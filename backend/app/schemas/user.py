from pydantic import BaseModel, EmailStr, Field
# every pydantic schema inherits from BaseModel jst like Bse in SQLA
# Instead of email:str we use email: EmailStr -> pydantic automatically validates email format - if wrong like abc@@ then fastapi automatically returns error 422 unprocessable entity
# Field used for validation like password length should be 8 etc
from uuid import UUID
from pydantic import ConfigDict
from app.enums.role import UserRole
from typing import Optional

class UserCreate(BaseModel):
    full_name : str = Field(min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)
    roll_number: str
    branch: str
    year: int = Field(ge=1, le=4)

class UserResponse(BaseModel):
    id: UUID
    full_name: str
    email: str
    roll_number: str
    branch: str
    year: int
    model_config = ConfigDict(from_attributes=True)
    role: str
# here password is missing - no hased password
# UUID required bcz client needs it and db generates it
# pydantic expects python dictionary but sqla returns an object
# from_attributes=True tells pydantic to read values from obj attributes 
# now update in endpoint

# only password and email required for login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# this describes response after login
class Token(BaseModel):
    access_token: str
    token_type: str

# for admin to epromote students to club-heads and admins
class UpdateRole(BaseModel):
    # role: str
    role: UserRole


# for returning full profile details
class UserProfileResponse(BaseModel):
    id: UUID
    full_name: str
    email: str
    roll_number: str
    branch: str
    year: int
    role: str

    bio: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
    profile_image: Optional[str] = None

    is_active: bool
    is_verified: bool

    model_config = ConfigDict(from_attributes=True)

# updating profile
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[int] = None
    bio: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
    profile_image: Optional[str] = None