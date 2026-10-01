import { describe, expect, it } from "vitest";
import { softwareAppJsonLd } from "./seo-jsonld";

const prix = (d: Date) =>
  ((softwareAppJsonLd(d).offers as { price: string }[])[0]).price;

describe("softwareAppJsonLd", () => {
  it("annonce le prix de lancement avant la bascule", () => {
    expect(prix(new Date("2026-10-15T12:00:00Z"))).toBe("14.90");
  });
  it("annonce la grille courante après le 1er novembre 2026", () => {
    expect(prix(new Date("2026-11-02T12:00:00Z"))).toBe("24.90");
  });
});
