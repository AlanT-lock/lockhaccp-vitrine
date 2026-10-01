// Source unique des pages publiques : routeur, pré-génération, sitemap, llms.txt.
import liste from "@/pages-publiques.json";

export interface PagePublique {
  path: string;
  /** Libellé court, utilisé dans le fil d'Ariane et llms.txt. */
  fil: string;
  sitemap: { changefreq: string; priority: number } | null;
  /** La page figure-t-elle dans llms.txt ? */
  llms: boolean;
}

export const PAGES_PUBLIQUES: PagePublique[] = liste;

/** Fil d'Ariane d'une page : accueil, pages intermédiaires existantes, page courante. */
export function filAriane(
  path: string,
  pages: PagePublique[] = PAGES_PUBLIQUES,
): { name: string; path: string }[] {
  const courante = pages.find((p) => p.path === path);
  if (!courante || path === "/") return [];
  const parPath = new Map(pages.map((p) => [p.path, p]));
  const segments = path.split("/").filter(Boolean);
  const fil: { name: string; path: string }[] = [];
  const accueil = parPath.get("/");
  if (accueil) fil.push({ name: accueil.fil, path: "/" });
  for (let i = 1; i <= segments.length; i++) {
    const prefixe = "/" + segments.slice(0, i).join("/");
    const page = parPath.get(prefixe);
    if (page) fil.push({ name: page.fil, path: prefixe });
  }
  return fil;
}
