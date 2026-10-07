// Index des articles du blog (content/blog/*.md, convertis au build par
// scripts/blog/plugin-articles.mjs) et publication programmée : un article
// daté dans le futur reste caché jusqu'à minuit, heure de Paris, le jour J.
import { instantDeRendu } from "@/lib/maintenant";

/** En-tête d'un article (sans le corps HTML, chargé à part sur la page de l'article). */
export interface Article {
  slug: string;
  meta: {
    titre: string;
    /** Titre plus court pour Google, si « titre » dépasse 60 caractères. */
    titreSeo?: string;
    description: string;
    date: string;
    maj?: string;
    motCle: string;
    resume: string;
    illustration?: string;
  };
  sommaire: { id: string; titre: string }[];
  mots: number;
  lecture: number;
}

// Variante « ?meta » : légère, incluse dans le bundle commun (listes, sitemap, fil d'Ariane).
const modules = import.meta.glob<Article>("/content/blog/*.md", { eager: true, query: "?meta", import: "default" });
// Variante complète : un fichier JS par article, chargé à la demande.
const complets = import.meta.glob<{ html: string }>("/content/blog/*.md", { import: "default" });

/** Chargeur du corps HTML d'un article (undefined si le slug n'existe pas). */
export const chargeurCorps = (slug: string) => complets[`/content/blog/${slug}.md`];

export const TOUS_LES_ARTICLES: Article[] = Object.values(modules);

const FORMAT_PARIS = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

/** Décalage de Paris par rapport à UTC (en ms) à l'instant `t`. */
function decalageParis(t: number): number {
  const p = Object.fromEntries(FORMAT_PARIS.formatToParts(new Date(t)).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - Math.floor(t / 60_000) * 60_000;
}

/** Minuit, heure de Paris, le jour `date` (AAAA-MM-JJ), en ms UTC (correct les jours de changement d'heure). */
function minuitParis(date: string): number {
  const [a, m, j] = date.split("-").map(Number);
  const minuitUtc = Date.UTC(a, m - 1, j, 0);
  let t = minuitUtc - decalageParis(minuitUtc);
  t = minuitUtc - decalageParis(t); // second passage : décalage réellement en vigueur à minuit
  return t;
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

/**
 * Articles en ligne : ceux publiés à l'instant de CONSTRUCTION du site (meta lhc-instant),
 * jamais selon l'horloge de l'appareil du visiteur, qui peut être déréglée. Un article
 * apparaît avec la reconstruction de son jour de publication.
 */
export const articlesEnLigne = (): Article[] => articlesPublies(TOUS_LES_ARTICLES, instantDeRendu());
