from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class WorkOrderCreate(BaseModel):
    """Schema for creating a work order"""
    customer_name: str = Field(..., min_length=1, max_length=100)
    device: str = Field(..., min_length=1, max_length=100)
    issue: str = Field(..., min_length=1)
    status: str = Field(default="Recibido")
    estimated_completion_date: Optional[datetime] = None


class WorkOrderUpdate(BaseModel):
    """Schema for updating a work order (all fields optional)"""
    customer_name: Optional[str] = Field(None, min_length=1, max_length=100)
    device: Optional[str] = Field(None, min_length=1, max_length=100)
    issue: Optional[str] = Field(None, min_length=1)
    status: Optional[str] = None
    estimated_completion_date: Optional[datetime] = None


class WorkOrderResponse(BaseModel):
    """Schema for work order response"""
    id: str
    code: Optional[str] = None
    customer_name: str
    device: str
    issue: str
    status: str
    received_date: datetime
    estimated_completion_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
