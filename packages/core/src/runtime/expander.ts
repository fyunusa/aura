/**
 * Compound attribute expander + arbitrary value injector.
 *
 * Enables intuitive shorthand syntax:
 *
 *   <div card="glass primary xl">     → expands to surface/tone/radius attrs
 *   <button btn="danger">             → tone + interactive base, no memorisation
 *   <span chip="success">             → small pill with tone
 *   <button primary>                  → one-word tone shorthand
 *   <div tone="[#ff6b6b]">            → arbitrary CSS var injection
 *   <div radius="[12px]">             → arbitrary inline style
 *   <div p="[2rem_1rem]" bg="[#111]"> → spacing + bg without tokens
 *
 * Tokens are classified by their vocabulary, so the user never needs to know
 * which attribute a value belongs to — they just pass the words they mean.
 */

const SURFACES   = new Set(['glass', 'solid', 'matte', 'ghost', 'frosted', 'neon'])
const TONES      = new Set(['primary', 'danger', 'success', 'warning', 'neutral', 'info', 'accent'])
const DENSITIES  = new Set(['compact', 'spacious', 'default'])
const RADII      = new Set(['none', 'sm', 'md', 'lg', 'xl', 'full'])
const ELEVATIONS = new Set(['low','mid','high'])
const LAYOUTS    = new Set(['row','stack','grid','cluster','cover','sidebar','masonry'])

/** Human-friendly radius aliases so you never have to remember scale names */
const RADIUS_ALIASES: Record<string, string> = {
  sharp:   'none',
  rounded: 'lg',
  pill:    'full',
  circle:  'full',
}

/** Classify a single token → [attrName, attrValue] or null if unknown */
function classify(token: string): [string, string] | null {
  if (SURFACES.has(token))          return ['surface',   token]
  if (TONES.has(token))             return ['tone',      token]
  if (DENSITIES.has(token))         return ['density',   token]
  if (RADII.has(token))             return ['radius',    token]
  if (ELEVATIONS.has(token))        return ['elevation', token]
  if (LAYOUTS.has(token))           return ['layout',    token]
  if (token in RADIUS_ALIASES)      return ['radius',    RADIUS_ALIASES[token]]
  return null
}

/** Apply classified tokens to element, never overriding attrs already set */
function applyTokens(el: Element, tokens: string[]): void {
  for (const token of tokens) {
    const pair = classify(token)
    if (pair && !el.hasAttribute(pair[0])) el.setAttribute(pair[0], pair[1])
  }
}

/**
 * Compound attrs and the token defaults applied when used bare (no value).
 * e.g. <div card>  — CSS handles bare glass surface, JS just sets density/radius defaults.
 *      <button btn> — JS sets compact + full-radius defaults.
 */
const COMPOUND: Record<string, string[]> = {
  aura:    [],                    // universal token bag — expand ALL recognized tokens
  card:    [],                    // CSS handles bare [card] glass defaults
  btn:     ['compact', 'full'],   // bare <button btn> → compact density, full radius
  chip:    ['compact', 'full'],
  tag:     ['compact', 'full'],
  hero:    [],                    // purely CSS
  section: [],                    // purely CSS
}

/** Tone-only boolean attrs that trigger interactive element expansion */
const TONE_ATTRS = new Set(['primary', 'danger', 'success', 'warning', 'neutral', 'info', 'accent'])

/**
 * Arbitrary [value] handlers.
 * Fires when an attr value matches [anything] — injects inline style/CSS var.
 *
 *   tone="[#ff6b6b]"    → --aura-tone-color: #ff6b6b
 *   radius="[12px]"     → border-radius: 12px
 *   p="[1rem_2rem]"     → padding: 1rem 2rem   (underscores → spaces)
 *   bg="[#1a1a2e]"      → background: #1a1a2e
 */
function u(v: string) { return v.replace(/_/g, ' ') }

