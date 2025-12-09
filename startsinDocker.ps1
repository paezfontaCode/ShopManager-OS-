# ServiceFlow - Script de Inicio Local
# Este script inicia el backend (FastAPI) y el frontend (Vite)

Write-Host "🚀 ServiceFlow - Iniciando servicios..." -ForegroundColor Cyan
Write-Host ""

# Función para verificar si un comando existe
function Test-Command($command) {
    try {
        if (Get-Command $command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Verificar Python
if (-not (Test-Command python)) {
    Write-Host "❌ Python no está instalado. Por favor, instala Python 3.10 o superior." -ForegroundColor Red
    exit 1
}

# Verificar Node.js
if (-not (Test-Command node)) {
    Write-Host "❌ Node.js no está instalado. Por favor, instala Node.js." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Python y Node.js detectados" -ForegroundColor Green
Write-Host ""

# Cambiar al directorio raíz del proyecto
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# ===== BACKEND ===== 
Write-Host "📦 Configurando Backend..." -ForegroundColor Yellow

# Verificar si existe .env en backend, si no, copiar desde .env.example
if (-not (Test-Path "backend\.env")) {
    if (Test-Path "backend\.env.example") {
        Write-Host "   Copiando .env.example a .env..." -ForegroundColor Gray
        Copy-Item "backend\.env.example" "backend\.env"
    } else {
        Write-Host "   ⚠️  No existe .env.example. Creando .env básico..." -ForegroundColor Yellow
        $envContent = @(
            "DATABASE_URL=sqlite:///./serviceflow.db",
            "SECRET_KEY=dev-secret-key-change-in-production-abc123xyz789",
            "ALGORITHM=HS256",
            "ACCESS_TOKEN_EXPIRE_MINUTES=1440",
            "CORS_ORIGINS=http://localhost:3000,http://localhost:5173"
        )
        $envContent | Out-File -FilePath "backend\.env" -Encoding utf8
    }
}

# Verificar si existe venv
if (-not (Test-Path "backend\venv")) {
    Write-Host "   Creando entorno virtual..." -ForegroundColor Gray
    Set-Location backend
    python -m venv venv
    Set-Location ..
}

# Activar virtualenv e instalar dependencias
Write-Host "   Instalando dependencias de Python..." -ForegroundColor Gray
Set-Location backend

# Activar venv y ejecutar instalación
& .\venv\Scripts\Activate.ps1
pip install -q -r requirements.txt

# Inicializar base de datos si no existe
if (-not (Test-Path "serviceflow.db")) {
    Write-Host "   Inicializando base de datos..." -ForegroundColor Gray
    python init_db.py
}

Set-Location ..

# ===== FRONTEND ===== 
Write-Host "📦 Configurando Frontend..." -ForegroundColor Yellow
Set-Location frontend

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "   Instalando dependencias de Node.js..." -ForegroundColor Gray
    npm install
} else {
    Write-Host "   ✅ Dependencias ya instaladas" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Configuración completada" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Iniciando servicios en paralelo..." -ForegroundColor Cyan
Write-Host ""
Write-Host "   📡 Backend:  http://localhost:8000" -ForegroundColor Magenta
Write-Host "   🌐 Frontend: http://localhost:3000" -ForegroundColor Magenta
Write-Host "   📚 API Docs: http://localhost:8000/docs" -ForegroundColor Magenta
Write-Host ""
Write-Host "Presiona Ctrl+C para detener ambos servicios" -ForegroundColor Yellow
Write-Host ""

# Iniciar backend en una nueva ventana
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru

# Esperar 3 segundos para que el backend inicie
Start-Sleep -Seconds 3

# Iniciar frontend en una nueva ventana
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; npm run dev" -PassThru

Write-Host "✅ Servicios iniciados en nuevas ventanas" -ForegroundColor Green
Write-Host ""
Write-Host "Para detener los servicios, cierra las ventanas de PowerShell que se abrieron." -ForegroundColor Yellow
