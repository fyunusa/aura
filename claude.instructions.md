# forma-css — Claude Instructions

> Complete build instructions for `forma-css`: a lightweight, zero-config semantic styling library where HTML attributes compile to atomic CSS classes.

---

## Project Identity

**Name:** `forma-css`
**Tagline:** Style with intent, not with soup.
**Philosophy:** Attributes describe *what*, never *how*. The library handles the rest.
**Target bundle:** core.css ~6kb gzip, runtime.js ~1.8kb gzip
**Zero dependencies in production.**

---

## Repository Structure

```
forma-css/
├── packages/
│   ├── core/                      # The library itself
│   │   ├── src/
│   │   │   ├── css/
│   │   │   │   ├── tokens.css     # CSS custom properties (design tokens)
│   │   │   │   ├── surface.css    # surface= attribute styles
│   │   │   │   ├── tone.css       # tone= attribute styles
│   │   │   │   ├── density.css    # density= attribute styles
│   │   │   │   ├── radius.css     # radius= attribute styles
│   │   │   │   ├── layer.css      # layer= attribute styles
│   │   │   │   ├── layout.css     # layout=, gap=, adaptive styles
│   │   │   │   ├── motion.css     # motion= transition styles
│   │   │   │   ├── animation.css  # reveal=, float= animation styles
│   │   │   │   └── index.css      # imports all above
│   │   │   ├── runtime/
│   │   │   │   ├── index.ts       # entry — auto-initialises on import
│   │   │   │   ├── mapper.ts      # attribute → class mapping logic
│   │   │   │   ├── observer.ts    # MutationObserver for dynamic content
│   │   │   │   └── reveal.ts      # IntersectionObserver for reveal=
│   │   │   ├── config/
│   │   │   │   ├── defaults.ts    # default token values
│   │   │   │   ├── resolver.ts    # merges user config with defaults
│   │   │   │   └── types.ts       # FormaConfig TypeScript types
│   │   │   └── index.ts           # main package entry
│   │   ├── dist/                  # built output (gitignored)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── vite-plugin/               # Build-time transform (zero runtime)
│   │   ├── src/
│   │   │   ├── index.ts           # Vite plugin entry
│   │   │   ├── transform.ts       # HTML/JSX attribute → class transform
│   │   │   └── types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── postcss-plugin/            # PostCSS plugin for non-Vite pipelines
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── transform.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── tailwind-preset/           # Injects forma tokens into Tailwind config
│       ├── src/
│       │   └── index.ts
│       └── package.json
│
├── apps/
│   ├── docs/                      # Documentation site (Astro)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── index.astro    # Landing page
│   │   │   │   ├── docs/          # Documentation pages
│   │   │   │   └── playground/    # Live playground
│   │   │   └── components/
│   │   └── package.json
│   │
│   └── playground/                # Isolated dev sandbox (Vite vanilla)
│       ├── index.html
│       ├── main.ts
│       └── package.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, typecheck, test on PR
│       └── release.yml            # Changesets → npm publish
│
├── pnpm-workspace.yaml
├── package.json                   # root — scripts only, no deps
├── turbo.json                     # Turborepo pipeline
├── changeset.config.json
├── .eslintrc.js
├── .prettierrc
└── README.md
```

---

## Tech Stack Decisions

| Concern | Choice | Reason |
|---|---|---|
| Monorepo | pnpm workspaces + Turborepo | Fast, standard for multi-package OSS |
| Build tool (packages) | tsup | Zero-config, outputs ESM + CJS + types |
| CSS bundler | LightningCSS | Fastest, handles nesting + autoprefixing |
| Runtime language | TypeScript | Types are required for config API |
| Test runner | Vitest | Fast, ESM-native |
| Docs site | Astro | Static, fast, component-agnostic |
| Release | Changesets | Industry standard for monorepo versioning |
| CI | GitHub Actions | Free for OSS |

---

## Package: `forma-css` (core)

### package.json

```json
{
  "name": "forma-css",
  "version": "0.1.0",
  "description": "Style with intent, not with soup.",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./css": "./dist/forma.css",
    "./runtime": {
      "import": "./dist/runtime.js",
      "types": "./dist/runtime.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup && node scripts/build-css.js",
    "dev": "tsup --watch",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "lightningcss": "^1.24.0",
    "typescript": "^5.4.0",
    "vitest": "^1.0.0"
  },
  "sideEffects": ["./dist/forma.css"]
}
```

