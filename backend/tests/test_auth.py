"""
Tests for authentication endpoints
"""
import pytest
from app.models.user import User
from app.utils.security import get_password_hash


@pytest.mark.auth
class TestAuthentication:
    """Test authentication endpoints"""
    
    def test_login_success(self, client, test_db):
        """Test successful login with valid credentials"""
        # Create a test user
        hashed_password = get_password_hash("testpass123")
        user = User(
            username="testuser",
            hashed_password=hashed_password,
            role="admin"
        )
        test_db.add(user)
        test_db.commit()
        
        # Attempt login
        response = client.post(
            "/api/auth/login",
            json={"username": "testuser", "password": "testpass123"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["role"] == "admin"
    
    def test_login_invalid_credentials(self, client, test_db):
        """Test login with invalid credentials"""
        # Create a test user
        hashed_password = get_password_hash("testpass123")
        user = User(
            username="testuser",
            hashed_password=hashed_password,
            role="admin"
        )
        test_db.add(user)
        test_db.commit()
        
        # Attempt login with wrong password
        response = client.post(
            "/api/auth/login",
            json={"username": "testuser", "password": "wrongpassword"}
        )
        
        assert response.status_code == 401
        assert "detail" in response.json()
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user"""
        response = client.post(
            "/api/auth/login",
            json={"username": "nonexistent", "password": "password123"}
        )
        
        assert response.status_code == 401
    
    def test_protected_route_without_token(self, client):
        """Test accessing protected route without authentication"""
        response = client.get("/api/products")
        assert response.status_code == 401
    
    def test_protected_route_with_valid_token(self, client, auth_headers_admin):
        """Test accessing protected route with valid token"""
        response = client.get("/api/products", headers=auth_headers_admin)
        assert response.status_code == 200
