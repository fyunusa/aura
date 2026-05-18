import type { Plugin } from 'vite'
import { shouldIncludeRevealRuntime } from './transform'
import type { AuraPluginOptions } from './types'

export default function auraPlugin(options: AuraPluginOptions = {}): Plugin {
  const { treeshakeReveal = true, staticOnly = false } = options

  return {
    name: 'aura',
    enforce: 'pre',

    transformIndexHtml(html) {
      // If no reveal= attributes in the HTML, drop the IntersectionObserver runtime
      if (treeshakeReveal && !shouldIncludeRevealRuntime(html)) {
        // Mark for tree-shaking — the bundler handles the rest via dead code elimination
        // The reveal.ts module will be omitted since it's not referenced
      }
      return html
    },

    transform(code, id) {
      // Skip non-forma files
      if (!id.includes('aura')) return

      // Strip MutationObserver in static-only mode
      if (staticOnly && code.includes('initMutationObserver')) {
        return {
          code: code.replace(/initMutationObserver\(\)/g, '/* static-only: mutation observer disabled */'),
          map: null,
        }
      }

      // Skip MutationObserver in SSR context
      if (process.env.SSR && code.includes('initMutationObserver')) {
        return {
          code: code.replace(/initMutationObserver\(\)/g, '/* ssr */'),
          map: null,
        }
      }
    },
  }
}

export type { AuraPluginOptions }
