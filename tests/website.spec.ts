import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const artifacts = process.env.DEEP_CODE_ARTIFACTS_DIR || join(tmpdir(), 'deep-code-validation');

const viewports = [
  [1920, 1080], [2560, 1440], [1440, 900], [1366, 768], [1024, 768],
  [768, 1024], [390, 844], [360, 800], [844, 390],
];

test('conteúdo, navegação e downloads continuam úteis sem a camada gráfica', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?graphics=off');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Deep\s*Code/i);
  for (const id of ['visao', 'demonstracao', 'recursos', 'modelos', 'como-funciona', 'downloads', 'atualizacoes', 'faq']) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(page.locator('#demonstracao')).toContainText(/conceitual|conceito/i);
  await expect(page.locator('#downloads').getByRole('button')).toBeDisabled();
  await expect(page.locator('a[href$=".exe"],a[download]')).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.locator('#faq summary').first().click();
  await expect(page.locator('#faq details').first()).toHaveAttribute('open', '');
  expect(errors).toEqual([]);
});

test('menu móvel recebe foco, navega por seção e devolve o foco ao fechar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?graphics=off');
  const open = page.getByRole('button', { name: 'Abrir menu', exact: true });
  await open.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/Deep Code|Explorar|Navega/i);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await dialog.locator('a[href="#demonstracao"]').click();
  await expect(page).toHaveURL(/#demonstracao$/);
  await expect(dialog).not.toBeVisible();
});

test('layout permanece sem overflow em nove tamanhos incluindo retrato e paisagem', async ({ page }) => {
  await page.goto('/?graphics=off');
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `${width}x${height}`).toBeLessThanOrEqual(dimensions.width + 1);
    const header = await page.locator('header').boundingBox();
    expect(header?.width).toBeLessThanOrEqual(width + 1);
  }
  await mkdir(artifacts, { recursive: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: join(artifacts, 'mobile-fallback.png'), fullPage: true });
});

