/* Shared helpers for the site's motion. Every effect falls back to its resting state when motion is reduced. */

export const prefersReducedMotion = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasFinePointer = (): boolean => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Live flag that tracks whether `el` is on screen. Starts true so nothing is skipped before the observer reports. */
export function visibility(el: Element, threshold = 0.05): { visible: boolean } {
  const state = { visible: true };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        for (const e of entries) state.visible = e.isIntersecting;
      },
      { threshold },
    ).observe(el);
  }
  return state;
}

/** Milliseconds until the `.rise` entrance of `el` has finished (0 when animations are off). */
export function entranceEnd(el: Element): number {
  const cs = getComputedStyle(el);
  const delay = parseFloat(cs.animationDelay) || 0;
  const duration = parseFloat(cs.animationDuration) || 0;
  return (delay + duration) * 1000;
}
