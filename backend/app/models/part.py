from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.types import JSON
from sqlalchemy.sql import func
from ..database import Base


class Part(Base):
    """Part model for repair parts inventory"""
    
    __tablename__ = "parts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    stock = Column(Integer, nullable=False, default=0)
    price = Column(Float, nullable=False)
    compatible_models = Column(JSON, nullable=False)  # List of compatible device models
    min_stock = Column(Integer, nullable=False, default=5)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Part(id={self.id}, name='{self.name}', sku='{self.sku}', stock={self.stock})>"
