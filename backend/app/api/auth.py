import bcrypt
import jwt
import random
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.config import settings
from app.models.models import User
from app.schemas.schemas import UserCreate, UserLogin, UserResponse, Token, UserVerification, UserResendCode
from typing import Optional

router = APIRouter()

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_jwt_token(data: dict, expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    # Generate 6-digit verification code
    verification_code = f"{random.randint(100000, 999999)}"
    
    # Create user
    new_user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        is_verified=False,
        verification_code=verification_code,
        verification_expires=datetime.now(timezone.utc) + timedelta(minutes=10)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    print(f"\n==================================================")
    print(f"EMAIL VERIFICATION: Code for {new_user.email} is {verification_code}")
    print(f"==================================================\n")
    
    return new_user

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email address has not been verified yet. Please verify your email first."
        )
    
    # Generate tokens
    access_token = create_jwt_token(
        data={"sub": user.id, "email": user.email, "type": "access"},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_jwt_token(
        data={"sub": user.id, "email": user.email, "type": "refresh"},
        expires_delta=timedelta(days=7)
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
def refresh_token(token_data: dict, db: Session = Depends(get_db)):
    refresh_token = token_data.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token is required"
        )
    
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        email = payload.get("email")
        token_type = payload.get("type")
        
        if token_type != "refresh" or not user_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
        
    new_access_token = create_jwt_token(
        data={"sub": user.id, "email": user.email, "type": "access"},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    new_refresh_token = create_jwt_token(
        data={"sub": user.id, "email": user.email, "type": "refresh"},
        expires_delta=timedelta(days=7)
    )
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.post("/verify")
def verify_email(verification: UserVerification, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == verification.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    if user.is_verified:
        return {"detail": "Email already verified"}
        
    if not user.verification_code or not user.verification_expires:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No verification code exists. Please request a new one."
        )
        
    # Check if verification expired
    now_utc = datetime.now(timezone.utc)
    expires_tz = user.verification_expires
    if expires_tz.tzinfo is None:
        expires_tz = expires_tz.replace(tzinfo=timezone.utc)
        
    if now_utc > expires_tz:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code has expired. Please request a new one."
        )
        
    if user.verification_code != verification.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code. Please check and try again."
        )
        
    # Mark user as verified
    user.is_verified = True
    user.verification_code = None
    user.verification_expires = None
    db.commit()
    return {"detail": "Email verified successfully"}

@router.post("/resend-code")
def resend_verification_code(resend: UserResendCode, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == resend.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    if user.is_verified:
        return {"detail": "Email already verified"}
        
    # Re-generate code
    verification_code = f"{random.randint(100000, 999999)}"
    user.verification_code = verification_code
    user.verification_expires = datetime.now(timezone.utc) + timedelta(minutes=10)
    db.commit()
    
    print(f"\n==================================================")
    print(f"EMAIL VERIFICATION (RESEND): Code for {user.email} is {verification_code}")
    print(f"==================================================\n")
    
    return {"detail": "Verification code resent successfully"}
