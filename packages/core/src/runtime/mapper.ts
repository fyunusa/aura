export const AURA_ATTRS = [
  // Core
  'surface',
  'tone',
  'density',
  'radius',
  'layer',
  // Layout
  'layout',
  'gap',
  'align',
  'justify',
  'adaptive',
  'max',
  'wrap',
  'grow',
  'shrink',
  // Motion
  'motion',
  'float',
  'axis',
  'reveal',
  'reveal-delay',
  // Typography
  'text',
  'weight',
  'truncate',
  'balance',
  'text-align',
  // Forms
  'input',
  'field',
  'hint',
  // State
  'state',
  // Elevation
  'elevation',
  // Responsive grid
  'cols',
  'span',
  'sm-cols',
  'md-cols',
  'lg-cols',
  'xl-cols',
  // Visibility
  'hide',
  'show',
  // Scheme
  'scheme',
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
