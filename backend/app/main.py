from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.connection import engine, Base
from app.api import auth, resumes, analysis

from sqlalchemy import text, inspect

# Automatically create tables for SQLite/PostgreSQL on start
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")
    
    # Run dynamic column migration checks (useful for dev SQLite transition)
    inspector = inspect(engine)
    if inspector.has_table("users"):
        columns = [col['name'] for col in inspector.get_columns('users')]
        with engine.begin() as conn:
            if 'is_verified' not in columns:
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0"))
                    print("Added column 'is_verified' to 'users' table.")
                except Exception as col_err:
                    print(f"Could not add 'is_verified' column: {col_err}")
            if 'verification_code' not in columns:
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN verification_code VARCHAR(6)"))
                    print("Added column 'verification_code' to 'users' table.")
                except Exception as col_err:
                    print(f"Could not add 'verification_code' column: {col_err}")
            if 'verification_expires' not in columns:
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN verification_expires DATETIME"))
                    print("Added column 'verification_expires' to 'users' table.")
                except Exception as col_err:
                    print(f"Could not add 'verification_expires' column: {col_err}")
except Exception as e:
    print(f"Error creating database tables: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for parsing, scoring, and matching resumes utilizing AI",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Endpoint
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0"
    }

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(resumes.router, prefix=f"{settings.API_V1_STR}/resumes", tags=["resumes"])
app.include_router(analysis.router, prefix=f"{settings.API_V1_STR}/analysis", tags=["analysis"])