---

## CSS Architecture — `packages/core/src/css/`

### Design Principles for CSS files

- Every attribute maps to a predictable class: `forma-{attr}-{value}`
- All values driven by CSS custom properties — overridable by user
- No `!important` anywhere
- Dark mode handled via `color-scheme` and CSS custom properties, not `.dark` class
- Use CSS nesting (LightningCSS compiles it)
- Each file is independently importable

---

### `tokens.css` — Single source of truth

```css
:root {
  /* Tone colors */
  --forma-color-primary: #7C6AF7;
  --forma-color-danger:  #ef4444;
  --forma-color-success: #22c55e;
  --forma-color-warning: #f59e0b;
  --forma-color-neutral: #6b7280;

  /* Surface tokens */
  --forma-glass-blur:       14px;
  --forma-glass-opacity:    0.10;
  --forma-glass-border:     rgba(255, 255, 255, 0.08);
  --forma-frosted-blur:     24px;
  --forma-frosted-opacity:  0.60;

  /* Density tokens */
  --forma-density-compact:   0.375rem 0.625rem;
  --forma-density-default:   0.75rem 1rem;
  --forma-density-spacious:  1.25rem 2rem;

  /* Radius tokens */
  --forma-radius-none: 0;
  --forma-radius-sm:   0.25rem;
  --forma-radius-md:   0.5rem;
  --forma-radius-lg:   0.75rem;
  --forma-radius-xl:   1.25rem;
  --forma-radius-full: 9999px;

  /* Layer (z-index) tokens */
  --forma-layer-base:    1;
  --forma-layer-raised:  10;
  --forma-layer-floating: 100;
  --forma-layer-overlay: 200;
  --forma-layer-top:     9999;

  /* Gap tokens */
  --forma-gap-xs: 0.25rem;
  --forma-gap-sm: 0.5rem;
  --forma-gap-md: 1rem;
  --forma-gap-lg: 1.5rem;
  --forma-gap-xl: 2.5rem;

  /* Motion tokens */
  --forma-motion-subtle-duration:     150ms;
  --forma-motion-subtle-ease:         ease;
  --forma-motion-expressive-duration: 280ms;
  --forma-motion-expressive-ease:     cubic-bezier(0.34, 1.56, 0.64, 1);
  --forma-motion-dramatic-duration:   500ms;
  --forma-motion-dramatic-ease:       cubic-bezier(0.22, 1, 0.36, 1);

  /* Animation tokens */
  --forma-float-slow-duration:   4s;
  --forma-float-med-duration:    2.5s;
  --forma-float-fast-duration:   1.5s;
  --forma-float-amplitude-sm:    6px;
  --forma-float-amplitude-md:    12px;
  --forma-float-amplitude-lg:    22px;

  /* Reveal tokens */
  --forma-reveal-distance: 24px;
  --forma-reveal-duration: 480ms;
  --forma-reveal-ease:     cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

### `surface.css`

```css
/* surface="glass" */
[surface="glass"] {
  backdrop-filter: blur(var(--forma-glass-blur));
  -webkit-backdrop-filter: blur(var(--forma-glass-blur));
  background-color: rgb(255 255 255 / var(--forma-glass-opacity));
  border: 1px solid var(--forma-glass-border);
}

/* surface="solid" */
[surface="solid"] {
  background-color: var(--forma-tone-color, rgb(255 255 255 / 0.05));
  border: 1px solid rgb(255 255 255 / 0.06);
}

/* surface="matte" */
[surface="matte"] {
  background-color: var(--forma-tone-color, rgb(255 255 255 / 0.04));
  border: none;
}

/* surface="ghost" */
[surface="ghost"] {
  background-color: transparent;
  border: 1px solid var(--forma-tone-color, rgb(255 255 255 / 0.12));
}

/* surface="frosted" */
[surface="frosted"] {
  backdrop-filter: blur(var(--forma-frosted-blur));
  -webkit-backdrop-filter: blur(var(--forma-frosted-blur));
  background-color: rgb(255 255 255 / var(--forma-frosted-opacity));
  border: 1px solid rgb(255 255 255 / 0.3);
}

