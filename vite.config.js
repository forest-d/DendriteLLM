import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Remove problematic headers that might cause issues
            proxyReq.removeHeader('referer');
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('host');
            
            // Ensure required headers are set
            if (req.headers['x-api-key']) {
              proxyReq.setHeader('x-api-key', req.headers['x-api-key']);
            }
            if (req.headers['anthropic-version']) {
              proxyReq.setHeader('anthropic-version', req.headers['anthropic-version']);
            }
            if (req.headers['content-type']) {
              proxyReq.setHeader('content-type', req.headers['content-type']);
            }
            
            // Set proper host for the target
            proxyReq.setHeader('host', 'api.anthropic.com');
          });
          
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Log response for debugging
            console.log(`Proxy response: ${proxyRes.statusCode} for ${req.url}`);
          });
        }
      }
    }
  }
})
