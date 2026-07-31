from datetime import datetime, timedelta, timezone

from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pwdlib import PasswordHash
from pwdlib.exceptions import UnknownHashError
from pwdlib.hashers.bcrypt import BcryptHasher

from app.core.config import (
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    SECRET_KEY,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def _build_password_hash() -> PasswordHash:
    """Support bcrypt (new) and argon2 (legacy local dev hashes)."""
    hashers = [BcryptHasher()]
    try:
        from pwdlib.hashers.argon2 import Argon2Hasher

        hashers.append(Argon2Hasher())
    except Exception:
        pass
    return PasswordHash(tuple(hashers))


password_hash = _build_password_hash()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    try:
        return password_hash.verify(plain_password, hashed_password)
    except UnknownHashError:
        return False


def password_needs_rehash(hashed_password: str) -> bool:
    # Upgrade legacy argon2 hashes to bcrypt after successful login.
    return hashed_password.startswith("$argon2")


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
