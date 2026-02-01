# =======================
# Standard Library
# =======================
from datetime import datetime, timedelta, timezone
import secrets
import hashlib
from uuid import UUID

# =======================
# Security / Auth
# =======================
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jose import jwt, JWTError

# =======================
# FastAPI
# =======================
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# =======================
# Database
# =======================
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# =======================
# App Config & Models
# =======================
from config import (
    ACCESS_TOKEN_EXPIRE_HOURS,
    SECRET_KEY,
    ALGORITHM,
    REFRESH_TOKEN_EXPIRE_DAYS,
)
from database.initialization import get_db
from database.schemas import UserModel, RefreshTokenModel

# =======================
# Setup
# =======================
ph = PasswordHasher()
security = HTTPBearer()

# =======================
# Utility Functions
# =======================

def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def hash_password(password: str) -> str:
    return ph.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    ✅ FIXED: Correct parameter order
    plain_password: The password to verify
    hashed_password: The stored hash
    """
    try:
        # Argon2 verify takes (hash, plain) in that order
        ph.verify(hashed_password, plain_password)
        return True
    except VerifyMismatchError:
        return False


# =======================
# Token Creation
# =======================

async def create_tokens(user_id: UUID, db: AsyncSession) -> dict:
    """
    ✅ FIXED: Now accepts UUID instead of UserModel
    Create access and refresh tokens for a user
    """
    print(f"🔑 create_tokens called with user_id: {user_id}")
    
    expire = datetime.now(tz=timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)

    # ✅ JWT payload (clean & standard)
    token_payload = {
        "sub": str(user_id),          # JWT subject
        "user_id": str(user_id),      # DB reference
        "exp": expire,
    }

    print(f"📝 Creating JWT with payload: {token_payload}")
    access_token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)
    print(f"✅ Access token created (length: {len(access_token)})")

    # Create refresh token
    refresh_token = secrets.token_urlsafe(64)
    token_hash = hash_refresh_token(refresh_token)
    refresh_expires = datetime.now(tz=timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    print(f"💾 Saving refresh token to database...")
    db_refresh_token = RefreshTokenModel(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=refresh_expires,
    )

    db.add(db_refresh_token)
    await db.commit()
    print(f"✅ Refresh token saved")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


# =======================
# Current User Dependency
# =======================

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> UserModel:
    """
    Decode JWT and fetch authenticated user
    """
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("🔍 Token payload:", payload)

        # Try user_id first, fallback to sub
        user_id_str = payload.get("user_id") or payload.get("sub")

        if not user_id_str:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        try:
            user_id = UUID(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired or invalid",
        )

    # Fetch user from DB
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    print(f"✅ Authenticated user: {user.email}")
    return user