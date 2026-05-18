import { defineConfig, type Plugin } from 'vite'
import { resolve } from 'path'
import fs from 'node:fs'
import path from 'node:path'

const root = resolve(__dirname, '../../packages/core/src')

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}

/** Serve the pre-built Astro docs at /docs/ so the link is always absolute */
function serveDocsPlugin(): Plugin {
  const docsDir = resolve(__dirname, '../docs/dist')
  return {
    name: 'serve-docs',
    configureServer(server) {
      server.middlewares.use('/docs', (req, res, next) => {
        const urlPath = !req.url || req.url === '/' ? '/index.html' : req.url
        const filePath = path.join(docsDir, urlPath)
        try {
          const stat = fs.statSync(filePath)
          if (stat.isFile()) {
            res.setHeader('Content-Type', MIME[path.extname(filePath)] ?? 'application/octet-stream')
            fs.createReadStream(filePath).pipe(res as import('stream').Writable)
            return
          }
          // directory → try index.html
          const idx = path.join(filePath, 'index.html')
          if (fs.existsSync(idx)) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            fs.createReadStream(idx).pipe(res as import('stream').Writable)
            return
          }
        } catch { /* not found */ }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [serveDocsPlugin()],
  resolve: {
    alias: [
      // More-specific paths must come before the bare package name
      { find: '@fyunusa/aura-css/css',     replacement: resolve(root, 'css/index.css') },
      { find: '@fyunusa/aura-css/runtime', replacement: resolve(root, 'runtime/index.ts') },
      // Exact match only — regex prevents this from swallowing subpath imports
      { find: /^@fyunusa/aura-css$/, replacement: resolve(root, 'index.ts') },
    ],
  },
})
