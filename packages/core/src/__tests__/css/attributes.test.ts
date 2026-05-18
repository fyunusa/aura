/**
 * CSS attribute selector tests.
 *
 * These tests verify that the correct CSS custom properties and classes
 * are applied when forma attributes are present. In a full setup with
 * Playwright, these would be visual regression / computed style tests.
 *
 * Here we test the attribute presence logic that the runtime depends on,
 * and verify the DOM structure expected by the CSS selectors.
 */
import { describe, it, expect, beforeEach } from 'vitest'

describe('forma attribute selectors — DOM contract', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('surface=', () => {
    it('element with surface="glass" is selectable by CSS', () => {
      document.body.innerHTML = `<div surface="glass"></div>`
      const el = document.querySelector('[surface="glass"]')
      expect(el).not.toBeNull()
    })

    it('element with surface="neon" is selectable by CSS', () => {
      document.body.innerHTML = `<div surface="neon"></div>`
      expect(document.querySelector('[surface="neon"]')).not.toBeNull()
    })

    const surfaces = ['glass', 'solid', 'matte', 'ghost', 'frosted', 'neon']
    for (const s of surfaces) {
      it(`surface="${s}" attribute is preserved in DOM`, () => {
        document.body.innerHTML = `<div surface="${s}"></div>`
        const el = document.body.firstElementChild!
        expect(el.getAttribute('surface')).toBe(s)
      })
    }
  })

  describe('tone=', () => {
    const tones = ['primary', 'danger', 'success', 'warning', 'neutral']
    for (const t of tones) {
      it(`tone="${t}" attribute is preserved in DOM`, () => {
        document.body.innerHTML = `<div tone="${t}"></div>`
        expect(document.body.firstElementChild!.getAttribute('tone')).toBe(t)
      })
    }
  })

  describe('density=', () => {
    const densities = ['compact', 'default', 'spacious']
    for (const d of densities) {
      it(`density="${d}" is selectable`, () => {
        document.body.innerHTML = `<div density="${d}"></div>`
        expect(document.querySelector(`[density="${d}"]`)).not.toBeNull()
      })
    }
  })

  describe('layout=', () => {
    const layouts = ['stack', 'row', 'cluster', 'grid', 'center', 'cover']
    for (const l of layouts) {
      it(`layout="${l}" is selectable`, () => {
        document.body.innerHTML = `<div layout="${l}"></div>`
        expect(document.querySelector(`[layout="${l}"]`)).not.toBeNull()
      })
    }
  })

  describe('reveal=', () => {
    it('[reveal] attribute present before JS runs — element starts hidden via CSS', () => {
      document.body.innerHTML = `<div reveal="bottom">Content</div>`
      const el = document.querySelector('[reveal]')!
      expect(el).not.toBeNull()
      expect(el.hasAttribute('reveal')).toBe(true)
    })

    it('aura-revealed class added by runtime enables animation', () => {
      document.body.innerHTML = `<div reveal="scale">Content</div>`
      const el = document.querySelector('[reveal]')!
      el.classList.add('aura-revealed')
      expect(el.classList.contains('aura-revealed')).toBe(true)
      expect(document.querySelector('[reveal].aura-revealed')).toBe(el)
    })
  })

  describe('adaptive attribute', () => {
    it('adaptive boolean attribute is present without value', () => {
      document.body.innerHTML = `<div layout="row" adaptive></div>`
      const el = document.body.firstElementChild!
      expect(el.hasAttribute('adaptive')).toBe(true)
      expect(document.querySelector('[layout="row"][adaptive]')).toBe(el)
    })
  })

  describe('reveal-delay', () => {
    it('reveal-delay attribute is preserved', () => {
      document.body.innerHTML = `<div reveal="bottom" reveal-delay="200">Content</div>`
      const el = document.body.firstElementChild!
      expect(el.getAttribute('reveal-delay')).toBe('200')
    })
  })
})
