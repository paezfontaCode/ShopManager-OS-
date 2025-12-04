@echo off
REM ========================================
REM ServiceFlow - Inicio Automatico
REM ========================================

echo.
echo ========================================
echo   ServiceFlow - Iniciando...
echo ========================================
echo.

REM Cambiar al directorio del proyecto
cd /d "%~dp0"

REM Verificar si Docker Desktop esta corriendo
echo [1/3] Verificando Docker Desktop...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Docker Desktop no esta corriendo.
    echo Por favor, inicia Docker Desktop y vuelve a ejecutar este script.
    echo.
    pause
    exit /b 1
)
echo [OK] Docker Desktop esta corriendo

REM Detener contenedores anteriores si existen
echo.
echo [2/3] Deteniendo contenedores anteriores...
docker-compose down >nul 2>&1

REM Iniciar los contenedores
echo.
echo [3/3] Iniciando contenedores...
docker-compose up -d

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ServiceFlow iniciado correctamente!
    echo ========================================
    echo.
    echo   Frontend: http://localhost:3000
    echo   Backend:  http://localhost:8000
    echo   API Docs: http://localhost:8000/docs
    echo.
    echo   Desde movil: http://192.168.1.9:3000
    echo.
    echo ========================================
    echo.
    echo Presiona Ctrl+C para detener los servicios
    echo o cierra esta ventana para detenerlos automaticamente.
    echo.
    
    REM Esperar a que el usuario cierre la ventana
    REM Cuando se cierre, se ejecutara el cleanup
    docker-compose logs -f
) else (
    echo.
    echo [ERROR] No se pudieron iniciar los contenedores.
    echo Verifica los logs con: docker-compose logs
    echo.
    pause
    exit /b 1
)

REM Este codigo se ejecuta cuando se cierra la ventana o se presiona Ctrl+C
:cleanup
echo.
echo ========================================
echo   Deteniendo ServiceFlow...
echo ========================================
docker-compose down
echo.
echo [OK] Servicios detenidos correctamente.
timeout /t 2 >nul
exit /b 0