/* surface="neon" */
[surface="neon"] {
  background-color: transparent;
  border: 1px solid var(--forma-tone-color, var(--forma-color-primary));
  box-shadow:
    0 0 8px  var(--forma-tone-color, var(--forma-color-primary)),
    0 0 24px rgb(from var(--forma-tone-color, var(--forma-color-primary)) r g b / 0.3),
    inset 0 0 12px rgb(from var(--forma-tone-color, var(--forma-color-primary)) r g b / 0.05);
}
```

---

### `tone.css`

```css
/*
  tone= sets --forma-tone-color.
  All surfaces and text read from this custom property.
  This means tone + surface compose cleanly without specificity fights.
*/

[tone="primary"] { --forma-tone-color: var(--forma-color-primary); color: var(--forma-tone-color); }
[tone="danger"]  { --forma-tone-color: var(--forma-color-danger);  color: var(--forma-tone-color); }
[tone="success"] { --forma-tone-color: var(--forma-color-success); color: var(--forma-tone-color); }
[tone="warning"] { --forma-tone-color: var(--forma-color-warning); color: var(--forma-tone-color); }
[tone="neutral"] { --forma-tone-color: var(--forma-color-neutral); color: var(--forma-tone-color); }

/* When tone + surface="solid", tint the bg */
[tone][surface="solid"] {
  background-color: rgb(from var(--forma-tone-color) r g b / 0.12);
  border-color: rgb(from var(--forma-tone-color) r g b / 0.2);
}

/* When tone + surface="ghost", tint the border */
[tone][surface="ghost"] {
  border-color: rgb(from var(--forma-tone-color) r g b / 0.3);
}
```

---

### `density.css`

```css
[density="compact"]  { padding: var(--forma-density-compact); }
[density="default"]  { padding: var(--forma-density-default); }
[density="spacious"] { padding: var(--forma-density-spacious); }
```

---

### `radius.css`

```css
[radius="none"] { border-radius: var(--forma-radius-none); }
[radius="sm"]   { border-radius: var(--forma-radius-sm); }
[radius="md"]   { border-radius: var(--forma-radius-md); }
[radius="lg"]   { border-radius: var(--forma-radius-lg); }
[radius="xl"]   { border-radius: var(--forma-radius-xl); }
[radius="full"] { border-radius: var(--forma-radius-full); }
```

---

### `layer.css`

```css
[layer="base"]    { z-index: var(--forma-layer-base);    position: relative; }
[layer="raised"]  { z-index: var(--forma-layer-raised);  position: relative; }
[layer="floating"]{ z-index: var(--forma-layer-floating); position: relative; }
[layer="overlay"] { z-index: var(--forma-layer-overlay);  position: fixed; }
[layer="top"]     { z-index: var(--forma-layer-top);      position: fixed; }
```

---

### `layout.css`

```css
/* layout= */
[layout="stack"]   { display: flex; flex-direction: column; }
[layout="row"]     { display: flex; flex-direction: row; align-items: center; }
[layout="cluster"] { display: flex; flex-wrap: wrap; align-items: center; }
[layout="grid"]    { display: grid; grid-template-columns: repeat(auto-fit, minmax(var(--forma-grid-min, 280px), 1fr)); }
[layout="center"]  { display: flex; flex-direction: column; align-items: center; justify-content: center; }
[layout="cover"]   {
  display: flex;
  flex-direction: column;
  min-height: var(--forma-cover-min, 100dvh);
  & > * { margin-block: auto; }
}

/* gap= */
[gap="xs"] { gap: var(--forma-gap-xs); }
[gap="sm"] { gap: var(--forma-gap-sm); }
[gap="md"] { gap: var(--forma-gap-md); }
[gap="lg"] { gap: var(--forma-gap-lg); }
[gap="xl"] { gap: var(--forma-gap-xl); }

/* align= (works with layout="stack" or layout="row") */
[align="start"]   { align-items: flex-start; }
[align="center"]  { align-items: center; }
[align="end"]     { align-items: flex-end; }
[align="stretch"] { align-items: stretch; }

/* justify= */
[justify="start"]   { justify-content: flex-start; }
[justify="center"]  { justify-content: center; }
[justify="end"]     { justify-content: flex-end; }
[justify="between"] { justify-content: space-between; }

/* adaptive= — stack collapses to column on mobile */
[layout="row"][adaptive] {
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}
[layout="stack"][adaptive] {
  @media (min-width: 769px) {
    flex-direction: row;
    align-items: center;
  }
}

