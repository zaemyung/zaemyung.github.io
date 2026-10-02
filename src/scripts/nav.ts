/* Site header: mobile menu, the sliding underline under the nav links, and the theme toggle with its sweep. */
import { prefersReducedMotion } from "./motion";

const nav = document.getElementById("site-nav");

/* Mobile menu */
const toggle = nav?.querySelector<HTMLButtonElement>(".nav-toggle");
if (nav && toggle) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* Sliding underline: rests under the current page and follows the hovered or focused link */
const list = nav?.querySelector<HTMLElement>(".nav-links");
const ind = list?.querySelector<HTMLElement>(".nav-ind");
if (nav && list && ind) {
  const links = [...list.querySelectorAll<HTMLAnchorElement>("a")];
  const current = links.find((a) => a.getAttribute("aria-current") === "page") ?? null;
  const place = (a: HTMLAnchorElement | null) => {
    if (!a) {
      ind.style.opacity = "0";
      return;
    }
    ind.style.left = `${a.offsetLeft}px`;
    ind.style.width = `${a.offsetWidth}px`;
    ind.style.opacity = "1";
  };
  const rest = () => place(current);
  for (const a of links) {
    a.addEventListener("pointerenter", () => place(a));
    a.addEventListener("focus", () => place(a));
    a.addEventListener("blur", rest);
  }
  list.addEventListener("pointerleave", rest);
  rest();
  nav.classList.add("has-ind"); // the static underline hands over to the slider
  requestAnimationFrame(() => ind.classList.add("ready")); // transitions only after the first placement
  document.fonts?.ready.then(rest);
  addEventListener("resize", rest);
}

/* Theme toggle: where the View Transitions API exists, the new theme sweeps out from the button */
const button = document.getElementById("theme-toggle");
button?.addEventListener("click", () => {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  const apply = () => {
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  const doc = document as Document & { startViewTransition?: (update: () => void) => { finished: Promise<void> } };
  if (prefersReducedMotion() || typeof doc.startViewTransition !== "function") {
    apply();
    return;
  }
  const r = button.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.style.setProperty("--vt-x", `${x}px`);
  root.style.setProperty("--vt-y", `${y}px`);
  root.style.setProperty("--vt-r", `${radius}px`);
  root.classList.add("vt-theme");
  doc.startViewTransition(apply).finished.finally(() => root.classList.remove("vt-theme"));
});
