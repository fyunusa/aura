import { describe, it, expect, beforeEach } from 'vitest'
import { applyConfig } from '../config/resolver'

describe('applyConfig', () => {
  beforeEach(() => {
    document.documentElement.style.cssText = ''
  })

  it('sets tone color custom properties', () => {
    applyConfig({ tokens: { tone: { primary: '#ff0000' } } })
    const val = document.documentElement.style.getPropertyValue('--aura-color-primary').trim()
    expect(val).toBe('#ff0000')
  })

  it('sets multiple tone colors', () => {
    applyConfig({ tokens: { tone: { danger: '#cc0000', success: '#00cc00' } } })
    expect(document.documentElement.style.getPropertyValue('--aura-color-danger').trim()).toBe('#cc0000')
    expect(document.documentElement.style.getPropertyValue('--aura-color-success').trim()).toBe('#00cc00')
  })

  it('sets glass blur token', () => {
    applyConfig({ tokens: { surface: { glass: { blur: '20px' } } } })
    const val = document.documentElement.style.getPropertyValue('--aura-glass-blur').trim()
    expect(val).toBe('20px')
  })

  it('sets glass opacity token', () => {
    applyConfig({ tokens: { surface: { glass: { opacity: 0.25 } } } })
    const val = document.documentElement.style.getPropertyValue('--aura-glass-opacity').trim()
    expect(val).toBe('0.25')
  })

  it('sets glass border token', () => {
    applyConfig({ tokens: { surface: { glass: { border: 'rgba(255,255,255,0.2)' } } } })
    const val = document.documentElement.style.getPropertyValue('--aura-glass-border').trim()
    expect(val).toBe('rgba(255,255,255,0.2)')
  })

  it('sets frosted blur and opacity tokens', () => {
    applyConfig({ tokens: { surface: { frosted: { blur: '32px', opacity: 0.8 } } } })
    expect(document.documentElement.style.getPropertyValue('--aura-frosted-blur').trim()).toBe('32px')
    expect(document.documentElement.style.getPropertyValue('--aura-frosted-opacity').trim()).toBe('0.8')
  })

  it('sets density tokens', () => {
    applyConfig({ tokens: { density: { compact: '0.25rem 0.5rem' } } })
    const val = document.documentElement.style.getPropertyValue('--aura-density-compact').trim()
    expect(val).toBe('0.25rem 0.5rem')
  })

  it('sets gap tokens', () => {
    applyConfig({ tokens: { gap: { md: '1.25rem', xl: '3rem' } } })
    expect(document.documentElement.style.getPropertyValue('--aura-gap-md').trim()).toBe('1.25rem')
    expect(document.documentElement.style.getPropertyValue('--aura-gap-xl').trim()).toBe('3rem')
  })

  it('sets radius tokens', () => {
    applyConfig({ tokens: { radius: { lg: '1rem' } } })
    const val = document.documentElement.style.getPropertyValue('--aura-radius-lg').trim()
    expect(val).toBe('1rem')
  })

  it('sets motion duration and ease', () => {
    applyConfig({ tokens: { motion: { subtle: { duration: '200ms', ease: 'linear' } } } })
    expect(document.documentElement.style.getPropertyValue('--aura-motion-subtle-duration').trim()).toBe('200ms')
    expect(document.documentElement.style.getPropertyValue('--aura-motion-subtle-ease').trim()).toBe('linear')
  })

  it('ignores undefined tone values', () => {
    applyConfig({ tokens: { tone: { primary: undefined } } })
    expect(document.documentElement.style.getPropertyValue('--aura-color-primary')).toBe('')
  })

  it('does nothing when tokens is undefined', () => {
    expect(() => applyConfig({})).not.toThrow()
    expect(document.documentElement.style.cssText).toBe('')
  })

  it('handles custom tone keys', () => {
    applyConfig({ tokens: { tone: { brand: '#abcdef' } } })
    const val = document.documentElement.style.getPropertyValue('--aura-color-brand').trim()
    expect(val).toBe('#abcdef')
  })
})
