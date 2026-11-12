import { expect, test } from '@playwright/test';

test('produção pré-renderizada preserva conteúdo e navegação sem JavaScript', async ({ browser, baseURL }) => {
  test.skip(!process.env.TEST_PRODUCTION, 'Requer build pré-renderizado, não servidor de desenvolvimento.');
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Deep\s*Code/);
    await expect(page.locator('#demonstracao')).toContainText(/conceitual/);
    await expect(page.locator('#downloads').getByRole('button')).toBeDisabled();
    await page.locator('a[href="#demonstracao"]').first().click();
    await expect(page).toHaveURL(/#demonstracao$/);
    await expect(page.locator('#demonstracao')).toBeVisible();
  } finally { await context.close(); }
});

test('falha simulada da API WebGL mantém o conteúdo e encerra o loading', async ({ page }) => {
  // Interceptação explícita da API para exercitar a falha de inicialização; não é GPU física.
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...options: unknown[]) {
      if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') return null;
      return Reflect.apply(original, this, [type, ...options]);
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Deep\s*Code/);
  await expect(page.getByRole('status').filter({ hasText: 'O conteúdo continua disponível.' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.locator('#downloads').scrollIntoViewIfNeeded();
  await expect(page.locator('#downloads').getByRole('button')).toBeDisabled();
});

test('toque mobile emulado abre o menu e troca a demonstração sem hover', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/?graphics=off`);
    await page.getByRole('button', { name: 'Abrir menu', exact: true }).tap();
    const menu = page.getByRole('dialog');
    await expect(menu).toBeVisible();
    await menu.locator('a[href="#demonstracao"]').tap();
    await expect(menu).not.toBeVisible();
    const logic = page.getByRole('tab', { name: 'Lógica', exact: true });
    await logic.tap();
    await expect(logic).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('motion.ts');
    await page.locator('#faq summary').first().tap();
    await expect(page.locator('#faq details').first()).toHaveAttribute('open', '');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  } finally { await context.close(); }
});
