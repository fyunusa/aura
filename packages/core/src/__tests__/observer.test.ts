import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockObserve } from './setup'

describe('MutationObserver (observer runtime)', () => {
  let initMutationObserver: () => MutationObserver

  beforeEach(async () => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    vi.resetModules()
    const mod = await import('../runtime/observer')
    initMutationObserver = mod.initMutationObserver
  })

  it('returns a MutationObserver instance', () => {
    const mo = initMutationObserver()
    expect(mo).toBeInstanceOf(MutationObserver)
    mo.disconnect()
  })

  it('calls observeRevealElement for dynamically added [reveal] nodes', async () => {
    const mo = initMutationObserver()

    const el = document.createElement('div')
    el.setAttribute('reveal', 'bottom')
    document.body.appendChild(el)

    // Allow microtask queue to flush MutationObserver callbacks
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(mockObserve).toHaveBeenCalledWith(el)

    mo.disconnect()
  })

  it('observes [reveal] children of a dynamically added parent', async () => {
    const mo = initMutationObserver()

    const parent = document.createElement('div')
    const child = document.createElement('span')
    child.setAttribute('reveal', 'scale')
    parent.appendChild(child)
    document.body.appendChild(parent)

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(mockObserve).toHaveBeenCalledWith(child)

    mo.disconnect()
  })

  it('ignores non-Element nodes (text, comments)', async () => {
    const mo = initMutationObserver()

    document.body.appendChild(document.createTextNode('hello'))
    document.body.appendChild(document.createComment('comment'))

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(mockObserve).not.toHaveBeenCalled()

    mo.disconnect()
  })

  it('ignores elements without [reveal]', async () => {
    const mo = initMutationObserver()

    const el = document.createElement('div')
    el.setAttribute('surface', 'glass')
    document.body.appendChild(el)

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(mockObserve).not.toHaveBeenCalled()

    mo.disconnect()
  })
})
