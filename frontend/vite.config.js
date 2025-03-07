import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensures it's using the correct port
    strictPort: true, // Prevents Vite from changing ports
    host: 'localhost', // Ensures it's accessible via localhost
  },
})