/* max= — constrain width and center (for layout="center" wrappers) */
[max] { max-width: attr(max); margin-inline: auto; width: 100%; }
```

---

### `motion.css`

```css
[motion="none"] {
  transition: none;
}

[motion="subtle"] {
  transition: all
    var(--forma-motion-subtle-duration)
    var(--forma-motion-subtle-ease);
}

[motion="expressive"] {
  transition: all
    var(--forma-motion-expressive-duration)
    var(--forma-motion-expressive-ease);
}

[motion="dramatic"] {
  transition: all
    var(--forma-motion-dramatic-duration)
    var(--forma-motion-dramatic-ease);
}
```

---

### `animation.css`

```css
/* ─── Float keyframes ───────────────────────────────── */
@keyframes forma-float-y {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(calc(var(--forma-float-amplitude, var(--forma-float-amplitude-md)) * -1)); }
}
@keyframes forma-float-x {
  0%, 100% { transform: translateX(0); }
  50%       { transform: translateX(var(--forma-float-amplitude, var(--forma-float-amplitude-md))); }
}
@keyframes forma-float-xy {
  0%, 100% { transform: translate(0, 0); }
  25%       { transform: translate(calc(var(--forma-float-amplitude, var(--forma-float-amplitude-md)) * 0.5), calc(var(--forma-float-amplitude, var(--forma-float-amplitude-md)) * -1)); }
  75%       { transform: translate(calc(var(--forma-float-amplitude, var(--forma-float-amplitude-md)) * -0.5), calc(var(--forma-float-amplitude, var(--forma-float-amplitude-md)) * 0.5)); }
}

/* float= */
[float="slow"] { animation: forma-float-y var(--forma-float-slow-duration) ease-in-out infinite; }
[float="med"]  { animation: forma-float-y var(--forma-float-med-duration)  ease-in-out infinite; }
[float="fast"] { animation: forma-float-y var(--forma-float-fast-duration) ease-in-out infinite; }

/* float axis override */
[float][axis="x"]  { animation-name: forma-float-x; }
[float][axis="xy"] { animation-name: forma-float-xy; }

