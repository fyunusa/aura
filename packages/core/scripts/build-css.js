import { bundle } from 'lightningcss'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

mkdirSync(resolve(__dirname, '../dist'), { recursive: true })

const { code } = bundle({
  filename: resolve(__dirname, '../src/css/index.css'),
  minify: true,
  targets: {
    chrome: 95,
    firefox: 95,
    safari: 15,
  },
})

const outPath = resolve(__dirname, '../dist/forma.css')
writeFileSync(outPath, code)
console.log(`✓ forma.css built (${(code.length / 1024).toFixed(1)}kb)`)
