import { describe, expect, it } from "vitest";
import {
  ajouterSurfacePerso, ajouterZonePerso, basculerSurface, basculerZone, changerFrequence, renommerZone,
  surfacesProposees, zonesInitiales, zonesProposees,
} from "./nettoyage";
import type { ElementListe } from "./genere/types";

const zones = () => zonesInitiales("restauration_commerciale");
const surfaces = (z: ElementListe) => (z.surfaces ?? []) as ElementListe[];

describe("zones initiales", () => {
  it("seules les zones précochées, avec leurs surfaces courantes", () => {
    const z = zones();
    expect(z.map((x) => x.nom)).toEqual(["Cuisine", "Plonge", "Réserve", "Sanitaires"]);
    const cuisine = surfaces(z[0]).map((s) => s.nom);
    expect(cuisine).toContain("Plans de travail");
    expect(cuisine).not.toContain("Trancheuse");
    expect(surfaces(z[0])[0]).toEqual({ nom: "Plans de travail", frequence: "Quotidien" });
  });

  it("les zones proposées dépendent du métier", () => {
    expect(zonesProposees("boulangerie_patisserie").map((z) => z.nom)).toContain("Fournil");
    expect(zonesProposees("restauration_commerciale").map((z) => z.nom)).not.toContain("Fournil");
  });
});

describe("cocher et décocher", () => {
  it("cocher une zone facultative l'ajoute avec ses surfaces courantes ; décocher la retire", () => {
    const avec = basculerZone(zones(), "restauration_commerciale", "Bar", true);
    const bar = avec.find((z) => z.nom === "Bar")!;
    expect(surfaces(bar).map((s) => s.nom)).toContain("Comptoir");
    expect(surfaces(bar).map((s) => s.nom)).not.toContain("Tireuse à bière");
    expect(basculerZone(avec, "restauration_commerciale", "Bar", false).some((z) => z.nom === "Bar")).toBe(false);
  });

  it("l'ordre du catalogue est respecté quand on recoche une zone", () => {
    const sans = basculerZone(zones(), "restauration_commerciale", "Plonge", false);
    const avec = basculerZone(sans, "restauration_commerciale", "Plonge", true);
    expect(avec.map((z) => z.nom)).toEqual(["Cuisine", "Plonge", "Réserve", "Sanitaires"]);
  });

  it("surfaces : cocher une surface facultative, changer une fréquence, décocher", () => {
    let z = zones()[0];
    z = basculerSurface(z, "restauration_commerciale", "Trancheuse", true);
    expect(surfaces(z).find((s) => s.nom === "Trancheuse")).toEqual({ nom: "Trancheuse", frequence: "Quotidien" });
    z = changerFrequence(z, "Trancheuse", "Hebdo");
    expect(surfaces(z).find((s) => s.nom === "Trancheuse")!.frequence).toBe("Hebdo");
    z = basculerSurface(z, "restauration_commerciale", "Sols", false);
    expect(surfaces(z).some((s) => s.nom === "Sols")).toBe(false);
  });
});

describe("zones et surfaces personnalisées (Review Focus 4)", () => {
  it("zone perso : ajoutée sans surface, surfaces ajoutables, pas de doublon de nom", () => {
    let z = ajouterZonePerso(zones(), "  Terrasse ");
    const terrasse = z.find((x) => x.nom === "Terrasse")!;
    expect(surfaces(terrasse)).toEqual([]);
    expect(surfacesProposees("restauration_commerciale", "Terrasse")).toEqual([]);
    expect(ajouterZonePerso(z, "terrasse").filter((x) => x.nom.toLowerCase() === "terrasse")).toHaveLength(1);
    expect(ajouterZonePerso(z, "   ")).toBe(z);
    z = z.map((x) => (x.nom === "Terrasse" ? ajouterSurfacePerso(x, "Mobilier extérieur") : x));
    expect(surfaces(z.find((x) => x.nom === "Terrasse")!)).toEqual([{ nom: "Mobilier extérieur", frequence: "Quotidien" }]);
  });

  it("surface perso : ajoutée une seule fois, même si elle existe au catalogue", () => {
    let c = zones()[0];
    c = ajouterSurfacePerso(c, "sols");
    expect(surfaces(c).filter((s) => s.nom.toLowerCase() === "sols")).toHaveLength(1);
    c = basculerSurface(c, "restauration_commerciale", "Sols", false);
    c = ajouterSurfacePerso(c, "Sols");
    expect(surfaces(c).filter((s) => s.nom === "Sols")).toHaveLength(1);
  });

  it("renommer une zone perso garde ses surfaces", () => {
    let z = ajouterZonePerso(zones(), "Terrase");
    z = z.map((x) => (x.nom === "Terrase" ? ajouterSurfacePerso(x, "Tables") : x));
    z = renommerZone(z, "Terrase", "Terrasse");
    expect(surfaces(z.find((x) => x.nom === "Terrasse")!).map((s) => s.nom)).toEqual(["Tables"]);
  });
});
