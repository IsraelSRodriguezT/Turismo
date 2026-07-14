#!/bin/bash
# Script para renderizar la documentación de PIT

echo "=========================================="
echo "PIT - Documentación Interactiva"
echo "=========================================="
echo ""

# Verificar si Quarto está instalado
if ! command -v quarto &> /dev/null; then
    echo "❌ Quarto no está instalado"
    echo ""
    echo "Para instalar Quarto, visita: https://quarto.org/docs/get-started/"
    echo ""
    echo "Pasos rápidos:"
    echo "1. Descarga el instalador desde quarto.org"
    echo "2. Ejecuta el instalador"
    echo "3. Reinicia tu terminal"
    echo ""
    exit 1
fi

echo "✅ Quarto detectado"
echo ""
echo "Opciones:"
echo "1. Renderizar a HTML (web)"
echo "2. Renderizar a PDF"
echo "3. Vista previa en vivo (auto-refresca)"
echo ""
read -p "Selecciona una opción (1-3): " option

case $option in
    1)
        echo ""
        echo "Renderizando a HTML..."
        quarto render index.qmd --to html
        echo ""
        echo "✅ ¡Listo! Abre 'index.html' en tu navegador"
        echo ""
        echo "Puedes usar:"
        echo "  Windows: start index.html"
        echo "  macOS:   open index.html"
        echo "  Linux:   xdg-open index.html"
        ;;
    2)
        echo ""
        echo "Renderizando a PDF..."
        quarto render index.qmd --to pdf
        echo ""
        echo "✅ ¡Listo! Se creó 'index.pdf'"
        ;;
    3)
        echo ""
        echo "Abriendo vista previa en vivo..."
        echo "La documentación se actualizará automáticamente al hacer cambios"
        echo "Presiona Ctrl+C para salir"
        echo ""
        quarto preview index.qmd
        ;;
    *)
        echo "❌ Opción no válida"
        exit 1
        ;;
esac
