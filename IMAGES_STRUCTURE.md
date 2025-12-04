# Estructura de Imágenes - ServiceFlow

Este documento explica la organización de carpetas para imágenes en el proyecto ServiceFlow.

## 📁 Estructura Completa

```
ServiceFlow/
├── frontend/
│   └── public/
│       └── images/
│           ├── logo/              # Logo de la aplicación
│           │   ├── README.md
│           │   ├── logo.png       # Logo principal (a agregar)
│           │   ├── logo.svg       # Logo vectorial (a agregar)
│           │   └── favicon.ico    # Icono del navegador (a agregar)
│           │
│           └── assets/            # Recursos estáticos (iconos, ilustraciones)
│               ├── README.md
│               ├── icons/         # Iconos de funcionalidades (crear si necesario)
│               ├── illustrations/ # Ilustraciones para UI (crear si necesario)
│               └── ui/           # Elementos decorativos (crear si necesario)
│
└── backend/
    └── uploads/                   # Imágenes subidas por usuarios
        ├── products/              # Fotos de productos
        │   └── README.md
        │   # Las imágenes aquí NO se commitean a Git
        │
        └── parts/                 # Fotos de repuestos
            └── README.md
            # Las imágenes aquí NO se commitean a Git
```

## 🎯 Propósito de Cada Carpeta

### Frontend - Logo (`frontend/public/images/logo/`)

**Propósito:** Almacenar el logo y marca de ServiceFlow

**Archivos recomendados:**
- `logo.png` - Logo principal (512x512 px, PNG transparente)
- `logo.svg` - Versión vectorial del logo
- `logo-dark.png` - Logo para modo oscuro (opcional)
- `favicon.ico` - Icono del navegador (32x32 px)

**Uso en código:**
```tsx
<img src="/images/logo/logo.png" alt="ServiceFlow" />
```

**Git:** ✅ SÍ commitear al repositorio

---

### Frontend - Assets (`frontend/public/images/assets/`)

**Propósito:** Recursos gráficos estáticos de la aplicación

**Contenido:**
- Iconos de funcionalidades
- Ilustraciones para páginas vacías
- Elementos decorativos de UI
- Imágenes de categorías

**Uso en código:**
```tsx
<img src="/images/assets/icons/repair-icon.svg" alt="Reparación" />
```

**Git:** ✅ SÍ commitear al repositorio

---

### Backend - Products (`backend/uploads/products/`)

**Propósito:** Almacenar fotografías de productos cargadas por usuarios

**Características:**
- Imágenes subidas dinámicamente
- Formato: `product_{id}_{timestamp}.{ext}`
- Tamaño máximo: 2 MB
- Dimensiones recomendadas: 800x800 px

**Uso:** A través del API REST
```http
POST /api/products
PUT /api/products/{id}
```

**Git:** ❌ NO commitear (excepto README.md)

---

### Backend - Parts (`backend/uploads/parts/`)

**Propósito:** Almacenar fotografías de partes/repuestos cargadas por usuarios

**Características:**
- Imágenes subidas dinámicamente
- Formato: `part_{id}_{timestamp}.{ext}`
- Tamaño máximo: 2 MB
- Dimensiones recomendadas: 600x600 px

**Uso:** A través del API REST
```http
POST /api/parts
PUT /api/parts/{id}
```

**Git:** ❌ NO commitear (excepto README.md)

---

## 🔒 Configuración de Git

### Backend `.gitignore`

Ya está configurado para:
- ✅ Ignorar todas las imágenes en `uploads/`
- ✅ Mantener los archivos `README.md`
- ✅ Mantener la estructura de carpetas

```gitignore
# User uploaded files (keep only README.md)
uploads/*
!uploads/README.md
!uploads/*/
!uploads/*/README.md
```

---

## 📝 Recomendaciones

### Para Logo y Assets (Frontend)

1. **Formato PNG** con transparencia para el logo
2. **Formato SVG** para iconos escalables
3. **Nombres descriptivos:** `product-icon.svg`, `empty-state.png`
4. **Optimizar imágenes** antes de commitear (usar TinyPNG, Squoosh, etc.)

### Para Uploads (Backend)

1. **NO** commitear imágenes de usuarios a Git
2. **Hacer backup** regular en producción
3. **Considerar almacenamiento en nube** (AWS S3, Cloudinary) para escalabilidad
4. **Implementar límites** de tamaño y tipos de archivo
5. **Validar formatos** aceptados (JPG, PNG, WebP)

---

## 🚀 Próximos Pasos

1. **Agregar el logo de ServiceFlow:**
   - Coloca tu logo en `frontend/public/images/logo/logo.png`
   - Actualiza el `index.html` con el favicon
   - Actualiza componentes que muestren el logo

2. **Configurar upload de imágenes en el backend:**
   - Implementar endpoints para subir archivos
   - Agregar validación de tipos y tamaños
   - Configurar redimensionamiento automático

3. **Actualizar componentes del frontend:**
   - Componente de carga de imágenes para productos
   - Preview de imágenes antes de subir
   - Galería de productos con imágenes

---

## 📚 Documentación Adicional

Cada carpeta tiene su propio `README.md` con instrucciones específicas:

- [Logo README](file:///c:/Users/Usuario/Desktop/ServiceFlow/frontend/public/images/logo/README.md)
- [Assets README](file:///c:/Users/Usuario/Desktop/ServiceFlow/frontend/public/images/assets/README.md)
- [Products README](file:///c:/Users/Usuario/Desktop/ServiceFlow/backend/uploads/products/README.md)
- [Parts README](file:///c:/Users/Usuario/Desktop/ServiceFlow/backend/uploads/parts/README.md)
