#!/bin/bash

echo "===================================="
echo "  Logo Detection API - Starting"
echo "===================================="
echo

# Verificar si el entorno virtual existe
if [ ! -d "../venv" ]; then
    echo "❌ Entorno virtual no encontrado"
    echo "   Ejecuta ./setup.sh primero"
    exit 1
fi

# Verificar si el archivo .env existe
if [ ! -f "../.env" ]; then
    echo "❌ Archivo .env no encontrado"
    echo "   Copia .env.example a .env y configura tus credenciales"
    exit 1
fi

echo "🔧 Activando entorno virtual..."
source ../venv/bin/activate

echo "🚀 Iniciando servidor..."
echo
echo "Servidor disponible en: http://localhost:8001"
echo "Documentación API: http://localhost:8001/docs"
echo
echo "Presiona Ctrl+C para detener el servidor"
echo

cd ..
python main.py
