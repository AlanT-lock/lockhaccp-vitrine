import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ETAPES, ecranDesErreurs, ecransEtape, erreursEcran, erreursEtape, premierEcranEnErreur, valeurSaisie, lireBrouillon, nettoyerReponses, premiereEtapeEnErreur, questionsDeLEtape, repartirErreursServeur,
  reponsesInitiales, sauverBrouillon,
} from "./questionnaire";
import type { ElementListe, Reponses } from "./genere/types";

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

  it("zones précochées pré-remplies, plus de liste de produits (v2)", () => {
    const r = reponsesInitiales("restauration_commerciale");
    expect((r["nettoyage.zones"] as unknown[]).length).toBe(5);
    expect(r["nettoyage.produits"]).toBeUndefined();
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

  it("étape 4 : consigne manquante et plus de 20 équipements refusés, comme sur le serveur (revue finale I7)", () => {
    const sansConsigne = { ...complet(), "equipements.froids": [{ nom: "Frigo", type: "refrigerateur" }] } as Reponses;
    expect(erreursEtape(4, sansConsigne)["equipements.froids"]).toMatch(/consigne/i);
    const trop = Array.from({ length: 21 }, (_, i) => ({ nom: `F${i}`, type: "refrigerateur", consigne_max: 4 }));
    expect(erreursEtape(4, { ...complet(), "equipements.froids": trop } as Reponses)["equipements.froids"]).toMatch(/20/);
    const nomLong = [{ nom: "N".repeat(81), type: "refrigerateur", consigne_max: 4 }];
    expect(erreursEtape(4, { ...complet(), "equipements.froids": nomLong } as Reponses)["equipements.froids"]).toMatch(/80/);
  });

  it("étape 5 : surfaces bornées comme sur le serveur (revue finale I7)", () => {
    const surfaces = Array.from({ length: 30 }, (_, i) => ({ nom: `S${i}`, frequence: "Hebdo" }));
    const zones = Array.from({ length: 6 }, (_, i) => ({ nom: `Z${i}`, surfaces }));
    expect(erreursEtape(5, { ...complet(), "nettoyage.zones": zones } as Reponses)["nettoyage.zones"]).toMatch(/150/);
  });
});

describe("avant l'envoi (revue finale I7)", () => {
  it("renvoie la première étape incomplète", () => {
    expect(premiereEtapeEnErreur(reponsesInitiales("restauration_commerciale"))).toBe(2);
    expect(premiereEtapeEnErreur({} as Reponses)).toBe(1);
  });

  it("erreurs du serveur rangées sous leur question, on revient à la plus en amont", () => {
    const r = repartirErreursServeur([
      "coordonnees.email : adresse e-mail invalide",
      "prep.viande_bovine : réponse manquante",
      "Métier inconnu",
    ]);
    expect(r.etape).toBe(3);
    expect(r.erreurs).toEqual({
      "coordonnees.email": "adresse e-mail invalide",
      "prep.viande_bovine": "réponse manquante",
    });
    expect(repartirErreursServeur(["Demande illisible"]).etape).toBeNull();
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

  it("brouillon d'une ancienne version du questionnaire ignoré (revue finale I7)", () => {
    sauverBrouillon(reponsesInitiales("traiteur"), 4);
    const brut = JSON.parse(stock["lockhaccp-pms-brouillon"]);
    expect(brut.version).toBeTruthy();
    stock["lockhaccp-pms-brouillon"] = JSON.stringify({ ...brut, version: "2020.0" });
    expect(lireBrouillon()).toBeNull();
  });

  it("brouillon de la version 2026.1 repris, sans les réponses supprimées (revue finale I4)", () => {
    const ancien = { ...reponsesInitiales("traiteur"), "nettoyage.produits": [{ nom: "Javel" }], "nettoyage.prestataire_nuisibles": true };
    stock["lockhaccp-pms-brouillon"] = JSON.stringify({ version: "2026.1", reponses: ancien, etape: 6 });
    const b = lireBrouillon();
    expect(b?.etape).toBe(6);
    expect(b?.reponses.metier).toBe("traiteur");
    expect(b?.reponses["nettoyage.produits"]).toBeUndefined();
    expect(b?.reponses["nettoyage.prestataire_nuisibles"]).toBeUndefined();
    expect(b?.reponses["nettoyage.zones"]).toEqual(ancien["nettoyage.zones"]);
  });

  it("stockage indisponible : aucune erreur", () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("bloqué"); }, setItem: () => { throw new Error("bloqué"); } });
    expect(() => sauverBrouillon(reponsesInitiales("traiteur"), 2)).not.toThrow();
    expect(lireBrouillon()).toBeNull();
  });
});

