#!/bin/bash
########################################
# ShopManager-OS - Inicio Silencioso
########################################

cd "$(dirname "$0")"

# Verificar Docker
if ! docker info > /dev/null 2>&1; then
    # Intentar notificar al usuario
    if command -v notify-send > /dev/null 2>&1; then
        notify-send "ShopManager-OS" "Docker no está corriendo. Por favor inícialo primero."
    elif command -v osascript > /dev/null 2>&1; then
        osascript -e 'display notification "Docker no está corriendo. Por favor inícialo primero." with title "ShopManager-OS"'
    fi
    exit 1
fi

# Iniciar contenedores en segundo plano
docker-compose up -d > /dev/null 2>&1

if [ $? -eq 0 ]; then
    # Esperar 5 segundos para que los servicios inicien
    sleep 5
    
    # Abrir el navegador automáticamente
    if command -v xdg-open > /dev/null 2>&1; then
        # Linux
        xdg-open http://localhost:3000 > /dev/null 2>&1
    elif command -v open > /dev/null 2>&1; then
        # macOS
        open http://localhost:3000
    fi
    
    # Mostrar notificación
    if command -v notify-send > /dev/null 2>&1; then
        notify-send "ShopManager-OS" "Iniciado correctamente! Frontend: http://localhost:3000"
    elif command -v osascript > /dev/null 2>&1; then
        osascript -e 'display notification "Iniciado correctamente! Frontend: http://localhost:3000" with title "ShopManager-OS"'
    fi
else
    if command -v notify-send > /dev/null 2>&1; then
        notify-send "ShopManager-OS" "Error al iniciar. Verifica Docker."
    elif command -v osascript > /dev/null 2>&1; then
        osascript -e 'display notification "Error al iniciar. Verifica Docker." with title "ShopManager-OS"'
    fi
    exit 1
fi

exit 0
