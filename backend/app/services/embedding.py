import hashlib
import json
import urllib.request
from typing import List, Optional

from app.config import settings

class EmbeddingService:
    COLLECTION_NAME = "resumes_collection"
    VECTOR_DIMENSION = 384
    
    # Local In-Memory Vector Store Fallback (when no external Qdrant URL is set)
    _in_memory_store = {} # Key: resume_id, Value: {"vector": List[float], "payload": dict}

    @classmethod
    def _call_qdrant_rest(cls, path: str, method: str = "GET", payload: Optional[dict] = None) -> Optional[dict]:
        if not settings.QDRANT_URL:
            return None
            
        url = f"{settings.QDRANT_URL.rstrip('/')}/{path.lstrip('/')}"
        headers = {"Content-Type": "application/json"}
        if settings.QDRANT_API_KEY:
            headers["api-key"] = settings.QDRANT_API_KEY
            
        data = json.dumps(payload).encode("utf-8") if payload else None
        
        try:
            req = urllib.request.Request(url, data=data, headers=headers, method=method)
            with urllib.request.urlopen(req, timeout=10) as response:
                return json.loads(response.read().decode("utf-8"))
        except Exception as e:
            print(f"Qdrant REST request to {path} failed: {e}")
            return None

    @classmethod
    def _ensure_collection_exists(cls):
        if not settings.QDRANT_URL:
            return
            
        # Check if collection exists
        res = cls._call_qdrant_rest(f"collections/{cls.COLLECTION_NAME}", "GET")
        if not res or "result" not in res:
            # Create collection
            payload = {
                "vectors": {
                    "size": cls.VECTOR_DIMENSION,
                    "distance": "Cosine"
                }
            }
            cls._call_qdrant_rest(f"collections/{cls.COLLECTION_NAME}", "PUT", payload)

    @classmethod
    def generate_embedding(cls, text: str) -> List[float]:
        # Try using Gemini Embeddings API via REST if API key is present
        if settings.GEMINI_API_KEY and settings.LLM_PROVIDER == "gemini":
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key={settings.GEMINI_API_KEY}"
                headers = {"Content-Type": "application/json"}
                payload = {
                    "model": "models/gemini-embedding-001",
                    "content": {"parts": [{"text": text[:4000]}]}
                }
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers=headers,
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=15) as response:
                    res_json = json.loads(response.read().decode("utf-8"))
                    embedding = res_json.get('embedding', {}).get('values', [])
                    
                    if embedding:
                        # Downsample projected embedding to cls.VECTOR_DIMENSION
                        projected = []
                        step = len(embedding) / cls.VECTOR_DIMENSION
                        for i in range(cls.VECTOR_DIMENSION):
                            projected.append(embedding[int(i * step)])
                        # Normalise
                        norm = sum(x*x for x in projected) ** 0.5
                        if norm > 0:
                            projected = [x / norm for x in projected]
                        return projected
            except Exception as e:
                print(f"Gemini REST embedding creation failed: {e}. Using deterministic term hash.")
                
        # Deterministic term hashing fallback (zero dependencies, fast, matches dimension perfectly)
        words = text.lower().split()
        vector = [0.0] * cls.VECTOR_DIMENSION
        if not words:
            return vector
            
        for word in words:
            h = int(hashlib.md5(word.encode('utf-8')).hexdigest(), 16)
            index = h % cls.VECTOR_DIMENSION
            vector[index] += 1.0
            
        # Normalize vector
        norm = sum(x*x for x in vector) ** 0.5
        if norm > 0:
            vector = [x / norm for x in vector]
            
        return vector

    @classmethod
    def upsert_resume(cls, resume_id: str, text: str):
        vector = cls.generate_embedding(text)
        payload = {"resume_id": resume_id}
        
        # Save in memory locally first as backup/dev mode
        cls._in_memory_store[resume_id] = {
            "vector": vector,
            "payload": payload
        }
        
        if not settings.QDRANT_URL:
            return
            
        cls._ensure_collection_exists()
        point_id = int(hashlib.md5(resume_id.encode('utf-8')).hexdigest(), 16) & 0xffffffffffffffff
        
        upsert_payload = {
            "points": [
                {
                    "id": point_id,
                    "vector": vector,
                    "payload": payload
                }
            ]
        }
        cls._call_qdrant_rest(f"collections/{cls.COLLECTION_NAME}/points?wait=true", "PUT", upsert_payload)

    @classmethod
    def search_similar(cls, query_text: str, limit: int = 5) -> List[dict]:
        vector = cls.generate_embedding(query_text)
        
        # If no Qdrant service is available, run cosine similarity against local in-memory store
        if not settings.QDRANT_URL:
            results = []
            for resume_id, data in cls._in_memory_store.items():
                other_vector = data["vector"]
                # Cosine similarity (dot product on normalised vectors)
                sim = sum(r * o for r, o in zip(vector, other_vector))
                results.append({
                    "resume_id": resume_id,
                    "score": int(sim * 100)
                })
            results.sort(key=lambda x: x["score"], reverse=True)
            return results[:limit]
            
        cls._ensure_collection_exists()
        
        search_payload = {
            "vector": vector,
            "limit": limit,
            "with_payload": True
        }
        
        res = cls._call_qdrant_rest(f"collections/{cls.COLLECTION_NAME}/points/search", "POST", search_payload)
        
        hits = []
        if res and "result" in res:
            for hit in res["result"]:
                hits.append({
                    "resume_id": hit.get("payload", {}).get("resume_id"),
                    "score": int(hit.get("score", 0) * 100)
                })
        return hits
