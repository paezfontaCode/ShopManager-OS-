from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.product import Product
from ..models.ticket import Ticket, PaymentStatus
from ..models.work_order import WorkOrder, RepairStatus
from ..models.part import Part
from ..models.user import User, UserRole
from ..utils.dependencies import get_db, get_current_user

router = APIRouter(prefix="/api", tags=["Dashboard"])


@router.get("/dashboard/summary")
def get_admin_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dashboard summary for admin users.
    
    Args:
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Dashboard summary with sales, stock, and ticket information
    """
    # Total sales (sum of all paid tickets)
    total_sales = db.query(func.sum(Ticket.total)).filter(
        Ticket.payment_status == PaymentStatus.PAID
    ).scalar() or 0.0
    
    # Total products in stock
    total_products = db.query(func.sum(Product.stock)).scalar() or 0
    
    # Total tickets
    total_tickets = db.query(func.count(Ticket.id)).scalar() or 0
    
    # Products with low stock
    low_stock_products = db.query(func.count(Product.id)).filter(
        Product.stock < Product.min_stock
    ).scalar() or 0
    
    return {
        "totalSales": total_sales,
        "totalProducts": total_products,
        "totalTickets": total_tickets,
        "lowStockProducts": low_stock_products
    }


@router.get("/repairs/dashboard/summary")
def get_repairs_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dashboard summary for technician users (repairs).
    
    Args:
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Dashboard summary with repair status counts and parts information
    """
    # Count work orders by status
    pending = db.query(func.count(WorkOrder.id)).filter(
        WorkOrder.status == RepairStatus.RECIBIDO
    ).scalar() or 0
    
    in_progress = db.query(func.count(WorkOrder.id)).filter(
        WorkOrder.status.in_([
            RepairStatus.EN_DIAGNOSTICO,
            RepairStatus.EN_REPARACION,
            RepairStatus.ESPERANDO_PARTE
        ])
    ).scalar() or 0
    
    completed = db.query(func.count(WorkOrder.id)).filter(
        WorkOrder.status == RepairStatus.REPARADO
    ).scalar() or 0
    
    delivered = db.query(func.count(WorkOrder.id)).filter(
        WorkOrder.status == RepairStatus.ENTREGADO
    ).scalar() or 0
    
    # Parts with low stock
    low_stock_parts = db.query(func.count(Part.id)).filter(
        Part.stock < Part.min_stock
    ).scalar() or 0
    
    return {
        "pendingRepairs": pending,
        "inProgressRepairs": in_progress,
        "completedRepairs": completed,
        "deliveredRepairs": delivered,
        "lowStockParts": low_stock_parts
    }
