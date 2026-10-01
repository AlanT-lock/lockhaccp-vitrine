// Index des articles du blog (content/blog/*.md, convertis au build par
// scripts/blog/plugin-articles.mjs) et publication programmée : un article
// daté dans le futur reste caché jusqu'à minuit, heure de Paris, le jour J.
import { instantDeRendu } from "@/lib/maintenant";

export interface Article {
  slug: string;
  meta: {
    titre: string;
    description: string;
    date: string;
    maj?: string;
    motCle: string;
    resume: string;
    illustration?: string;
  };
  html: string;
  sommaire: { id: string; titre: string }[];
  mots: number;
  lecture: number;
}

const modules = import.meta.glob<{ default: Article }>("/content/blog/*.md", { eager: true });

export const TOUS_LES_ARTICLES: Article[] = Object.values(modules).map((m) => m.default);

/** Minuit, heure de Paris, le jour `date` (AAAA-MM-JJ), en millisecondes UTC. */
function minuitParis(date: string): number {
  const [a, m, j] = date.split("-").map(Number);
  const midiUtc = new Date(Date.UTC(a, m - 1, j, 12));
  const heureParis = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", hour12: false }).format(midiUtc),
  );
  const decalage = heureParis - 12; // +1 en hiver, +2 en été
  return Date.UTC(a, m - 1, j, 0) - decalage * 3_600_000;
}

export const estPublie = (date: string, instant: Date) => instant.getTime() >= minuitParis(date);

export function articlesPublies(articles: Article[], instant: Date): Article[] {
  return articles
    .filter((a) => estPublie(a.meta.date, instant))
    .sort((x, y) => y.meta.date.localeCompare(x.meta.date));
}

export const trouverArticle = (slug: string, instant: Date = instantDeRendu()) =>
  articlesPublies(TOUS_LES_ARTICLES, instant).find((a) => a.slug === slug);

const texteBrut = (html: string) =>
  html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

/** Questions/réponses de la section « Questions fréquentes » (h3 + premier paragraphe). */
export function extraireFaq(html: string): { question: string; answer: string }[] {
  const debut = html.indexOf('<h2 id="questions-frequentes">');
  if (debut < 0) return [];
  const suite = html.slice(debut + 1);
  const fin = suite.search(/<h2[\s>]/);
  const section = fin < 0 ? suite : suite.slice(0, fin);
  const faq: { question: string; answer: string }[] = [];
  const motif = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
  let m: RegExpExecArray | null;
  while ((m = motif.exec(section))) faq.push({ question: texteBrut(m[1]), answer: texteBrut(m[2]) });
  return faq;
}

/** « 2026-10-02 » → « 2 octobre 2026 » (identique côté serveur et navigateur). */
export const dateLongue = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris",
  });
