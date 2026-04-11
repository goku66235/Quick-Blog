import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    outDir: '../server/public', // ✅ output to backend
    emptyOutDir: true,

    chunkSizeWarningLimit: 1000, // ✅ remove warning

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'] // ✅ better performance
        }
      }
    }
  },

  server: {
    proxy: {
      "/api": "http://localhost:3000" // ✅ dev API fix
    }
  }
})