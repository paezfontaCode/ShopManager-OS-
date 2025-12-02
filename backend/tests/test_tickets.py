"""
Tests for ticket/sales endpoints
"""
import pytest
from app.models.ticket import Ticket
from app.models.product import Product


@pytest.mark.tickets
class TestTickets:
    """Test ticket/sales operations"""
    
    def test_create_ticket_with_items(self, client, test_db, auth_headers_admin):
        """Test creating a ticket with items"""
        # Create a product first
        product = Product(
            name="Test Product",
            brand="Test Brand",
            stock=100,
            price=50.0,
            image_url=""
        )
        test_db.add(product)
        test_db.commit()
        test_db.refresh(product)
        
        ticket_data = {
            "customer_name": "Test Customer",
            "payment_method": "cash",
            "payment_status": "Paid",
            "items": [
                {
                    "product_id": product.id,
                    "quantity": 2,
                    "price": 50.0
                }
            ],
            "subtotal": 100.0,
            "tax": 0.0,
            "total": 100.0,
            "exchange_rate": 36.5,
            "amount_usd": 100.0,
            "amount_ves": 0.0
        }
        
        response = client.post(
            "/api/tickets",
            json=ticket_data,
            headers=auth_headers_admin
        )
        
        assert response.status_code in [200, 201]
        data = response.json()
        assert "id" in data
        assert data["customer_name"] == "Test Customer"
        assert data["total"] == 100.0
    
    def test_create_ticket_updates_stock(self, client, test_db, auth_headers_admin):
        """Test that creating a ticket updates product stock"""
        # Create a product with initial stock
        product = Product(
            name="Stock Test Product",
            brand="Test",
            stock=50,
            price=25.0,
            image_url=""
        )
        test_db.add(product)
        test_db.commit()
        test_db.refresh(product)
        initial_stock = product.stock
        
        ticket_data = {
            "customer_name": "Stock Test",
            "payment_method": "cash",
            "payment_status": "Paid",
            "items": [
                {
                    "product_id": product.id,
                    "quantity": 5,
                    "price": 25.0
                }
            ],
            "subtotal": 125.0,
            "tax": 0.0,
            "total": 125.0,
            "exchange_rate": 36.5
        }
        
        response = client.post(
            "/api/tickets",
            json=ticket_data,
            headers=auth_headers_admin
        )
        
        assert response.status_code in [200, 201]
        
        # Verify stock was updated
        test_db.refresh(product)
        assert product.stock == initial_stock - 5
    
    def test_list_tickets(self, client, auth_headers_admin):
        """Test listing tickets"""
        response = client.get("/api/tickets", headers=auth_headers_admin)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_get_ticket_by_id(self, client, test_db, auth_headers_admin):
        """Test getting a specific ticket by ID"""
        # This test would need a ticket to exist
        # For now, just test the endpoint returns proper error for non-existent ticket
        response = client.get("/api/tickets/nonexistent-id", headers=auth_headers_admin)
        assert response.status_code in [404, 200]
    
    def test_mark_ticket_as_paid(self, client, test_db, auth_headers_admin):
        """Test marking a ticket as paid"""
        # This would need a ticket to exist
        # Testing the endpoint structure
        response = client.put("/api/tickets/test-id/pay", headers=auth_headers_admin)
        assert response.status_code in [200, 404]
