# Variables de Entorno - MobilePOS Backend

Este documento describe todas las variables de entorno utilizadas por el backend de MobilePOS.

## Configuración de Base de Datos

### `DATABASE_URL`
- **Descripción**: URL de conexión a la base de datos SQLite
- **Valor por defecto**: `sqlite:///./mobilepos.db`
- **Ejemplo**: `sqlite:///./mobilepos.db`
- **Requerido**: No (usa valor por defecto)

## Configuración de Seguridad

### `SECRET_KEY`
- **Descripción**: Clave secreta para firmar tokens JWT
- **Valor por defecto**: `your-secret-key-here-change-in-production`
- **Ejemplo**: `mi-clave-super-secreta-2024`
- **Requerido**: **SÍ** (debe cambiarse en producción)
- **⚠️ IMPORTANTE**: Nunca compartas esta clave. Genera una nueva para producción.

### `ALGORITHM`
- **Descripción**: Algoritmo de encriptación para JWT
- **Valor por defecto**: `HS256`
- **Ejemplo**: `HS256`
- **Requerido**: No

### `ACCESS_TOKEN_EXPIRE_MINUTES`
- **Descripción**: Tiempo de expiración del token JWT en minutos
- **Valor por defecto**: `30`
- **Ejemplo**: `60`
- **Requerido**: No

## Configuración de CORS

### `ALLOWED_ORIGINS`
- **Descripción**: Orígenes permitidos para CORS (separados por coma)
- **Valor por defecto**: `http://localhost:3000,http://localhost:5173`
- **Ejemplo**: `http://localhost:3000,https://mobilepos.com`
- **Requerido**: No
- **Nota**: En producción, especifica solo los dominios necesarios

## Ejemplo de archivo `.env`

```env
# Base de datos
DATABASE_URL=sqlite:///./mobilepos.db

# Seguridad
SECRET_KEY=cambiar-esta-clave-en-produccion-usar-clave-larga-y-aleatoria
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Generación de SECRET_KEY Segura

Para generar una clave secreta segura, puedes usar:

```python
import secrets
print(secrets.token_urlsafe(32))
```

O en la terminal:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Notas de Seguridad

1. **Nunca** commits el archivo `.env` al repositorio
2. El archivo `.env.example` debe contener solo valores de ejemplo
3. En producción, usa variables de entorno del sistema o un gestor de secretos
4. Cambia `SECRET_KEY` regularmente en producción
5. Usa HTTPS en producción para proteger los tokens en tránsito
