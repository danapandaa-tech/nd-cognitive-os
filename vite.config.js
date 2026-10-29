import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'

// Vite plugin to proxy Token Factory requests with API key
function tokenFactoryProxy(env) {
  return {
    name: 'tokenfactory-proxy',
    configureServer(server) {
      server.middlewares.use('/api/tokenfactory', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }
        let body = ''
        req.on('data', chunk => body += chunk)
        req.on('end', async () => {
          try {
            const response = await fetch(`https://api.tokenfactory.nebius.com/v1${req.url}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.TOKEN_FACTORY_KEY}`
              },
              body
            })
            const data = await response.text()
            res.statusCode = response.status
            res.setHeader('Content-Type', 'application/json')
            res.end(data)
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tokenFactoryProxy(env)],
    server: {
      port: 3001,
      strictPort: true,
      open: false,
    },
    test: {
      environment: 'node',
      setupFiles: ['src/test/setup.js'],
      exclude: ['**/node_modules/**', 'creator-os-pilot/**', '.scratch/**'],
    }
  }
})
