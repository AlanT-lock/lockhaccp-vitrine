import { describe, expect, it } from "vitest";
import { ARBORESCENCE, FAQ_PMS, INTERCALAIRES, NB_DOCUMENTS_EXEMPLE } from "./presentation";

describe("contenu de la page PMS", () => {
  it("les onglets annoncent le même nombre de documents que l'arborescence", () => {
    const parOnglet = Object.fromEntries(INTERCALAIRES.map((i) => [i.id, i.documents]));
    expect(parOnglet.tracabilite).toBe(ARBORESCENCE.find((d) => d.dossier === "Traçabilité")!.fichiers.length);
    expect(parOnglet.affichage).toBe(ARBORESCENCE.find((d) => d.dossier === "Affichage obligatoire")!.fichiers.length);
    expect(INTERCALAIRES.reduce((n, i) => n + i.documents, 0)).toBe(NB_DOCUMENTS_EXEMPLE);
  });
  it("chaque aperçu a un texte alternatif", () => {
    for (const i of INTERCALAIRES) for (const p of i.pages) expect(p.alt.length).toBeGreaterThan(15);
  });
  it("aucune réponse de FAQ ne promet une obligation légale du PMS en restaurant", () => {
    for (const f of FAQ_PMS) expect(f.answer).not.toMatch(/PMS est obligatoire/i);
  });
});
