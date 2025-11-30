# MobilePOS - Sistema de Gestión y Punto de Venta

MobilePOS es una aplicación web completa diseñada para la gestión de tiendas de móviles. Ofrece una solución integral que combina un Punto de Venta (POS), gestión de inventario, seguimiento de reparaciones y un panel de control administrativo. La interfaz está construida con un enfoque moderno, responsivo y personalizable, con soporte para múltiples roles de usuario (Administrador y Técnico).

## ✨ Características Principales

- **Dashboard Dual**: Paneles de control separados y especializados para Administradores (ventas, stock) y Técnicos (reparaciones).
- **Punto de Venta (POS)**: Interfaz intuitiva para procesar ventas de manera rápida y eficiente.
- **Gestión de Inventario**: Dos inventarios separados: uno para productos de venta y otro para partes de reparación.
- **Módulo de Reparaciones**: Seguimiento completo de órdenes de trabajo, desde la recepción del equipo hasta la entrega al cliente.
- **Gestión Financiera**: Seguimiento de tickets, métodos de pago y una sección para clientes con pagos pendientes.
- **Alta Personalización**: Los usuarios pueden cambiar el idioma (Español/Inglés), el tema (claro/oscuro), el nombre de la aplicación y la imagen de fondo.

---

## 🚀 Inicio Rápido (Frontend)

### Prerrequisitos
- Node.js (versión LTS)
- npm o yarn

### Instalación y Ejecución
1.  Clona el repositorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre la aplicación en [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite).

---

## 📂 Estructura del Proyecto Frontend

El proyecto está organizado de manera modular para facilitar el mantenimiento y la escalabilidad.

```
/
├── public/               # Archivos estáticos
├── index.html            # Punto de entrada HTML
├── index.tsx             # Punto de entrada de React
├── App.tsx               # Componente principal con el enrutador
├── components/           # Componentes de UI reutilizables (Sidebar, Header, Card, etc.)
├── context/              # Context API de React para estado global (Auth, Theme, Language)
├── data/                 # Datos mock para simular el backend
├── hooks/                # Hooks personalizados (useAuth, useTheme, etc.)
├── pages/                # Vistas principales de la aplicación (Dashboard, Inventory, POS, etc.)
├── types.ts              # Definiciones de interfaces y tipos de TypeScript
├── constants.tsx         # Constantes de la aplicación (ej. enlaces de navegación)
└── translations.ts       # Textos para internacionalización (i18n)
```

-   **`components/`**: Contiene piezas de UI reutilizables como botones, modales y tarjetas, que no tienen lógica de negocio compleja.
-   **`context/`**: Maneja el estado global de la aplicación. Se utiliza para la autenticación, el tema visual, el idioma y los ajustes generales para evitar el "prop drilling".
-   **`hooks/`**: Simplifican el acceso a los contextos y encapsulan lógica reutilizable.
-   **`pages/`**: Cada archivo representa una ruta principal de la aplicación y se encarga de componer la UI a partir de los `components` y de manejar la lógica de la página.
-   **`data/`**: Contiene datos de prueba (`mock`) que simulan las respuestas de una API. **Serán reemplazados por llamadas a la API real.**

---

## 🔧 Requerimientos para el Backend (FastAPI + PostgreSQL)

Para que este frontend funcione correctamente, el backend debe proporcionar una API RESTful con los siguientes endpoints y modelos de datos.

### Autenticación (JWT)

El sistema de autenticación debe basarse en JSON Web Tokens (JWT).

-   **Endpoint de Login:** `POST /api/auth/login`
    -   **Request Body**: `{ "username": "string", "password": "string" }`
    -   **Response (Éxito)**: `{ "access_token": "string", "token_type": "bearer", "role": "admin" | "technician" }`
    -   **Response (Error)**: `401 Unauthorized` con un mensaje de error.
-   **Rutas Protegidas**: Todos los demás endpoints deben requerir un `Authorization: Bearer <token>` en el header. El backend debe validar el token y el rol del usuario para dar acceso a los recursos.

### Modelos de Datos (PostgreSQL)

Se sugieren las siguientes tablas/modelos para la base de datos:

