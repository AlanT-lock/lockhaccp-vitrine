import { beforeEach, describe, expect, it } from "vitest";

type Appel = unknown[];
const g = globalThis as unknown as { window?: { gtag?: (...a: unknown[]) => void } };

describe("conversions Google Ads du PMS", () => {
  let appels: Appel[];
  beforeEach(async () => {
    appels = [];
    g.window = { gtag: (...a: unknown[]) => appels.push(a) };
    const m = await import("./googleAds");
    m.reinitialiserPourTests();
  });

  it("« PMS commencé » part une seule fois, même si le métier change", async () => {
    const { conversionPms } = await import("./googleAds");
    conversionPms("commence");
    conversionPms("commence");
    expect(appels).toEqual([
      ["event", "conversion", { send_to: "AW-18490045299/SiVLCLLPio4dEPPm3vBE", value: 1.0, currency: "EUR" }],
    ]);
  });

  it("« PMS généré » envoie sa propre conversion", async () => {
    const { conversionPms } = await import("./googleAds");
    conversionPms("genere");
    expect(appels[0]).toEqual(["event", "conversion", { send_to: "AW-18490045299/jzJHCLXPio4dEPPm3vBE", value: 1.0, currency: "EUR" }]);
  });

  it("ne plante pas si la balise n'est pas chargée (bloqueur de publicité)", async () => {
    g.window = {};
    const { conversionPms } = await import("./googleAds");
    expect(() => conversionPms("genere")).not.toThrow();
  });
});
