import { describe, expect, it } from "vitest";
import { convertirArticle } from "./plugin-articles.mjs";

const OK = `---
titre: Titre
description: Desc
date: 2026-10-02
motCle: test
resume: Résumé.
---

Intro.

## Et si le frigo dépasse 4 °C ?

Texte avec [lien](/plan-de-maitrise-sanitaire) sur le PMS.

| A | B |
|---|---|
| 1 | 2 |

## Sources

- [Texte](https://www.legifrance.gouv.fr/)
`;

describe("convertirArticle", () => {
  it("produit le HTML, les ancres et le sommaire", () => {
    const a = convertirArticle(OK, "ok.md");
    expect(a.html).toContain('<h2 id="et-si-le-frigo-depasse-4-c">');
    expect(a.sommaire).toEqual([
      { id: "et-si-le-frigo-depasse-4-c", titre: "Et si le frigo dépasse 4 °C ?" },
    ]);
    expect(a.html).toContain('<div class="article-tableau"><table>');
    expect(a.html).toContain('href="https://www.legifrance.gouv.fr/" rel="noopener" target="_blank"');
    expect(a.lecture).toBe(1);
  });
  it("échoue en nommant le fichier et toutes les règles violées", () => {
    const mauvais = OK.replace("Intro.", "Dans cet article — a — b — c.").replace("[lien](/plan-de-maitrise-sanitaire) ", "");
    expect(() => convertirArticle(mauvais, "mauvais.md")).toThrow(/mauvais\.md[\s\S]*formule interdite[\s\S]*tirets[\s\S]*plan-de-maitrise-sanitaire/);
  });
});

describe("plugin articles()", () => {
  it("la variante ?meta ne contient pas le corps de l'article", async () => {
    const { articles } = await import("./plugin-articles.mjs");
    const p = articles();
    const meta = p.transform(OK, "/x/content/blog/essai.md?meta").code;
    const complet = p.transform(OK, "/x/content/blog/essai.md").code;
    expect(meta).toContain('"slug":"essai"');
    expect(meta).toContain('"sommaire"');
    expect(meta).not.toContain('"html"');
    expect(complet).toContain('"html"');
  });
});
