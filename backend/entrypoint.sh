#!/bin/bash

# Entrypoint script for backend container
# Initializes database and starts the application

set -e

echo "🔧 Checking database..."

# Only run init_db.py if database is empty (no users table)
python -c "
from app.database import engine
from sqlalchemy import inspect
inspector = inspect(engine)
tables = inspector.get_table_names()
if 'users' not in tables:
    print('Database is empty, initializing...')
    exit(0)
else:
    print('Database already initialized, skipping...')
    exit(1)
" && python init_db.py || echo "✅ Database already initialized"

echo "🚀 Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
