# aura

**Style with intent, not with soup.**

A lightweight (~8kb), zero-config CSS library where semantic HTML attributes
compile to atomic styles. Works with or without a build step.

## Install

```bash
npm install aura-css
```

## Usage

```html
<!-- Import once -->
<link rel="stylesheet" href="node_modules/aura/dist/forma.css" />

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
import forma from 'aura/vite'
export default { plugins: [forma()] }
```

## Token override

```typescript
import { init } from 'aura-css'

init({
  tokens: {
    tone: { primary: '#your-brand' },
    surface: { glass: { blur: '20px' } },
  }
})
```

## Works alongside Tailwind

```bash
npm install aura-css
```
```javascript
// tailwind.config.js
import formaPreset from 'aura/tailwind'
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

## Development

```bash
# Clone and install
git clone https://github.com/yourname/aura
cd aura
pnpm install

# Build all packages
pnpm build

# Start dev mode (watch all packages)
pnpm dev

# Run tests
pnpm test

# Start playground
pnpm --filter aura-playground dev

# Start docs site
pnpm --filter aura-docs dev

# Add a changeset before merging a feature
pnpm changeset
```

## License

MIT
