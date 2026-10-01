import { describe, expect, it } from "vitest";
import {
  lireEntete, validerMeta, verifierCharte, verifierLienPms, slugTitre, tempsDeLecture, compterMots,
} from "./lib.mjs";

const SOURCES = "\n\n## Sources\n\n- [Règlement 852/2004](https://eur-lex.europa.eu/eli/reg/2004/852/oj)\n";

describe("lireEntete", () => {
  it("sépare l'en-tête et le corps", () => {
    const { meta, corps } = lireEntete('---\ntitre: "Bonjour : test"\ndate: 2026-10-02\n---\n\nTexte.');
    expect(meta).toEqual({ titre: "Bonjour : test", date: "2026-10-02" });
    expect(corps.trim()).toBe("Texte.");
  });
  it("refuse un fichier sans en-tête", () => {
    expect(() => lireEntete("Texte seul")).toThrow(/en-tête/);
  });
});

describe("validerMeta", () => {
  const ok = { titre: "T", description: "D", date: "2026-10-02", motCle: "k", resume: "R" };
  it("accepte un en-tête complet", () => expect(validerMeta(ok, "a.md")).toEqual([]));
  it("signale un champ manquant en nommant le fichier", () => {
    expect(validerMeta({ ...ok, resume: "" }, "a.md").join()).toMatch(/a\.md.*resume/);
  });
  it("refuse une description trop longue et une date invalide", () => {
    const e = validerMeta({ ...ok, description: "x".repeat(161), date: "02/10/2026" }, "a.md").join();
    expect(e).toMatch(/description/);
    expect(e).toMatch(/date/);
  });
});

describe("verifierCharte", () => {
  it("accepte un texte sobre avec sources", () => {
    expect(verifierCharte("Je vous explique. Court." + SOURCES)).toEqual([]);
  });
  it("refuse les formules typiques d'un texte généré", () => {
    for (const f of ["Dans cet article, on voit.", "En conclusion, voilà.", "Il est important de noter que x.", "N'hésitez pas à demander.", "C'est crucial."]) {
      expect(verifierCharte(f + SOURCES).length, f).toBeGreaterThan(0);
    }
  });
  it("limite les tirets cadratins, le gras, les listes et refuse les emojis", () => {
    expect(verifierCharte("a — b — c — d" + SOURCES).join()).toMatch(/tirets/);
    expect(verifierCharte("**a** **b** **c** **d** **e**" + SOURCES).join()).toMatch(/gras/);
    const listes = "\n\n- a\n- b\n\nTexte.\n\n- c\n\nTexte.\n\n- d\n\nTexte.\n\n- e\n";
    expect(verifierCharte(listes + SOURCES).join()).toMatch(/listes/);
    expect(verifierCharte("Super 👍" + SOURCES).join()).toMatch(/emoji/);
  });
  it("exige une section Sources avec un lien", () => {
    expect(verifierCharte("Texte.").join()).toMatch(/Sources/);
  });
});

describe("verifierLienPms", () => {
  it("exige le lien vers la page PMS quand le PMS est évoqué", () => {
    expect(verifierLienPms("Votre PMS doit être à jour.").join()).toMatch(/plan-de-maitrise-sanitaire/);
    expect(verifierLienPms("Votre [PMS](/plan-de-maitrise-sanitaire) doit être à jour.")).toEqual([]);
    expect(verifierLienPms("Rien à voir.")).toEqual([]);
  });
});

describe("slugTitre / tempsDeLecture", () => {
  it("fabrique une ancre lisible", () => expect(slugTitre("Et si le frigo dépasse 4 °C ?")).toBe("et-si-le-frigo-depasse-4-c"));
  it("compte au moins une minute", () => {
    expect(tempsDeLecture(compterMots("un deux trois"))).toBe(1);
    expect(tempsDeLecture(1100)).toBe(5);
  });
});
