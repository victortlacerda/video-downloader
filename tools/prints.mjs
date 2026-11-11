// Gera os prints do README em docs/imagens/ a partir da tela real do app (src/index.html).
// O yt-dlp é simulado: nada é baixado. Requer Playwright (npm i -D playwright && npx playwright install chromium).
// Uso: node tools/prints.mjs
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, readFileSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs', 'imagens');
mkdirSync(out, { recursive: true });
const appUrl = pathToFileURL(join(root, 'src', 'index.html')).href;
const PASTA = 'C:\\Users\\Voce\\Downloads';
const LINK = 'https://www.exemplo.com/watch?v=aula-de-violao-01';

// API falsa no lugar do preload do Electron
const mock = (instalado) => `
  window.__cb = {};
  window.downloader = {
    getStatus: async () => ({ ytdlp: ${instalado}, ffmpeg: ${instalado}, defaultFolder: ${JSON.stringify(PASTA)} }),
    setup: () => new Promise(() => {}),
    chooseFolder: async () => null, openFolder: async () => {},
    download: () => new Promise(() => {}),
    onSetupProgress: cb => (window.__cb.setup = cb),
    onDownloadProgress: cb => (window.__cb.dl = cb),
  };`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 2 });

async function shot(nome, instalado, preparar) {
  const page = await ctx.newPage();
  await page.addInitScript(mock(instalado));
  await page.goto(appUrl);
  await page.waitForTimeout(200);
  if (preparar) await preparar(page);
  await page.waitForTimeout(300);
  const h = await page.evaluate(() => Math.min(900, Math.ceil(document.querySelector('main').getBoundingClientRect().bottom) + 12));
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 900, height: h } });
  await page.close();
  return buf;
}

const telas = {
  '1-primeiro-acesso': await shot('1', false, async p => {
    await p.click('#setupBtn');
    await p.evaluate(() => window.__cb.setup({ message: 'Baixando FFmpeg...', percent: 64 }));
  }),
  '2-tela-principal': await shot('2', true, async p => {
    await p.fill('#videoUrl', LINK);
  }),
  '3-baixando': await shot('3', true, async p => {
    await p.fill('#videoUrl', LINK);
    await p.click('#downloadBtn');
    await p.evaluate(() => window.__cb.dl({ percent: 47.3, message: '[download]  47.3% of  128.45MiB at  6.12MiB/s ETA 00:12' }));
  }),
  '4-mp3-concluido': await shot('4', true, async p => {
    await p.fill('#videoUrl', LINK);
    await p.check('input[value=audio]');
    await p.evaluate((pasta) => {
      document.getElementById('downloadProgress').classList.remove('hidden');
      document.getElementById('downloadBar').style.width = '100%';
      const s = document.getElementById('downloadStatus');
      s.textContent = 'Download concluído! Arquivo salvo em:\n' + pasta; s.className = 'status show';
    }, PASTA);
  }),
};

// Moldura de janela do Windows em volta de cada print
const frame = (b64, w) => `<!doctype html><html style="background:#e9f2fb"><body style="margin:0;padding:36px;width:${w}px;background:linear-gradient(135deg,#dfeefc,#f5f9fd);font-family:'Segoe UI',Arial,sans-serif">
<div style="width:${w}px;border-radius:10px;overflow:hidden;box-shadow:0 24px 60px #1a3a5a33,0 0 0 1px #c9d8e6">
<div style="height:34px;background:#fff;display:flex;align-items:center;border-bottom:1px solid #e3ebf3;font-size:12.5px;color:#334">
<span style="margin-left:12px;width:18px;height:18px;border-radius:5px;background:#1769aa;color:#fff;display:grid;place-items:center;font-size:12px">↓</span>
<span style="margin-left:9px;flex:1">Video Downloader</span>
<span style="width:46px;text-align:center">&#8212;</span><span style="width:46px;text-align:center">&#9744;</span><span style="width:46px;text-align:center">&#10005;</span></div>
<img src="data:image/png;base64,${b64}" style="display:block;width:${w}px;background:#f3f7fc"></div></body></html>`;

const page = await ctx.newPage();
for (const [nome, buf] of Object.entries(telas)) {
  await page.setContent(frame(buf.toString('base64'), 900));
  await page.waitForTimeout(100);
  await page.locator('body').screenshot({ path: join(out, nome + '.jpg'), type: 'jpeg', quality: 88 });
  console.log('ok', nome);
}

// Imagem de capa: título + tela principal
const capa = `<!doctype html><html><body style="margin:0;width:1280px;height:640px;background:linear-gradient(120deg,#0f4f86,#1769aa 55%,#2d83c8);font-family:'Segoe UI',Arial,sans-serif;color:#fff;display:flex;align-items:center;overflow:hidden">
<div style="padding:0 0 0 70px;width:520px;flex:none">
<div style="display:flex;align-items:center;gap:14px"><span style="width:58px;height:58px;border-radius:17px;background:#fff;color:#1769aa;display:grid;place-items:center;font-size:32px;font-weight:700">↓</span><span style="font-size:20px;opacity:.9">Para Windows 10 e 11</span></div>
<h1 style="font-size:54px;line-height:1.05;margin:26px 0 18px;font-weight:700">Video Downloader</h1>
<p style="font-size:23px;line-height:1.4;margin:0;opacity:.95">Cole o link, escolha vídeo ou MP3 e clique em baixar. Sem linha de comando.</p>
<div style="margin-top:30px;display:flex;gap:10px;flex-wrap:wrap;font-size:15px">
<span style="background:#ffffff26;padding:8px 14px;border-radius:99px">Vídeo em MP4</span><span style="background:#ffffff26;padding:8px 14px;border-radius:99px">Áudio em MP3</span><span style="background:#ffffff26;padding:8px 14px;border-radius:99px">Portátil, sem instalar</span></div></div>
<div style="flex:none;margin-left:20px;transform:rotate(-2deg);border-radius:12px;overflow:hidden;box-shadow:0 30px 80px #00000055">
<img src="data:image/png;base64,${telas['2-tela-principal'].toString('base64')}" style="display:block;width:680px"></div></body></html>`;
const p2 = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1.5 });
await p2.setContent(capa);
await p2.waitForTimeout(150);
await p2.screenshot({ path: join(out, 'capa.jpg'), type: 'jpeg', quality: 90 });
console.log('ok capa');
await browser.close();
