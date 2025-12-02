from sqlalchemy import Column, String, Text, DateTime, Enum, Numeric
from sqlalchemy.sql import func
import enum
from ..database import Base


class RepairStatus(str, enum.Enum):
    """Repair status enumeration"""
    RECIBIDO = "Recibido"
    EN_DIAGNOSTICO = "En Diagnóstico"
    ESPERANDO_PARTE = "Esperando Parte"
    EN_REPARACION = "En Reparación"
    REPARADO = "Reparado"
    ENTREGADO = "Entregado"


class PaymentStatus(str, enum.Enum):
    """Payment status enumeration"""
    PENDIENTE = "Pendiente"
    PAGADO = "Pagado"
    PAGO_PARCIAL = "Pago Parcial"
    VENCIDO = "Vencido"


class WorkOrder(Base):
    """Work order model for repair tracking"""
    
    __tablename__ = "work_orders"
    
    id = Column(String(36), primary_key=True, index=True)  # UUID
    code = Column(String(8), unique=True, index=True, nullable=True) # Short ID (e.g., "ABC-123")
    customer_name = Column(String(100), nullable=False, index=True)
    customer_phone = Column(String(20), nullable=True)  # Phone for WhatsApp/SMS notifications
    customer_id = Column(String(20), nullable=True, index=True)  # C.I. or other ID
    device = Column(String(100), nullable=False)
    issue = Column(Text, nullable=False)
    status = Column(Enum(RepairStatus), nullable=False, default=RepairStatus.RECIBIDO)
    received_date = Column(DateTime(timezone=True), server_default=func.now())
    estimated_completion_date = Column(DateTime(timezone=True), nullable=True)
    
    # Payment fields
    repair_cost = Column(Numeric(10, 2), nullable=True, default=0.00)  # Total repair cost
    amount_paid = Column(Numeric(10, 2), nullable=True, default=0.00)  # Amount already paid
    payment_status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDIENTE)
    payment_date = Column(DateTime(timezone=True), nullable=True)  # When fully paid
    payment_notes = Column(Text, nullable=True)  # Additional payment notes
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    @property
    def balance_due(self) -> float:
        """Calculate remaining balance"""
        if self.repair_cost and self.amount_paid:
            return float(self.repair_cost) - float(self.amount_paid)
        return float(self.repair_cost or 0)
    
    def __repr__(self):
        return f"<WorkOrder(code='{self.code}', customer='{self.customer_name}', status='{self.status}')>"
