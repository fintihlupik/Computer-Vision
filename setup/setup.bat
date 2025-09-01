@echo off
echo ====================================
echo    Logo Detection API - Setup
echo ====================================
echo.

REM Verificar que estamos en el directorio setup correcto
if not exist setup.bat (
    echo ❌ Error: Este script debe ejecutarse desde la carpeta setup
    echo    Ubicación actual: %CD%
    echo    Ejecuta: cd setup && setup.bat
    pause
    exit /b 1
)

REM Verificar que existe el directorio padre del proyecto
if not exist .. (
    echo ❌ Error: No se encuentra el directorio padre del proyecto
    echo    Asegúrate de estar en FactoriaF5API\setup\
    pause
    exit /b 1
)

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python no está instalado o no está en el PATH
    echo    Por favor instala Python 3.8+ desde https://python.org
    pause
    exit /b 1
)

echo ✅ Python encontrado:
python --version

echo.
echo 📦 Creando entorno virtual...
python -m venv ..\venv

echo.
echo 🔧 Activando entorno virtual...
call ..\venv\Scripts\activate.bat

echo.
echo 📥 Instalando dependencias...
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo 📋 Configurando variables de entorno...
if not exist ..\.env (
    copy .env.example ..\.env
    echo ✅ Archivo .env creado desde .env.example
    echo ⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales de Supabase
) else (
    echo ℹ️  El archivo .env ya existe
)

echo.
echo 📁 Creando directorios necesarios...
if not exist ..\temp mkdir ..\temp
if not exist ..\temp\uploads mkdir ..\temp\uploads
if not exist ..\temp\frames mkdir ..\temp\frames
if not exist ..\temp\crops mkdir ..\temp\crops

echo.
echo 🎯 Verificando modelo YOLO...
echo Directorio actual: %CD%
echo Buscando modelo en: %CD%\..\best.pt
if exist ..\best.pt (
    echo ✅ Modelo YOLO encontrado: best.pt
) else (
    echo ⚠️  Modelo YOLO no encontrado: best.pt
    echo    Ubicación esperada: %CD%\..\best.pt
    echo    El sistema usará yolov8n.pt como fallback
    echo.
    echo 📝 NOTA IMPORTANTE:
    echo    Si no tienes el modelo best.pt personalizado,
    echo    el sistema funcionará con el modelo por defecto YOLOv8n
)

echo.
echo ====================================
echo     ✅ INSTALACIÓN COMPLETADA
echo ====================================
echo.
echo Próximos pasos:
echo 1. Edita el archivo .env con tus credenciales de Supabase
echo 2. Asegúrate de tener el modelo best.pt (opcional)
echo 3. Ejecuta: setup\run.bat o python main.py
echo.
echo Para activar el entorno manualmente:
echo   ..\venv\Scripts\activate.bat
echo.
pause
