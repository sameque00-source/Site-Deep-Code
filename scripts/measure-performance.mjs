import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

// Benchmark sem screenshots. rAF mede callbacks; não mede apresentação física nem tempo GPU.
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const sampleMs = Number(process.env.SAMPLE_MS || 3000);
if (!Number.isFinite(sampleMs) || sampleMs < 1000 || sampleMs > 20_000) {
  throw new Error('SAMPLE_MS deve estar entre1000 e20000.');
}
const output = process.env.PERFORMANCE_OUTPUT || join(tmpdir(), 'deep-code-validation', 'performance.json');
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH }
    : existsSync('/usr/bin/chromium') ? { executablePath: '/usr/bin/chromium' } : { channel: 'chrome' }),
  headless: true,
  chromiumSandbox: process.platform !== 'linux',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const cdp = await page.context().newCDPSession(page);
await cdp.send('Performance.enable');
let revision = 'unavailable';
try { revision = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* Export sem Git. */ }
const report = {
  schemaVersion: 1,
  dateUTC: new Date().toISOString(),
  revision,
  target: baseURL,
  browser: browser.version(),
  scenarios: [],
  conditions: {
    physicalRefreshRate: 'not measured; headless browser',
    presentationFPS: 'not measured',
    gpuTiming: 'not measured',
    screenshotsDuringSamples: false,
    throttlingConfigured: false,
    viewport: { width: 1440, height: 900 },
    dpr: 1,
  },
  limitations: [
    'Intervalos rAF são oportunidades de callback e não prova de frames apresentados.',
    'SwiftShader é renderização por software e não valida a meta de90/120FPS em GPU física.',
    'Os cenários são amostras curtas de laboratório, não um teste térmico ou sessão de horas.',
    'Snapshots de heap JS não medem VRAM nem toda a memória do processo.',
    'Scroll pode suspender a cena fora do viewport; frames renderizados e callbacks diferem.',
  ],
};

const diagnostic = () => page.evaluate(() => {
  const value = window.__deepCodeExperience;
  return value ? JSON.parse(JSON.stringify(value)) : null;
});

function summarize(intervals) {
  const sorted = [...intervals].sort((a, b) => a - b);
  const percentile = p => sorted[Math.floor((sorted.length - 1) * p)] ?? null;
  return {
    samples: sorted.length,
    medianMs: percentile(.5),
    p95Ms: percentile(.95),
    p99Ms: percentile(.99),
    maxMs: sorted.at(-1) ?? null,
    meanMs: sorted.length ? sorted.reduce((sum, value) => sum + value, 0) / sorted.length : null,
    callbacksAbove11_11ms: sorted.filter(value => value > 1000 / 90).length,
    callbacksAbove16_67ms: sorted.filter(value => value > 1000 / 60).length,
    note: 'Threshold counts are not a precise dropped-presented-frame count.',
  };
}

async function sample(id, purpose, action, duration = sampleMs) {
  const before = await diagnostic();
  const cpuBefore = (await cdp.send('Performance.getMetrics')).metrics;
  const started = Date.now();
  const capture = page.evaluate(milliseconds => new Promise(resolve => {
    const times = [];
    const longTasks = [];
    let previous = null;
    const begin = performance.now();
    let observer;
    try {
      observer = new PerformanceObserver(list => {
        longTasks.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, duration: entry.duration })));
      });
      observer.observe({ type: 'longtask' });
    } catch { /* Somente APIs suportadas. */ }
    const step = now => {
      if (previous !== null) times.push(now - previous);
      previous = now;
      if (now - begin < milliseconds) requestAnimationFrame(step);
      else {
        observer?.disconnect();
        resolve({ elapsedMs: now - begin, intervals: times, longTasks,
          heapAfter: performance.memory?.usedJSHeapSize ?? null });
      }
    };
    requestAnimationFrame(step);
  }), duration);
  let actionError = null;
  try { if (action) await action(duration); } catch (error) { actionError = String(error.message).slice(0, 400); }
  const captured = await capture;
  const after = await diagnostic();
  const cpuAfter = (await cdp.send('Performance.getMetrics')).metrics;
  const metric = (list, name) => list.find(entry => entry.name === name)?.value ?? null;
  const taskBefore = metric(cpuBefore, 'TaskDuration');
  const taskAfter = metric(cpuAfter, 'TaskDuration');
  report.scenarios.push({
    id, purpose, startedUTC: new Date(started).toISOString(),
    durationMs: captured.elapsedMs,
    viewport: page.viewportSize(),
    dpr: await page.evaluate(() => devicePixelRatio),
    raf: summarize(captured.intervals),
    longTasks: captured.longTasks,
    mainThreadTaskDurationMs: taskBefore !== null && taskAfter !== null ? (taskAfter - taskBefore) * 1000 : null,
    heapAfter: captured.heapAfter,
    cdpJSHeapBefore: metric(cpuBefore, 'JSHeapUsedSize'),
    cdpJSHeapAfter: metric(cpuAfter, 'JSHeapUsedSize'),
    sceneFramesRendered: before && after ? after.frames - before.frames : null,
    before, after, actionError,
  });
}

