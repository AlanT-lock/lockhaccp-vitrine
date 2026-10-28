import { describe, expect, it } from "vitest";
import {
  CAPTEURS_EN_VENTE,
  FAQ_CAPTEURS,
  PRIX_CAPTEUR_ANNUEL,
  PRIX_CAPTEUR_MENSUEL,
  capteursProductJsonLd,
  lienCommandeCapteurs,
} from "./capteurs";
import { PAGES_FIXES } from "./pages";

const offre = (enVente: boolean) =>
  capteursProductJsonLd(enVente).offers as { price: string; availability: string; priceSpecification: { valueAddedTaxIncluded: boolean } };

describe("capteurs connectés", () => {
  it("4,90 € TTC par mois, 49 € par an (10 mois payés)", () => {
    expect(PRIX_CAPTEUR_MENSUEL).toBe(4.9);
    expect(PRIX_CAPTEUR_ANNUEL).toBe(49);
  });
  it("en vente depuis la création des prix Stripe (28/10/2026)", () => {
    expect(CAPTEURS_EN_VENTE).toBe(true);
  });
  it("hors vente : le bouton mène au formulaire de contact", () => {
    const lien = lienCommandeCapteurs(false);
    expect(lien.href).toBe("/contact?sujet=capteurs#formulaire");
    expect(lien.externe).toBe(false);
    expect(lien.libelle).toMatch(/Bientôt disponible/);
  });
  it("en vente : le bouton mène à l'application", () => {
    const lien = lienCommandeCapteurs(true);
    expect(lien.externe).toBe(true);
    expect(lien.href).toMatch(/^https:\/\//);
  });
  it("données structurées : prix TTC, précommande tant que pas en vente", () => {
    expect(offre(false).price).toBe("4.90");
    expect(offre(false).availability).toBe("https://schema.org/PreOrder");
    expect(offre(true).availability).toBe("https://schema.org/InStock");
    expect(offre(false).priceSpecification.valueAddedTaxIncluded).toBe(true);
  });
  it("FAQ : internet, piles, résiliation, matériel", () => {
    const q = FAQ_CAPTEURS.map((f) => f.question).join(" ");
    for (const mot of ["internet", "piles", "résilier", "matériel"]) expect(q).toContain(mot);
  });
  it("aucun tiret long dans les textes", () => {
    expect(JSON.stringify(FAQ_CAPTEURS)).not.toContain("—");
  });
  it("la page dédiée est une page publique du sitemap", () => {
    const page = PAGES_FIXES.find((p) => p.path === "/capteurs-connectes");
    expect(page?.sitemap).not.toBeNull();
  });
});
