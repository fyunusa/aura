import { vi } from 'vitest'

// ── IntersectionObserver mock ──────────────────────────────────────────────
// jsdom does not implement IntersectionObserver; we provide a minimal stub.
// We use a mutable object so ESM live-binding semantics are not required
// to observe the latest captured callback across module boundaries.

export const revealState: { lastCallback: IntersectionObserverCallback | null } = {
  lastCallback: null,
}

export const mockObserve = vi.fn()
export const mockUnobserve = vi.fn()
export const mockDisconnect = vi.fn()

const MockIntersectionObserver = vi.fn(function (
  this: IntersectionObserver,
  callback: IntersectionObserverCallback
) {
  revealState.lastCallback = callback
  this.observe = mockObserve
  this.unobserve = mockUnobserve
  this.disconnect = mockDisconnect
  this.takeRecords = () => []
  this.root = null
  this.rootMargin = ''
  this.thresholds = []
})

;(global as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
  MockIntersectionObserver
