import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 로 두면 GitHub Pages 같은 하위 경로에도 그대로 올릴 수 있어요.
export default defineConfig({
  base: './',
  plugins: [react()],
});
