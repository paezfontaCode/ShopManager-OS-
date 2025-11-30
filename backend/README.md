# MobilePOS Backend

Backend API para el sistema de gestión MobilePOS, construido con FastAPI y SQLite.

## 🚀 Características

- **Autenticación JWT**: Sistema seguro de autenticación con roles (Admin/Técnico)
- **API RESTful**: Endpoints completos para gestión de productos, ventas, reparaciones y partes
- **Base de Datos SQLite**: Base de datos ligera y fácil de configurar
- **Documentación Automática**: Swagger UI y ReDoc integrados
- **Validación de Datos**: Validación automática con Pydantic
- **CORS Configurado**: Listo para trabajar con el frontend

## 📋 Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

## 🔧 Instalación

### 1. Crear entorno virtual

```bash
cd backend
python -m venv venv
```

### 2. Activar entorno virtual

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
copy .env.example .env
```

El archivo `.env` ya está configurado con valores por defecto para desarrollo.

### 5. Inicializar base de datos

```bash
python init_db.py
```

Este script creará todas las tablas y poblará la base de datos con datos de prueba.

## ▶️ Ejecutar el servidor

```bash
uvicorn app.main:app --reload
```

El servidor estará disponible en:
- API: http://localhost:8000
- Documentación Swagger: http://localhost:8000/docs
- Documentación ReDoc: http://localhost:8000/redoc

## 👥 Usuarios de Prueba

Después de ejecutar `init_db.py`, tendrás estos usuarios disponibles:

- **Administrador**
  - Username: `admin`
  - Password: `admin123`
  - Permisos: Acceso completo a todos los endpoints

- **Técnico**
  - Username: `tech`
  - Password: `tech123`
  - Permisos: Acceso a reparaciones y consultas

## 📡 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Login y obtención de token JWT

### Productos (requiere autenticación)
- `GET /api/products` - Listar productos (con búsqueda opcional)
- `POST /api/products` - Crear producto (solo admin)
- `PUT /api/products/{id}` - Actualizar producto (solo admin)
- `DELETE /api/products/{id}` - Eliminar producto (solo admin)

### Tickets/Ventas (requiere autenticación)
- `GET /api/tickets` - Listar tickets
- `POST /api/tickets` - Crear ticket (procesar venta)
- `GET /api/tickets/delinquents` - Tickets con pago pendiente
- `PUT /api/tickets/{id}/pay` - Marcar ticket como pagado

### Órdenes de Trabajo (requiere autenticación)
- `GET /api/work-orders` - Listar órdenes (con búsqueda opcional)
- `POST /api/work-orders` - Crear orden de trabajo
- `PUT /api/work-orders/{id}` - Actualizar orden
- `DELETE /api/work-orders/{id}` - Eliminar orden

### Partes de Repuesto (requiere autenticación)
- `GET /api/parts` - Listar partes (con búsqueda opcional)
- `POST /api/parts` - Crear parte
- `PUT /api/parts/{id}` - Actualizar parte
- `DELETE /api/parts/{id}` - Eliminar parte

### Dashboard (requiere autenticación)
- `GET /api/dashboard/summary` - Resumen para administradores
- `GET /api/repairs/dashboard/summary` - Resumen para técnicos

## 🔐 Autenticación

Todos los endpoints (excepto `/api/auth/login`) requieren autenticación mediante JWT token.

### Flujo de autenticación:

1. **Login**: Envía credenciales a `/api/auth/login`
```json
{
  "username": "admin",
  "password": "admin123"
}
```

2. **Respuesta**: Recibirás un token JWT
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "role": "admin"
}
```

3. **Usar token**: Incluye el token en el header de las siguientes peticiones
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📁 Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Aplicación FastAPI principal
│   ├── config.py            # Configuración y variables de entorno
│   ├── database.py          # Configuración de SQLAlchemy
│   ├── models/              # Modelos de base de datos
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── ticket.py
│   │   ├── work_order.py
│   │   └── part.py
│   ├── schemas/             # Schemas Pydantic para validación
│   │   ├── auth.py
│   │   ├── product.py
│   │   ├── ticket.py
│   │   ├── work_order.py
│   │   └── part.py
│   ├── routers/             # Endpoints de la API
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── tickets.py
│   │   ├── work_orders.py
│   │   ├── parts.py
│   │   └── dashboard.py
│   └── utils/               # Utilidades
│       ├── security.py      # JWT y hashing
│       └── dependencies.py  # Dependencias de FastAPI
├── init_db.py               # Script de inicialización
├── requirements.txt         # Dependencias Python
├── .env                     # Variables de entorno
└── README.md               # Este archivo
```

## 🧪 Testing

Para probar la API, puedes usar:

1. **Swagger UI**: http://localhost:8000/docs
   - Interfaz interactiva para probar todos los endpoints
   - Incluye autenticación integrada

2. **Postman/Insomnia**: Importa los endpoints manualmente

3. **curl**: Ejemplo de uso
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Obtener productos (con token)
curl http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔄 Integración con Frontend

El frontend debe configurar la URL del backend en su archivo `.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

## 📝 Notas de Desarrollo

- La base de datos SQLite se crea automáticamente en `mobilepos.db`
- Los tokens JWT expiran después de 24 horas (configurable en `.env`)
- El servidor se recarga automáticamente con cambios en modo desarrollo (`--reload`)
- CORS está configurado para permitir requests desde `localhost:5173` y `localhost:3000`

## 🐛 Solución de Problemas

### Error: "ModuleNotFoundError"
- Asegúrate de que el entorno virtual esté activado
- Reinstala las dependencias: `pip install -r requirements.txt`

### Error: "Could not validate credentials"
- Verifica que el token JWT sea válido
- Asegúrate de incluir "Bearer " antes del token en el header

### Error de CORS
- Verifica que la URL del frontend esté en `CORS_ORIGINS` en el archivo `.env`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
