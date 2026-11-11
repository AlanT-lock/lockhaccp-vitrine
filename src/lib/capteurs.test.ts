import { describe, expect, it } from "vitest";
import {
  CAPTEURS_EN_VENTE,
  FAQ_CAPTEURS,
  PRIX_CAPTEUR,
  PRIX_PASSERELLE,
  POINTS_CAPTEURS,
  prixKit,
  capteursProductJsonLd,
  lienCommandeCapteurs,
} from "./capteurs";
import { PAGES_FIXES } from "./pages";

const offre = (enVente: boolean) =>
  capteursProductJsonLd(enVente).offers as { price: string; availability: string; priceSpecification?: unknown };

describe("capteurs connectés", () => {
  it("kit en paiement unique : passerelle 200 €, 60 € par capteur (comme l'app et Stripe)", () => {
    expect(PRIX_PASSERELLE).toBe(200);
    expect(PRIX_CAPTEUR).toBe(60);
    expect(prixKit(3)).toBe(380);
    expect(prixKit(2, false)).toBe(120);
  });
  it("plus aucune trace du modèle de location (mensuel, renvoi, passerelle incluse)", () => {
    const tout = JSON.stringify([POINTS_CAPTEURS, FAQ_CAPTEURS]);
    for (const mot of ["par mois", "renvoyez", "notre propriété", "Passerelle incluse", "résilier"]) expect(tout).not.toContain(mot);
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
  it("données structurées : prix unique du capteur, précommande tant que pas en vente", () => {
    expect(offre(false).price).toBe("60.00");
    expect(offre(false).availability).toBe("https://schema.org/PreOrder");
    expect(offre(true).availability).toBe("https://schema.org/InStock");
    expect(offre(false).priceSpecification).toBeUndefined();
  });
  it("FAQ : internet, piles, abonnement, matériel", () => {
    const q = FAQ_CAPTEURS.map((f) => f.question).join(" ");
    for (const mot of ["internet", "piles", "abonnement", "matériel"]) expect(q).toContain(mot);
  });
  it("aucun tiret long dans les textes", () => {
    expect(JSON.stringify(FAQ_CAPTEURS)).not.toContain("—");
  });
  it("la page dédiée est une page publique du sitemap", () => {
    const page = PAGES_FIXES.find((p) => p.path === "/capteurs-connectes");
    expect(page?.sitemap).not.toBeNull();
  });
});
