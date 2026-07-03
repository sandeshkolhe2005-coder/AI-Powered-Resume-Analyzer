import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Include backend path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database.connection import Base, get_db

# Setup test in-memory SQLite DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def client():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Override get_db dependency
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()
            
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
        
    # Drop tables after tests finish
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    if os.path.exists("./test.db"):
        try:
            os.remove("./test.db")
        except Exception:
            pass

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_user_flow(client):
    # Test Register
    reg_response = client.post(
        "/api/v1/auth/register",
        json={"email": "tester@example.com", "password": "password123"}
    )
    assert reg_response.status_code == 201
    assert reg_response.json()["email"] == "tester@example.com"
    
    # Test Duplicate Register
    dup_response = client.post(
        "/api/v1/auth/register",
        json={"email": "tester@example.com", "password": "password123"}
    )
    assert dup_response.status_code == 400
    
    # Test Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "tester@example.com", "password": "password123"}
    )
    assert login_response.status_code == 200
    tokens = login_response.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens
    
    # Test Token Refresh
    refresh_response = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": tokens["refresh_token"]}
    )
    assert refresh_response.status_code == 200
    assert "access_token" in refresh_response.json()
