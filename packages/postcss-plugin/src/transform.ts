/**
 * PostCSS transform utilities for forma-css.
 *
 * In v1, forma CSS ships pre-built with attribute selectors.
 * This module provides helpers for any future CSS transforms.
 */

/**
 * Returns true if the CSS source contains forma attribute selector usage.
 */
export function hasFormaSelectors(css: string): boolean {
  return /\[(surface|tone|density|radius|layer|layout|gap|align|justify|motion|float|reveal)/.test(css)
}

/**
 * No-op pass-through. Placeholder for future CSS transforms.
 */
export function transformCSS(css: string): string {
  return css
}
