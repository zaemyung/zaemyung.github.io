/* "Last updated October 1, 2026" becomes "Last updated yesterday"; the absolute date stays in the title attribute. */
const el = document.getElementById("site-updated") as HTMLTimeElement | null;
if (el?.dateTime && "RelativeTimeFormat" in Intl) {
  const then = new Date(el.dateTime);
  const now = new Date();
  const day = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const days = Math.max(0, Math.round((day(now) - day(then)) / 864e5));
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  el.textContent =
    days < 14
      ? rtf.format(-days, "day")
      : days < 60
        ? rtf.format(-Math.round(days / 7), "week")
        : days < 365
          ? rtf.format(-Math.round(days / 30), "month")
          : rtf.format(-Math.round(days / 365), "year");
}
