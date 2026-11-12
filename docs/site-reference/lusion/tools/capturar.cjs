// Ferramenta de pesquisa. Não contém nem implementa o site do produto.
// Uso e limitações: ../PENDENCIAS_E_EVIDENCIAS.md
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { createRequire } = require('node:module');

const [target, output, width = '1440', height = '900', actionFile] = process.argv.slice(2);
if (!target || !output) {
  console.error('Uso: node capturar.cjs URL_HTTPS DIRETORIO_NOVO_EXTERNO [largura altura [acao.json]]');
  process.exit(2);
}

function cleanURL(value) {
  try {
    const u = new URL(value);
    if (!['https:', 'http:'].includes(u.protocol)) return `[${u.protocol}]`;
    return `${u.origin}${u.pathname}`; // Sem userinfo, query ou fragmento.
  } catch { return '[URL inválida]'; }
}

function within(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

// Resolve também ancestrais com symlinks antes de criar diretórios de saída.
function prospectiveRealPath(candidate) {
  const missing = [];
  let existing = candidate;
  while (!fs.existsSync(existing)) {
    missing.unshift(path.basename(existing));
    const parent = path.dirname(existing);
    if (parent === existing) throw new Error('Não foi possível resolver a saída.');
    existing = parent;
  }
  return path.join(fs.realpathSync(existing), ...missing);
}

function playwright() {
  if (!process.env.AUDIT_TOOLS_DIR) return require('playwright');
  const tools = fs.realpathSync(process.env.AUDIT_TOOLS_DIR);
  return createRequire(path.join(tools, 'package.json'))('playwright');
}

function browserExecutable() {
  if (process.env.CHROMIUM_PATH) {
    const executablePath = fs.realpathSync(process.env.CHROMIUM_PATH);
    if (!fs.statSync(executablePath).isFile()) throw new Error('CHROMIUM_PATH não é arquivo.');
    return { executablePath };
  }
  if (process.platform === 'win32' || process.platform === 'darwin') return { channel: 'chrome' };
  if (fs.existsSync('/usr/bin/chromium')) return { executablePath: '/usr/bin/chromium' };
  return {}; // Chromium gerenciado pelo Playwright, quando instalado.
}

function gitRoot(directory) {
  return fs.realpathSync(execFileSync('git', ['-C', directory, 'rev-parse', '--show-toplevel'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim());
}

function protectedRepoRoot() {
  let scriptRoot;
  try { scriptRoot = gitRoot(__dirname); } catch { /* Cópia externa pode declarar seu checkout. */ }
  if (!process.env.AUDIT_REPO_ROOT) {
    if (!scriptRoot) throw new Error('Execute no checkout ou declare AUDIT_REPO_ROOT.');
    return scriptRoot;
  }
  const declaredRoot = gitRoot(process.env.AUDIT_REPO_ROOT);
  if (scriptRoot && path.relative(scriptRoot, declaredRoot) !== '')
    throw new Error('AUDIT_REPO_ROOT difere do checkout que contém o coletor.');
  return declaredRoot;
}

async function main() {
  const url = new URL(target);
  if (url.protocol !== 'https:' || url.username || url.password)
    throw new Error('Utilize somente uma URL pública HTTPS sem credenciais.');
  const viewport = { width: Number(width), height: Number(height) };
  if (!Object.values(viewport).every(n => Number.isInteger(n) && n >= 240 && n <= 3840))
    throw new Error('Dimensões devem ser inteiros entre 240 e 3840 CSS px.');
  const repo = protectedRepoRoot();
  const out = path.resolve(output);
  if (within(repo, prospectiveRealPath(out)))
    throw new Error('Capturas devem ficar FORA do repositório.');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (within(repo, fs.realpathSync(path.dirname(out)))) throw new Error('Saída resolve para dentro do repositório.');
  fs.mkdirSync(out, { mode: 0o700 }); // Não sobrescreve uma sessão anterior.
  const write = (name, data) => fs.writeFileSync(path.join(out, name), JSON.stringify(data, null, 2) + '\n');
  const action = actionFile ? JSON.parse(fs.readFileSync(actionFile, 'utf8')) : null;
  if (action && !['hover', 'click', 'focus', 'press', 'wheel', 'move', 'tap'].includes(action.type))
    throw new Error('Tipo de ação não suportado.');
  const mobile = process.env.PROFILE === 'mobile';
  const headed = process.env.AUDIT_HEADED === '1';
  const proxyRaw = process.env.HTTPS_PROXY || process.env.https_proxy;
  const p = proxyRaw ? new URL(proxyRaw) : null;
  const sessionStart = performance.now();
  const testID = process.env.TEST_ID || 'sem-id';
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(testID)) throw new Error('TEST_ID inválido.');
  const readySelector = process.env.READY_SELECTOR || null;
  const requestedHosts = new Set();
  const report = {
    schemaVersion: 3, testID,
    startedUTC: new Date().toISOString(), target: cleanURL(target), viewport,
    profile: mobile ? `Chromium com emulação mobile/touch (${headed ? 'headed' : 'headless'})` : `desktop ${headed ? 'headed' : 'headless'}`,
    instrument: { platform: process.platform, externalToolsDirectory: !!process.env.AUDIT_TOOLS_DIR,
      browserOwnership: 'launched-by-collector', cdpAttachment: false },
    reducedMotion: process.env.REDUCED_MOTION === 'reduce' ? 'reduce' : 'no-preference',
    navigation: null, requestsFailed: [], responses: [], consoleErrors: [],
    consoleCounts: {}, phases: [],
    action: action ? { type: action.type, selector: action.selector || null } : null,
    notes: ['Contexto novo sem cache persistente; sem throttling configurado.',
      'DOMContentLoaded e condição automatizada de readiness não garantem que a cena esteja visualmente pronta.',
      'rAF mede intervalos de callbacks; não é tempo de GPU nem FPS de apresentação.',
      'Som audível, curvas visuais e estado final exigem análise adicional.']
  };
  const mark = name => {
    report.phase = name;
    report.phases.push({ name, elapsedMs: performance.now() - sessionStart });
  };
  let browser;
  try {
    mark('dependency-loading');
    const { chromium } = playwright();
    mark('browser-launch');
    browser = await chromium.launch({
      ...browserExecutable(), headless: !headed,
      // Preserva o modo Linux atual; usa sandbox no Chrome local Windows/macOS.
      chromiumSandbox: process.platform !== 'linux',
      ...(p ? { proxy: { server: p.origin,
        ...(p.username ? { username: decodeURIComponent(p.username), password: decodeURIComponent(p.password) } : {}) } } : {})
    });
    report.browser = browser.version();
    const context = await browser.newContext({ viewport, deviceScaleFactor: mobile ? 3 : 1,
      isMobile: mobile, hasTouch: mobile, reducedMotion: report.reducedMotion });
    await context.addInitScript(() => {
      window.__referenceAuditLongTasks = [];
      try {
        new PerformanceObserver(list => {
          for (const e of list.getEntries()) window.__referenceAuditLongTasks.push({ start: e.startTime, duration: e.duration });
        }).observe({ type: 'longtask', buffered: true });
      } catch { /* API opcional; o relatório indica suporte. */ }
    });
    const page = await context.newPage();
    page.on('request', r => {
      try { const u = new URL(r.url()); if (['https:', 'http:'].includes(u.protocol)) requestedHosts.add(u.hostname); } catch { /* URL não HTTP. */ }
    });
    page.on('requestfailed', r => report.requestsFailed.push({ url: cleanURL(r.url()),
      error: r.failure()?.errorText, elapsedMs: performance.now() - sessionStart }));
    page.on('response', r => report.responses.push({ url: cleanURL(r.url()), status: r.status(),
      type: r.request().resourceType(), mime: r.headers()['content-type'] || null,
      elapsedMs: performance.now() - sessionStart }));
    page.on('console', message => {
      const type = message.type(); report.consoleCounts[type] = (report.consoleCounts[type] || 0) + 1;
    });
    // Não exportar mensagens de console de terceiros: podem conter dados pessoais ou credenciais.
    page.on('pageerror', () => report.consoleErrors.push({ kind: 'uncaught-page-error', atUTC: new Date().toISOString() }));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Performance.enable');
    const begin = performance.now();
    let response;
    mark('navigation');
    try {
      response = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch {
      report.navigation = { ok: false, reason: 'navigation-failed; consulte requestsFailed',
        elapsedMs: performance.now() - begin };
      process.exitCode = 3;
      return;
    }
    report.navigation = { ok: !!response?.ok(), status: response?.status(),
      finalURL: cleanURL(page.url()), toDOMContentLoadedMs: performance.now() - begin };
    if (!response?.ok()) { process.exitCode = 3; return; }
    mark('readiness');
    report.readiness = { strategy: readySelector ? 'explicit-visible-selector' : 'fixed-wait-1500ms',
      selector: readySelector, conditionSatisfied: false, sceneVisuallyVerified: false };
    if (readySelector) await page.locator(readySelector).waitFor({ state: 'visible', timeout: 30000 });
    else await page.waitForTimeout(1500);
    report.readiness.conditionSatisfied = true;
    mark('inventory');
    report.dom = await page.evaluate(() => {
      const clean = v => { try { const u = new URL(v, location.href); return ['http:', 'https:'].includes(u.protocol) ? u.origin + u.pathname : `[${u.protocol}]`; } catch { return '[inválida]'; } };
      return {
        title: document.title, readyState: document.readyState,
        headings: [...document.querySelectorAll('h1,h2,h3')].map(e => ({ tag: e.tagName, text: e.textContent.trim() })),
        links: [...document.querySelectorAll('a[href]')].map(e => ({ text: e.textContent.trim(), url: clean(e.href) })),
        controls: [...document.querySelectorAll('button,[role="button"]')].map(e => ({ text: e.textContent.trim(), label: e.getAttribute('aria-label') })),
        canvases: [...document.querySelectorAll('canvas')].map(e => ({ width: e.width, height: e.height,
          rect: e.getBoundingClientRect().toJSON() })),
        media: [...document.querySelectorAll('audio,video')].map(e => ({ tag: e.tagName, src: clean(e.currentSrc),
          paused: e.paused, muted: e.muted, autoplay: e.autoplay, currentTime: e.currentTime,
          duration: Number.isFinite(e.duration) ? e.duration : null })),
        bodyStyle: (() => { const s = getComputedStyle(document.body); return { font: s.font, color: s.color, backgroundColor: s.backgroundColor }; })(),
        dpr: devicePixelRatio, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        longTaskSupported: PerformanceObserver.supportedEntryTypes?.includes('longtask') || false
      };
    });
    await page.screenshot({ path: path.join(out, 'estado-inicial.png') });
    mark('idle-sample');
    const sampleStart = await page.evaluate(() => performance.now());
    report.raf = await page.evaluate(() => new Promise(resolve => {
      const intervals = []; let last = null; const start = performance.now();
      const timeout = setTimeout(() => resolve({ valid: false, reason: 'insufficient callbacks', intervals }), 10000);
      const step = now => {
        if (last !== null) intervals.push(now - last);
        last = now;
        if (now - start < 5000) requestAnimationFrame(step);
        else { clearTimeout(timeout); resolve({ valid: true, elapsedMs: now - start, intervals }); }
      };
      requestAnimationFrame(step);
    }));
    if (report.raf.valid) {
      const values = [...report.raf.intervals].sort((a, b) => a - b);
      const q = p => values[Math.floor((values.length - 1) * p)];
      report.raf.summary = { n: values.length, p50Ms: q(.5), p95Ms: q(.95), p99Ms: q(.99),
        maxMs: values.at(-1), above8_33ms: values.filter(v => v > 1000 / 120).length,
        above16_67ms: values.filter(v => v > 1000 / 60).length, scope: 'idle; scene readiness NOT verified' };
    }
    report.longTasks = await page.evaluate(start => window.__referenceAuditLongTasks.filter(e => e.start >= start), sampleStart);
    report.cdpMetricsAfterIdle = (await cdp.send('Performance.getMetrics')).metrics;
    if (action) {
      mark('action');
      const frames = [], before = performance.now();
      const locator = action.selector ? page.locator(action.selector) : null;
      // Offsets começam após o comando de interação; incluem overhead e não representam dispatch exato.
      if (action.type === 'hover') await locator.hover();
      if (action.type === 'click') await locator.click();
      if (action.type === 'focus') await locator.focus();
      if (action.type === 'press') await page.keyboard.press(action.key);
      if (action.type === 'wheel') await page.mouse.wheel(action.dx || 0, action.dy || 0);
      if (action.type === 'move') await page.mouse.move(action.x, action.y, { steps: action.steps || 1 });
      if (action.type === 'tap') await locator.tap();
      const completed = performance.now();
      report.action.commandDurationMs = completed - before;
      report.action.clock = 'Node performance.now(); screenshot windows relative to command completion';
      for (const offset of [0, 50, 100, 200, 400, 800, 1200, 2000]) {
        await page.waitForTimeout(Math.max(0, offset - (performance.now() - completed)));
        const frame = { targetOffsetMs: offset, startedMs: performance.now() - completed };
        await page.screenshot({ path: path.join(out, `frame-${String(offset).padStart(4, '0')}.png`) });
        frame.finishedMs = performance.now() - completed; frames.push(frame);
      }
      report.action.frames = frames;
      report.action.finalURL = cleanURL(page.url());
    }
    mark('resource-metadata');
    report.resources = await page.evaluate(() => performance.getEntriesByType('resource').map(e => {
      const u = new URL(e.name); return { url: ['http:', 'https:'].includes(u.protocol) ? u.origin + u.pathname : `[${u.protocol}]`,
        initiatorType: e.initiatorType, startTime: e.startTime, duration: e.duration,
        transferSize: e.transferSize, encodedBodySize: e.encodedBodySize, decodedBodySize: e.decodedBodySize };
    }));
    report.navigationTiming = await page.evaluate(() => performance.getEntriesByType('navigation').map(e => ({
      type: e.type, domContentLoadedEventEnd: e.domContentLoadedEventEnd, loadEventEnd: e.loadEventEnd,
      transferSize: e.transferSize, encodedBodySize: e.encodedBodySize })));
    mark('collection-complete');
  } catch (error) {
    // Não persistir mensagem/stack: erros externos podem carregar URLs ou dados privados.
    report.collectionError = { phase: report.phase,
      kind: error?.name === 'TimeoutError' ? 'timeout' : 'collection-failed', detailsOmitted: true };
    process.exitCode = 4;
  } finally {
    const host = value => { try { return new URL(value).hostname; } catch { return null; } };
    report.networkSummary = {
      requestedHosts: [...requestedHosts].sort(),
      failedHosts: [...new Set(report.requestsFailed.map(r => host(r.url)).filter(Boolean))].sort(),
      httpErrorHosts: [...new Set(report.responses.filter(r => r.status >= 400).map(r => host(r.url)).filter(Boolean))].sort(),
      warning: 'Hosts com falha não comprovam bloqueio administrativo; verificar tipo de erro e política antes de pedir liberação.'
    };
    report.endedUTC = new Date().toISOString();
    write('relatorio.json', report);
    if (browser) await browser.close();
    console.log(JSON.stringify({ saved: out, navigationOK: report.navigation?.ok === true,
      collectionOK: report.phase === 'collection-complete', phase: report.phase }));
  }
}
main().catch(() => { console.error('Falha de coleta. Verifique o relatório local, os parâmetros, Playwright e Chromium.'); process.exitCode = 1; });
