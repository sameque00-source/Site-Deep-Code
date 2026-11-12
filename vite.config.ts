import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  build: { target: 'es2022', chunkSizeWarningLimit: 650 },
  test: { include: ['src/**/*.test.ts', 'src/**/*.test.tsx'], environment: 'node' },
});
