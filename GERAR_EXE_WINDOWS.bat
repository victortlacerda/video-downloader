@echo off
setlocal
title Gerar Video Downloader EXE
cd /d "%~dp0"

echo ==========================================
echo   GERADOR DO VIDEO DOWNLOADER - WINDOWS
echo ==========================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo ERRO: Node.js nao encontrado.
  echo Instale a versao LTS em https://nodejs.org/ e execute novamente.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo ERRO: npm nao encontrado. Reinstale o Node.js LTS.
  pause
  exit /b 1
)

echo Instalando dependencias do projeto...
call npm install
if errorlevel 1 (
  echo.
  echo Falha ao instalar dependencias. Verifique a internet e tente novamente.
  pause
  exit /b 1
)

echo.
echo Gerando o executavel portatil...
call npm run dist
if errorlevel 1 (
  echo.
  echo Falha ao gerar o executavel.
  pause
  exit /b 1
)

echo.
echo Concluido! Verifique a pasta:
echo %~dp0dist
echo.
explorer "%~dp0dist"
pause
