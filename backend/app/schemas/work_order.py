from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class WorkOrderCreate(BaseModel):
    """Schema for creating a work order"""
    customer_name: str = Field(..., min_length=1, max_length=100)
    customer_phone: Optional[str] = Field(None, max_length=20)
    customer_id: Optional[str] = Field(None, max_length=20)
    device: str = Field(..., min_length=1, max_length=100)
    issue: str = Field(..., min_length=1)
    status: str = Field(default="Recibido")
    estimated_completion_date: Optional[datetime] = None
    
    # Payment fields
    repair_cost: Optional[Decimal] = Field(default=0.00, ge=0)
    amount_paid: Optional[Decimal] = Field(default=0.00, ge=0)
    payment_status: str = Field(default="Pendiente")
    payment_notes: Optional[str] = None


class WorkOrderUpdate(BaseModel):
    """Schema for updating a work order (all fields optional)"""
    customer_name: Optional[str] = Field(None, min_length=1, max_length=100)
    customer_phone: Optional[str] = Field(None, max_length=20)
    customer_id: Optional[str] = Field(None, max_length=20)
    device: Optional[str] = Field(None, min_length=1, max_length=100)
    issue: Optional[str] = Field(None, min_length=1)
    status: Optional[str] = None
    estimated_completion_date: Optional[datetime] = None
    
    # Payment fields
    repair_cost: Optional[Decimal] = Field(None, ge=0)
    amount_paid: Optional[Decimal] = Field(None, ge=0)
    payment_status: Optional[str] = None
    payment_date: Optional[datetime] = None
    payment_notes: Optional[str] = None


class WorkOrderResponse(BaseModel):
    """Schema for work order response"""
    id: str
    code: Optional[str] = None
    customer_name: str
    customer_phone: Optional[str] = None
    customer_id: Optional[str] = None
    device: str
    issue: str
    status: str
    received_date: datetime
    estimated_completion_date: Optional[datetime] = None
    
    # Payment fields
    repair_cost: Optional[Decimal] = None
    amount_paid: Optional[Decimal] = None
    payment_status: str
    payment_date: Optional[datetime] = None
    payment_notes: Optional[str] = None
    
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
