from pydantic import BaseModel, Field, validator
from typing import Optional
from ..models.user import UserRole


class UserCreate(BaseModel):
    """Schema for creating a new user"""
    username: str = Field(..., min_length=3, max_length=50, description="Username for the user")
    password: str = Field(..., min_length=6, description="Password for the user")
    role: UserRole = Field(..., description="Role of the user (admin or technician)")
    
    @validator('username')
    def username_alphanumeric(cls, v):
        """Validate that username contains only alphanumeric characters and underscores"""
        if not v.replace('_', '').isalnum():
            raise ValueError('Username must be alphanumeric (underscores allowed)')
        return v.lower()


class UserUpdate(BaseModel):
    """Schema for updating user information"""
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    role: Optional[UserRole] = None
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if v and not v.replace('_', '').isalnum():
            raise ValueError('Username must be alphanumeric (underscores allowed)')
        return v.lower() if v else v


class PasswordChange(BaseModel):
    """Schema for changing a user's password"""
    current_password: Optional[str] = Field(None, description="Current password (required if changing own password)")
    new_password: str = Field(..., min_length=6, description="New password")
    
    @validator('new_password')
    def password_strength(cls, v):
        """Basic password strength validation"""
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    username: str
    role: str
    created_at: str
    
    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Schema for list of users"""
    users: list[UserResponse]
    total: int
