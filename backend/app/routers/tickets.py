from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from ..schemas.ticket import TicketCreate, TicketResponse
from ..models.ticket import Ticket, TicketItem, PaymentStatus
from ..models.product import Product
from ..models.user import User
from ..utils.dependencies import get_db, get_current_user

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])


@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new ticket/sale and update product stock.
    
    Args:
        ticket_data: Ticket data with items
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Created ticket
        
    Raises:
        HTTPException: If product not found or insufficient stock
    """
    # Calculate totals
    subtotal = 0.0
    ticket_items = []
    
    for item in ticket_data.items:
        # Get product
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {item.product_id} not found"
            )
        
        # Check stock
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product {product.name}. Available: {product.stock}, Requested: {item.quantity}"
            )
        
        # Calculate item total
        item_total = product.price * item.quantity
        subtotal += item_total
        
        # Create ticket item
        ticket_items.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": product.price
        })
        
        # Update product stock
        product.stock -= item.quantity
    
    # No additional tax - prices already include tax
    tax = 0.0
    total = subtotal
    
    # Create ticket
    db_ticket = Ticket(
        id=str(uuid.uuid4()),
        customer_name=ticket_data.customer_name,
        payment_method=ticket_data.payment_method,
        payment_status=PaymentStatus(ticket_data.payment_status),
        subtotal=subtotal,
        tax=tax,
        total=total,
        exchange_rate=ticket_data.exchange_rate,
        amount_usd=ticket_data.amount_usd,
        amount_ves=ticket_data.amount_ves
    )
    
    db.add(db_ticket)
    db.flush()  # Flush to get the ticket ID
    
    # Create ticket items
    for item_data in ticket_items:
        db_item = TicketItem(ticket_id=db_ticket.id, **item_data)
        db.add(db_item)
    
    db.commit()
    db.refresh(db_ticket)
    
    return db_ticket


@router.get("", response_model=List[TicketResponse])
def get_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all tickets.
    
    Args:
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of tickets
    """
    tickets = db.query(Ticket).order_by(Ticket.date.desc()).all()
    return tickets


@router.get("/delinquents", response_model=List[TicketResponse])
def get_delinquent_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all tickets with pending payment.
    
    Args:
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of tickets with pending payment
    """
    tickets = db.query(Ticket).filter(
        Ticket.payment_status == PaymentStatus.PENDING
    ).order_by(Ticket.date.desc()).all()
    return tickets


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific ticket by ID.
    
    Args:
        ticket_id: Ticket ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Ticket details
        
    Raises:
        HTTPException: If ticket not found
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket with id {ticket_id} not found"
        )
    
    return ticket


@router.put("/{ticket_id}/pay", response_model=TicketResponse)
def mark_ticket_as_paid(
    ticket_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a ticket as paid.
    
    Args:
        ticket_id: Ticket ID
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Updated ticket
        
    Raises:
        HTTPException: If ticket not found
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket with id {ticket_id} not found"
        )
    
    ticket.payment_status = PaymentStatus.PAID
    db.commit()
    db.refresh(ticket)
    
    return ticket
