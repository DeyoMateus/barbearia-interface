import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // 🌟 Força o uso do IPv4 puro
    hmr: {
      host: '127.0.0.1', // Garante que o WebSocket mude junto
    },
  },
})