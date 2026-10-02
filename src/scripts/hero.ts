/* Home-page hero: rotating thesis phrase, resolving role line, ambient discourse graph, counting stats.
   Markup lives in Hero.astro; everything here only enhances what is already rendered. */
import { entranceEnd, prefersReducedMotion, sleep, visibility } from "./motion";

const reduced = prefersReducedMotion();

/* ---- Thesis: one slot cycles through the research pillars ---- */
function initRotator(): void {
  const slot = document.querySelector<HTMLElement>(".hero .rotator");
  const phrase = slot?.querySelector<HTMLElement>(".phrase");
  const thesis = slot?.closest<HTMLElement>(".thesis");
  if (!slot || !phrase || !thesis) return;
  let phrases: string[] = [];
  try {
    phrases = JSON.parse(slot.dataset.phrases ?? "[]");
  } catch {
    return;
  }
  if (phrases.length < 2) return;

  // Reserve room for the tallest variant so the paragraphs below never move when the phrase changes.
  const reserve = () => {
    const current = phrase.innerHTML;
    thesis.style.minHeight = "";
    let tallest = 0;
    for (const html of phrases) {
      phrase.innerHTML = html;
      tallest = Math.max(tallest, thesis.offsetHeight);
    }
    phrase.innerHTML = current;
    thesis.style.minHeight = `${tallest}px`;
  };
  reserve();
  document.fonts?.ready.then(reserve);
  let timer = 0;
  addEventListener("resize", () => {
    clearTimeout(timer);
    timer = window.setTimeout(reserve, 150);
  });

  if (reduced) return;
  const seen = visibility(thesis);
  let i = 0;
  (async () => {
    for (;;) {
      await sleep(3600);
      while (!seen.visible || document.hidden) await sleep(500);
      phrase.classList.add("out");
      await sleep(340);
      i = (i + 1) % phrases.length;
      phrase.innerHTML = phrases[i]!;
      phrase.classList.remove("out");
    }
  })();
}

/* ---- Role line: resolves from scrambled glyphs on every load of the home page ---- */
function initScramble(): void {
  const el = document.querySelector<HTMLElement>(".hero .scramble");
  if (!el || reduced) return;
  const text = el.dataset.text ?? el.textContent ?? "";
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const fixed = (ch: string) => !/[A-Za-z]/.test(ch); // spaces, separators and hyphens never scramble
  const start = performance.now() + Math.max(0, entranceEnd(el.parentElement ?? el) - 250); // as the line fades in
  const duration = 1300;
  const tick = (now: number) => {
    const p = Math.min(1, Math.max(0, (now - start) / duration));
    let out = "";
    for (let k = 0; k < text.length; k++) {
      const ch = text[k]!;
      const settled = p > (k / text.length) * 0.8 + 0.15;
      out += fixed(ch) || settled ? ch : glyphs[(Math.random() * glyphs.length) | 0];
    }
    el.textContent = p < 1 ? out : text;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---- Ambient graph: discourse units drifting behind the hero, nudged by the cursor ---- */
function initGraph(): void {
  const hero = document.querySelector<HTMLElement>(".hero");
  const canvas = hero?.querySelector<HTMLCanvasElement>(".hero-graph");
  const ctx = canvas?.getContext("2d");
  if (!hero || !canvas || !ctx) return;

  interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    ix: number;
    iy: number;
    r: number;
    c: number;
  }
  let W = 0;
  let H = 0;
  let nodes: Node[] = [];
  let colors: string[] = [];
  let edge = "#999";
  const LINK = 120; // px within which two nodes are joined
  const PUSH = 110; // px within which the cursor nudges a node
  const seen = visibility(hero);
  const mouse = { x: -1e4, y: -1e4 };

  const palette = () => {
    const cs = getComputedStyle(document.documentElement);
    colors = ["--t-structure", "--t-metacognition", "--t-collaboration", "--t-multilingual"].map((v) =>
      cs.getPropertyValue(v).trim(),
    );
    edge = cs.getPropertyValue("--line-strong").trim();
  };
  const seed = () => {
    const n = Math.max(16, Math.min(44, Math.round((W * H) / 13000)));
    nodes = Array.from({ length: n }, (_, k) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.26,
      vy: (Math.random() - 0.5) * 0.26,
      ix: 0,
      iy: 0,
      r: 1.6 + Math.random() * 2,
      c: k % 4,
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    ctx.strokeStyle = edge;
    for (let a = 0; a < nodes.length; a++) {
      const p = nodes[a]!;
      for (let b = a + 1; b < nodes.length; b++) {
        const q = nodes[b]!;
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 >= LINK * LINK) continue;
        ctx.globalAlpha = (1 - Math.sqrt(d2) / LINK) * 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    for (const n of nodes) {
      ctx.fillStyle = colors[n.c]!;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  const step = () => {
    for (const n of nodes) {
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < PUSH * PUSH) {
        const d = Math.sqrt(d2) || 1;
        const f = (1 - d / PUSH) * 0.5;
        n.ix += (dx / d) * f;
        n.iy += (dy / d) * f;
      }
      n.ix *= 0.9;
      n.iy *= 0.9;
      n.x += n.vx + n.ix;
      n.y += n.vy + n.iy;
      if (n.x < -12) n.x = W + 12;
      else if (n.x > W + 12) n.x = -12;
      if (n.y < -12) n.y = H + 12;
      else if (n.y > H + 12) n.y = -12;
    }
  };
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return; // hidden on narrow screens
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = rect.width;
    H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!nodes.length) seed();
    draw();
  };

  hero.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener("pointerleave", () => {
    mouse.x = mouse.y = -1e4;
  });
  palette();
  resize();
  new ResizeObserver(resize).observe(canvas);
  new MutationObserver(palette).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  if (reduced) return; // one still frame is enough

  const loop = () => {
    if (W > 0 && seen.visible && !document.hidden) {
      step();
      draw();
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

initRotator();
initScramble();
initGraph();
