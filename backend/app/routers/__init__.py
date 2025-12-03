# Import all routers here for easier imports
from .auth import router as auth_router
from .products import router as products_router
from .tickets import router as tickets_router
from .work_orders import router as work_orders_router
from .parts import router as parts_router
from .dashboard import router as dashboard_router
from .users import router as users_router

__all__ = [
    "auth_router",
    "products_router",
    "tickets_router",
    "work_orders_router",
    "parts_router",
    "dashboard_router",
    "users_router"
]