describe("étape 5 : un écran par zone (v2)", () => {
  const r = () => ({ ...reponsesInitiales("restauration_commerciale") }) as Reponses;

  it("écrans : choix des zones, une page par zone, puis le produit", () => {
    const e = ecransEtape(5, r());
    expect(e[0]).toEqual({ type: "zones" });
    expect(e.slice(1, 6)).toEqual([0, 1, 2, 3, 4].map((index) => ({ type: "zone", index })));
    expect(e[6]).toEqual({ type: "questions" });
    expect(ecransEtape(3, r())).toEqual([{ type: "questions" }]);
  });

  it("écran des zones : au moins une zone", () => {
    const vide = { ...r(), "nettoyage.zones": [] } as Reponses;
    expect(erreursEcran(5, { type: "zones" }, vide)["nettoyage.zones"]).toMatch(/zone/i);
    expect(erreursEcran(5, { type: "zones" }, r())).toEqual({});
  });

  it("écran d'une zone : au moins une surface, seulement pour cette zone", () => {
    const zones = r()["nettoyage.zones"] as ElementListe[];
    zones[1] = { ...zones[1], surfaces: [] };
    const x = { ...r(), "nettoyage.zones": zones } as Reponses;
    expect(erreursEcran(5, { type: "zone", index: 1 }, x)["nettoyage.zones"]).toMatch(/surface/i);
    expect(erreursEcran(5, { type: "zone", index: 0 }, x)).toEqual({});
  });

  it("écran final de l'étape 5 : le produit est facultatif, les zones n'y sont pas contrôlées", () => {
    const zones = r()["nettoyage.zones"] as ElementListe[];
    zones[1] = { ...zones[1], surfaces: [] };
    expect(erreursEcran(5, { type: "questions" }, { ...r(), "nettoyage.zones": zones } as Reponses)).toEqual({});
  });

  it("une zone sans surface bloque toujours l'envoi final", () => {
    const zones = r()["nettoyage.zones"] as ElementListe[];
    zones[0] = { ...zones[0], surfaces: [] };
    expect(Object.keys(erreursEtape(5, { ...r(), "nettoyage.zones": zones } as Reponses))).toContain("nettoyage.zones");
  });
});

describe("erreurs sur le bon écran (revue finale I1)", () => {
  const complet = () => ({ ...reponsesInitiales("restauration_commerciale") }) as Reponses;

  it("texte facultatif effacé : non envoyé ; obligatoire : conservé", () => {
    const produit = QUESTIONS_ETAPE5().find((q) => q.id === "nettoyage.produit")!;
    expect(valeurSaisie(produit, "   ")).toBeUndefined();
    expect(valeurSaisie(produit, "Javel")).toBe("Javel");
    const nom = { ...produit, obligatoire: true };
    expect(valeurSaisie(nom, "")).toBe("");
  });

  it("erreur serveur sur le produit : dernier écran de l'étape 5", () => {
    const r = complet();
    expect(ecranDesErreurs(5, ["nettoyage.produit"], r)).toBe(ecransEtape(5, r).length - 1);
  });

  it("zone sans surface : écran de cette zone", () => {
    const r = complet();
    const zones = r["nettoyage.zones"] as ElementListe[];
    zones[2] = { ...zones[2], surfaces: [] };
    expect(ecranDesErreurs(5, ["nettoyage.zones"], r)).toBe(3);
  });

  it("premier écran incomplet de tout le questionnaire", () => {
    const r = complet();
    expect(premierEcranEnErreur(r)).toEqual({ etape: 2, ecran: 0 });
    expect(premierEcranEnErreur({} as Reponses)).toEqual({ etape: 1, ecran: 0 });
  });
});

function QUESTIONS_ETAPE5() {
  return questionsDeLEtape(5, reponsesInitiales("restauration_commerciale"));
}

describe("plafonds alignés sur le serveur (revue finale I3)", () => {
  it("15 zones au plus, dès l'écran du choix des zones ; 5 friteuses au plus", () => {
    const r = reponsesInitiales("restauration_commerciale");
    const zones = Array.from({ length: 16 }, (_, i) => ({ nom: `Zone ${i}`, surfaces: [{ nom: "Sols", frequence: "Hebdo" }] }));
    expect(erreursEcran(5, { type: "zones" }, { ...r, "nettoyage.zones": zones } as Reponses)["nettoyage.zones"]).toMatch(/15/);
    const friteuses = Array.from({ length: 6 }, (_, i) => ({ nom: `F${i}` }));
    expect(erreursEtape(4, { ...r, "equipements.friteuses": friteuses } as Reponses)["equipements.friteuses"]).toMatch(/5/);
  });
});
