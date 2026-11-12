import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { readFile, writeFile } from 'node:fs/promises';
const server = await createServer({ cacheDir: 'node_modules/.cache/prerender-vite', server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/app/App.tsx');
  const html = await readFile('dist/index.html', 'utf8');
  if (!html.includes('<!--app-html-->')) throw new Error('Marcador de pré-renderização ausente');
  await writeFile('dist/index.html', html.replace('<!--app-html-->', renderToString(createElement(App))));
  console.log('HTML semântico pré-renderizado para a página Deep Code.');
} finally { await server.close(); }
