from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas.part import PartCreate, PartUpdate, PartResponse
from ..models.part import Part
from ..models.user import User
from ..utils.dependencies import get_db, get_current_user

router = APIRouter(prefix="/api/parts", tags=["Parts"])


@router.get("", response_model=List[PartResponse])
def get_parts(
    q: Optional[str] = Query(None, description="Search query for name or SKU"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all parts with optional search.
    
    Args:
        q: Optional search query
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of parts
    """
    query = db.query(Part)
    
    if q:
        search_filter = f"%{q}%"
        query = query.filter(
            (Part.name.ilike(search_filter)) | (Part.sku.ilike(search_filter))
        )
    
    parts = query.all()
    return parts


@router.post("", response_model=PartResponse, status_code=status.HTTP_201_CREATED)
def create_part(
    part: PartCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new part.
    
    Args:
        part: Part data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Created part
        
    Raises:
        HTTPException: If SKU already exists
    """
    # Check if SKU already exists
    existing_part = db.query(Part).filter(Part.sku == part.sku).first()
    if existing_part:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Part with SKU {part.sku} already exists"
        )
    
    db_part = Part(**part.model_dump())
    db.add(db_part)
    db.commit()
    db.refresh(db_part)
    return db_part


@router.put("/{part_id}", response_model=PartResponse)
def update_part(
    part_id: int,
    part: PartUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a part.
    
    Args:
        part_id: Part ID
        part: Updated part data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Updated part
        
    Raises:
        HTTPException: If part not found or SKU conflict
    """
    db_part = db.query(Part).filter(Part.id == part_id).first()
    
    if not db_part:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Part with id {part_id} not found"
        )
    
    # Check SKU conflict if updating SKU
    if part.sku and part.sku != db_part.sku:
        existing_part = db.query(Part).filter(Part.sku == part.sku).first()
        if existing_part:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Part with SKU {part.sku} already exists"
            )
    
    # Update only provided fields
    update_data = part.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_part, field, value)
    
    db.commit()
    db.refresh(db_part)
    return db_part


@router.delete("/{part_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_part(
    part_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a part.
    
    Args:
        part_id: Part ID
        db: Database session
        current_user: Current authenticated user
        
    Raises:
        HTTPException: If part not found
    """
    db_part = db.query(Part).filter(Part.id == part_id).first()
    
    if not db_part:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Part with id {part_id} not found"
        )
    
    db.delete(db_part)
    db.commit()
    return None
