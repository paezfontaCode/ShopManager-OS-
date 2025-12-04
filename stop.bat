@echo off
REM ========================================
REM ServiceFlow - Detener Servicios
REM ========================================

echo.
echo ========================================
echo   Deteniendo ServiceFlow...
echo ========================================
echo.

cd /d "%~dp0"

docker-compose down

if %errorlevel% equ 0 (
    echo.
    echo [OK] Servicios detenidos correctamente.
) else (
    echo.
    echo [ERROR] Hubo un problema al detener los servicios.
)

echo.
timeout /t 3
exit /b 0
