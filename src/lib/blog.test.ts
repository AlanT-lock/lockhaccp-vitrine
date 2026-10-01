import { describe, expect, it } from "vitest";
import { articlesPublies, estPublie, type Article } from "./blog";

const art = (slug: string, date: string) => ({ slug, meta: { date } } as unknown as Article);

describe("estPublie", () => {
  it("publie dès minuit heure de Paris (heure d'été)", () => {
    expect(estPublie("2026-10-09", new Date("2026-10-08T21:59:00Z"))).toBe(false);
    expect(estPublie("2026-10-09", new Date("2026-10-08T22:00:00Z"))).toBe(true);
  });
  it("la reconstruction de 23:15 UTC la veille publie l'article du jour", () => {
    expect(estPublie("2026-10-09", new Date("2026-10-08T23:15:00Z"))).toBe(true);
  });
  it("publie dès minuit heure de Paris (heure d'hiver)", () => {
    expect(estPublie("2026-11-06", new Date("2026-11-05T22:59:00Z"))).toBe(false);
    expect(estPublie("2026-11-06", new Date("2026-11-05T23:00:00Z"))).toBe(true);
  });
});

describe("articlesPublies", () => {
  it("masque les articles futurs et trie du plus récent au plus ancien", () => {
    const liste = [art("a", "2026-05-11"), art("c", "2026-10-16"), art("b", "2026-10-02")];
    expect(articlesPublies(liste, new Date("2026-10-03T12:00:00Z")).map((a) => a.slug)).toEqual(["b", "a"]);
  });
});
