"""
Database initialization and seed data script.
Run this script to create all tables and populate with initial users.
"""
from app.database import engine, SessionLocal, Base
from app.models import User
from app.models.user import UserRole
from app.utils.security import get_password_hash


def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")


def seed_data():
    """Populate database with initial seed data"""
    db = SessionLocal()
    
    try:
        print("\nSeeding database with initial data...")
        
        # Create users
        print("Creating users...")
        admin_user = User(
            username="admin",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN
        )
        tech_user = User(
            username="tech",
            hashed_password=get_password_hash("tech123"),
            role=UserRole.TECHNICIAN
        )
        db.add(admin_user)
        db.add(tech_user)
        db.commit()
        print("✓ Users created (admin/admin123, tech/tech123)")
        
        print("\n✅ Database initialized successfully!")
        print("\nLogin credentials:")
        print("  Admin: username='admin', password='admin123'")
        print("  Tech:  username='tech', password='tech123'")
        print("\nYour system is ready to use with a clean database.")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 50)
    print("ServiceFlow Database Initialization")
    print("=" * 50)
    
    init_db()
    seed_data()
    
    print("\n" + "=" * 50)
    print("Initialization complete!")
    print("=" * 50)
