/* Sidebar: live clocks for the places in the Now block, and a pause for the portrait ring while it is off screen. */

function initClocks(): void {
  const box = document.querySelector<HTMLElement>(".sidebar .clocks");
  if (!box) return;
  const formats = new Map<string, Intl.DateTimeFormat>();
  const clocks = [...box.querySelectorAll<HTMLTimeElement>("time[data-tz]")].filter((c) => {
    const tz = c.dataset.tz ?? "";
    try {
      formats.set(
        tz,
        new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: tz }),
      );
      return true;
    } catch {
      c.parentElement?.remove(); // this device does not know the zone: drop that clock
      return false;
    }
  });
  if (!clocks.length) return;
  const tick = () => {
    const now = new Date();
    for (const c of clocks) {
      c.textContent = formats.get(c.dataset.tz ?? "")!.format(now);
      c.dateTime = now.toISOString();
    }
  };
  tick();
  box.hidden = false;
  setInterval(tick, 15_000);
}

function initRing(): void {
  const ring = document.querySelector<HTMLElement>(".identity .portrait");
  if (!ring || !("IntersectionObserver" in window)) return;
  new IntersectionObserver((entries) => {
    for (const e of entries) ring.classList.toggle("paused", !e.isIntersecting);
  }).observe(ring);
}

initClocks();
initRing();
