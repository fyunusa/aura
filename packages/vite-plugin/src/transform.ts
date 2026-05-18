/**
 * Given an HTML string, replace forma attributes with equivalent CSS classes.
 *
 * Strategy: attribute selectors in CSS are preserved as-is (they still work).
 * The transform is ADDITIVE — it adds classes matching the attribute values
 * so that build-time class-based purging (e.g. Tailwind) can also pick them up.
 *
 * The transform does NOT remove attributes — this preserves semantic meaning
 * in the DOM and allows progressive enhancement.
 */
export function transformHTML(html: string): string {
  // In v1, no-op — CSS attribute selectors handle everything.
  // The plugin's main value is tree-shaking the runtime from the bundle.
  return html
}

/**
 * Strips the runtime import if no [reveal] attributes are found.
 * Saves ~0.8kb for projects that don't use scroll animations.
 */
export function shouldIncludeRevealRuntime(html: string): boolean {
  return html.includes('reveal=')
}

/**
 * Returns true if any forma attribute is found in the given source string.
 */
export function hasFormaAttributes(source: string): boolean {
  const FORMA_ATTR_RE = /\b(surface|tone|density|radius|layer|layout|gap|align|justify|adaptive|motion|float|reveal)\s*=/
  return FORMA_ATTR_RE.test(source)
}
