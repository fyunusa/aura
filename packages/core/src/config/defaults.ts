import type { AuraConfig } from './types'

/**
 * Default token values — mirrors the CSS custom property values in tokens.css.
 * Used for documentation and as a reference for config type consumers.
 */
export const defaults: Required<NonNullable<AuraConfig['tokens']>> = {
  tone: {
    primary: '#7C6AF7',
    danger:  '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    neutral: '#6b7280',
  },
  surface: {
    glass:   { blur: '14px',  opacity: 0.10, border: 'rgba(255, 255, 255, 0.08)' },
    frosted: { blur: '24px',  opacity: 0.60 },
  },
  density: {
    compact:  '0.375rem 0.625rem',
    default:  '0.75rem 1rem',
    spacious: '1.25rem 2rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1.25rem',
  },
  gap: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2.5rem',
  },
  motion: {
    subtle:     { duration: '150ms', ease: 'ease' },
    expressive: { duration: '280ms', ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    dramatic:   { duration: '500ms', ease: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  },
}
