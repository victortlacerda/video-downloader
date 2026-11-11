@echo off
setlocal
title yt-dlp - Download de video

set "PASTA_PADRAO=C:\Users\Estudos\Downloads"

echo ========================================
echo          DOWNLOAD COM yt-dlp
echo ========================================
echo.
echo Pasta padrao:
echo %PASTA_PADRAO%
echo.
choice /C SN /N /M "Salvar na pasta padrao? [S]im / [N]ao: "

if errorlevel 2 goto escolher_pasta
set "PASTA=%PASTA_PADRAO%"
goto validar_pasta

:escolher_pasta
echo.
set /p "PASTA=Digite o caminho da pasta onde salvar: "
if "%PASTA%"=="" (
    echo Nenhuma pasta informada.
    pause
    exit /b 1
)

:validar_pasta
if not exist "%PASTA%" (
    echo.
    echo A pasta nao existe. Criando...
    mkdir "%PASTA%" 2>nul
    if errorlevel 1 (
        echo Nao foi possivel criar a pasta.
        pause
        exit /b 1
    )
)

where yt-dlp >nul 2>nul
if errorlevel 1 (
    if exist "%~dp0yt-dlp.exe" (
        set "YT_DLP=%~dp0yt-dlp.exe"
    ) else (
        echo.
        echo ERRO: yt-dlp nao foi encontrado.
        echo Instale-o e adicione-o ao PATH, ou coloque yt-dlp.exe
        echo na mesma pasta deste arquivo .bat.
        echo.
        pause
        exit /b 1
    )
) else (
    set "YT_DLP=yt-dlp"
)

echo.
set /p "LINK=Cole o link do video: "
if "%LINK%"=="" (
    echo Nenhum link informado.
    pause
    exit /b 1
)

echo.
echo Pasta de destino: %PASTA%
echo Iniciando download...
echo.

"%YT_DLP%" -P "%PASTA%" "%LINK%"
set "RESULTADO=%ERRORLEVEL%"

echo.
if "%RESULTADO%"=="0" (
    echo Download concluido!
) else (
    echo O yt-dlp terminou com codigo de erro %RESULTADO%.
)
echo.
pause
exit /b %RESULTADO%
