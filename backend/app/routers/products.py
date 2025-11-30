from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse
from ..models.product import Product
from ..models.user import User
from ..utils.dependencies import get_db, get_current_user, require_admin

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("", response_model=List[ProductResponse])
def get_products(
    q: Optional[str] = Query(None, description="Search query for name or brand"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all products with optional search.
    
    Args:
        q: Optional search query
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of products
    """
    query = db.query(Product)
    
    if q:
        search_filter = f"%{q}%"
        query = query.filter(
            (Product.name.ilike(search_filter)) | (Product.brand.ilike(search_filter))
        )
    
    products = query.all()
    return products


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Create a new product (admin only).
    
    Args:
        product: Product data
        db: Database session
        current_user: Current authenticated admin user
        
    Returns:
        Created product
    """
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Update a product (admin only).
    
    Args:
        product_id: Product ID
        product: Updated product data
        db: Database session
        current_user: Current authenticated admin user
        
    Returns:
        Updated product
        
    Raises:
        HTTPException: If product not found
    """
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    
    # Update only provided fields
    update_data = product.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Delete a product (admin only).
    
    Args:
        product_id: Product ID
        db: Database session
        current_user: Current authenticated admin user
        
    Raises:
        HTTPException: If product not found
    """
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    
    db.delete(db_product)
    db.commit()
    return None
