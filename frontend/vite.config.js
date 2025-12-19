import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isCodespaces = Boolean(process.env.CODESPACE_NAME || process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN);
const forwardedProtoHeaders = isCodespaces ? { 'X-Forwarded-Proto': 'https' } : undefined;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
        secure: false,
        xfwd: true,
        headers: forwardedProtoHeaders,
      },
      '/media': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
        secure: false,
        xfwd: true,
        headers: forwardedProtoHeaders,
      }
    }
  }
})