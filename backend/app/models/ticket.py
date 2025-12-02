from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base


class PaymentStatus(str, enum.Enum):
    """Payment status enumeration"""
    PAID = "Paid"
    PENDING = "Pending"
    PARTIAL = "Partial"
    OVERDUE = "Overdue"


class Ticket(Base):
    """Ticket model for sales transactions"""
    
    __tablename__ = "tickets"
    
    id = Column(String(36), primary_key=True, index=True)  # UUID
    date = Column(DateTime(timezone=True), server_default=func.now())
    customer_name = Column(String(100), nullable=False)
    payment_method = Column(String(50), nullable=False)
    payment_status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    subtotal = Column(Float, nullable=False)
    tax = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    
    # Multi-currency payment details
    exchange_rate = Column(Float, nullable=True)  # VES/USD rate at time of sale
    amount_usd = Column(Float, nullable=True, default=0.0)  # Amount paid in USD
    amount_ves = Column(Float, nullable=True, default=0.0)  # Amount paid in VES
    
    # Relationship to ticket items
    items = relationship("TicketItem", back_populates="ticket", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Ticket(id='{self.id}', customer='{self.customer_name}', total={self.total})>"


class TicketItem(Base):
    """Ticket item model for individual products in a sale"""
    
    __tablename__ = "ticket_items"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(36), ForeignKey("tickets.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # Price at time of sale
    
    # Relationships
    ticket = relationship("Ticket", back_populates="items")
    product = relationship("Product")
    
    def __repr__(self):
        return f"<TicketItem(id={self.id}, product_id={self.product_id}, quantity={self.quantity})>"
