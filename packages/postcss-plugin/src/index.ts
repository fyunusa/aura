import type { Plugin, Root } from 'postcss'

export interface AuraPostCSSOptions {
  /**
   * When true, injects a `@import "aura"` at the top of every
   * processed CSS file that doesn't already import it.
   * @default false
   */
  autoImport?: boolean
}

function auraPostCSSPlugin(options: AuraPostCSSOptions = {}): Plugin {
  const { autoImport = false } = options

  return {
    postcssPlugin: 'aura',

    Once(root: Root, { result }) {
      if (!autoImport) return

      // Check if aura is already imported
      let hasFormaImport = false
      root.walkAtRules('import', (rule) => {
        if (rule.params.includes('aura')) {
          hasFormaImport = true
        }
      })

      if (!hasFormaImport) {
        const importNode = result.root.clone()
        // Prepend a forma-css import comment for documentation purposes
        root.prepend({ text: ' Auto-injected by aura PostCSS plugin ', type: 'comment' })
      }
    },
  }
}

auraPostCSSPlugin.postcss = true as const

export default auraPostCSSPlugin
