# Imágenes de Productos

Esta carpeta almacena las fotografías de productos cargadas por los usuarios.

## ⚠️ Importante

- **NO** commitear imágenes de productos al repositorio Git
- Esta carpeta debe estar en `.gitignore` (excepto este README)
- Las imágenes se guardan automáticamente cuando los usuarios agregan productos
- Hacer backup regular de esta carpeta en producción

## Estructura de Nombres

Las imágenes se guardan con el siguiente formato:
```
product_{id}_{timestamp}.{ext}
```

Ejemplo: `product_12_1638475839.jpg`

## Formatos Soportados

- **JPG/JPEG** - Fotografías de productos
- **PNG** - Imágenes con transparencia
- **WebP** - Formato moderno optimizado

## Tamaño Recomendado

- **Máximo:** 2 MB por imagen
- **Dimensiones:** 800x800 px (se redimensiona automáticamente)
- **Aspect ratio:** Cuadrado (1:1) preferiblemente

## Backend API

El backend maneja la carga de archivos a través de:
- `POST /api/products` - Al crear producto con imagen
- `PUT /api/products/{id}` - Al actualizar imagen de producto

## Backup

En producción, asegúrate de:
1. Hacer backup diario de esta carpeta
2. Usar almacenamiento externo (S3, Cloudinary) para escalabilidad
3. Implementar límites de tamaño de archivos