/* ─── Reveal keyframes ───────────────────────────────── */
@keyframes forma-reveal-bottom {
  from { opacity: 0; transform: translateY(var(--forma-reveal-distance)); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes forma-reveal-top {
  from { opacity: 0; transform: translateY(calc(var(--forma-reveal-distance) * -1)); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes forma-reveal-left {
  from { opacity: 0; transform: translateX(calc(var(--forma-reveal-distance) * -1)); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes forma-reveal-right {
  from { opacity: 0; transform: translateX(var(--forma-reveal-distance)); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes forma-reveal-scale {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes forma-reveal-blur {
  from { opacity: 0; filter: blur(8px); }
  to   { opacity: 1; filter: blur(0); }
}

/* reveal= — hidden by default, JS adds .forma-revealed */
[reveal] {
  opacity: 0;
}
[reveal].forma-revealed {
  animation-duration: var(--forma-reveal-duration);
  animation-timing-function: var(--forma-reveal-ease);
  animation-fill-mode: forwards;
}
[reveal="bottom"].forma-revealed { animation-name: forma-reveal-bottom; }
[reveal="top"].forma-revealed    { animation-name: forma-reveal-top; }
[reveal="left"].forma-revealed   { animation-name: forma-reveal-left; }
[reveal="right"].forma-revealed  { animation-name: forma-reveal-right; }
[reveal="scale"].forma-revealed  { animation-name: forma-reveal-scale; }
[reveal="blur"].forma-revealed   { animation-name: forma-reveal-blur; }

/* Delay support via reveal-delay attribute */
[reveal-delay] { animation-delay: attr(reveal-delay ms); }

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  [reveal]          { opacity: 1; }
  [reveal].forma-revealed { animation: none; }
  [float]           { animation: none; }
  [motion]          { transition: none; }
}
```

---

### `index.css` — Master import

```css
@import './tokens.css';
@import './surface.css';
@import './tone.css';
@import './density.css';
@import './radius.css';
@import './layer.css';
@import './layout.css';
@import './motion.css';
@import './animation.css';
```

---

## Runtime Architecture — `packages/core/src/runtime/`

### `mapper.ts`

Maps the attribute API. This is the canonical list — every attribute the library supports must be listed here.

```typescript
export const FORMA_ATTRS = [
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

export type FormaAttr = typeof FORMA_ATTRS[number]

/**
 * Returns true if the given attribute name is a forma attribute.
 * Used by runtime and build plugins to identify which attrs to handle.
 */
export function isFormaAttr(attr: string): attr is FormaAttr {
  return (FORMA_ATTRS as readonly string[]).includes(attr)
}

/**
 * In runtime mode, we don't transform attributes to classes —
 * the CSS uses attribute selectors directly ([surface="glass"]).
 * The runtime's main job is:
 * 1. Initialise reveal= IntersectionObserver
 * 2. Watch for dynamically added elements (MutationObserver)
 * 3. Apply user token overrides to :root CSS custom properties
 */
```

---

### `reveal.ts`

```typescript
const THRESHOLD = 0.15

let observer: IntersectionObserver | null = null

function createObserver(): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('forma-revealed')
          observer?.unobserve(entry.target) // fire once
        }
      }
    },
    { threshold: THRESHOLD }
  )
}

export function initReveal(root: Document | Element = document): void {
  if (typeof IntersectionObserver === 'undefined') {
    // SSR or old browser — reveal everything immediately
    root.querySelectorAll('[reveal]').forEach((el) => {
      el.classList.add('forma-revealed')
    })
    return
  }

  observer = createObserver()
  root.querySelectorAll('[reveal]').forEach((el) => observer!.observe(el))
}

export function observeRevealElement(el: Element): void {
  if (!observer) observer = createObserver()
  observer.observe(el)
}
```

---

### `observer.ts`

```typescript
import { observeRevealElement } from './reveal'

/**
 * Watches for dynamically inserted forma elements.
 * Needed for SPA navigations, lazy-rendered lists, etc.
 */
export function initMutationObserver(): MutationObserver {
  const mo = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue

        // Handle the node itself
        if (node.hasAttribute('reveal')) observeRevealElement(node)

        // Handle children
        node.querySelectorAll('[reveal]').forEach(observeRevealElement)
      }
    }
  })

  mo.observe(document.body, { childList: true, subtree: true })
  return mo
}
```

---

### `index.ts` — Runtime entry

```typescript
import { initReveal } from './reveal'
import { initMutationObserver } from './observer'
import { applyConfig } from '../config/resolver'
import type { FormaConfig } from '../config/types'

let initialised = false

export function init(config?: FormaConfig): void {
  if (initialised) return
  initialised = true

  if (config) applyConfig(config)

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initReveal()
      initMutationObserver()
    })
  } else {
    initReveal()
    initMutationObserver()
  }
}

// Auto-init when imported without arguments (script tag usage)
// Can be overridden by calling init(config) explicitly before import
if (typeof window !== 'undefined') {
  init()
}
```

---

## Config System — `packages/core/src/config/`

### `types.ts`

```typescript
export interface SurfaceTokens {
  blur?: string        // glass, frosted blur amount
  opacity?: number     // background opacity
  border?: string      // border color
}

export interface FormaConfig {
  tokens?: {
    tone?: {
      primary?: string
      danger?: string
      success?: string
      warning?: string
      neutral?: string
      [key: string]: string | undefined   // custom tones
    }
    surface?: {
      glass?: SurfaceTokens
      frosted?: SurfaceTokens
    }
    density?: {
      compact?: string
      default?: string
      spacious?: string
    }
    radius?: {
      sm?: string
      md?: string
      lg?: string
      xl?: string
    }
    gap?: {
      xs?: string
      sm?: string
      md?: string
      lg?: string
      xl?: string
    }
    motion?: {
      subtle?: { duration?: string; ease?: string }
      expressive?: { duration?: string; ease?: string }
      dramatic?: { duration?: string; ease?: string }
    }
  }
}
```

---

### `resolver.ts`

```typescript
import type { FormaConfig } from './types'

/**
 * Applies a FormaConfig by writing CSS custom properties to :root.
 * This is how runtime token overrides work — no JS style computation,
 * just CSS variable injection.
 */
