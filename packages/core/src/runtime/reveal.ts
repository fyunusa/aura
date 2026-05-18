const THRESHOLD = 0.15

/**
 * These reveal values are handled entirely by CSS Scroll Timeline API.
 * The JS IntersectionObserver must NOT touch them.
 */
const CSS_NATIVE_REVEALS = new Set(['parallax', 'progress', 'sticky-fade', 'slide-left', 'slide-right'])

let observer: IntersectionObserver | null = null

function createObserver(): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('aura-revealed')
          observer?.unobserve(entry.target) // fire once
        }
      }
    },
    { threshold: THRESHOLD }
  )
}

export function initReveal(root: Document | Element = document): void {
  if (typeof IntersectionObserver === 'undefined') {
    // SSR or old browser — reveal everything immediately
    root.querySelectorAll('[reveal]').forEach((el) => {
      if (!CSS_NATIVE_REVEALS.has(el.getAttribute('reveal') ?? '')) {
        el.classList.add('aura-revealed')
      }
    })
    return
  }

  observer = createObserver()
  root.querySelectorAll('[reveal]').forEach((el) => {
    if (!CSS_NATIVE_REVEALS.has(el.getAttribute('reveal') ?? '')) {
      observer!.observe(el)
    }
  })
}

export function observeRevealElement(el: Element): void {
  if (CSS_NATIVE_REVEALS.has(el.getAttribute('reveal') ?? '')) return
  if (!observer) observer = createObserver()
  observer.observe(el)
}
