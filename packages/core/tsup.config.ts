import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index:   'src/index.ts',
    runtime: 'src/runtime/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  external: [],
  esbuildOptions(options) {
    options.loader = { ...options.loader, '.css': 'copy' }
  },
})
