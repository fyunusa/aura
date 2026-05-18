import { observeRevealElement } from './reveal'

/**
 * Watches for dynamically inserted forma elements.
 * Needed for SPA navigations, lazy-rendered lists, etc.
 */
export function initMutationObserver(): MutationObserver {
  const mo = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue

        // Handle the node itself
        if (node.hasAttribute('reveal')) observeRevealElement(node)

        // Handle children
        node.querySelectorAll('[reveal]').forEach(observeRevealElement)
      }
    }
  })

  mo.observe(document.body, { childList: true, subtree: true })
  return mo
}
