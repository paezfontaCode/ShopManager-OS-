#!/bin/bash
########################################
# ServiceFlow - Detener Servicios
########################################

echo ""
echo "========================================"
echo "  Deteniendo ServiceFlow..."
echo "========================================"
echo ""

cd "$(dirname "$0")"

docker-compose down

if [ $? -eq 0 ]; then
    echo ""
    echo "[OK] Servicios detenidos correctamente."
else
    echo ""
    echo "[ERROR] Hubo un problema al detener los servicios."
fi

echo ""
sleep 2
exit 0
