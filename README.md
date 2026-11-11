# Video Downloader para Windows

Aplicativo desktop Electron com interface HTML para baixar vídeos com yt-dlp ou extrair áudio MP3.

## Requisitos

* Windows 10/11 de 64 bits
* Node.js LTS para executar o projeto ou gerar o `.exe`
* Internet no primeiro acesso
* PowerShell (incluído no Windows)

## Executar

1. Instale Node.js LTS: https://nodejs.org/
2. Extraia este ZIP.
3. Abra o terminal na pasta `VideoDownloader`.
4. Execute `npm install` e depois `npm start`.
5. No primeiro acesso, clique em **Configurar aplicativo**. O programa baixa yt-dlp do GitHub e FFmpeg Essentials de gyan.dev.
6. Escolha a pasta, selecione vídeo ou MP3, cole o link e clique em **Baixar agora**.

## Gerar executável portátil

Na pasta do projeto, execute:

```powershell
npm install
npm run dist
```

O `.exe` será criado na pasta `dist`.

A pasta padrão é a pasta Downloads do usuário atual. Para MP3, FFmpeg é necessário e é configurado automaticamente. A disponibilidade dos downloads depende do site e do suporte atual do yt-dlp. Baixe apenas conteúdo que você tem autorização para salvar e respeite direitos autorais e termos aplicáveis.

