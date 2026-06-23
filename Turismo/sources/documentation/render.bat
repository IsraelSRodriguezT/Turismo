@echo off
REM Script para renderizar la documentación de PIT en Windows

echo ==========================================
echo PIT - Documentación Interactiva
echo ==========================================
echo.

REM Verificar si Quarto está instalado
where quarto >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Quarto no está instalado
    echo.
    echo Para instalar Quarto, visita: https://quarto.org/docs/get-started/
    echo.
    echo Pasos rápidos:
    echo 1. Descarga el instalador desde quarto.org
    echo 2. Ejecuta el instalador
    echo 3. Reinicia tu terminal
    echo.
    pause
    exit /b 1
)

echo ✅ Quarto detectado
echo.
echo Opciones:
echo 1. Renderizar a HTML (web)
echo 2. Renderizar a PDF
echo 3. Vista previa en vivo (auto-refresca)
echo.
set /p option="Selecciona una opción (1-3): "

if "%option%"=="1" (
    echo.
    echo Renderizando a HTML...
    quarto render index.qmd --to html
    echo.
    echo ✅ ¡Listo! Abre 'index.html' en tu navegador
    echo Puedes hacer doble clic en el archivo o usar:
    echo   start index.html
    pause
) else if "%option%"=="2" (
    echo.
    echo Renderizando a PDF...
    quarto render index.qmd --to pdf
    echo.
    echo ✅ ¡Listo! Se creó 'index.pdf'
    pause
) else if "%option%"=="3" (
    echo.
    echo Abriendo vista previa en vivo...
    echo La documentación se actualizará automáticamente al hacer cambios
    echo Presiona Ctrl+C para salir
    echo.
    quarto preview index.qmd
) else (
    echo ❌ Opción no válida
    pause
    exit /b 1
)
