import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const artifacts = process.env.DEEP_CODE_ARTIFACTS_DIR || join(tmpdir(), 'deep-code-validation');

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  workers: 1,
  fullyParallel: false,
  outputDir: join(artifacts, 'artifacts'),
  reporter: [['list'], ['json', { outputFile: join(artifacts, 'results.json') }]],
  use: {
    baseURL,
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH }
        : existsSync('/usr/bin/chromium') ? { executablePath: '/usr/bin/chromium' } : { channel: 'chrome' }),
      chromiumSandbox: process.platform !== 'linux',
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: process.env.PLAYWRIGHT_SERVER_COMMAND || 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