const ARBITRARY: Record<string, (v: string, el: HTMLElement) => void> = {
  tone:    (v, el) => el.style.setProperty('--aura-tone-color', u(v)),
  radius:  (v, el) => el.style.setProperty('border-radius', u(v)),
  gap:     (v, el) => el.style.setProperty('gap', u(v)),
  'gap-x': (v, el) => el.style.setProperty('column-gap', u(v)),
  'gap-y': (v, el) => el.style.setProperty('row-gap', u(v)),
  bg:      (v, el) => el.style.setProperty('background', u(v)),
  p:       (v, el) => el.style.setProperty('padding', u(v)),
  px:      (v, el) => { el.style.setProperty('padding-left', u(v)); el.style.setProperty('padding-right', u(v)) },
  py:      (v, el) => { el.style.setProperty('padding-top', u(v)); el.style.setProperty('padding-bottom', u(v)) },
  pt:      (v, el) => el.style.setProperty('padding-top', u(v)),
  pb:      (v, el) => el.style.setProperty('padding-bottom', u(v)),
  m:       (v, el) => el.style.setProperty('margin', u(v)),
  mx:      (v, el) => { el.style.setProperty('margin-left', u(v)); el.style.setProperty('margin-right', u(v)) },
  my:      (v, el) => { el.style.setProperty('margin-top', u(v)); el.style.setProperty('margin-bottom', u(v)) },
  w:       (v, el) => el.style.setProperty('width', u(v)),
  h:       (v, el) => el.style.setProperty('height', u(v)),
  'min-w': (v, el) => el.style.setProperty('min-width', u(v)),
  'min-h': (v, el) => el.style.setProperty('min-height', u(v)),
  'max-w': (v, el) => el.style.setProperty('max-width', u(v)),
  'max-h': (v, el) => el.style.setProperty('max-height', u(v)),
  text:    (v, el) => el.style.setProperty('font-size', u(v)),
  opacity: (v, el) => el.style.setProperty('opacity', u(v)),
  shadow:  (v, el) => el.style.setProperty('box-shadow', u(v)),
  z:       (v, el) => el.style.setProperty('z-index', u(v)),
}

/** Extract the inner value from [value] notation, or null if not arbitrary */
function extractArbitrary(val: string): string | null {
  const m = val.match(/^\[(.+)\]$/)
  return m ? m[1] : null
}

/** Expand a single element — idempotent, safe to call multiple times */
export function expandElement(el: Element): void {
  if (!(el instanceof HTMLElement)) return

  // 1. Compound attrs: card=, btn=, chip=, tag=, hero, section
  for (const [attr, defaults] of Object.entries(COMPOUND)) {
    if (!el.hasAttribute(attr)) continue
    const raw = (el.getAttribute(attr) ?? '').trim()
    applyTokens(el, raw ? raw.split(/\s+/) : defaults)
  }

  // 2. Tone shorthand boolean attrs: <button primary>, <a danger>, etc.
  for (const tone of TONE_ATTRS) {
    if (!el.hasAttribute(tone)) continue
    if (!el.hasAttribute('tone')) el.setAttribute('tone', tone)
    // On interactive elements, fill in sensible button defaults
    const tag = el.tagName.toLowerCase()
    const role = el.getAttribute('role')
    if (tag === 'button' || tag === 'a' || role === 'button') {
      if (!el.hasAttribute('density')) el.setAttribute('density', 'compact')
      if (!el.hasAttribute('radius'))  el.setAttribute('radius',  'full')
    }
  }

  // 3. Arbitrary [value] injection for any supported attr
  for (const [attr, handler] of Object.entries(ARBITRARY)) {
    if (!el.hasAttribute(attr)) continue
    const arb = extractArbitrary(el.getAttribute(attr)!)
    if (arb) handler(arb, el)
  }
}

/** CSS selector to find elements that may need expansion */
export const EXPAND_SELECTOR = [
  ...Object.keys(COMPOUND).map(a => `[${a}]`),
  ...Array.from(TONE_ATTRS).map(t => `[${t}]`),
  ...Object.keys(ARBITRARY).map(a => `[${a}*="["]`),
].join(',')

/** Expand all matching elements under a root node */
export function expandAll(root: Element | Document = document): void {
  root.querySelectorAll(EXPAND_SELECTOR).forEach(expandElement)
}
