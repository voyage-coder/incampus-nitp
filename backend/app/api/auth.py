from fastapi import APIRouter, Depends

from app.schemas.user import (UserCreate, UserResponse, UserLogin, Token, GoogleAuthRequest)
from sqlalchemy.orm import Session
from app.db.session import get_db

from fastapi import HTTPException, status
from app.services.auth_service import (
    get_user_by_email,
    create_user,
    authenticate_user,
    authenticate_google_user,
)
from app.core.security import create_access_token
from app.dependencies.auth import get_current_user
from app.models.user import User
from fastapi.security import OAuth2PasswordRequestForm

from app.dependencies.roles import require_role

# create router
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# create endpoints
# @router.post("/register")
# def register(user: UserCreate):
#     return user

@router.post(
        "/register",
        response_model=UserResponse,
        status_code=201
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    # checking email existing or not
    existing_user = get_user_by_email(
        db,
        user.email
    )
    # if email already exist retrun error in http format
    if existing_user:
        raise HTTPException(
            # status_code=400,
            status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    # if email doesn't exist -> register it as new user
    new_user = create_user(
        db, 
        user
    )
    # return{
    #     "message": "User registered successfully",
    #     "user_id": str(new_user.id)
    # }
    return new_user
# response_model means fastapi now knows every successful response must look like UserResponse
# now instead of return meassage simply return new_user
# fastapi converts UserResponse(..) obj into json
# 200 ok, 201 created so use 201

@router.post(
    "/login",
    response_model=Token
)
# 

def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        db,
        form_data.username,
        form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    # if authentication success
    access_token = create_access_token(
        data={
            "sub": user.email
        }
    )
    return Token(
        access_token=access_token,
        token_type="bearer"
    )


@router.post(
    "/google",
    response_model=Token,
)
def login_with_google(
    body: GoogleAuthRequest,
    db: Session = Depends(get_db),
):
    user = authenticate_google_user(db, body.id_token)
    access_token = create_access_token(
        data={
            "sub": user.email,
        }
    )
    return Token(
        access_token=access_token,
        token_type="bearer",
    )


@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.get("/admin-test")
def admin_test(
    current_user: User = Depends(require_role(["admin"]))
):
    return {
        "message": "Welcome Admin!"
    }