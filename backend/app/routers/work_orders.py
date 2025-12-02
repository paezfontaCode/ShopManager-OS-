from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from ..schemas.work_order import WorkOrderCreate, WorkOrderUpdate, WorkOrderResponse
from ..models.work_order import WorkOrder, RepairStatus
from ..models.user import User
from ..utils.dependencies import get_db, get_current_user

router = APIRouter(prefix="/api/work-orders", tags=["Work Orders"])


@router.get("/delinquent", response_model=List[dict])
def get_delinquent_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get list of customers with unpaid repairs (delinquent customers).
    
    Returns:
        List of customers with their total debt and unpaid orders
    """
    from ..models.work_order import PaymentStatus as WOPaymentStatus
    from ..models.ticket import Ticket, PaymentStatus as TicketPaymentStatus
    from collections import defaultdict
    from datetime import datetime
    
    # Get all delivered orders that are not fully paid
    unpaid_orders = db.query(WorkOrder).filter(
        WorkOrder.status == RepairStatus.ENTREGADO,
        WorkOrder.payment_status.in_([WOPaymentStatus.PENDIENTE, WOPaymentStatus.PAGO_PARCIAL, WOPaymentStatus.VENCIDO])
    ).all()
    
    # Get all unpaid tickets
    unpaid_tickets = db.query(Ticket).filter(
        Ticket.payment_status.in_([TicketPaymentStatus.PENDING, TicketPaymentStatus.PARTIAL, TicketPaymentStatus.OVERDUE])
    ).all()
    
    # Group by customer
    customers_debt = defaultdict(lambda: {
        'customer_name': '',
        'customer_phone': None,
        'customer_id': None,
        'total_debt': 0.0,
        'orders_count': 0,
        'orders': []
    })
    
    # Process Work Orders
    for order in unpaid_orders:
        debt = float(order.repair_cost or 0) - float(order.amount_paid or 0)
        
        customer_key = order.customer_name
        customers_debt[customer_key]['customer_name'] = order.customer_name
        # Prioritize phone/id from work order if available
        if order.customer_phone:
            customers_debt[customer_key]['customer_phone'] = order.customer_phone
        if order.customer_id:
            customers_debt[customer_key]['customer_id'] = order.customer_id
            
        customers_debt[customer_key]['total_debt'] += debt
        customers_debt[customer_key]['orders_count'] += 1
        customers_debt[customer_key]['orders'].append({
            'type': 'repair',
            'code': order.code,
            'device': order.device,
            'debt': debt,
            'payment_status': order.payment_status,
            'received_date': order.received_date.isoformat() if order.received_date else None
        })
        
    # Process Tickets
    for ticket in unpaid_tickets:
        # For tickets, debt is total - (amount_usd * rate + amount_ves) roughly, 
        # but simpler is total - paid. 
        # Assuming total is the final amount and we need to calculate paid.
        # If payment_status is PENDING, paid is 0.
        # If PARTIAL, we need to know how much was paid. 
        # Ticket model has amount_usd and amount_ves which represent what was paid.
        
        paid_amount = (ticket.amount_usd or 0) * (ticket.exchange_rate or 1) + (ticket.amount_ves or 0)
        # If exchange rate is not stored for USD, we might have an issue, but let's assume it is.
        # Actually, let's look at how total is calculated. 
        # If total is in VES (base currency), then debt = total - paid_in_ves_equivalent.
        
        debt = float(ticket.total) - float(paid_amount)
        if debt < 0: debt = 0 # Safety check
        
        customer_key = ticket.customer_name
        if not customers_debt[customer_key]['customer_name']:
             customers_debt[customer_key]['customer_name'] = ticket.customer_name
             
        customers_debt[customer_key]['total_debt'] += debt
        customers_debt[customer_key]['orders_count'] += 1
        customers_debt[customer_key]['orders'].append({
            'type': 'sale',
            'code': f"T-{ticket.id[:8]}",
            'device': f"Venta ({len(ticket.items)} items)",
            'debt': debt,
            'payment_status': ticket.payment_status,
            'received_date': ticket.date.isoformat() if ticket.date else None
        })
    
    # Convert to list and sort by total debt (highest first)
    result = sorted(
        customers_debt.values(),
        key=lambda x: x['total_debt'],
        reverse=True
    )
    
    return result


@router.get("/payment-stats", response_model=dict)
def get_payment_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get payment statistics summary.
    
    Returns:
        Dictionary with payment statistics
    """
    from ..models.work_order import PaymentStatus
    from sqlalchemy import func
    
    # Get all orders
    all_orders = db.query(WorkOrder).all()
    
    total_pending = 0.0
    total_paid = 0.0
    total_partial = 0.0
    overdue_count = 0
    overdue_amount = 0.0
    
    for order in all_orders:
        repair_cost = float(order.repair_cost or 0)
        amount_paid = float(order.amount_paid or 0)
        balance = repair_cost - amount_paid
        
        if order.payment_status == PaymentStatus.PAGADO:
            total_paid += repair_cost
        elif order.payment_status == PaymentStatus.PAGO_PARCIAL:
            total_partial += balance
            total_paid += amount_paid
        elif order.payment_status == PaymentStatus.PENDIENTE:
            total_pending += balance
        elif order.payment_status == PaymentStatus.VENCIDO:
            overdue_amount += balance
            overdue_count += 1
    
    # Count unique customers with debt
    customers_with_debt = db.query(WorkOrder.customer_name).filter(
        WorkOrder.payment_status.in_([PaymentStatus.PENDIENTE, PaymentStatus.PAGO_PARCIAL, PaymentStatus.VENCIDO])
    ).distinct().count()
    
    return {
        'total_pending': round(total_pending, 2),
        'total_paid': round(total_paid, 2),
        'total_partial': round(total_partial, 2),
        'overdue_count': overdue_count,
        'overdue_amount': round(overdue_amount, 2),
        'customers_with_debt': customers_with_debt
    }


