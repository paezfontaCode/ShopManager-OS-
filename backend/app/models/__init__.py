# Import all models here for easier imports
from .user import User
from .product import Product
from .ticket import Ticket, TicketItem
from .work_order import WorkOrder
from .part import Part

__all__ = ["User", "Product", "Ticket", "TicketItem", "WorkOrder", "Part"]
