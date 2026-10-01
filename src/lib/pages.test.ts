import { describe, expect, it } from "vitest";
import { PAGES_PUBLIQUES, filAriane, type PagePublique } from "./pages";

const pages: PagePublique[] = [
  { path: "/", fil: "Accueil", sitemap: null, llms: true },
  { path: "/blog", fil: "Ressources", sitemap: null, llms: true },
  { path: "/blog/article", fil: "Article", sitemap: null, llms: true },
  { path: "/fonctionnalites/temperatures", fil: "Températures", sitemap: null, llms: true },
];

describe("filAriane", () => {
  it("est vide pour l'accueil", () => {
    expect(filAriane("/", pages)).toEqual([]);
  });
  it("passe par les pages intermédiaires qui existent", () => {
    expect(filAriane("/blog/article", pages)).toEqual([
      { name: "Accueil", path: "/" },
      { name: "Ressources", path: "/blog" },
      { name: "Article", path: "/blog/article" },
    ]);
  });
  it("saute un niveau intermédiaire qui n'est pas une page", () => {
    expect(filAriane("/fonctionnalites/temperatures", pages)).toEqual([
      { name: "Accueil", path: "/" },
      { name: "Températures", path: "/fonctionnalites/temperatures" },
    ]);
  });
  it("est vide pour une page inconnue (admin, 404)", () => {
    expect(filAriane("/admin", pages)).toEqual([]);
  });
});

describe("PAGES_PUBLIQUES", () => {
  it("n'a pas de chemin en double", () => {
    const chemins = PAGES_PUBLIQUES.map((p) => p.path);
    expect(new Set(chemins).size).toBe(chemins.length);
  });
  it("ne contient ni l'admin ni de chemin avec slash final", () => {
    for (const p of PAGES_PUBLIQUES) {
      expect(p.path.startsWith("/admin")).toBe(false);
      if (p.path !== "/") expect(p.path.endsWith("/")).toBe(false);
    }
  });
  it("contient /app (affichée sur ordinateur) hors sitemap", () => {
    const app = PAGES_PUBLIQUES.find((p) => p.path === "/app");
    expect(app?.sitemap).toBeNull();
  });
});

describe("pagesPubliques", () => {
  const article = (slug: string, date: string) =>
    ({ slug, meta: { titre: `Titre ${slug}`, date } }) as unknown as import("./blog").Article;
  it("ajoute les articles publiés et ignore ceux à venir", async () => {
    const { pagesPubliques } = await import("./pages");
    const pages = pagesPubliques(new Date("2026-10-03T12:00:00Z"), [
      article("deja-la", "2026-10-02"),
      article("a-venir", "2026-10-09"),
    ]);
    const blog = pages.filter((p) => p.path.startsWith("/blog/"));
    expect(blog).toEqual([
      { path: "/blog/deja-la", fil: "Titre deja-la", sitemap: { changefreq: "monthly", priority: 0.6 }, llms: true },
    ]);
  });
  it("contient la page auteur", async () => {
    const { PAGES_FIXES } = await import("./pages");
    expect(PAGES_FIXES.some((p) => p.path === "/auteur/alan-touati")).toBe(true);
  });
});
