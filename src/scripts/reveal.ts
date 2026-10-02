/* Scroll effects for browsers without CSS scroll-driven animations (global.css handles the rest declaratively). */
import { prefersReducedMotion } from "./motion";

const hasScrollTimeline = typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");

/* Publication rows below the fold fade up as they scroll into view. Rows already on screen are left alone. */
if (!hasScrollTimeline && !prefersReducedMotion() && "IntersectionObserver" in window) {
  const below = [...document.querySelectorAll<HTMLElement>(".pub")].filter(
    (el) => el.getBoundingClientRect().top > innerHeight * 0.92,
  );
  if (below.length) {
    document.documentElement.classList.add("reveal-js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );
    for (const el of below) {
      el.classList.add("pending");
      io.observe(el);
    }
  }
}

/* Reading progress bar */
const bar = document.querySelector<HTMLElement>(".scroll-progress");
if (bar && !hasScrollTimeline) {
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
}