-   **`User`**: `id`, `username`, `hashed_password`, `role` ('admin', 'technician').
-   **`Product`**: `id`, `name`, `brand`, `stock`, `price`, `imageUrl`.
-   **`Ticket`**: `id`, `date`, `customerName`, `paymentMethod`, `paymentStatus`, `subtotal`, `tax`, `total`.
-   **`TicketItem`**: `id`, `ticket_id` (FK a Ticket), `product_id` (FK a Product), `quantity`, `price`.
-   **`WorkOrder`**: `id`, `customerName`, `device`, `issue`, `status`, `receivedDate`, `estimatedCompletionDate`.
-   **`Part`**: `id`, `name`, `sku`, `stock`, `price`, `compatibleModels`.

### API Endpoints Requeridos

#### Perfil de Administrador

-   `GET /api/dashboard/summary`: Devuelve un resumen para el dashboard (ventas totales, productos en stock, tickets totales, productos con bajo stock).
-   `GET /api/products`: Devuelve una lista de todos los productos. Soporte para búsqueda (`?q=query`).
-   `POST /api/products`: Crea un nuevo producto.
-   `PUT /api/products/{product_id}`: Actualiza un producto existente.
-   `POST /api/tickets`: Crea un nuevo ticket de venta. Recibe los detalles del carrito y del cliente.
-   `GET /api/tickets`: Devuelve una lista de todos los tickets.
-   `GET /api/tickets/delinquents`: Devuelve una lista de tickets con `paymentStatus` como 'Pending'.
-   `PUT /api/tickets/{ticket_id}/pay`: Cambia el `paymentStatus` de un ticket a 'Paid'.

#### Perfil de Técnico

-   `GET /api/repairs/dashboard/summary`: Devuelve un resumen para el dashboard de reparaciones (equipos pendientes, en progreso, listos, partes con bajo stock).
-   `GET /api/work-orders`: Devuelve una lista de todas las órdenes de trabajo. Soporte para búsqueda (`?q=query`).
-   `POST /api/work-orders`: Registra una nueva orden de trabajo.
-   `PUT /api/work-orders/{order_id}`: Actualiza el estado o los detalles de una orden de trabajo.
-   `GET /api/parts`: Devuelve una lista de todas las partes de repuesto. Soporte para búsqueda (`?q=query`).
-   `POST /api/parts`: Crea una nueva parte en el inventario.
-   `PUT /api/parts/{part_id}`: Actualiza una parte existente.

---

## 💡 Mejoras Sugeridas

-   **Manejo de Estado del Servidor**: Actualmente, la lógica de datos está simulada. Se recomienda integrar una librería como **TanStack Query (React Query)** para gestionar el fetching, cacheo, y actualización de datos de la API de una manera mucho más eficiente y declarativa.
-   **Validación de Formularios**: Implementar validación en todos los formularios (Login, POS, creación de productos/órdenes) utilizando una librería como **React Hook Form** o **Zod** para mejorar la experiencia de usuario y la integridad de los datos.
-   **Notificaciones (Toasts)**: Añadir notificaciones "toast" para dar feedback al usuario tras realizar acciones (ej. "Venta completada con éxito", "Error al añadir producto"). Librerías como **React-Toastify** son excelentes para esto.
-   **UI/UX Avanzada**:
    -   Implementar estados de carga (skeletons, spinners) mientras se obtienen los datos de la API.
    -   Mostrar mensajes de error claros cuando una llamada a la API falle.
    -   Añadir paginación en las tablas de Inventario y Tickets para manejar grandes volúmenes de datos.
-   **Pruebas (Testing)**: Desarrollar pruebas unitarias y de integración utilizando **Jest** y **React Testing Library** para asegurar la calidad y estabilidad del código.

---

## ✅ Tareas Pendientes (To-Do)

-   [ ] **Integración de API**: Reemplazar todos los datos `mock` con llamadas reales a los endpoints del backend.
-   [ ] **Autenticación Completa**: Implementar el almacenamiento seguro del JWT (en `localStorage` o `HttpOnly cookie`) y el `logout` para invalidar el token.
-   [ ] **Desarrollo de Modales**: Crear los modales y formularios para "Añadir/Editar Producto", "Registrar Nuevo Equipo" y "Añadir Parte", que actualmente solo son botones.
-   [ ] **Gráficos Dinámicos**: Conectar el gráfico de ventas semanales del dashboard a datos reales provenientes de la API.
-   [ ] **Funcionalidad de "Editar"**: Implementar la lógica para editar productos, órdenes de trabajo y partes.
-   [ ] **Optimización de Rendimiento**: Analizar el rendimiento con React DevTools y optimizar los re-renders innecesarios, especialmente en la página de POS.
