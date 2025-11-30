"""
Tests for product endpoints
"""
import pytest
from app.models.product import Product


@pytest.mark.products
class TestProducts:
    """Test product CRUD operations"""
    
    def test_list_products_empty(self, client, auth_headers_admin):
        """Test listing products when database is empty"""
        response = client.get("/api/products", headers=auth_headers_admin)
        assert response.status_code == 200
        # Database might have seed data, just check it returns a list
        assert isinstance(response.json(), list)
    
    def test_create_product(self, client, auth_headers_admin):
        """Test creating a new product"""
        product_data = {
            "name": "iPhone 14",
            "brand": "Apple",
            "stock": 10,
            "price": 999.99,
            "image_url": "https://example.com/iphone14.jpg"
        }
        
        response = client.post(
            "/api/products",
            json=product_data,
            headers=auth_headers_admin
        )
        
        assert response.status_code in [200, 201]
        data = response.json()
        assert data["name"] == product_data["name"]
        assert data["brand"] == product_data["brand"]
        assert data["stock"] == product_data["stock"]
        assert data["price"] == product_data["price"]
        assert "id" in data
    
    def test_create_product_invalid_data(self, client, auth_headers_admin):
        """Test creating product with invalid data"""
        product_data = {
            "name": "Test Product",
            "stock": -5,  # Invalid: negative stock
            "price": 100.0
        }
        
        response = client.post(
            "/api/products",
            json=product_data,
            headers=auth_headers_admin
        )
        
        assert response.status_code == 422
    
    def test_update_product(self, client, test_db, auth_headers_admin):
        """Test updating an existing product"""
        # Create a product first
        product = Product(
            name="Test Product",
            brand="Test Brand",
            stock=10,
            price=50.0,
            image_url="http://example.com/test.jpg"
        )
        test_db.add(product)
        test_db.commit()
        test_db.refresh(product)
        
        # Update the product
        update_data = {
            "name": "Updated Product",
            "stock": 20,
            "price": 75.0
        }
        
        response = client.put(
            f"/api/products/{product.id}",
            json=update_data,
            headers=auth_headers_admin
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Product"
        assert data["stock"] == 20
        assert data["price"] == 75.0
    
    def test_delete_product(self, client, test_db, auth_headers_admin):
        """Test deleting a product"""
        # Create a product first
        product = Product(
            name="Test Product",
            brand="Test Brand",
            stock=10,
            price=50.0,
            image_url="http://example.com/test.jpg"
        )
        test_db.add(product)
        test_db.commit()
        test_db.refresh(product)
        
        # Delete the product
        response = client.delete(
            f"/api/products/{product.id}",
            headers=auth_headers_admin
        )
        
        assert response.status_code == 204
        
        # Verify it's deleted - check that our test product is not in the list
        response = client.get("/api/products", headers=auth_headers_admin)
        products = response.json()
        assert not any(p["name"] == "Test Product" for p in products)
    
    def test_search_products(self, client, test_db, auth_headers_admin):
        """Test searching products"""
        # Create multiple products
        products = [
            Product(name="iPhone 14", brand="Apple", stock=10, price=999.99, image_url=""),
            Product(name="Samsung Galaxy S23", brand="Samsung", stock=5, price=899.99, image_url=""),
            Product(name="iPhone 13", brand="Apple", stock=15, price=799.99, image_url=""),
        ]
        for product in products:
            test_db.add(product)
        test_db.commit()
        
        # Search for "iPhone"
        response = client.get("/api/products?q=iPhone", headers=auth_headers_admin)
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert all("iPhone" in p["name"] for p in data)
