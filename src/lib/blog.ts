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