@router.get("", response_model=List[WorkOrderResponse])
def get_work_orders(
    q: Optional[str] = Query(None, description="Search query for customer name or device"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all work orders with optional search.
    
    Args:
        q: Optional search query
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of work orders
    """
    query = db.query(WorkOrder)
    
    if q:
        search_filter = f"%{q}%"
        query = query.filter(
            (WorkOrder.customer_name.ilike(search_filter)) | 
            (WorkOrder.device.ilike(search_filter))
        )
    
    work_orders = query.order_by(WorkOrder.received_date.desc()).all()
    return work_orders


@router.post("", response_model=WorkOrderResponse, status_code=status.HTTP_201_CREATED)
def create_work_order(
    work_order: WorkOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new work order.
    
    Args:
        work_order: Work order data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Created work order
    """
    # Generate unique short code
    import random
    import string
    
    def generate_code(length=6):
        chars = string.ascii_uppercase + string.digits
        return ''.join(random.choice(chars) for _ in range(length))
    
    code = generate_code()
    while db.query(WorkOrder).filter(WorkOrder.code == code).first():
        code = generate_code()

    db_work_order = WorkOrder(
        id=str(uuid.uuid4()),
        code=code,
        **work_order.model_dump()
    )
    db.add(db_work_order)
    db.commit()
    db.refresh(db_work_order)
    return db_work_order


@router.put("/{order_id}", response_model=WorkOrderResponse)
def update_work_order(
    order_id: str,
    work_order: WorkOrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a work order.
    
    Args:
        order_id: Work order ID
        work_order: Updated work order data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Updated work order
        
    Raises:
        HTTPException: If work order not found
    """
    from ..services import notification_service, NotificationTemplates
    import logging
    
    logger = logging.getLogger(__name__)
    
    db_work_order = db.query(WorkOrder).filter(WorkOrder.id == order_id).first()
    
    if not db_work_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work order with id {order_id} not found"
        )
    
    # Store old status for comparison
    old_status = db_work_order.status
    
    # Update only provided fields
    update_data = work_order.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_work_order, field, value)
    
    db.commit()
    db.refresh(db_work_order)
    
    # Send notifications on status change
    new_status = db_work_order.status
    
    # Notify when repair is ready for pickup
    if old_status != RepairStatus.REPARADO and new_status == RepairStatus.REPARADO:
        if db_work_order.customer_phone:
            message = NotificationTemplates.repair_ready(
                customer_name=db_work_order.customer_name,
                device=db_work_order.device,
                code=db_work_order.code or db_work_order.id[:8]
            )
            notification_service.send_notification(
                phone=db_work_order.customer_phone,
                message=message,
                prefer_whatsapp=True
            )
            logger.info(f"📱 Notification sent for order {db_work_order.code} - Status: Reparado")
        else:
            logger.warning(f"⚠️ No phone number for order {db_work_order.code}")
    
    # Notify when device is delivered
    elif old_status != RepairStatus.ENTREGADO and new_status == RepairStatus.ENTREGADO:
        if db_work_order.customer_phone:
            message = NotificationTemplates.repair_delivered(
                customer_name=db_work_order.customer_name,
                device=db_work_order.device,
                warranty_days=8
            )
            notification_service.send_notification(
                phone=db_work_order.customer_phone,
                message=message,
                prefer_whatsapp=True
            )
            logger.info(f"📱 Delivery confirmation sent for order {db_work_order.code}")
        else:
            logger.warning(f"⚠️ No phone number for order {db_work_order.code}")
    
    return db_work_order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_work_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a work order.
    
    Args:
        order_id: Work order ID
        db: Database session
        current_user: Current authenticated user
        
    Raises:
        HTTPException: If work order not found
    """
    db_work_order = db.query(WorkOrder).filter(WorkOrder.id == order_id).first()
    
    if not db_work_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work order with id {order_id} not found"
        )
    
    db.delete(db_work_order)
    db.commit()
    return None
