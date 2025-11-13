#!/bin/bash

# Script de prueba para el generador add-method
# Este script NO ejecuta el generador, solo verifica que los archivos necesarios existen

echo "🔍 Verificando estructura del generador add-method..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de errores
errors=0

# Verificar archivos del generador
echo "📁 Verificando archivos del generador..."

if [ -f "generators/add-method/index.js" ]; then
    echo -e "${GREEN}✓${NC} index.js encontrado"
else
    echo -e "${RED}✗${NC} index.js NO encontrado"
    ((errors++))
fi

if [ -f "generators/add-method/README.md" ]; then
    echo -e "${GREEN}✓${NC} README.md encontrado"
else
    echo -e "${RED}✗${NC} README.md NO encontrado"
    ((errors++))
fi

if [ -f "generators/add-method/EXAMPLES.md" ]; then
    echo -e "${GREEN}✓${NC} EXAMPLES.md encontrado"
else
    echo -e "${RED}✗${NC} EXAMPLES.md NO encontrado"
    ((errors++))
fi

echo ""
echo "📦 Verificando dependencias de Node.js..."

if [ -f "generators/package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json encontrado"

    # Verificar si node_modules existe
    if [ -d "generators/node_modules" ]; then
        echo -e "${GREEN}✓${NC} node_modules encontrado"
    else
        echo -e "${YELLOW}⚠${NC} node_modules NO encontrado. Ejecuta: cd generators && npm install"
    fi
else
    echo -e "${RED}✗${NC} package.json NO encontrado"
    ((errors++))
fi

echo ""
echo "🔧 Verificando sintaxis de JavaScript..."

if command -v node &> /dev/null; then
    if node -c generators/add-method/index.js 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Sintaxis de index.js válida"
    else
        echo -e "${RED}✗${NC} Errores de sintaxis en index.js"
        ((errors++))
    fi
else
    echo -e "${YELLOW}⚠${NC} Node.js no está instalado, no se puede verificar sintaxis"
fi

echo ""
echo "📝 Verificando documentación..."

if grep -q "add-method" generators/README.md; then
    echo -e "${GREEN}✓${NC} README.md actualizado con información de add-method"
else
    echo -e "${YELLOW}⚠${NC} README.md no menciona add-method"
fi

echo ""
echo "════════════════════════════════════════"

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ Todas las verificaciones pasaron!${NC}"
    echo ""
    echo "Para usar el generador:"
    echo -e "${YELLOW}  yo ./generators/add-method${NC}"
    echo ""
    echo "Para instalar dependencias (si es necesario):"
    echo -e "${YELLOW}  cd generators && npm install${NC}"
else
    echo -e "${RED}❌ Se encontraron $errors errores${NC}"
    exit 1
fi

echo "════════════════════════════════════════"

