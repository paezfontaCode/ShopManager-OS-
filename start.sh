#!/bin/bash
########################################
# ShopManager-OS - Inicio Automático
########################################

echo ""
echo "========================================"
echo "  ShopManager-OS - Iniciando..."
echo "========================================"
echo ""

# Cambiar al directorio del script
cd "$(dirname "$0")"

# Verificar si Docker está corriendo
echo "[1/3] Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    echo ""
    echo "[ERROR] Docker no está corriendo."
    echo "Por favor, inicia Docker y vuelve a ejecutar este script."
    echo ""
    read -p "Presiona Enter para salir..."
    exit 1
fi
echo "[OK] Docker está corriendo"

# Detener contenedores anteriores si existen
echo ""
echo "[2/3] Deteniendo contenedores anteriores..."
docker-compose down > /dev/null 2>&1

# Iniciar los contenedores
echo ""
echo "[3/3] Iniciando contenedores..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  ShopManager-OS iniciado correctamente!"
    echo "========================================"
    echo ""
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:8000"
    echo "  API Docs: http://localhost:8000/docs"
    echo ""
    
    # Obtener IP local
    if command -v hostname > /dev/null 2>&1; then
        LOCAL_IP=$(hostname -I | awk '{print $1}')
        if [ ! -z "$LOCAL_IP" ]; then
            echo "  Desde móvil: http://$LOCAL_IP:3000"
            echo ""
        fi
    fi
    
    echo "========================================"
    echo ""
    echo "Presiona Ctrl+C para detener los servicios"
    echo ""
    
    # Función para limpiar al salir
    cleanup() {
        echo ""
        echo "========================================"
        echo "  Deteniendo ShopManager-OS..."
        echo "========================================"
        docker-compose down
        echo ""
        echo "[OK] Servicios detenidos correctamente."
        exit 0
    }
    
    # Capturar señal de interrupción (Ctrl+C)
    trap cleanup SIGINT SIGTERM
    
    # Mostrar logs
    docker-compose logs -f
else
    echo ""
    echo "[ERROR] No se pudieron iniciar los contenedores."
    echo "Verifica los logs con: docker-compose logs"
    echo ""
    read -p "Presiona Enter para salir..."
    exit 1
fi
