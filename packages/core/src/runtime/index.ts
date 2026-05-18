import { initReveal } from './reveal'
import { initMutationObserver } from './observer'
import { initTilt } from './tilt'
import { applyConfig } from '../config/resolver'
import type { AuraConfig } from '../config/types'

let initialised = false

export function init(config?: AuraConfig): void {
  if (initialised) return
  initialised = true

  if (config) applyConfig(config)

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initReveal()
      initTilt()
      initMutationObserver()
    })
  } else {
    initReveal()
    initTilt()
    initMutationObserver()
  }
}

// Auto-init when imported without arguments (script tag usage)
// Can be overridden by calling init(config) explicitly before import
if (typeof window !== 'undefined') {
  init()
}
