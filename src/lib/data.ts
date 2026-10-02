import yaml from "js-yaml";

// All data files are bundled at build time; nothing is read from disk at runtime.
const yamlFiles = import.meta.glob("../data/*.yml", { query: "?raw", import: "default", eager: true }) as Record<
  string,
  string
>;
const jsonFiles = import.meta.glob("../data/*.json", { eager: true, import: "default" }) as Record<string, unknown>;

export function loadYaml<T>(name: string): T {
  const raw = yamlFiles[`../data/${name}`];
  if (raw === undefined) throw new Error(`Missing data file: src/data/${name}`);
  return yaml.load(raw) as T;
}
export function loadJson<T>(name: string): T {
  const data = jsonFiles[`../data/${name}`];
  if (data === undefined) throw new Error(`Missing data file: src/data/${name}`);
  return data as T;
}

/* ---------- Types ---------- */
export type Links = Partial<
  Record<"paper" | "code" | "project" | "video" | "slides" | "poster" | "demo" | "data", string | null>
>;
export interface Paper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  venue_full?: string | null;
  year: number;
  month?: number | null;
  type: "conference" | "findings" | "workshop" | "journal" | "preprint" | "patent";
  status?: "published" | "accepted" | "under review";
  topics: string[];
  selected?: boolean;
  note?: string | null;
  links?: Links;
  arxiv?: string | null;
  abstract?: string | null;
  tldr?: string | null;
  preview?: string | null;
  preview_source?: string | null;
}
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}
export interface Pillar {
  num: string;
  tag: string;
  heading: string;
  blurb: string;
  papers: { label: string; match: string }[];
  /** Small illustration drawn above the heading (see PillarArt.astro). */
  art?: "tree" | "layers" | "edits";
}
/** The thesis line: `before` + one of `phrases` (the first is the static default; the rest rotate) + `after`. */
export interface Thesis {
  before: string;
  phrases: string[];
  after?: string;
}
export interface Profile {
  name: string;
  name_native?: string;
  title: string;
  department: string;
  affiliation: string;
  location: string;
  email: string;
  photo: string;
  cv: string;
  group: string;
  group_url: string;
  advisor: string;
  advisor_url: string;
  socials: { label: string; href: string; icon: string }[];
  affiliations: { label: string; href?: string | null }[];
  role_line: string;
  thesis: Thesis;
  lead: string[];
  /** IANA time zone and short place name for the live clock in the sidebar. */
  tz?: string;
  clock_label?: string;
  cta: { label: string; href: string; primary?: boolean; external?: boolean; icon?: string }[];
  pillars: Pillar[];
  description: string;
}
/** One position in experience.yml (newest first). */
export interface Experience {
  role: string;
  org: string;
  /** Chip label when `org` is too long. */
  short?: string;
  /** Links the organisation name. */
  url?: string;
  /** Show as a sidebar chip: under Affiliations while current, under Previously once ended. */
  highlight?: boolean;
  location: string;
  start: string;
  end: string | null;
  /** IANA zone: adds a live clock to the sidebar while the position is current. */
  tz?: string;
  bullets?: string[];
}
/** One degree in education.yml. */
export interface Education {
  degree: string;
  school: string;
  url?: string;
  location: string;
  start: string;
  end: string;
  expected: boolean;
  thesis?: string | null;
  advisor?: string | null;
  notes?: string[];
}
export interface Award {
  year: number;
  title: string;
  org: string;
}
export interface ServiceYear {
  year: number;
  items: string[];
}
export interface NewsItem {
  date: string;
  html: string;
}

/* ---------- Topics ---------- */
export const TOPICS: Record<string, { label: string; blurb: string }> = {
  structure: { label: "Structure", blurb: "Discourse, structural alignment, long-form coherence" },
  metacognition: { label: "Metacognition", blurb: "Self-improvement, evaluators, reward models" },
  collaboration: { label: "Collaboration", blurb: "Human-AI writing, sensemaking, agents" },
  multilingual: { label: "Multilingual", blurb: "Machine translation and multilingual representations" },
  others: { label: "Others", blurb: "Earlier and adjacent work" },
};
export const TOPIC_ORDER = Object.keys(TOPICS);

/* ---------- Papers ---------- */
export function allPapers(): Paper[] {
  const papers = loadJson<Paper[]>("papers.json");
  return [...papers].sort((a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0));
}
export function selectedPapers(): Paper[] {
  return allPapers().filter((p) => p.selected);
}
export function groupByYear(papers: Paper[]): { year: number; papers: Paper[] }[] {
  const map = new Map<number, Paper[]>();
  for (const p of papers) map.set(p.year, [...(map.get(p.year) ?? []), p]);
  return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([year, papers]) => ({ year, papers }));
}
export function groupByTopic(papers: Paper[]): { topic: string; papers: Paper[] }[] {
  return TOPIC_ORDER.map((topic) => ({
    topic,
    papers: papers.filter((p) => (p.topics?.[0] ?? "others") === topic),
  })).filter((g) => g.papers.length > 0);
}
export function findPaper(papers: Paper[], match: string): Paper | undefined {
  const m = match.toLowerCase();
  return papers.find((p) => p.id === match) ?? papers.find((p) => p.title.toLowerCase().includes(m));
}
export function primaryTopic(p: Paper): string {
  return p.topics?.[0] ?? "others";
}

/* ---------- Formatting ---------- */
export const OWN_NAME = "Zae Myung Kim";
export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
/** Author list as HTML, own name emphasised, equal-contribution asterisks preserved. */
export function authorsHtml(authors: string[]): string {
  return authors
    .map((a) => {
      const star = a.endsWith("*");
      const name = star ? a.slice(0, -1).trim() : a;
      const html = escapeHtml(name) + (star ? "<sup>*</sup>" : "");
      return name === OWN_NAME ? `<span class="me">${html}</span>` : html;
    })
    .join(", ");
}
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function formatDate(iso: string, style: "short" | "long" = "short"): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!m) return String(y);
  const mon = style === "long" ? new Date(y, m - 1, d ?? 1).toLocaleString("en-US", { month: "long" }) : MONTHS[m - 1];
  return d ? `${mon} ${d}, ${y}` : `${mon} ${y}`;
}
/** "2026-09" -> "Sep 2026"; null -> "Present" */
export function formatYm(ym: string | null | undefined): string {
  if (!ym) return "Present";
  return formatDate(ym);
}
export function venueLine(p: Paper): string {
  const parts = [p.venue, String(p.year)];
  return parts.join(" ");
}

/** "2026-09-30" -> "Sep 2026" (compact, for narrow columns) */
export function formatMy(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return m ? `${MONTHS[m - 1]} ${y}` : String(y);
}

/* ---------- Stats ---------- */
export interface PaperStats {
  total: number;
  /** Papers led by the owner, counting equal-contribution (starred) lead authorship. */
  firstAuthor: number;
  /** Distinct publication venues, excluding preprint servers and patents. */
  venues: number;
}
export function paperStats(papers: Paper[] = allPapers()): PaperStats {
  const strip = (a: string) => a.replace(/\*$/, "").trim();
  const firstAuthor = papers.filter((p) => {
    const lead = p.authors[0] ?? "";
    const leads = lead.endsWith("*") ? p.authors.filter((a) => a.endsWith("*")) : [lead];
    return leads.map(strip).includes(OWN_NAME);
  }).length;
  const venues = new Set(papers.filter((p) => p.type !== "preprint" && p.type !== "patent").map((p) => p.venue)).size;
  return { total: papers.length, firstAuthor, venues };
}
