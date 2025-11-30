from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from ..schemas.work_order import WorkOrderCreate, WorkOrderUpdate, WorkOrderResponse
from ..models.work_order import WorkOrder, RepairStatus
from ..models.user import User
from ..utils.dependencies import get_db, get_current_user

router = APIRouter(prefix="/api/work-orders", tags=["Work Orders"])


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
    db_work_order = db.query(WorkOrder).filter(WorkOrder.id == order_id).first()
    
    if not db_work_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work order with id {order_id} not found"
        )
    
    # Update only provided fields
    update_data = work_order.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_work_order, field, value)
    
    db.commit()
    db.refresh(db_work_order)
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
