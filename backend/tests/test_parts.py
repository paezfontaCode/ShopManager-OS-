"""
Tests for parts endpoints
"""
import pytest
from app.models.part import Part


@pytest.mark.parts
class TestParts:
    """Test parts CRUD operations"""
    
    def test_create_part(self, client, auth_headers_tech):
        """Test creating a new part"""
        part_data = {
            "name": "iPhone 14 Screen",
            "sku": "IP14-SCR",
            "stock": 10,
            "price": 250.00,
            "compatible_models": ["iPhone 14", "iPhone 14 Pro"]
        }
        
        response = client.post(
            "/api/parts",
            json=part_data,
            headers=auth_headers_tech
        )
        
        assert response.status_code in [200, 201]
        data = response.json()
        assert data["name"] == part_data["name"]
        assert data["sku"] == part_data["sku"]
        assert data["compatible_models"] == part_data["compatible_models"]
    
    def test_list_parts(self, client, test_db, auth_headers_tech):
        """Test listing parts"""
        parts = [
            Part(
                name="Screen",
                sku="SCR-001",
                stock=10,
                price=100.0,
                compatible_models=["iPhone 14"]
            ),
            Part(
                name="Battery",
                sku="BAT-001",
                stock=5,
                price=50.0,
                compatible_models=["iPhone 14", "iPhone 13"]
            )
        ]
        for part in parts:
            test_db.add(part)
        test_db.commit()
        
        response = client.get("/api/parts", headers=auth_headers_tech)
        assert response.status_code == 200
        data = response.json()
        # Check that at least our test parts are in the response
        assert len(data) >= 2
        # Verify our test parts are present
        names = [part["name"] for part in data]
        assert "Screen" in names
        assert "Battery" in names
    
    def test_update_part_stock(self, client, test_db, auth_headers_tech):
        """Test updating part stock"""
        part = Part(
            name="Test Part",
            sku="TEST-001",
            stock=10,
            price=50.0,
            compatible_models=["Test Model"]
        )
        test_db.add(part)
        test_db.commit()
        test_db.refresh(part)
        
        update_data = {"stock": 20}
        response = client.put(
            f"/api/parts/{part.id}",
            json=update_data,
            headers=auth_headers_tech
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["stock"] == 20
