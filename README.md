# 🏪 ServiceFlow - Sistema de Gestión para Tiendas de Móviles

<div align="center">
  <img src="frontend/public/images/logo/logo.png" alt="ServiceFlow Logo" width="200"/>
  <br>
  <h3>Gestión Inteligente para tu Negocio de Reparaciones</h3>
</div>

---

**ServiceFlow** es un sistema integral de gestión y punto de venta (POS) diseñado específicamente para talleres y tiendas de reparación de dispositivos móviles. Combina control de inventario, seguimiento de reparaciones, gestión de clientes y facturación en una interfaz moderna y fácil de usar.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)
![React](https://img.shields.io/badge/react-19-61dafb.svg)
![FastAPI](https://img.shields.io/badge/fastapi-latest-009688.svg)

---

## ✨ Características Principales

### 🔧 Gestión de Reparaciones (Core)
- **Seguimiento de Estado:** Recepción, Diagnóstico, En Proceso, Listo, Entregado.
- **Órdenes de Trabajo:** Generación de tickets con códigos únicos.
- **Garantías:** Cálculo automático de fechas de garantía.
- **Asignación:** Distribución de trabajos entre técnicos.

### 📦 Inventario Inteligente
- **Productos:** Control de stock para venta directa (accesorios, equipos).
- **Repuestos:** Inventario separado para partes de reparación (pantallas, baterías).
- **Alertas:** Notificaciones de stock bajo.
- **Imágenes:** Carga de fotos de productos y repuestos.

### 💰 Punto de Venta (POS)
- **Ventas Rápidas:** Interfaz optimizada para pantalla táctil o mouse.
- **Multimoneda:** Conversión automática USD/VES (Tasa configurable).
- **Pagos Múltiples:** Efectivo, Punto de Venta, Pago Móvil, Zelle.
- **Facturación:** Generación de recibos digitales.

### 👥 CRM & Usuarios
- **Clientes:** Historial completo de reparaciones y compras por cliente.
- **Roles:**
  - **Administrador:** Acceso total a finanzas y configuración.
  - **Técnico:** Acceso enfocado en reparaciones e inventario.

---

## 🚀 Inicio Rápido

### Prerrequisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado y corriendo.

### Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/paezfontaCode/ServiceFlow.git
   cd ServiceFlow
   ```

2. **Iniciar el sistema (Windows):**
   Simplemente haz doble clic en el archivo `start.bat` o ejecuta:
   ```powershell
   .\start.bat
   ```
   > Este script verificará Docker, limpiará contenedores antiguos e iniciará el sistema automáticamente.

3. **Acceder a la aplicación:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:8000/docs](http://localhost:8000/docs)

### 👤 Credenciales por Defecto

El sistema se instala con una base de datos limpia y dos usuarios preconfigurados:

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| **Administrador** | `admin` | `admin123` |
| **Técnico** | `tech` | `tech123` |

> ⚠️ **Importante:** Cambie estas contraseñas inmediatamente después del primer inicio de sesión.

---

## 📱 Acceso Móvil (Red Local)

Puedes usar ServiceFlow desde tu celular o tablet conectado a la misma red WiFi:

1. **Obtén tu IP local:** Ejecuta `ipconfig` en la terminal (busca IPv4, ej: `192.168.1.15`).
2. **Desde tu móvil:** Abre el navegador y ve a `http://192.168.1.15:3000`.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS.
- **Backend:** FastAPI (Python), SQLAlchemy, Pydantic.
- **Base de Datos:** PostgreSQL 15.
- **Infraestructura:** Docker Compose.

---

## 📂 Estructura de Carpetas

```
ServiceFlow/
├── frontend/             # SPA React
│   ├── public/images/    # Assets (Logo, iconos)
│   └── src/              # Código fuente
├── backend/              # API REST
│   ├── app/              # Lógica de negocio
│   └── uploads/          # Imágenes de usuarios (No Git)
├── docker-compose.yml    # Definición de servicios
└── start.bat             # Script de inicio automático
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre nuestro código de conducta y el proceso para enviarnos pull requests.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <sub>Desarrollado con ❤️ por <a href="https://github.com/paezfontaCode">paezfontaCode</a></sub>
</div>