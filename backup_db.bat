@echo off
echo Iniciando Backup de la Base de Datos...

:: Obtener fecha y hora para el nombre del archivo
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set timestamp=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%

:: Crear directorio de backups si no existe
if not exist "backups" mkdir backups

:: Ejecutar pg_dump dentro del contenedor
docker-compose exec -T db pg_dump -U postgres mobilepos > backups/backup_%timestamp%.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Backup completado exitosamente: backups/backup_%timestamp%.sql
) else (
    echo.
    echo ❌ Error al crear el backup. Asegurate de que Docker este corriendo.
)

pause
