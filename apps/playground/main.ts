import '@fyunusa/aura-css/css'
import { init } from '@fyunusa/aura-css'

// Init with custom token overrides to demonstrate the config API
init({
  tokens: {
    tone: {
      primary: '#7C6AF7',
    },
    surface: {
      glass: { blur: '16px', opacity: 0.12 },
    },
  },
})
