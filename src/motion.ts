/** The visitor asked for less motion, unless they turned it back on here (?motion=on; saved by the script in index.html). */
export const reducedMotion = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches && !document.documentElement.classList.contains('motion-on')
