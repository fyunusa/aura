export const AURA_ATTRS = [
  'surface',
  'tone',
  'density',
  'radius',
  'layer',
  'layout',
  'gap',
  'align',
  'justify',
  'adaptive',
  'max',
  'motion',
  'float',
  'axis',
  'reveal',
  'reveal-delay',
] as const

export type AuraAttr = typeof AURA_ATTRS[number]

/**
 * Returns true if the given attribute name is an aura attribute.
 * Used by runtime and build plugins to identify which attrs to handle.
 */
export function isAuraAttr(attr: string): attr is AuraAttr {
  return (AURA_ATTRS as readonly string[]).includes(attr)
}

/**
 * In runtime mode, we don't transform attributes to classes —
 * the CSS uses attribute selectors directly ([surface="glass"]).
 * The runtime's main job is:
 * 1. Initialise reveal= IntersectionObserver
 * 2. Watch for dynamically added elements (MutationObserver)
 * 3. Apply user token overrides to :root CSS custom properties
 */
