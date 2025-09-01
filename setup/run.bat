@echo off
echo ====================================
echo   Logo Detection API - Starting
echo ====================================
echo.

REM Verificar si el entorno virtual existe
if not exist ..\venv (
    echo ❌ Entorno virtual no encontrado
    echo    Ejecuta setup.bat primero
    pause
    exit /b 1
)

REM Verificar si el archivo .env existe
if not exist ..\.env (
    echo ❌ Archivo .env no encontrado
    echo    Copia .env.example a .env y configura tus credenciales
    pause
    exit /b 1
)

echo 🔧 Activando entorno virtual...
call ..\venv\Scripts\activate.bat

echo 🚀 Iniciando servidor...
echo.
echo Servidor disponible en: http://localhost:8001
echo Documentación API: http://localhost:8001/docs
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

cd ..
python main.py
