import { describe, expect, it } from "vitest";
import { economieAnnuelle, mensuelEquivalent } from "./tarifs-affichage";
import { CURRENT_PRICING, PRO_PRICING, formatPriceEUR } from "./launch";

describe("affichage des tarifs annuels", () => {
  it("offre LockHACCP : 249 € par an, soit 20,75 € par mois", () => {
    expect(formatPriceEUR(mensuelEquivalent(CURRENT_PRICING.mainYearly))).toBe("20,75€");
  });
  it("établissement supplémentaire et Pro arrondis au centime", () => {
    expect(formatPriceEUR(mensuelEquivalent(CURRENT_PRICING.extraYearly))).toBe("3,92€");
    expect(formatPriceEUR(mensuelEquivalent(PRO_PRICING.mainYearly))).toBe("24,92€");
  });
  it("l'équivalent mensuel en annuel est toujours sous le prix au mois", () => {
    for (const g of [CURRENT_PRICING, PRO_PRICING]) {
      expect(mensuelEquivalent(g.mainYearly)).toBeLessThan(g.mainMonthly);
      expect(mensuelEquivalent(g.extraYearly)).toBeLessThan(g.extraMonthly);
    }
  });
  it("économie annuelle : 2 mois offerts sur 24,90 € = 49,80 €", () => {
    expect(economieAnnuelle(CURRENT_PRICING.mainMonthly, CURRENT_PRICING.mainYearly)).toBe(49.8);
  });
});
