import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiProxy = {
  target: 'http://127.0.0.1:8000',
  changeOrigin: true,
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': apiProxy,
      '/users': apiProxy,
      '/clubs': apiProxy,
      '/events': apiProxy,
      '/marketplace': apiProxy,
      '/lost-found': apiProxy,
      '/pyqs': apiProxy,
      '/placement-experiences': apiProxy,
      '/resume': apiProxy,
      '/positions': apiProxy,
      '/recruitments': apiProxy,
      '/applications': apiProxy,
      '/memberships': apiProxy,
      '/admin': apiProxy,
      '/uploads': apiProxy,
      '/educations': apiProxy,
      '/experiences': apiProxy,
      '/projects': apiProxy,
      '/skills': apiProxy,
      '/achievements': apiProxy,
      '/certifications': apiProxy,
      '/notifications': apiProxy,
    },
  },
})
