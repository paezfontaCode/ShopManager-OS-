"""
Database initialization and seed data script.
Run this script to create all tables and populate with initial data.
"""
from app.database import engine, SessionLocal, Base
from app.models import User, Product, Part, WorkOrder, Ticket, TicketItem
from app.models.user import UserRole
from app.models.work_order import RepairStatus
from app.utils.security import get_password_hash
import uuid


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
        
        # Create products
        print("Creating products...")
        products = [
            Product(
                name="iPhone 14 Pro",
                brand="Apple",
                stock=15,
                price=999.99,
                image_url="https://images.unsplash.com/photo-1678652197950-d4c0b0a5e5a5",
                min_stock=5
            ),
            Product(
                name="Galaxy S23 Ultra",
                brand="Samsung",
                stock=12,
                price=1199.99,
                image_url="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
                min_stock=5
            ),
            Product(
                name="Pixel 8 Pro",
                brand="Google",
                stock=8,
                price=899.99,
                image_url="https://images.unsplash.com/photo-1598327105666-5b89351aff97",
                min_stock=5
            ),
            Product(
                name="iPhone 13",
                brand="Apple",
                stock=20,
                price=699.99,
                image_url="https://images.unsplash.com/photo-1632633173522-c8e6e1b2f7e0",
                min_stock=5
            ),
            Product(
                name="Galaxy A54",
                brand="Samsung",
                stock=25,
                price=449.99,
                image_url="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
                min_stock=10
            ),
            Product(
                name="OnePlus 11",
                brand="OnePlus",
                stock=3,
                price=699.99,
                image_url="https://images.unsplash.com/photo-1565849904461-04a58ad377e0",
                min_stock=5
            ),
        ]
        
        for product in products:
            db.add(product)
        db.commit()
        print(f"✓ Created {len(products)} products")
        
        # Create parts
        print("Creating repair parts...")
        parts = [
            Part(
                name="Pantalla LCD iPhone 14",
                sku="LCD-IP14-001",
                stock=10,
                price=199.99,
                compatible_models=["iPhone 14", "iPhone 14 Pro"],
                min_stock=5
            ),
            Part(
                name="Batería Samsung S23",
                sku="BAT-S23-001",
                stock=15,
                price=49.99,
                compatible_models=["Galaxy S23", "Galaxy S23 Ultra"],
                min_stock=8
            ),
            Part(
                name="Cámara Trasera Pixel 8",
                sku="CAM-PX8-001",
                stock=5,
                price=89.99,
                compatible_models=["Pixel 8", "Pixel 8 Pro"],
                min_stock=3
            ),
            Part(
                name="Puerto de Carga USB-C",
                sku="CHG-USBC-001",
                stock=25,
                price=19.99,
                compatible_models=["Universal"],
                min_stock=10
            ),
            Part(
                name="Vidrio Templado Universal",
                sku="GLASS-UNI-001",
                stock=2,
                price=9.99,
                compatible_models=["Universal"],
                min_stock=20
            ),
        ]
        
        for part in parts:
            db.add(part)
        db.commit()
        print(f"✓ Created {len(parts)} repair parts")
        
        # Create sample work orders
        print("Creating sample work orders...")
        work_orders = [
            WorkOrder(
                id=str(uuid.uuid4()),
                customer_name="Juan Pérez",
                device="iPhone 13 Pro",
                issue="Pantalla rota, necesita reemplazo",
                status=RepairStatus.EN_REPARACION
            ),
            WorkOrder(
                id=str(uuid.uuid4()),
                customer_name="María García",
                device="Samsung Galaxy S22",
                issue="Batería se descarga rápidamente",
                status=RepairStatus.EN_DIAGNOSTICO
            ),
            WorkOrder(
                id=str(uuid.uuid4()),
                customer_name="Carlos López",
                device="Google Pixel 7",
                issue="No enciende, posible problema de placa",
                status=RepairStatus.RECIBIDO
            ),
        ]
        
        for order in work_orders:
            db.add(order)
        db.commit()
        print(f"✓ Created {len(work_orders)} work orders")
        
        print("\n✅ Database seeded successfully!")
        print("\nTest credentials:")
        print("  Admin: username='admin', password='admin123'")
        print("  Tech:  username='tech', password='tech123'")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 50)
    print("MobilePOS Database Initialization")
    print("=" * 50)
    
    init_db()
    seed_data()
    
    print("\n" + "=" * 50)
    print("Initialization complete!")
    print("=" * 50)
