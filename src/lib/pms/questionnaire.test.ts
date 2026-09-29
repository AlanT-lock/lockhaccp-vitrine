import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ETAPES, erreursEtape, lireBrouillon, nettoyerReponses, questionsDeLEtape, reponsesInitiales, sauverBrouillon,
} from "./questionnaire";
import type { Reponses } from "./genere/types";

describe("étapes du questionnaire", () => {
  it("8 étapes, titres en français", () => {
    expect(ETAPES).toHaveLength(8);
    expect(ETAPES[0].titre).toBe("Votre métier");
    expect(ETAPES[7].titre).toBe("Vos coordonnées");
  });

  it("une boulangerie n'a pas la question sur la viande bovine", () => {
    const ids = questionsDeLEtape(3, reponsesInitiales("boulangerie_patisserie")).map((q) => q.id);
    expect(ids).not.toContain("prep.viande_bovine");
    expect(ids).toContain("prep.cuisson_avance");
  });

  it("la remise en température est posée même sans préparation à l'avance", () => {
    const r = { ...reponsesInitiales("restauration_commerciale"), "prep.cuisson_avance": false } as Reponses;
    expect(questionsDeLEtape(3, r).map((q) => q.id)).toContain("prep.remise_temperature");
  });
});

describe("réponses initiales", () => {
  it("une poissonnerie reçoit un étal à 0 / +2 °C", () => {
    const eqs = reponsesInitiales("poissonnerie")["equipements.froids"] as Array<Record<string, unknown>>;
    expect(eqs.find((e) => e.type === "vitrine_poisson")).toMatchObject({ consigne_min: 0, consigne_max: 2 });
  });

  it("zones et produits pré-remplis", () => {
    const r = reponsesInitiales("restauration_commerciale");
    expect((r["nettoyage.zones"] as unknown[]).length).toBeGreaterThanOrEqual(2);
    expect((r["nettoyage.produits"] as unknown[]).length).toBeGreaterThanOrEqual(3);
  });
});

describe("contrôle par étape", () => {
  const complet = (): Reponses => ({
    ...reponsesInitiales("restauration_commerciale"),
    "coordonnees.nom": "Chez Paul",
    "coordonnees.adresse": "1 rue A",
    "coordonnees.code_postal": "75001",
    "coordonnees.ville": "Paris",
    "coordonnees.telephone": "01 02 03 04 05",
    "coordonnees.email": "paul@exemple.fr",
    "coordonnees.consentement": true,
  }) as Reponses;

  it("étape 8 : e-mail invalide et consentement non coché", () => {
    const r = { ...complet(), "coordonnees.email": "paul", "coordonnees.consentement": false } as Reponses;
    const e = erreursEtape(8, r);
    expect(e["coordonnees.email"]).toMatch(/e-mail/);
    expect(e["coordonnees.consentement"]).toMatch(/consentement|cochez/i);
  });

  it("étape 8 complète : aucune erreur", () => {
    expect(erreursEtape(8, complet())).toEqual({});
  });

  it("étape 3 : une question oui/non sans réponse bloque", () => {
    const r = reponsesInitiales("restauration_commerciale");
    expect(Object.keys(erreursEtape(3, r))).toContain("prep.viande_bovine");
  });
});

describe("nettoyage des réponses", () => {
  it("retire la cellule de refroidissement quand il n'y a plus de préparation à l'avance", () => {
    const r = {
      ...reponsesInitiales("restauration_commerciale"),
      "prep.cuisson_avance": false,
      "equipements.cellule_refroidissement": true,
    } as Reponses;
    expect(nettoyerReponses(r)["equipements.cellule_refroidissement"]).toBeUndefined();
  });
});

describe("brouillon (Review Focus 5)", () => {
  const stock: Record<string, string> = {};
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => stock[k] ?? null,
      setItem: (k: string, v: string) => { stock[k] = v; },
      removeItem: (k: string) => { delete stock[k]; },
    });
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it("enregistré dans le navigateur, jamais envoyé au serveur", () => {
    const r = { ...reponsesInitiales("traiteur"), "coordonnees.nom": "Traiteur Test" } as Reponses;
    sauverBrouillon(r, 4);
    expect(lireBrouillon()).toEqual({ reponses: r, etape: 4 });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("stockage indisponible : aucune erreur", () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("bloqué"); }, setItem: () => { throw new Error("bloqué"); } });
    expect(() => sauverBrouillon(reponsesInitiales("traiteur"), 2)).not.toThrow();
    expect(lireBrouillon()).toBeNull();
  });
});
