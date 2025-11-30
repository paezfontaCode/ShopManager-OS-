from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class PartBase(BaseModel):
    """Base schema for part"""
    name: str = Field(..., min_length=1, max_length=100)
    sku: str = Field(..., min_length=1, max_length=50)
    stock: int = Field(..., ge=0)
    price: float = Field(..., gt=0)
    compatible_models: List[str] = Field(default_factory=list)
    min_stock: int = Field(default=5, ge=0)


class PartCreate(PartBase):
    """Schema for creating a part"""
    pass


class PartUpdate(BaseModel):
    """Schema for updating a part (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    sku: Optional[str] = Field(None, min_length=1, max_length=50)
    stock: Optional[int] = Field(None, ge=0)
    price: Optional[float] = Field(None, gt=0)
    compatible_models: Optional[List[str]] = None
    min_stock: Optional[int] = Field(None, ge=0)


class PartResponse(PartBase):
    """Schema for part response"""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