test('a cena renderiza de verdade, reage ao ponteiro, redimensiona e trata perda de contexto', async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.waitForFunction(() => (window as unknown as { __deepCodeExperience?: { status: string; drawCalls: number } }).__deepCodeExperience?.status === 'ready' && (window as unknown as { __deepCodeExperience: { drawCalls: number } }).__deepCodeExperience.drawCalls > 0, null, { timeout: 45_000 });
  const snapshot = () => page.evaluate(() => (window as unknown as { __deepCodeExperience: {
    status: string; frames: number; drawCalls: number; triangles: number; camera: { x: number; y: number; z: number };
  } }).__deepCodeExperience);
  const initial = await snapshot();
  expect(initial.drawCalls).toBeGreaterThan(0);
  expect(initial.triangles).toBeGreaterThan(0);
  await page.mouse.move(1400, 150, { steps: 8 });
  await page.waitForFunction(frames => (window as unknown as { __deepCodeExperience: { frames: number } }).__deepCodeExperience.frames > frames + 3, initial.frames);
  const moved = await snapshot();
  expect(moved.frames).toBeGreaterThan(initial.frames);
  expect(moved.camera).not.toEqual(initial.camera);
  await mkdir(artifacts, { recursive: true });
  await page.screenshot({ path: join(artifacts, 'desktop-scene.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('[data-testid="space-canvas"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  await page.screenshot({ path: join(artifacts, 'mobile-scene.png') });
  const contextLost = await page.locator('canvas').evaluate(canvas => {
    const gl = (canvas as HTMLCanvasElement).getContext('webgl2');
    const ext = gl?.getExtension('WEBGL_lose_context');
    if (!ext) return false;
    ext.loseContext();
    return true;
  });
  expect(contextLost, 'A extensão de perda de contexto está disponível no Chromium testado').toBe(true);
  await page.waitForFunction(() => (window as unknown as { __deepCodeExperience: { status: string } }).__deepCodeExperience.status === 'fallback');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('#demonstracao').scrollIntoViewIfNeeded();
  await expect(page.locator('#demonstracao')).toBeVisible();
  expect(errors).toEqual([]);
});

test('preferência de movimento reduzido é respeitada sem remover conteúdo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForFunction(() => (window as unknown as { __deepCodeExperience?: { reducedMotion: boolean; status: string } }).__deepCodeExperience?.status === 'ready');
  expect(await page.evaluate(() => (window as unknown as { __deepCodeExperience: { reducedMotion: boolean } }).__deepCodeExperience.reducedMotion)).toBe(true);
  await expect(page.locator('#downloads')).toBeAttached();
  await expect(page.locator('#demonstracao')).toContainText(/conceitual|conceito/i);
});

test('som exige escolha explícita e a preferência não inicia áudio após recarga', async ({ page }) => {
  await page.goto('/?graphics=off');
  const activate = page.getByRole('button', { name: 'Ativar som', exact: true });
  await expect(activate).toHaveAttribute('aria-pressed', 'false');
  await page.waitForFunction(() => typeof (window as unknown as { __deepCodeAudio?: () => unknown }).__deepCodeAudio === 'function');
  expect(await page.evaluate(() => (window as unknown as { __deepCodeAudio: () => { contextCreated: boolean } }).__deepCodeAudio().contextCreated)).toBe(false);
  await activate.click();
  const deactivate = page.getByRole('button', { name: 'Desativar som', exact: true });
  await expect(deactivate).toHaveAttribute('aria-pressed', 'true');
  await page.waitForFunction(() => (window as unknown as { __deepCodeAudio: () => { contextState: string; userActivated: boolean; ambientSources: number } }).__deepCodeAudio().contextState === 'running');
  expect(await page.evaluate(() => (window as unknown as { __deepCodeAudio: () => { ambientSources: number } }).__deepCodeAudio().ambientSources)).toBeGreaterThan(0);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Ativar som', exact: true })).toHaveAttribute('aria-pressed', 'false');
});

test('pausa e retomada controlam o trabalho da cena sem bloquear o conteúdo', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => (window as unknown as { __deepCodeExperience?: { status: string } }).__deepCodeExperience?.status === 'ready');
  await page.locator('.experience-settings summary').click();
  await page.getByRole('button', { name: 'Pausar animações', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Retomar animações', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.waitForFunction(() => (window as unknown as { __deepCodeExperience?: { active: boolean } }).__deepCodeExperience?.active === false);
  const before = await page.evaluate(() => (window as unknown as { __deepCodeExperience: { frames: number } }).__deepCodeExperience.frames);
  await page.waitForTimeout(350);
  const after = await page.evaluate(() => (window as unknown as { __deepCodeExperience: { frames: number } }).__deepCodeExperience.frames);
  expect(after - before).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'Retomar animações', exact: true }).click();
  await page.waitForFunction(frames => (window as unknown as { __deepCodeExperience: { frames: number } }).__deepCodeExperience.frames > frames + 1, after);
});

test('demonstração conceitual troca perspectivas por clique e teclado e pode reiniciar', async ({ page }) => {
  await page.goto('/?graphics=off#demonstracao');
  const panel = page.getByRole('tabpanel');
  const tabInterface = page.getByRole('tab', { name: 'Interface', exact: true });
  const tabLogic = page.getByRole('tab', { name: 'Lógica', exact: true });
  const tabReview = page.getByRole('tab', { name: 'Revisão', exact: true });
  await expect(tabInterface).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toContainText('Orbit.tsx');
  await tabLogic.click();
  await expect(tabLogic).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toContainText('motion.ts');
  await tabLogic.press('ArrowRight');
  await expect(tabReview).toBeFocused();
  await expect(tabReview).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toContainText('quality.ts');
  await page.getByRole('button', { name: 'Reiniciar demonstração conceitual', exact: true }).click();
  await expect(tabInterface).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toContainText('Orbit.tsx');
});
