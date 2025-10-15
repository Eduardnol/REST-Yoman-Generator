#!/bin/bash

echo "🚀 Instalando generador de API REST..."

# Ir a la carpeta generators
cd "$(dirname "$0")"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
npm install -g yo

# Enlazar el generador
echo "🔗 Enlazando generador..."
npm link

echo "✅ ¡Instalación completada!"
echo ""
echo "Para usar el generador, ejecuta desde la raíz del proyecto:"
echo "  yo spring-rest-api"

