from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import (
    auth_router,
    products_router,
    tickets_router,
    work_orders_router,
    parts_router,
    dashboard_router,
    users_router
)

# Create FastAPI application
app = FastAPI(
    title="ServiceFlow API",
    description="Backend API for ServiceFlow Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(tickets_router)
app.include_router(work_orders_router)
app.include_router(parts_router)
app.include_router(dashboard_router)
app.include_router(users_router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "ServiceFlow API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
