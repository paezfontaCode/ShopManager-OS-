# Guía de Instalación y Ejecución - MobilePOS

Esta guía te ayudará a instalar y ejecutar MobilePOS en tu entorno local o en producción.

## Requisitos Previos

### Software Necesario
- **Python**: 3.10 o superior
- **Node.js**: 18 o superior
- **npm**: 9 o superior
- **Docker** (opcional): Para deployment con contenedores
- **Git**: Para clonar el repositorio

### Verificar Instalaciones
```bash
python --version  # Debe ser 3.10+
node --version    # Debe ser 18+
npm --version     # Debe ser 9+
docker --version  # Opcional
```

## Instalación - Desarrollo Local

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd Proyecto
```

### 2. Configurar Backend

#### 2.1 Crear Entorno Virtual
```bash
cd backend
python -m venv venv
```

#### 2.2 Activar Entorno Virtual
**Windows:**
```bash
.\venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

#### 2.3 Instalar Dependencias
```bash
pip install -r requirements.txt
```

#### 2.4 Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# Editar .env y cambiar SECRET_KEY
```

#### 2.5 Inicializar Base de Datos
```bash
python init_db.py
```

Esto creará:
- Base de datos SQLite (`mobilepos.db`)
- Usuarios de prueba:
  - Admin: `admin` / `admin123`
  - Técnico: `tech` / `tech123`
- Datos de ejemplo (productos, partes, órdenes)

#### 2.6 Ejecutar Backend
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

El backend estará disponible en: `http://localhost:8000`
Documentación API: `http://localhost:8000/docs`

### 3. Configurar Frontend

#### 3.1 Instalar Dependencias
```bash
cd ../frontend
npm install
```

#### 3.2 Ejecutar Frontend
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

## Instalación - Docker (Producción)

### 1. Construir y Ejecutar con Docker Compose
```bash
# Desde la raíz del proyecto
docker-compose up --build -d
```

Esto iniciará:
- **Backend**: `http://localhost:8000`
- **Frontend**: `http://localhost:3000`

### 2. Ver Logs
```bash
docker-compose logs -f
```

### 3. Detener Servicios
```bash
docker-compose down
```

### 4. Reiniciar Base de Datos
```bash
# Detener contenedores
docker-compose down

# Eliminar base de datos
rm backend/mobilepos.db

# Inicializar DB dentro del contenedor
docker-compose run backend python init_db.py

# Reiniciar
docker-compose up -d
```

## Ejecutar Tests

### Backend (pytest)
```bash
cd backend
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux/Mac

# Ejecutar todos los tests
pytest

# Con cobertura
pytest --cov=app --cov-report=html

# Tests específicos
pytest tests/test_auth.py -v
```

### Frontend (si se implementan)
```bash
cd frontend
npm test
```

## Estructura de Directorios

```
Proyecto/
├── backend/
│   ├── app/
│   │   ├── models/      # Modelos SQLAlchemy
│   │   ├── routers/     # Endpoints API
│   │   ├── schemas/     # Validación Pydantic
│   │   ├── utils/       # Utilidades (auth, security)
│   │   ├── database.py  # Configuración DB
│   │   └── main.py      # Aplicación FastAPI
│   ├── tests/           # Tests con pytest
│   ├── init_db.py       # Script de inicialización
│   ├── requirements.txt # Dependencias Python
│   ├── .env            # Variables de entorno (NO commitear)
│   └── Dockerfile      # Imagen Docker backend
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas
│   │   ├── services/    # API calls
│   │   └── App.tsx      # Componente principal
│   ├── package.json     # Dependencias Node
│   └── Dockerfile      # Imagen Docker frontend
└── docker-compose.yml  # Orquestación Docker
```

## Solución de Problemas

### Backend no inicia
```bash
# Verificar que el puerto 8000 no esté en uso
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Linux/Mac

# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall
```

### Frontend no inicia
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar puerto 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac
```

### Error de base de datos
```bash
# Eliminar y recrear
rm mobilepos.db
python init_db.py
```

### Error de CORS
Verificar que `ALLOWED_ORIGINS` en `.env` incluya `http://localhost:3000`

### Caché del navegador
Hacer hard refresh: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)

## Próximos Pasos

1. **Cambiar credenciales**: Modificar usuarios por defecto en `init_db.py`
2. **Configurar producción**: Actualizar `.env` con valores seguros
3. **Backup**: Configurar respaldo automático de `mobilepos.db`
4. **SSL/HTTPS**: Configurar certificados para producción
5. **Monitoreo**: Implementar logging y monitoreo de errores

## Soporte

Para problemas o preguntas:
1. Revisar la documentación de la API: `http://localhost:8000/docs`
2. Verificar logs del backend y frontend
3. Consultar el archivo `ENVIRONMENT.md` para configuración de variables

## Licencia

[Especificar licencia del proyecto]
