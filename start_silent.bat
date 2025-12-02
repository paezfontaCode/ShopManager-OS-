@echo off
REM ========================================
REM ShopManager-OS - Inicio Silencioso
REM ========================================

cd /d "%~dp0"

REM Verificar Docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    msg * "Docker Desktop no esta corriendo. Por favor inicialo primero."
    exit /b 1
)

REM Iniciar contenedores en segundo plano
docker-compose up -d >nul 2>&1

if %errorlevel% equ 0 (
    REM Esperar 5 segundos para que los servicios inicien
    timeout /t 5 >nul
    
    REM Abrir el navegador automaticamente
    start http://localhost:3000
    
    REM Mostrar notificacion
    msg * "ShopManager-OS iniciado correctamente! Frontend: http://localhost:3000"
) else (
    msg * "Error al iniciar ShopManager-OS. Verifica Docker Desktop."
    exit /b 1
)

exit /b 0
