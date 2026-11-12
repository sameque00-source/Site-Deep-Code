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
