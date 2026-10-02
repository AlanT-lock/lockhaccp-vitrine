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

describe("extraireFaq", () => {
  it("lit les questions (h3) et leur première réponse sous « Questions fréquentes »", async () => {
    const { extraireFaq } = await import("./blog");
    const html = '<h2 id="intro">Intro</h2><p>x</p><h2 id="questions-frequentes">Questions fréquentes</h2>' +
      '<h3 id="q1">Faut-il un thermomètre ?</h3>\n<p>Oui, à <strong>sonde</strong>.</p>\n<h3 id="q2">Et le papier ?</h3><p>Ça marche.</p>' +
      '<h2 id="sources">Sources</h2><ul><li>a</li></ul>';
    expect(extraireFaq(html)).toEqual([
      { question: "Faut-il un thermomètre ?", answer: "Oui, à sonde." },
      { question: "Et le papier ?", answer: "Ça marche." },
    ]);
  });
  it("renvoie une liste vide sans section FAQ", async () => {
    const { extraireFaq } = await import("./blog");
    expect(extraireFaq("<h2>Autre</h2><p>x</p>")).toEqual([]);
  });
});

describe("dateLongue", () => {
  it("affiche la date en français", async () => {
    const { dateLongue } = await import("./blog");
    expect(dateLongue("2026-10-02")).toBe("2 octobre 2026");
  });
});

describe("articlesEnLigne", () => {
  it("dépend de l'instant de construction, pas de l'horloge de l'appareil", async () => {
    const { articlesEnLigne } = await import("./blog");
    const g = globalThis as { __LHC_INSTANT__?: Date };
    g.__LHC_INSTANT__ = new Date("2026-10-03T12:00:00Z");
    const slugs = articlesEnLigne().map((a) => a.slug);
    delete g.__LHC_INSTANT__;
    expect(slugs).toContain("controle-sanitaire-restaurant-inspecteur-ddpp");
    expect(slugs).not.toContain("difference-pms-haccp");
  });
});
