// CSS — imported for side effects in bundler context
import './css/index.css'

// Runtime
export { init } from './runtime/index'

// Config types (for TypeScript users)
export type { AuraConfig } from './config/types'

// Attribute list (used by build plugins)
export { AURA_ATTRS, isAuraAttr } from './runtime/mapper'
