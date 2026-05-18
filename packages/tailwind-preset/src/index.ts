import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS preset that injects forma design tokens into your Tailwind config.
 * Allows Tailwind utilities to reference the same color, radius, and gap scales
 * as forma attributes — keeping both systems in sync through CSS custom properties.
 *
 * Usage:
 * ```js
 * // tailwind.config.js
 * import auraPreset from 'useaura/tailwind'
 * export default { presets: [auraPreset] }
 * ```
 */
const auraPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        'aura-primary': 'var(--aura-color-primary)',
        'aura-danger':  'var(--aura-color-danger)',
        'aura-success': 'var(--aura-color-success)',
        'aura-warning': 'var(--aura-color-warning)',
        'aura-neutral': 'var(--aura-color-neutral)',
      },
      borderRadius: {
        'aura-sm':   'var(--aura-radius-sm)',
        'aura-md':   'var(--aura-radius-md)',
        'aura-lg':   'var(--aura-radius-lg)',
        'aura-xl':   'var(--aura-radius-xl)',
        'aura-full': 'var(--aura-radius-full)',
      },
      gap: {
        'aura-xs': 'var(--aura-gap-xs)',
        'aura-sm': 'var(--aura-gap-sm)',
        'aura-md': 'var(--aura-gap-md)',
        'aura-lg': 'var(--aura-gap-lg)',
        'aura-xl': 'var(--aura-gap-xl)',
      },
      spacing: {
        'aura-xs': 'var(--aura-gap-xs)',
        'aura-sm': 'var(--aura-gap-sm)',
        'aura-md': 'var(--aura-gap-md)',
        'aura-lg': 'var(--aura-gap-lg)',
        'aura-xl': 'var(--aura-gap-xl)',
      },
      transitionDuration: {
        'aura-subtle':     'var(--aura-motion-subtle-duration)',
        'aura-expressive': 'var(--aura-motion-expressive-duration)',
        'aura-dramatic':   'var(--aura-motion-dramatic-duration)',
      },
      transitionTimingFunction: {
        'aura-subtle':     'var(--aura-motion-subtle-ease)',
        'aura-expressive': 'var(--aura-motion-expressive-ease)',
        'aura-dramatic':   'var(--aura-motion-dramatic-ease)',
      },
    },
  },
}

export default auraPreset
