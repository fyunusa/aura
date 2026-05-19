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
  // v0.3.0 — advanced features
  'fluid',
  'tooltip',
  'tooltip-pos',
  'cq',
  // v0.4.0 — utilities
  'aspect',
  'overflow',
  'cursor',
  'select',
  'pointer',
  'opacity',
  'object',
  'place',
  'size',
  'w',
  'h',
  'pos',
  'inset',
  'z',
  'columns',
  'column-gap',
  'writing',
  'list',
  'resize',
  'blend',
  'isolate',
  // v0.4.0 — visual effects
  'gradient',
  'gradient-dir',
  'text-gradient',
  'glow',
  'ring',
  'shadow',
  'text-glow',
  'pattern',
  // v0.4.0 — animations
  'animate',
  'animate-delay',
  'animate-duration',
  'animate-once',
  'animate-twice',
  'animate-fill',
  'animate-pause',
  // v0.4.0 — masks + clip + filter
  'mask',
  'clip',
  'filter',
  'filter-hover-clear',
  'backdrop',
  // v0.4.0 — layout extras
  'divide',
  'divide-width',
  'divide-style',
  'divide-opacity',
  'divide-gap',
  // v0.4.0 — scroll snap
  'scroll',
  'scroll-pad',
  'snap',
  'snap-proximity',
  'overscroll',
  'scrollbar',
  // v0.4.0 — badge
  'badge',
  'badge-size',
  'badge-shape',
  // v0.4.0 — text effects
  'text-shadow',
  'text-stroke',
  'text-hollow',
  'underline',
  'highlight',
  'indent',
  'tracking',
  'leading',
  // v0.4.0 — tilt + shimmer
  'tilt',
  'tilt-scale',
  'tilt-css',
  'tilt-shine',
  'shimmer',
  'skeleton',
  // v0.5.0 — layout extras
  'gap-x',
  'gap-y',
  // v0.5.0 — components
  'progress',
  'progress-size',
  'striped',
  'indeterminate',
  'switch',
  'switch-size',
  'accordion',
  'accordion-style',
  'alert',
  'alert-size',
  'alert-icon',
  'alert-title',
  'alert-body',
  'alert-dismiss',
  'tabs',
  'tabs-style',
  'tabs-dir',
  'tab-list',
  'tab',
  'tab-panel',
  'stepper',
  'stepper-dir',
  'stepper-size',
  'step',
  'step-state',
  'step-label',
  'done',
  'rating',
  'rating-size',
  'star',
  'filled',
  'half',
  'interactive',
  'kbd',
  'kbd-size',
  'kbd-style',
  // v0.5.0 — theming
  'theme',
  'selection',
  'caret',
  'placeholder',
  // v0.6.0 — presets & compound shorthand
  'aura',
  'card',
  'btn',
  'chip',
  'tag',
  'hero',
  'section',
  // v0.6.0 — tone shorthand attrs
  'primary',
  'danger',
  'success',
  'warning',
  'neutral',
  'info',
  'accent',
  // v0.6.0 — arbitrary-capable spacing/layout attrs
  'bg',
  'p',
  'px',
  'py',
  'pt',
  'pb',
  'm',
  'mx',
  'my',
  'min-w',
  'min-h',
  'max-w',
  'max-h',
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
