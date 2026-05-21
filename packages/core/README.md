# useaura

Style HTML with a handful of readable words — no class names, no config, no mental overhead.

```html
<div aura="glass primary xl">Card</div>
<button aura="solid danger pill compact">Delete</button>
<button primary>One-word button</button>
<div card>Zero-config card</div>
```

## Install

```bash
npm install useaura
# or
pnpm add useaura
```

## Quick start

```js
// 1. Import the CSS
import 'useaura/css'

// 2. Optionally activate motion + compound attr runtime
import 'useaura/runtime'
```

Or via CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/useaura@0.7.0/dist/forma.css" />
<script type="module" src="https://unpkg.com/useaura@0.7.0/dist/runtime.js"></script>
```

## Docs

Full documentation, live examples, and the Quick Reference (everything on one page) are at:

**[aura-css.netlify.app/docs](https://aura-css.netlify.app/docs)**

## Issues & feedback

Found a bug or have a feature request? Open an issue on GitHub:

**[github.com/fyunusa/aura/issues](https://github.com/fyunusa/aura/issues)**

## License

MIT
