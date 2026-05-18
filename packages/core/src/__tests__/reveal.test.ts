import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockObserve, mockUnobserve, revealState } from './setup'
import { initReveal, observeRevealElement } from '../runtime/reveal'

describe('reveal runtime', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    revealState.lastCallback = null
  })

  it('observes all [reveal] elements on initReveal', () => {
    document.body.innerHTML = `
      <div reveal="bottom">Item 1</div>
      <div reveal="scale">Item 2</div>
      <div reveal="blur">Item 3</div>
    `
    initReveal()
    expect(mockObserve).toHaveBeenCalledTimes(3)
  })

  it('adds aura-revealed class when element intersects', () => {
    document.body.innerHTML = `<div reveal="bottom">Item</div>`
    const el = document.querySelector('[reveal]')!

    initReveal()

    revealState.lastCallback?.(
      [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
      {} as IntersectionObserver
    )

    expect(el.classList.contains('aura-revealed')).toBe(true)
  })

  it('does not add aura-revealed when not intersecting', () => {
    document.body.innerHTML = `<div reveal="bottom">Item</div>`
    const el = document.querySelector('[reveal]')!

    initReveal()

    revealState.lastCallback?.(
      [{ isIntersecting: false, target: el } as IntersectionObserverEntry],
      {} as IntersectionObserver
    )

    expect(el.classList.contains('aura-revealed')).toBe(false)
  })

  it('unobserves after revealing (fire once)', () => {
    document.body.innerHTML = `<div reveal="bottom">Item</div>`
    const el = document.querySelector('[reveal]')!

    initReveal()

    revealState.lastCallback?.(
      [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
      {} as IntersectionObserver
    )

    expect(mockUnobserve).toHaveBeenCalledWith(el)
  })

  it('falls back immediately when IntersectionObserver is unavailable (SSR)', async () => {
    const g = global as unknown as Record<string, unknown>
    const original = g.IntersectionObserver
    delete g.IntersectionObserver

    vi.resetModules()
    const { initReveal: initRevealFresh } = await import('../runtime/reveal')

    document.body.innerHTML = `<div reveal="bottom">Item</div>`
    const el = document.querySelector('[reveal]')!

    initRevealFresh()

    expect(el.classList.contains('aura-revealed')).toBe(true)

    g.IntersectionObserver = original
  })

  it('observeRevealElement observes the given element', () => {
    document.body.innerHTML = `<div reveal="scale">Item</div>`
    const el = document.querySelector('[reveal]')!

    observeRevealElement(el)

    expect(mockObserve).toHaveBeenCalledWith(el)
  })

  it('initReveal scoped to a sub-element only observes within it', () => {
    document.body.innerHTML = `
      <section id="scope">
        <div reveal="left">Inside</div>
      </section>
      <div reveal="right">Outside</div>
    `
    const scope = document.getElementById('scope')!
    initReveal(scope)

    expect(mockObserve).toHaveBeenCalledTimes(1)
    expect(mockObserve.mock.calls[0][0].textContent.trim()).toBe('Inside')
  })
})
