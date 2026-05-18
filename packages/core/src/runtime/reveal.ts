const THRESHOLD = 0.15

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
      el.classList.add('aura-revealed')
    })
    return
  }

  observer = createObserver()
  root.querySelectorAll('[reveal]').forEach((el) => observer!.observe(el))
}

export function observeRevealElement(el: Element): void {
  if (!observer) observer = createObserver()
  observer.observe(el)
}
