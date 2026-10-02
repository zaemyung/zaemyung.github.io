/* Figures in a .stats row count up from zero the first time the row is on screen (Stats.astro). */
import { entranceEnd, prefersReducedMotion } from "./motion";

if (!prefersReducedMotion() && "IntersectionObserver" in window) {
  for (const row of document.querySelectorAll<HTMLElement>(".stats")) {
    const counters = [...row.querySelectorAll<HTMLElement>(".count[data-n]")];
    if (!counters.length) continue;
    for (const c of counters) c.textContent = "0";
    const run = () => {
      const start = performance.now();
      const duration = 1100;
      const ease = (t: number) => 1 - (1 - t) ** 3;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        for (const c of counters) c.textContent = String(Math.round(ease(p) * Number(c.dataset.n)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setTimeout(run, Math.max(0, entranceEnd(row) - 350)); // after any entrance animation on the row
      },
      { threshold: 0.2 },
    );
    io.observe(row);
  }
}
