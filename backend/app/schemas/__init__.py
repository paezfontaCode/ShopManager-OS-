# Import all schemas here for easier imports
from .auth import LoginRequest, TokenResponse
from .product import ProductBase, ProductCreate, ProductUpdate, ProductResponse
from .ticket import TicketItemCreate, TicketCreate, TicketResponse, TicketItemResponse
from .work_order import WorkOrderCreate, WorkOrderUpdate, WorkOrderResponse
from .part import PartBase, PartCreate, PartUpdate, PartResponse

__all__ = [
    "LoginRequest", "TokenResponse",
    "ProductBase", "ProductCreate", "ProductUpdate", "ProductResponse",
    "TicketItemCreate", "TicketCreate", "TicketResponse", "TicketItemResponse",
    "WorkOrderCreate", "WorkOrderUpdate", "WorkOrderResponse",
    "PartBase", "PartCreate", "PartUpdate", "PartResponse"
]
