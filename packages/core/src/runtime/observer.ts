import { observeRevealElement } from './reveal'
import { observeTiltElement } from './tilt'

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
        if (node.hasAttribute('tilt'))   observeTiltElement(node)

        // Handle children
        node.querySelectorAll('[reveal]').forEach(observeRevealElement)
        node.querySelectorAll('[tilt]').forEach(observeTiltElement)
      }
    }
  })

  mo.observe(document.body, { childList: true, subtree: true })
  return mo
}
