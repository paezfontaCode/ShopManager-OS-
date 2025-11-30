from sqlalchemy import Column, String, Text, DateTime, Enum
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


class WorkOrder(Base):
    """Work order model for repair tracking"""
    
    __tablename__ = "work_orders"
    
    id = Column(String(36), primary_key=True, index=True)  # UUID
    code = Column(String(8), unique=True, index=True, nullable=True) # Short ID (e.g., "ABC-123")
    customer_name = Column(String(100), nullable=False, index=True)
    device = Column(String(100), nullable=False)
    issue = Column(Text, nullable=False)
    status = Column(Enum(RepairStatus), nullable=False, default=RepairStatus.RECIBIDO)
    received_date = Column(DateTime(timezone=True), server_default=func.now())
    estimated_completion_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<WorkOrder(code='{self.code}', customer='{self.customer_name}', status='{self.status}')>"
