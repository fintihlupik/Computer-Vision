@echo off
echo ====================================
echo   Logo Detection API - Fix NumPy
echo ====================================
echo.

REM Verificar que estamos en el directorio setup correcto
if not exist setup.bat (
    echo ❌ Error: Este script debe ejecutarse desde la carpeta setup
    echo    Ubicación actual: %CD%
    echo    Ejecuta: cd setup && fix-numpy.bat
    pause
    exit /b 1
)

REM Verificar si el entorno virtual existe
if not exist ..\venv (
    echo ❌ Entorno virtual no encontrado
    echo    Ejecuta setup.bat primero desde la carpeta setup:
    echo    cd setup
    echo    setup.bat
    pause
    exit /b 1
)

echo 🔧 Activando entorno virtual...
call ..\venv\Scripts\activate.bat

echo 📦 Reparando instalación de NumPy...
echo    Desinstalando NumPy actual...
pip uninstall -y numpy

echo    Instalando NumPy estable para Windows...
pip install "numpy>=1.21.0,<1.25.0"
if %errorlevel% neq 0 (
    echo ⚠️  Intentando con versión específica...
    pip install "numpy==1.24.3"
)

echo    Verificando instalación...
python -c "import numpy; print('NumPy version:', numpy.__version__); print('NumPy compiled with:', numpy.show_config())" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Error al verificar NumPy
    pause
    exit /b 1
)

echo.
echo ✅ NumPy reparado exitosamente
echo    Puedes ejecutar run.bat nuevamente
echo.
pause
