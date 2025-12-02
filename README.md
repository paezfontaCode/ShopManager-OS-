# 🏪 ShopManager-OS - Sistema de Gestión para Tiendas de Móviles

Sistema completo de gestión y punto de venta (POS) diseñado específicamente para tiendas de móviles. Incluye gestión de inventario, ventas, reparaciones, clientes y un panel de control administrativo completo.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)
![React](https://img.shields.io/badge/react-19-61dafb.svg)
![FastAPI](https://img.shields.io/badge/fastapi-latest-009688.svg)

---

## ✨ Características Principales

### 🎯 Gestión de Ventas
- **Punto de Venta (POS)** intuitivo y rápido
- Soporte para múltiples métodos de pago (Efectivo, Tarjeta, Transferencia, Pago Móvil)
- Conversión automática USD/VES con tasa de cambio configurable
- Gestión de ventas a crédito con seguimiento de pagos pendientes
- Historial completo de tickets con búsqueda y filtrado

### 📦 Inventario Dual
- **Inventario de Productos**: Gestión de productos para venta
- **Inventario de Partes**: Control de repuestos para reparaciones
- Alertas de stock bajo configurables
- Búsqueda y filtrado avanzado
- Imágenes de productos

### 🔧 Módulo de Reparaciones
- Gestión completa de órdenes de trabajo
- Seguimiento de estado (Pendiente, En Progreso, Listo, Entregado)
- Fechas de entrada y entrega
- Cálculo automático de garantía (8 días desde entrega para cambios de pantalla)
- Descripción detallada de reparaciones
- Asignación a técnicos

### 👥 Gestión de Clientes
- Registro de clientes con información completa
- Historial de compras y reparaciones por cliente
- Seguimiento de pagos pendientes
- Notificaciones por WhatsApp/SMS (opcional)

### 🎨 Personalización
- **Temas**: Modo claro/oscuro
- **Idiomas**: Español e Inglés
- **Configuración**: Nombre de tienda personalizable
- **Roles de Usuario**: Admin y Técnico con permisos diferenciados

---

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

La forma más rápida de ejecutar la aplicación completa:

```bash
# Clonar el repositorio
git clone https://github.com/paezfontaCode/ShopManager-OS-.git
cd ShopManager-OS-

# Iniciar con Docker Compose
docker-compose up -d

# Ver logs (opcional)
docker-compose logs -f
```

**Acceso:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Opción 2: Desarrollo Local

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 📱 Acceso desde Dispositivos Móviles

Para acceder a la aplicación desde tu teléfono en la misma red:

1. **Encuentra la IP de tu PC:**
   ```powershell
   ipconfig
   ```
   Busca la "Dirección IPv4" (ej: 192.168.1.100)

2. **Configura el Firewall de Windows:**
   ```powershell
   # Ejecutar como Administrador
   netsh advfirewall firewall add rule name="MobilePOS Frontend" dir=in action=allow protocol=TCP localport=3000
   netsh advfirewall firewall add rule name="MobilePOS Backend" dir=in action=allow protocol=TCP localport=8000
   ```

3. **Accede desde tu teléfono:**
   - Conecta el teléfono a la misma WiFi
   - Navega a: `http://[IP-DE-TU-PC]:3000`
   - Ejemplo: `http://192.168.1.100:3000`

📖 **Instrucciones detalladas**: Ver [INSTRUCCIONES_ACCESO_MOVIL.md](./.gemini/antigravity/brain/39b6ab8e-7f07-4a6b-9b0f-51b19bd7c132/INSTRUCCIONES_ACCESO_MOVIL.md)

---

## 🔧 Stack Tecnológico

### Frontend
- **React 19** con TypeScript
- **Vite** - Build tool ultrarrápido
- **React Router DOM** - Navegación
- **Recharts** - Gráficos y visualizaciones
- **Context API** - Estado global
- **TailwindCSS** - Estilos (via clases personalizadas)

### Backend
- **FastAPI** - Framework web moderno y rápido
- **PostgreSQL** - Base de datos relacional
- **SQLAlchemy** - ORM
- **Alembic** - Migraciones de base de datos
- **JWT** - Autenticación segura
- **Pydantic** - Validación de datos
- **Pytest** - Testing automatizado

### DevOps
- **Docker & Docker Compose** - Contenedorización
- **Nginx** - Servidor web para frontend
- **GitHub Actions** - CI/CD (configurado)

---

## 👥 Usuarios de Prueba

```
Administrador:
  username: admin
  password: admin123

Técnico:
  username: tech
  password: tech123
```

---

## 📂 Estructura del Proyecto

```
ShopManager-OS-/
├── frontend/                 # Aplicación React
│   ├── components/          # Componentes reutilizables
│   ├── context/             # Context API (Auth, Theme, Language)
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Páginas principales
│   ├── services/            # API client
│   ├── types.ts             # TypeScript types
│   └── translations.ts      # i18n
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/            # Endpoints
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Lógica de negocio
│   │   └── core/           # Configuración, seguridad
│   └── tests/              # Tests automatizados
├── docker-compose.yml       # Orquestación de contenedores
├── deploy.sh               # Script de despliegue
└── backup_db.bat           # Script de backup de BD
```

---

## 🔐 Seguridad

- ✅ Autenticación JWT con tokens seguros
- ✅ Contraseñas hasheadas con bcrypt
- ✅ CORS configurado para producción
- ✅ Variables de entorno para secretos
- ✅ Validación de datos con Pydantic
- ✅ Protección contra SQL injection (SQLAlchemy ORM)

---

## 🧪 Testing

El backend incluye tests automatizados con pytest:

```bash
cd backend
pytest
```

**Cobertura de tests:**
- ✅ Autenticación y autorización
- ✅ CRUD de productos
- ✅ Gestión de tickets
- ✅ Órdenes de trabajo
- ✅ Inventario de partes

---

## 📚 Documentación Adicional

- **[INSTALLATION.md](./INSTALLATION.md)** - Guía de instalación detallada
- **[QUICKSTART.md](./QUICKSTART.md)** - Inicio rápido
- **[NOTIFICATIONS_SETUP.md](./NOTIFICATIONS_SETUP.md)** - Configuración de notificaciones WhatsApp/SMS
- **[Frontend README](./frontend/README.md)** - Documentación del frontend
- **[Backend README](./backend/README.md)** - Documentación del backend

---

## 🔄 Cambios Recientes

### v1.2.0 (Diciembre 2025)
- ✅ Eliminada línea de impuesto en POS (precios netos)
- ✅ Configuración CORS para acceso móvil
- ✅ Soporte para redes locales (192.168.*.* y 10.*.*.*)
- ✅ Mejoras en gestión de clientes
- ✅ Sistema de notificaciones WhatsApp/SMS

# 3. Verificar estado
docker-compose ps
```

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Backend
SECRET_KEY=tu-clave-secreta-muy-segura
DATABASE_URL=postgresql://user:password@localhost:5432/shopmanager
ALLOWED_ORIGINS=http://localhost:3000,http://tu-dominio.com

# Notificaciones (Opcional)
NOTIFICATIONS_ENABLED=false
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_SMS_NUMBER=+1234567890
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código existentes
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Usa commits descriptivos

---

## 📝 Roadmap

- [ ] Reportes y estadísticas avanzadas
- [ ] Exportación de datos (PDF, Excel)
- [ ] Integración con impresoras térmicas
- [ ] App móvil nativa (React Native)
- [ ] Sistema de facturación electrónica
- [ ] Multi-tienda (gestión de múltiples sucursales)
- [ ] Dashboard de métricas en tiempo real

---

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Ver logs
docker-compose logs db
```

### Frontend no se conecta al backend
```bash
# Verificar que el backend esté corriendo
curl http://localhost:8000/api/health

# Verificar CORS en docker-compose.yml
```

### Error de TypeScript en Dashboard.tsx
```bash
# Limpiar cache y reconstruir
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**paezfontaCode**

- GitHub: [@paezfontaCode](https://github.com/paezfontaCode)
- Proyecto: [ShopManager-OS-](https://github.com/paezfontaCode/ShopManager-OS-)

---

## 🙏 Agradecimientos

- Comunidad de FastAPI
- Comunidad de React
- Todos los contribuidores del proyecto

---
  password: admin123

Técnico:
  username: tech
  password: tech123
```

---

## 📂 Estructura del Proyecto

```
ShopManager-OS-/
├── frontend/                 # Aplicación React
│   ├── components/          # Componentes reutilizables
│   ├── context/             # Context API (Auth, Theme, Language)
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Páginas principales
│   ├── services/            # API client
│   ├── types.ts             # TypeScript types
│   └── translations.ts      # i18n
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/            # Endpoints
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Lógica de negocio
│   │   └── core/           # Configuración, seguridad
│   └── tests/              # Tests automatizados
├── docker-compose.yml       # Orquestación de contenedores
├── deploy.sh               # Script de despliegue
└── backup_db.bat           # Script de backup de BD
```

---

## 🔐 Seguridad

- ✅ Autenticación JWT con tokens seguros
- ✅ Contraseñas hasheadas con bcrypt
- ✅ CORS configurado para producción
- ✅ Variables de entorno para secretos
- ✅ Validación de datos con Pydantic
- ✅ Protección contra SQL injection (SQLAlchemy ORM)

---

## 🧪 Testing

El backend incluye tests automatizados con pytest:

```bash
cd backend
pytest
```

**Cobertura de tests:**
- ✅ Autenticación y autorización
- ✅ CRUD de productos
- ✅ Gestión de tickets
- ✅ Órdenes de trabajo
- ✅ Inventario de partes

---

## 📚 Documentación Adicional

- **[INSTALLATION.md](./INSTALLATION.md)** - Guía de instalación detallada
- **[QUICKSTART.md](./QUICKSTART.md)** - Inicio rápido
- **[NOTIFICATIONS_SETUP.md](./NOTIFICATIONS_SETUP.md)** - Configuración de notificaciones WhatsApp/SMS
- **[Frontend README](./frontend/README.md)** - Documentación del frontend
- **[Backend README](./backend/README.md)** - Documentación del backend

---

## 🔄 Cambios Recientes

### v1.2.0 (Diciembre 2025)
- ✅ Eliminada línea de impuesto en POS (precios netos)
- ✅ Configuración CORS para acceso móvil
- ✅ Soporte para redes locales (192.168.*.* y 10.*.*.*)
- ✅ Mejoras en gestión de clientes
- ✅ Sistema de notificaciones WhatsApp/SMS

# 3. Verificar estado
docker-compose ps
```

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Backend
SECRET_KEY=tu-clave-secreta-muy-segura
DATABASE_URL=postgresql://user:password@localhost:5432/shopmanager
ALLOWED_ORIGINS=http://localhost:3000,http://tu-dominio.com

# Notificaciones (Opcional)
NOTIFICATIONS_ENABLED=false
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_SMS_NUMBER=+1234567890
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código existentes
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Usa commits descriptivos

---

## 📝 Roadmap

- [ ] Reportes y estadísticas avanzadas
- [ ] Exportación de datos (PDF, Excel)
- [ ] Integración con impresoras térmicas
- [ ] App móvil nativa (React Native)
- [ ] Sistema de facturación electrónica
- [ ] Multi-tienda (gestión de múltiples sucursales)
- [ ] Dashboard de métricas en tiempo real

---

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Ver logs
docker-compose logs db
```

### Frontend no se conecta al backend
```bash
# Verificar que el backend esté corriendo
curl http://localhost:8000/api/health

# Verificar CORS en docker-compose.yml
```

### Error de TypeScript en Dashboard.tsx
```bash
# Limpiar cache y reconstruir
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**paezfontaCode**

- GitHub: [@paezfontaCode](https://github.com/paezfontaCode)
- Proyecto: [ShopManager-OS-](https://github.com/paezfontaCode/ShopManager-OS-)

---

## 🙏 Agradecimientos

- Comunidad de FastAPI
- Comunidad de React
- Todos los contribuidores del proyecto

---

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la [documentación](./INSTALLATION.md)
2. Busca en [Issues](https://github.com/paezfontaCode/ShopManager-OS-/issues)
3. Crea un nuevo Issue si es necesario

---

## ☁️ Despliegue en la Nube

¿Quieres desplegar ShopManager-OS en un servidor en la nube? Tenemos una guía completa con múltiples opciones.

### 📊 Comparación Rápida de Proveedores

| Proveedor | Precio/Mes | Dificultad | Mejor Para |
|-----------|------------|------------|------------|
| **Railway** | $5-10 | ⭐ Fácil | Empezar rápido |
| **Render** | $7-25 | ⭐⭐ Fácil | Proyectos pequeños |
| **DigitalOcean** | $6-12 | ⭐⭐⭐ Medio | Producción seria |
| **Hetzner** | €4-8 | ⭐⭐⭐ Medio | Mejor precio/rendimiento |
| **AWS EC2** | $10-30 | ⭐⭐⭐⭐ Difícil | Empresas grandes |
| **Fly.io** | $5-15 | ⭐⭐ Medio | Aplicaciones globales |

### 🎯 Recomendaciones

- **Para empezar rápido:** Railway o Render (deploy con un click)
- **Para producción:** DigitalOcean o Hetzner (mejor relación calidad-precio)
- **Para empresas:** AWS (máxima escalabilidad)

### 📖 Guía Completa

Ver **[GUIA_DESPLIEGUE_NUBE.md](./.gemini/antigravity/brain/39b6ab8e-7f07-4a6b-9b0f-51b19bd7c132/GUIA_DESPLIEGUE_NUBE.md)** para:

- Instrucciones paso a paso para cada proveedor
- Configuración de dominio y SSL
- Seguridad y mejores prácticas
- Backups automáticos
- Monitoreo y mantenimiento

---

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub!**