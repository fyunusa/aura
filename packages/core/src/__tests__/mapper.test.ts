import { describe, it, expect } from 'vitest'
import { AURA_ATTRS, isAuraAttr } from '../runtime/mapper'

describe('AURA_ATTRS', () => {
  const EXPECTED_ATTRS = [
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

  it('contains all expected attributes', () => {
    for (const attr of EXPECTED_ATTRS) {
      expect(AURA_ATTRS).toContain(attr)
    }
  })

  it('has no unexpected extra attributes', () => {
    expect(AURA_ATTRS.length).toBe(EXPECTED_ATTRS.length)
  })

  it('is a readonly tuple', () => {
    // TypeScript-level check: AURA_ATTRS is readonly
    expect(Array.isArray(AURA_ATTRS)).toBe(true)
  })
})

describe('isAuraAttr', () => {
  it('returns true for all known forma attributes', () => {
    const attrs = [
      'surface', 'tone', 'density', 'radius', 'layer',
      'layout', 'gap', 'align', 'justify', 'adaptive',
      'max', 'motion', 'float', 'axis', 'reveal', 'reveal-delay',
    ]
    for (const attr of attrs) {
      expect(isAuraAttr(attr)).toBe(true)
    }
  })

  it('returns false for standard HTML attributes', () => {
    expect(isAuraAttr('class')).toBe(false)
    expect(isAuraAttr('id')).toBe(false)
    expect(isAuraAttr('style')).toBe(false)
    expect(isAuraAttr('href')).toBe(false)
    expect(isAuraAttr('src')).toBe(false)
    expect(isAuraAttr('type')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isAuraAttr('')).toBe(false)
  })

  it('returns false for partial attribute names', () => {
    expect(isAuraAttr('surf')).toBe(false)
    expect(isAuraAttr('tone=')).toBe(false)
    expect(isAuraAttr('SURFACE')).toBe(false)
  })

  it('is case-sensitive', () => {
    expect(isAuraAttr('Surface')).toBe(false)
    expect(isAuraAttr('TONE')).toBe(false)
  })
})
