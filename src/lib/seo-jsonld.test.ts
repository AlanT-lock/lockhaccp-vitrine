import { describe, expect, it } from "vitest";
import { softwareAppJsonLd } from "./seo-jsonld";
import { CURRENT_PRICING, PRO_EN_VENTE, PRO_PRICING } from "./launch";

const prix = (d: Date) =>
  ((softwareAppJsonLd(d).offers as { price: string }[])[0]).price;

describe("softwareAppJsonLd", () => {
  it("annonce le prix de lancement avant la bascule", () => {
    expect(prix(new Date("2026-10-15T12:00:00Z"))).toBe("14.90");
  });
  it("annonce la grille courante après le 1er novembre 2026", () => {
    expect(prix(new Date("2026-11-02T12:00:00Z"))).toBe("24.90");
  });
  it("annonce la date de fin de l'offre de lancement, puis plus rien après la bascule", () => {
    const offre = (d: Date) => (softwareAppJsonLd(d).offers as Record<string, unknown>[])[0];
    expect(offre(new Date("2026-10-15T12:00:00Z")).priceValidUntil).toBe("2026-10-31");
    expect(offre(new Date("2026-11-02T12:00:00Z")).priceValidUntil).toBeUndefined();
  });
  it("offre Pro : 29,90 € par mois, 299 € par an (dix mois payés)", () => {
    expect(PRO_PRICING.mainMonthly).toBe(29.9);
    expect(PRO_PRICING.extraMonthly).toBe(9.9);
    expect(CURRENT_PRICING.extraMonthly).toBe(4.9);
    expect(CURRENT_PRICING.extraYearly).toBe(47);
    expect(PRO_PRICING.mainYearly).toBe(299);
  });
  it("n'annonce l'offre Pro (29,90 €) qu'une fois en vente", () => {
    const offres = softwareAppJsonLd(new Date("2026-11-02T12:00:00Z")).offers as { price: string }[];
    if (PRO_EN_VENTE) {
      expect(offres.map((o) => o.price)).toEqual(["24.90", "29.90"]);
    } else {
      expect(offres).toHaveLength(1);
    }
  });
});
