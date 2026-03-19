# Plant Disease Detection Backend - Setup Script for Windows
# Run this script in PowerShell to set up the backend

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Plant Disease Detection Backend - Setup" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[OK] $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host "`nCreating virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "[INFO] Virtual environment already exists" -ForegroundColor Cyan
    $recreate = Read-Host "Recreate? (y/n)"
    if ($recreate -eq "y") {
        Remove-Item -Recurse -Force venv
        python -m venv venv
        Write-Host "[OK] Virtual environment recreated" -ForegroundColor Green
    }
} else {
    python -m venv venv
    Write-Host "[OK] Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "`nActivating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"
Write-Host "[OK] Virtual environment activated" -ForegroundColor Green

# Upgrade pip
Write-Host "`nUpgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip | Out-Null
Write-Host "[OK] Pip upgraded" -ForegroundColor Green

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
Write-Host "[OK] Dependencies installed" -ForegroundColor Green

# Create directories
Write-Host "`nCreating directories..." -ForegroundColor Yellow
$directories = @("uploads", "models")
foreach ($dir in $directories) {
    if (-Not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
        Write-Host "[OK] Created $dir/ directory" -ForegroundColor Green
    } else {
        Write-Host "[INFO] $dir/ directory already exists" -ForegroundColor Cyan
    }
}

# Create mock model files
Write-Host "`nCreating mock CNN model files..." -ForegroundColor Yellow
if (Test-Path "models\plant_disease_cnn_v2.h5") {
    Write-Host "[INFO] Model files already exist" -ForegroundColor Cyan
    $recreate = Read-Host "Recreate model files? (y/n)"
    if ($recreate -eq "y") {
        python create_mock_models.py
        Write-Host "[OK] Model files recreated" -ForegroundColor Green
    }
} else {
    python create_mock_models.py
    Write-Host "[OK] Model files created" -ForegroundColor Green
}

# Setup complete
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "============================================================`n" -ForegroundColor Cyan

Write-Host "To start the server:" -ForegroundColor Yellow
Write-Host "  1. Make sure virtual environment is activated: venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  2. Run: python app.py`n" -ForegroundColor White

Write-Host "Or use the quick start script:" -ForegroundColor Yellow
Write-Host "  python start.py`n" -ForegroundColor White

$startNow = Read-Host "Start server now? (y/n)"
if ($startNow -eq "y") {
    Write-Host "`nStarting server...`n" -ForegroundColor Green
    python app.py
}
