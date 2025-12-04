# Imágenes de Partes y Repuestos

Esta carpeta almacena las fotografías de partes/repuestos cargadas por los usuarios.

## ⚠️ Importante

- **NO** commitear imágenes al repositorio Git
- Esta carpeta debe estar en `.gitignore` (excepto este README)
- Las imágenes se guardan automáticamente cuando los usuarios agregan partes
- Hacer backup regular de esta carpeta en producción

## Estructura de Nombres

Las imágenes se guardan con el siguiente formato:
```
part_{id}_{timestamp}.{ext}
```

Ejemplo: `part_45_1638475839.jpg`

## Formatos Soportados

- **JPG/JPEG** - Fotografías de partes
- **PNG** - Imágenes con transparencia
- **WebP** - Formato moderno optimizado

## Tamaño Recomendado

- **Máximo:** 2 MB por imagen
- **Dimensiones:** 600x600 px
- **Aspect ratio:** Cuadrado (1:1) preferiblemente

## Uso

Las imágenes de partes ayudan a:
- Identificar visualmente repuestos
- Verificar compatibilidad con dispositivos
- Facilitar el inventario visual
- Mejorar la experiencia de búsqueda

## Backend API

El backend maneja la carga de archivos a través de:
- `POST /api/parts` - Al crear parte con imagen
- `PUT /api/parts/{id}` - Al actualizar imagen de parte
