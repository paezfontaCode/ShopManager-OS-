from pydantic import BaseModel, Field
from typing import List
from datetime import datetime


class TicketItemCreate(BaseModel):
    """Schema for creating a ticket item"""
    product_id: int
    quantity: int = Field(..., gt=0)


class TicketItemResponse(BaseModel):
    """Schema for ticket item response"""
    id: int
    product_id: int
    quantity: int
    price: float
    
    class Config:
        from_attributes = True


class TicketCreate(BaseModel):
    """Schema for creating a ticket"""
    customer_name: str = Field(default="Cliente General", min_length=1, max_length=100)
    payment_method: str = Field(default="mixed", min_length=1, max_length=50)
    payment_status: str = Field(default="Paid")
    items: List[TicketItemCreate] = Field(..., min_length=1)
    
    # Multi-currency payment details
    exchange_rate: float = Field(..., gt=0)
    amount_usd: float = Field(default=0.0, ge=0)
    amount_ves: float = Field(default=0.0, ge=0)


class TicketResponse(BaseModel):
    """Schema for ticket response"""
    id: str
    date: datetime
    customer_name: str
    payment_method: str
    payment_status: str
    subtotal: float
    tax: float
    total: float
    items: List[TicketItemResponse] = []
    
    # Multi-currency payment details
    exchange_rate: float | None = None
    amount_usd: float | None = None
    amount_ves: float | None = None
    
    class Config:
        from_attributes = True
