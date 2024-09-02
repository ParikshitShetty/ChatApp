import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host : '0.0.0.0',
    port : 5173
  },
  resolve: {
    alias: {
      "src": "/src",
			"components": "/components",
			"routes": "/routes",
			"store": "/store",
			"services": "/services",
			"utils": "/utils",
			"common": "/common",
    }
  }
})
