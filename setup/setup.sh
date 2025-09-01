#!/bin/bash

echo "===================================="
echo "   Logo Detection API - Setup"
echo "===================================="
echo

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado"
    echo "   Por favor instala Python 3.8+ desde https://python.org"
    exit 1
fi

echo "✅ Python encontrado:"
python3 --version

echo
echo "📦 Creando entorno virtual..."
python3 -m venv venv

echo
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

echo
echo "📥 Instalando dependencias..."
pip install --upgrade pip
pip install -r setup/requirements.txt

echo
echo "📋 Configurando variables de entorno..."
if [ ! -f .env ]; then
    cp setup/.env.example .env
    echo "✅ Archivo .env creado desde setup/.env.example"
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales de Supabase"
else
    echo "ℹ️  El archivo .env ya existe"
fi

echo
echo "📁 Creando directorios necesarios..."
mkdir -p temp/uploads
mkdir -p temp/frames
mkdir -p temp/crops

echo
echo "🎯 Verificando modelo YOLO..."
if [ -f "best.pt" ]; then
    echo "✅ Modelo YOLO encontrado: best.pt"
else
    echo "⚠️  Modelo YOLO no encontrado: best.pt"
    echo "   El sistema usará yolov8n.pt como fallback"
fi

echo
echo "===================================="
echo "     ✅ INSTALACIÓN COMPLETADA"
echo "===================================="
echo
echo "Próximos pasos:"
echo "1. Edita el archivo .env con tus credenciales de Supabase"
echo "2. Asegúrate de tener el modelo best.pt (opcional)"
echo "3. Ejecuta: setup/run.sh o python main.py"
echo
echo "Para activar el entorno manualmente:"
echo "   source venv/bin/activate"
echo
