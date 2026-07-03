import os
import httpx
from typing import Optional
from supabase import create_client, Client
from app.config import settings

class SupabaseService:
    _client: Optional[Client] = None

    @classmethod
    def get_client(cls) -> Optional[Client]:
        if cls._client is None:
            if settings.SUPABASE_PROJECT_ID and settings.SUPABASE_KEY:
                supabase_url = f"https://{settings.SUPABASE_PROJECT_ID}.supabase.co"
                try:
                    cls._client = create_client(supabase_url, settings.SUPABASE_KEY)
                    
                    # Proactively attempt to create the 'resumes' bucket if it doesn't exist
                    try:
                        cls._client.storage.create_bucket('resumes', options={"public": True})
                    except Exception:
                        # Bucket already exists or create bucket permissions not available
                        pass
                except Exception as e:
                    print(f"Failed to initialize Supabase client: {e}")
        return cls._client

    @classmethod
    def upload_resume(cls, local_file_path: str, unique_filename: str) -> Optional[str]:
        client = cls.get_client()
        if not client:
            print("Supabase client is not initialized. Skipping upload.")
            return None

        if not os.path.exists(local_file_path):
            print(f"Local file {local_file_path} not found. Cannot upload to Supabase.")
            return None

        try:
            # Determine mime-type
            ext = os.path.splitext(local_file_path)[1].lower()
            mime_type = "application/pdf" if ext == ".pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

            with open(local_file_path, "rb") as f:
                # Upload to resumes storage bucket
                response = client.storage.from_("resumes").upload(
                    path=unique_filename,
                    file=f,
                    file_options={"content-type": mime_type, "x-upsert": "true"}
                )
            
            # Fetch the public URL of the uploaded resume
            public_url = client.storage.from_("resumes").get_public_url(unique_filename)
            return public_url
        except Exception as e:
            print(f"Error uploading resume to Supabase Storage: {e}")
            return None

    @classmethod
    def download_file(cls, file_url_or_path: str, local_destination_path: str) -> bool:
        """
        Download a file from a public URL or Supabase storage path and save it locally.
        """
        # If it's a full http/https URL, fetch directly via HTTP GET
        if file_url_or_path.startswith("http://") or file_url_or_path.startswith("https://"):
            try:
                response = httpx.get(file_url_or_path)
                if response.status_code == 200:
                    with open(local_destination_path, "wb") as f:
                        f.write(response.content)
                    return True
            except Exception as e:
                print(f"Failed to download remote file via HTTP: {e}")
            return False

        # If it's a relative path, download from storage bucket
        client = cls.get_client()
        if not client:
            return False

        try:
            with open(local_destination_path, "wb") as f:
                res = client.storage.from_("resumes").download(file_url_or_path)
                f.write(res)
            return True
        except Exception as e:
            print(f"Failed to download from Supabase Storage: {e}")
            return False

    @classmethod
    def delete_resume(cls, file_url_or_path: str) -> bool:
        """
        Delete a file from Supabase Storage bucket.
        """
        client = cls.get_client()
        if not client:
            return False

        try:
            # Extract filename from URL or path
            filename = os.path.basename(file_url_or_path.split("?")[0])
            client.storage.from_("resumes").remove([filename])
            return True
        except Exception as e:
            print(f"Failed to delete file from Supabase Storage: {e}")
            return False