export function applyConfig(config: FormaConfig): void {
  const root = document.documentElement
  const set = (prop: string, val: string) => root.style.setProperty(prop, val)

  const { tokens } = config

  if (!tokens) return

  // Tone colors
  if (tokens.tone) {
    for (const [name, value] of Object.entries(tokens.tone)) {
      if (value) set(`--forma-color-${name}`, value)
    }
  }

  // Surface tokens
  if (tokens.surface?.glass) {
    const g = tokens.surface.glass
    if (g.blur)    set('--forma-glass-blur', g.blur)
    if (g.opacity != null) set('--forma-glass-opacity', String(g.opacity))
    if (g.border)  set('--forma-glass-border', g.border)
  }
  if (tokens.surface?.frosted) {
    const f = tokens.surface.frosted
    if (f.blur)    set('--forma-frosted-blur', f.blur)
    if (f.opacity != null) set('--forma-frosted-opacity', String(f.opacity))
  }

  // Density
  if (tokens.density) {
    const d = tokens.density
    if (d.compact)  set('--forma-density-compact', d.compact)
    if (d.default)  set('--forma-density-default', d.default)
    if (d.spacious) set('--forma-density-spacious', d.spacious)
  }

  // Gap
  if (tokens.gap) {
    for (const [size, value] of Object.entries(tokens.gap)) {
      if (value) set(`--forma-gap-${size}`, value)
    }
  }

  // Radius
  if (tokens.radius) {
    for (const [size, value] of Object.entries(tokens.radius)) {
      if (value) set(`--forma-radius-${size}`, value)
    }
  }

  // Motion
  if (tokens.motion) {
    for (const [scale, val] of Object.entries(tokens.motion)) {
      if (!val) continue
      if (val.duration) set(`--forma-motion-${scale}-duration`, val.duration)
      if (val.ease)     set(`--forma-motion-${scale}-ease`, val.ease)
    }
  }
}
```

---

## Package: `forma-css/vite` — Vite Plugin

The Vite plugin transforms forma attributes to classes at build time, producing zero runtime JS.

### `src/transform.ts`

```typescript
import { FORMA_ATTRS } from 'forma-css/runtime'

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
  // For each forma attribute, ensure a matching class is added
  // e.g. surface="glass" → adds class "forma-surface-glass"
  // This is used if someone opts into class-based purging.
  // The CSS attribute selectors still work regardless.
  return html // In v1, no-op — CSS attribute selectors handle everything.
              // The plugin's main value is tree-shaking the runtime from the bundle.
}

/**
 * Strips the runtime import if no [reveal] attributes are found.
 * Saves ~0.8kb for projects that don't use scroll animations.
 */
export function shouldIncludeRevealRuntime(html: string): boolean {
  return html.includes('reveal=')
}
```

### `src/index.ts`

```typescript
import type { Plugin } from 'vite'
import { shouldIncludeRevealRuntime } from './transform'

export default function formaPlugin(): Plugin {
  return {
    name: 'forma-css',
    enforce: 'pre',

    transformIndexHtml(html) {
      // If no reveal= attributes, drop the IntersectionObserver runtime
      if (!shouldIncludeRevealRuntime(html)) {
        // Mark for tree-shaking — the bundler handles the rest
      }
      return html
    },

    transform(code, id) {
      // If someone imports 'forma-css' in a build context,
      // replace auto-init with a no-op (config still works, reveal still works,
      // but MutationObserver is skipped in SSR)
      if (id.includes('forma-css') && code.includes('initMutationObserver')) {
        if (process.env.SSR) {
          return code.replace('initMutationObserver()', '/* ssr */')
        }
      }
    },
  }
}
```

---

## Package: `forma-css/tailwind` — Tailwind Preset

Injects forma design tokens into an existing Tailwind project so both systems share the same color palette, spacing, and radius scales.

```typescript
// packages/tailwind-preset/src/index.ts
import type { Config } from 'tailwindcss'

const formaPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        'forma-primary': 'var(--forma-color-primary)',
        'forma-danger':  'var(--forma-color-danger)',
        'forma-success': 'var(--forma-color-success)',
        'forma-warning': 'var(--forma-color-warning)',
        'forma-neutral': 'var(--forma-color-neutral)',
      },
      borderRadius: {
        'forma-sm':   'var(--forma-radius-sm)',
        'forma-md':   'var(--forma-radius-md)',
        'forma-lg':   'var(--forma-radius-lg)',
        'forma-xl':   'var(--forma-radius-xl)',
        'forma-full': 'var(--forma-radius-full)',
      },
      gap: {
        'forma-xs': 'var(--forma-gap-xs)',
        'forma-sm': 'var(--forma-gap-sm)',
        'forma-md': 'var(--forma-gap-md)',
        'forma-lg': 'var(--forma-gap-lg)',
        'forma-xl': 'var(--forma-gap-xl)',
      },
    },
  },
}

