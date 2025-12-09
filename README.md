# 🏪 ServiceFlow - Sistema de Gestión para Talleres de Reparación

<div align="center">
  <img src="frontend/public/images/logo/logo.png" alt="ServiceFlow Logo" width="200"/>
  <br>
  <h3>Sistema completo de gestión de reparaciones, inventario y punto de venta</h3>
  
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![React](https://img.shields.io/badge/react-19-61dafb.svg)
  ![FastAPI](https://img.shields.io/badge/fastapi-latest-009688.svg)
  ![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)
</div>

---

## 📋 Descripción

**ServiceFlow** es un sistema integral diseñado para talleres y tiendas de reparación de dispositivos móviles. Ofrece gestión completa de órdenes de trabajo, control de inventario (productos y repuestos), sistema punto de venta (POS), y administración de clientes, todo en una interfaz moderna y fácil de usar.

### ✨ Características Principales

- 🔧 **Gestión de Reparaciones**: Seguimiento completo desde recepción hasta entrega
- 📦 **Control de Inventario**: Productos para venta y repuestos para reparación
- 💰 **Punto de Venta (POS)**: Sistema de facturación rápida
- 👥 **CRM de Clientes**: Historial completo por cliente
- 📊 **Dashboard Analítico**: Métricas de ventas, reparaciones y stock
- 🔐 **Sistema de Usuarios**: Roles Admin y Técnico
- ⚙️ **Garantías Automáticas**: Cálculo de periodos de garantía

---

## 🚀 Inicio Rápido

Elige el método que prefieras:

### 📌 Opción 1: Desarrollo Local (Sin Docker)

**Requisitos**:
- Python 3.10+
- Node.js 16+
- npm 8+

**Instalación**:

```bash
# 1. Clonar repositorio
git clone https://github.com/paezfontaCode/ServiceFlow.git
cd ServiceFlow

# 2. Iniciar servicios (en Windows)
.\start.bat

# O usar PowerShell:
.\startsinDocker.ps1
```

El script automáticamente:
- ✅ Crea entorno virtual Python
- ✅ Instala dependencias backend y frontend
- ✅ Inicializa base de datos SQLite
- ✅ Inicia backend (puerto 8000) y frontend (puerto 3000)

**Acceso**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

### 📌 Opción 2: Con Docker

**Requisitos**:
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

**Instalación**:

```bash
# 1. Clonar repositorio
git clone https://github.com/paezfontaCode/ServiceFlow.git
cd ServiceFlow

# 2. Iniciar con Docker Compose
docker-compose up -d --build
```

**Acceso**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- PostgreSQL: localhost:5432

**Detener servicios**:
```bash
docker-compose down
```

**Borrar datos (reinicio completo)**:
```bash
docker-compose down -v
```

---

## 👤 Credenciales de Acceso

El sistema incluye dos usuarios preconfigurados:

| Rol | Usuario | Contraseña | Permisos |
|-----|---------|------------|----------|
| **Administrador** | `admin` | `admin123` | Acceso total |
| **Técnico** | `tech` | `tech123` | Reparaciones e inventario |

> ⚠️ **Importante**: Cambia estas contraseñas después del primer inicio de sesión.

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: React 19 con TypeScript
- **Build Tool**: Vite
- **UI**: TailwindCSS, React Router
- **Estado**: React Query (TanStack Query)

### Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy 2.0
- **Validación**: Pydantic 2.x
- **Autenticación**: JWT (python-jose)

### Base de Datos
- **Desarrollo Local**: SQLite
- **Producción (Docker)**: PostgreSQL 15

### DevOps
- **Containerización**: Docker, Docker Compose
- **Servidor Web**: Nginx (producción)

---

## 📂 Estructura del Proyecto

```
ServiceFlow/
├── frontend/                  # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Páginas principales
│   │   ├── context/          # Context API (Auth, etc.)
│   │   └── api/              # Cliente API
│   └── public/images/        # Assets estáticos
│
├── backend/                   # API FastAPI
│   ├── app/
│   │   ├── models/           # Modelos SQLAlchemy
│   │   ├── routers/          # Endpoints API
│   │   ├── schemas/          # Schemas Pydantic
│   │   └── config.py         # Configuración
│   ├── init_db.py            # Inicializador BD
│   └── requirements.txt
│
├── docker-compose.yml         # Orquestación Docker
├── start.bat                  # Script de inicio (Windows)
├── startsinDocker.ps1         # Script PowerShell alternativo
└── README.md
```

---

## 📱 Acceso desde Dispositivos Móviles

Puedes acceder desde tu celular o tablet en la misma red WiFi:

1. **Obtén tu IP local**:
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```
   Busca tu IPv4 (ej: `192.168.1.15`)

2. **Accede desde el móvil**:
   - Abre tu navegador
   - Ve a `http://192.168.1.15:3000`

---

## 🔧 Configuración Avanzada

### Variables de Entorno (Backend)

Crea un archivo `.env` en `backend/`:

```env
# Base de datos
DATABASE_URL=sqlite:///./serviceflow.db
# DATABASE_URL=postgresql://user:pass@localhost:5432/serviceflow

# Seguridad
SECRET_KEY=tu-clave-secreta-muy-segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Cambiar Puerto del Frontend

Edita `frontend/vite.config.ts`:
```typescript
server: {
  port: 3000,  // Cambia este valor
  host: '0.0.0.0',
}
```

---

## 🧪 Desarrollo

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Inicializar BD
python init_db.py

# Iniciar servidor de desarrollo
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

---

## 🐛 Solución de Problemas

### Puerto 8000 o 3000 ya en uso

```bash
# Windows: Encuentra el proceso
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Matael proceso
taskkill /PID <número_proceso> /F
```

### Error de dependencias Python

```bash
cd backend
venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Error de dependencias Node

```bash
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 📞 Soporte

¿Problemas o preguntas? Abre un [issue](https://github.com/paezfontaCode/ServiceFlow/issues) en GitHub.

---

<div align="center">
  <sub>Desarrollado con ❤️ por <a href="https://github.com/paezfontaCode">paezfontaCode</a></sub>
</div>