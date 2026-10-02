/* Research-focus cards: cursor tilt with a topic-tinted sheen, and the looping Meta^n layer illustration. */
import { hasFinePointer, prefersReducedMotion, sleep, visibility } from "./motion";

function initTilt(): void {
  if (prefersReducedMotion() || !hasFinePointer()) return;
  for (const card of document.querySelectorAll<HTMLElement>(".pillar[data-tilt]")) {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5 across the card
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--rx", `${(-py * 5).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  }
}

/* Meta^n: a fixed operator stacks a new layer on the trace of the one below, then the stack resets. */
function initLayers(): void {
  const art = document.querySelector<SVGElement>('.pillar-art[data-art="layers"]');
  if (!art || prefersReducedMotion()) return; // without the loop every layer stays visible
  const layers = [...art.querySelectorAll<SVGElement>(".layer[data-level]")].sort(
    (a, b) => Number(a.dataset.level) - Number(b.dataset.level),
  );
  if (!layers.length) return;
  art.classList.add("anim");
  const seen = visibility(art);
  (async () => {
    await sleep(1200); // let the card finish rising first
    for (;;) {
      while (!seen.visible || document.hidden) await sleep(500);
      for (const l of layers) {
        l.classList.add("on");
        await sleep(600);
      }
      await sleep(2800);
      for (const l of layers) l.classList.remove("on");
      await sleep(900);
    }
  })();
}

initTilt();
initLayers();