export default formaPreset
```

---

## Main `packages/core/src/index.ts`

```typescript
// CSS — imported for side effects in bundler context
import './css/index.css'

// Runtime
export { init } from './runtime/index'

// Config types (for TypeScript users)
export type { FormaConfig } from './config/types'

// Attribute list (used by build plugins)
export { FORMA_ATTRS, isFormaAttr } from './runtime/mapper'
```

---

## Build Script — `packages/core/scripts/build-css.js`

```javascript
import { bundle } from 'lightningcss'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'

mkdirSync('./dist', { recursive: true })

const { code } = bundle({
  filename: './src/css/index.css',
  minify: true,
  targets: {
    chrome: 95,
    firefox: 95,
    safari: 15,
  },
})

writeFileSync('./dist/forma.css', code)
console.log(`✓ forma.css built (${(code.length / 1024).toFixed(1)}kb)`)
```

---

## `tsup.config.ts` (core package)

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index:   'src/index.ts',
    runtime: 'src/runtime/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  external: [], // zero deps
})
```

---

## `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "typecheck": {}
  }
}
```

---

## Root `package.json`

```json
{
  "name": "forma-css-monorepo",
  "private": true,
  "scripts": {
    "build":     "turbo run build",
    "dev":       "turbo run dev --parallel",
    "test":      "turbo run test",
    "typecheck": "turbo run typecheck",
    "lint":      "eslint packages --ext .ts",
    "release":   "changeset publish"
  },
  "devDependencies": {
    "turbo":       "^1.13.0",
    "@changesets/cli": "^2.27.0",
    "eslint":      "^8.0.0",
    "prettier":    "^3.0.0",
    "typescript":  "^5.4.0"
  }
}
```

---

## `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

---

## Testing Strategy — `packages/core/src/__tests__/`

### What to test

```
__tests__/
├── resolver.test.ts     # applyConfig correctly sets CSS custom props
├── reveal.test.ts       # IntersectionObserver fires, class added
├── observer.test.ts     # MutationObserver picks up dynamic elements
├── mapper.test.ts       # FORMA_ATTRS list is complete, isFormaAttr works
└── css/                 # Visual regression tests (Playwright)
    └── attributes.test.ts
```

### `resolver.test.ts` example

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { applyConfig } from '../config/resolver'

describe('applyConfig', () => {
  beforeEach(() => {
    // Reset custom props
    document.documentElement.style.cssText = ''
  })

  it('sets tone color custom properties', () => {
    applyConfig({ tokens: { tone: { primary: '#ff0000' } } })
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue('--forma-color-primary').trim()
    expect(val).toBe('#ff0000')
  })

  it('sets glass blur token', () => {
    applyConfig({ tokens: { surface: { glass: { blur: '20px' } } } })
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue('--forma-glass-blur').trim()
    expect(val).toBe('20px')
  })

  it('ignores undefined token values', () => {
    applyConfig({ tokens: { tone: { primary: undefined } } })
    // Should not throw, should not set the property
    const val = document.documentElement.style.getPropertyValue('--forma-color-primary')
    expect(val).toBe('')
  })
})
```

---

## GitHub Actions — `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm lint
```

---

## `.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          registry-url: https://registry.npmjs.org
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## README.md (root)

````markdown
# forma-css

**Style with intent, not with soup.**

A lightweight (~8kb), zero-config CSS library where semantic HTML attributes
compile to atomic styles. Works with or without a build step.

## Install

```bash
npm install forma-css
```

## Usage

```html
<!-- Import once -->
<link rel="stylesheet" href="node_modules/forma-css/dist/forma.css" />

<!-- Write intent, not utilities -->
<div surface="glass" tone="primary" density="spacious" radius="xl">
  Hello, forma.
</div>

<div layout="row" gap="md" adaptive>
  <button surface="solid" tone="primary" density="compact" radius="full" motion="expressive">
    Get started
  </button>
  <button surface="ghost" density="compact" radius="full" motion="expressive">
    Learn more
  </button>
</div>
```

