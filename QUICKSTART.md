# 🚀 Cómo Ejecutar MobilePOS

## Paso 1: Configurar Frontend

Abre una terminal en la carpeta del frontend y agrega la variable de entorno:

```bash
cd frontend
```

Crea o edita el archivo `.env.local` y agrega:
```
VITE_API_URL=http://localhost:8000
```

Luego instala dependencias (si no lo has hecho):
```bash
npm install
```

## Paso 2: Iniciar Backend

En una terminal, ejecuta:

```bash
cd backend
.\venv\Scripts\uvicorn app.main:app --reload
```

El backend estará en: **http://localhost:8000**
- Documentación API: http://localhost:8000/docs

## Paso 3: Iniciar Frontend

En OTRA terminal, ejecuta:

```bash
cd frontend
npm run dev
```

El frontend estará en: **http://localhost:5173**

## Paso 4: Probar la Aplicación

1. Abre http://localhost:5173 en tu navegador
2. Usa las credenciales de prueba:
   - **Admin**: `admin` / `admin123`
   - **Técnico**: `tech` / `tech123`

3. Explora:
   - Dashboard con datos reales
   - Inventario de productos
   - Y más!

## ✅ Todo Listo!

Ahora tienes el frontend y backend corriendo juntos. Los datos que ves en el frontend vienen directamente de la base de datos SQLite del backend.
