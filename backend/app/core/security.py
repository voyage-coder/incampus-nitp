# from passlib.context import CryptContext
from pwdlib import PasswordHash

from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError # creates and verifies JWTs
from app.core.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

# from fastapi import Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from app.db.session import get_db
# from app.models.user import User
# from app.services.auth_service import get_user_by_email -> this forming loop with auth_service.py
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)
# this does not log users in.
# it tells fastapi when a protected endpoint is called, read the token from the Authorization header
# then fastapi automatically extracts token fromt he header

# def get_current_user(
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_db)
# ):
#     try:
#         payload = jwt.decode(
#             token,
#             SECRET_KEY,
#             algorithms=[ALGORITHM]
#         )
#         # read the subject
#         email = payload.get("sub")

#         if email is None:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Could not validate credentials"
#             )
#     # catch JWT errors
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Could not validate credentials"
#         )

#     user = get_user_by_email(
#         db,
#         email
#     )
#     # may be if account gets deleted after token was issued
#     if user is None:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Could not validate credentials"
#         )

#     return user



# create password context
# pwd_context = CryptContext(
#     schemes=["bcrypt"], # means use bcrypt if later company wants to change into other algo it can change here
#     deprecated="auto" # if in future bcrypt becomes outdated, passlib automatically detect old hashes and help migrate them
# )

# create hash function
# def hash_password(password: str):
#     return pwd_context.hash(password)
# everytime you hash the same password, we get diff hash bcz bcrypt uses a random salt
# this makes passwords more secure

# verify function
# def verify_password(
#         plain_password, 
#         hashed_password
# ):
#     return pwd_context.verify(
#         plain_password,
#         hashed_password
#     )
# we use this during login
# ALL THIS IS USING PASSLIB 
# NOW CHANGING TO PWDLIB
password_hash = PasswordHash.recommended()
def hash_password(password: str) -> str:
    return password_hash.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    # this signs the payload using secret key

    return encoded_jwt



