/**
 * Tilt runtime — mouse-position-aware 3D tilt effect.
 * CSS handles the transform; this script feeds CSS custom properties.
 * tilt= attribute value sets the max rotation in degrees (default: 8).
 */

function attachTilt(el: Element): void {
  const htmlEl = el as HTMLElement
  let frameId = 0

  const onMove = (e: MouseEvent) => {
    cancelAnimationFrame(frameId)
    frameId = requestAnimationFrame(() => {
      const rect = htmlEl.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const cx = rect.width / 2
      const cy = rect.height / 2
      const maxDeg = Number(htmlEl.getAttribute('tilt') || htmlEl.dataset.tiltMax || 8)
      const rotX = ((y - cy) / cy) * -maxDeg
      const rotY = ((x - cx) / cx) *  maxDeg

      htmlEl.style.setProperty('--aura-tilt-x', `${rotX.toFixed(2)}deg`)
      htmlEl.style.setProperty('--aura-tilt-y', `${rotY.toFixed(2)}deg`)

      // Shine position (if tilt-shine is present)
      if (htmlEl.hasAttribute('tilt-shine')) {
        const pctX = ((x / rect.width)  * 100).toFixed(1)
        const pctY = ((y / rect.height) * 100).toFixed(1)
        htmlEl.style.setProperty('--aura-tilt-shine-x', `${pctX}%`)
        htmlEl.style.setProperty('--aura-tilt-shine-y', `${pctY}%`)
        htmlEl.style.setProperty('--aura-tilt-shine-opacity', '1')
      }
    })
  }

  const onLeave = () => {
    cancelAnimationFrame(frameId)
    htmlEl.style.setProperty('--aura-tilt-x', '0deg')
    htmlEl.style.setProperty('--aura-tilt-y', '0deg')
    if (htmlEl.hasAttribute('tilt-shine')) {
      htmlEl.style.setProperty('--aura-tilt-shine-opacity', '0')
    }
  }

  htmlEl.addEventListener('mousemove', onMove, { passive: true })
  htmlEl.addEventListener('mouseleave', onLeave)
}

export function initTilt(): void {
  // Skip if reduced motion is preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  document.querySelectorAll('[tilt]:not([tilt-css])').forEach(attachTilt)
}

/** Called by the MutationObserver for dynamically added [tilt] elements */
export function observeTiltElement(el: Element): void {
  if (!el.hasAttribute('tilt') || el.hasAttribute('tilt-css')) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  attachTilt(el)
}
