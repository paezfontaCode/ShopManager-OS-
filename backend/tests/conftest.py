"""
Pytest configuration and shared fixtures for testing
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models.user import User
from app.utils.security import create_access_token, get_password_hash


# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def test_db():
    """Create a fresh database for each test"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with database override"""
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    # Override both the database module and the dependencies module
    # to ensure all parts of the app use the test database
    app.dependency_overrides[get_db] = override_get_db
    from app.utils import dependencies
    # We also need to override the get_db in dependencies if it's used directly
    # But since we refactored dependencies.py to import get_db from database.py,
    # overriding app.database.get_db should be enough if imports are correct.
    # However, to be safe, let's override the dependency in the app:
    # app.dependency_overrides[dependencies.get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def admin_token():
    """Generate admin JWT token for testing"""
    return create_access_token(data={"sub": "admin", "role": "admin"})


@pytest.fixture
def tech_token():
    """Generate technician JWT token for testing"""
    return create_access_token(data={"sub": "tech", "role": "technician"})


@pytest.fixture
def auth_headers_admin(test_db, admin_token):
    """Headers with admin authentication"""
    # Create admin user in the database
    user = User(
        username="admin",
        hashed_password=get_password_hash("admin123"),
        role="admin"
    )
    test_db.add(user)
    test_db.commit()
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def auth_headers_tech(test_db, tech_token):
    """Headers with technician authentication"""
    # Create technician user in the database
    user = User(
        username="tech",
        hashed_password=get_password_hash("tech123"),
        role="technician"
    )
    test_db.add(user)
    test_db.commit()
    return {"Authorization": f"Bearer {tech_token}"}
