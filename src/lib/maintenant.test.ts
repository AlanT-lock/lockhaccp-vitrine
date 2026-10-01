import { afterEach, describe, expect, it } from "vitest";
import { META_INSTANT, instantDeRendu } from "./maintenant";

const docAvecMeta = (contenu: string | null) => ({
  querySelector: (sel: string) =>
    sel === `meta[name="${META_INSTANT}"]` && contenu !== null
      ? { getAttribute: () => contenu }
      : null,
});

afterEach(() => {
  delete (globalThis as { __LHC_INSTANT__?: Date }).__LHC_INSTANT__;
});

describe("instantDeRendu", () => {
  it("côté pré-génération : l'instant fixé pour tout le build", () => {
    const fixe = new Date("2026-10-31T23:15:00Z");
    (globalThis as { __LHC_INSTANT__?: Date }).__LHC_INSTANT__ = fixe;
    expect(instantDeRendu(undefined)).toEqual(fixe);
  });
  it("à l'hydratation : l'instant de construction écrit dans la page", () => {
    // Page construite avant la bascule, visitée après : on reprend l'instant du build.
    expect(instantDeRendu(docAvecMeta("2026-10-31T22:00:00.000Z")))
      .toEqual(new Date("2026-10-31T22:00:00.000Z"));
  });
  it("sans page pré-générée (admin, dev) : maintenant", () => {
    const avant = Date.now();
    const t = instantDeRendu(docAvecMeta(null)).getTime();
    expect(t).toBeGreaterThanOrEqual(avant);
  });
  it("ignore une meta illisible", () => {
    const avant = Date.now();
    expect(instantDeRendu(docAvecMeta("pas une date")).getTime()).toBeGreaterThanOrEqual(avant);
  });
});