async function returnToHero() {
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForFunction(() => window.__deepCodeExperience?.active !== false);
}

try {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__deepCodeExperience?.status === 'ready', null, { timeout: 45_000 });
  report.environment = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const gl = canvas?.getContext('webgl2');
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    return {
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemoryGiB: navigator.deviceMemory ?? null,
      renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : null,
      screen: { width: screen.width, height: screen.height, colorDepth: screen.colorDepth },
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });
  await sample('P01', 'Hero e astronauta em repouso', null);
  await sample('P02', 'Movimento contínuo do ponteiro', async duration => {
    const start = Date.now();
    let n = 0;
    while (Date.now() - start < duration - 100) {
      await page.mouse.move(720 + Math.cos(n / 3) * 600, 400 + Math.sin(n / 3) * 300, { steps: 3 });
      n++;
      await page.waitForTimeout(40);
    }
  });
  await sample('P03', 'Scroll pelo conteúdo e retorno', async duration => {
    const start = Date.now();
    let direction = 1;
    while (Date.now() - start < duration - 100) {
      await page.mouse.wheel(0, 400 * direction);
      const end = await page.evaluate(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 10);
      if (end) direction = -1;
      await page.waitForTimeout(100);
    }
  });
  await returnToHero();
  await sample('P04', 'Transição de scroll e reversão próximo ao hero', async duration => {
    const start = Date.now();
    let direction = 1;
    while (Date.now() - start < duration - 100) {
      await page.mouse.wheel(0, 300 * direction);
      direction *= -1;
      await page.waitForTimeout(200);
    }
  });
  await returnToHero();
  await sample('P05', 'Astronauta: orientação e acomodação', async duration => {
    await page.mouse.move(1400, 120, { steps: 20 });
    await page.waitForTimeout(Math.floor(duration / 3));
    await page.mouse.move(100, 750, { steps: 20 });
    await page.waitForTimeout(Math.floor(duration / 3));
    await page.mouse.move(700, 450, { steps: 20 });
  });
  await sample('P06', 'Menu e navegação por seções', async () => {
    const menu = page.getByRole('button', { name: 'Abrir menu', exact: true });
    if (await menu.isVisible()) { await menu.click(); await page.keyboard.press('Escape'); }
    await page.evaluate(() => { location.hash = 'demonstracao'; });
    await page.locator('#demonstracao').scrollIntoViewIfNeeded();
    await returnToHero();
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await returnToHero();
  await sample('P07', 'Cena em mobile emulado390×844, toque não físico', async () => {
    await page.mouse.move(190, 400);
    await page.mouse.wheel(0, 200);
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await returnToHero();
  await sample('P08', 'Ciclos repetidos curtos: não é soak prolongado', async duration => {
    const start = Date.now();
    while (Date.now() - start < duration - 200) {
      await page.locator('#demonstracao').scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await returnToHero();
      await page.waitForTimeout(150);
    }
  }, Math.max(6000, sampleMs * 2));
  report.totalTransferredResources = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    return { count: resources.length,
      knownTransferBytes: resources.reduce((sum, item) => sum + (item.transferSize || 0), 0),
      caveat: 'TransferSize pode omitir recursos por cache/TAO; não é VRAM.' };
  });
} catch (error) {
  report.error = String(error.message).slice(0, 600);
  process.exitCode = 1;
} finally {
  report.finishedUTC = new Date().toISOString();
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ output, scenarios: report.scenarios.length,
    error: report.error ?? null, renderer: report.environment?.renderer ?? null }, null, 2));
  await browser.close();
}
