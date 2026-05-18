import type { AuraConfig } from './types'

/**
 * Applies a AuraConfig by writing CSS custom properties to :root.
 * This is how runtime token overrides work — no JS style computation,
 * just CSS variable injection.
 */
export function applyConfig(config: AuraConfig): void {
  const root = document.documentElement
  const set = (prop: string, val: string) => root.style.setProperty(prop, val)

  const { tokens } = config

  if (!tokens) return

  // Tone colors
  if (tokens.tone) {
    for (const [name, value] of Object.entries(tokens.tone)) {
      if (value) set(`--aura-color-${name}`, value)
    }
  }

  // Surface tokens
  if (tokens.surface?.glass) {
    const g = tokens.surface.glass
    if (g.blur)           set('--aura-glass-blur', g.blur)
    if (g.opacity != null) set('--aura-glass-opacity', String(g.opacity))
    if (g.border)         set('--aura-glass-border', g.border)
  }
  if (tokens.surface?.frosted) {
    const f = tokens.surface.frosted
    if (f.blur)           set('--aura-frosted-blur', f.blur)
    if (f.opacity != null) set('--aura-frosted-opacity', String(f.opacity))
  }

  // Density
  if (tokens.density) {
    const d = tokens.density
    if (d.compact)  set('--aura-density-compact', d.compact)
    if (d.default)  set('--aura-density-default', d.default)
    if (d.spacious) set('--aura-density-spacious', d.spacious)
  }

  // Gap
  if (tokens.gap) {
    for (const [size, value] of Object.entries(tokens.gap)) {
      if (value) set(`--aura-gap-${size}`, value)
    }
  }

  // Radius
  if (tokens.radius) {
    for (const [size, value] of Object.entries(tokens.radius)) {
      if (value) set(`--aura-radius-${size}`, value)
    }
  }

  // Motion
  if (tokens.motion) {
    for (const [scale, val] of Object.entries(tokens.motion)) {
      if (!val) continue
      if (val.duration) set(`--aura-motion-${scale}-duration`, val.duration)
      if (val.ease)     set(`--aura-motion-${scale}-ease`, val.ease)
    }
  }
}