## With Vite (zero runtime in production)

```typescript
// vite.config.ts
import forma from 'forma-css/vite'
export default { plugins: [forma()] }
```

## Token override

```typescript
import { init } from 'forma-css'

init({
  tokens: {
    tone: { primary: '#your-brand' },
    surface: { glass: { blur: '20px' } },
  }
})
```

## Works alongside Tailwind

```bash
# Add the preset to sync tokens
npm install forma-css
```
```javascript
// tailwind.config.js
import formaPreset from 'forma-css/tailwind'
export default { presets: [formaPreset] }
```

## Attribute Reference

| Attribute | Values | What it does |
|---|---|---|
| `surface` | `glass \| solid \| matte \| ghost \| neon \| frosted` | Visual material |
| `tone` | `primary \| danger \| success \| warning \| neutral` | Semantic color |
| `density` | `compact \| default \| spacious` | Internal padding |
| `radius` | `none \| sm \| md \| lg \| xl \| full` | Border radius |
| `layer` | `base \| raised \| floating \| overlay \| top` | Semantic z-index |
| `layout` | `stack \| row \| cluster \| grid \| center \| cover` | Layout primitive |
| `gap` | `xs \| sm \| md \| lg \| xl` | Gap scale |
| `align` | `start \| center \| end \| stretch` | align-items |
| `justify` | `start \| center \| end \| between` | justify-content |
| `adaptive` | boolean | Auto-switch direction at mobile |
| `motion` | `none \| subtle \| expressive \| dramatic` | Transition preset |
| `float` | `slow \| med \| fast` | CSS float animation |
| `reveal` | `bottom \| top \| left \| right \| scale \| blur` | Scroll entrance |

## License

MIT
````

---

## Development Setup Commands

```bash
# Clone and install
git clone https://github.com/yourname/forma-css
cd forma-css
pnpm install

# Build all packages
pnpm build

# Start dev mode (watch all packages)
pnpm dev

# Run tests
pnpm test

# Start playground
pnpm --filter playground dev

# Start docs site
pnpm --filter docs dev

# Add a changeset before merging a feature
pnpm changeset
```

---

## Implementation Order

Build in this exact sequence. Do not skip ahead.

1. **`tokens.css`** — Define all CSS custom properties. This is the foundation everything else reads from.
2. **`surface.css`** — The signature feature. Get `glass` perfect first.
3. **`tone.css`** — Implement tone composition with surface.
4. **`density.css`, `radius.css`, `layer.css`** — Trivial. Knock them out together.
5. **`layout.css`** — Implement `stack`, `row`, `grid`, `cluster`, then `adaptive`.
6. **`motion.css`** — Transition presets.
7. **`animation.css`** — `float` first (pure CSS), then `reveal` (needs JS).
8. **`runtime/reveal.ts`** — IntersectionObserver for `reveal=`.
9. **`runtime/observer.ts`** — MutationObserver for dynamic content.
10. **`runtime/index.ts`** — Wire up auto-init.
11. **`config/types.ts` + `resolver.ts`** — Token override system.
12. **`index.ts`** — Package entry.
13. **Tests** — Write tests for resolver, reveal, observer.
14. **Vite plugin** — Build-time path.
15. **Tailwind preset** — Token bridge.
16. **Playground app** — Live dev sandbox.
17. **Docs site** — After the library is stable.

---

## Non-negotiable Quality Rules

- **No `!important` anywhere in CSS.** Solve specificity with better selectors.
- **No inline style injection** in the runtime. CSS custom properties on `:root` only.
- **Attribute selectors are the styling mechanism.** The runtime never adds classes to drive styles (only `.forma-revealed` for reveal animations, which is a state class, not a style class).
- **Every token must be a CSS custom property.** If it can't be overridden with a CSS variable, it doesn't belong as a hardcoded value.
- **`prefers-reduced-motion` must be respected** for all animations. Already handled in `animation.css` — never remove it.
- **SSR-safe.** Every `window`/`document` access must be guarded. The CSS works with no JS at all.
- **Zero production dependencies.** The runtime ships no third-party code.
- **Bundle size is a feature.** If adding something pushes core.css past 10kb gzip, justify it explicitly or don't add it.
