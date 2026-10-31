import { beforeEach, describe, expect, it } from "vitest";
import { enregistrerChoix, lireChoix, TOUT_ACCEPTER, TOUT_REFUSER } from "./consentement";

const JOUR = 24 * 60 * 60 * 1000;
type Appel = unknown[];

describe("consentement aux cookies", () => {
  let appels: Appel[];
  let dataLayer: unknown[];
  let chargements: number;

  beforeEach(() => {
    const donnees = new Map<string, string>();
    appels = [];
    dataLayer = [];
    chargements = 0;
    Object.assign(globalThis, {
      localStorage: { getItem: (k: string) => donnees.get(k) ?? null, setItem: (k: string, v: string) => void donnees.set(k, v) },
      document: { cookie: "" },
      window: {
        location: { hostname: "lockhaccp.fr" },
        gtag: (...a: unknown[]) => appels.push(a),
        dataLayer,
        lhcChargerGoogleTag: () => chargements++,
      },
    });
  });

  it("aucun choix au départ : le bandeau s'affiche", () => {
    expect(lireChoix()).toBeNull();
  });

  it("un accord reste valable 13 mois", () => {
    enregistrerChoix({ mesure: true, publicite: false }, 0);
    expect(lireChoix(390 * JOUR)).toEqual({ mesure: true, publicite: false });
    expect(lireChoix(400 * JOUR)).toBeNull();
  });

  it("un refus total reste valable 6 mois", () => {
    enregistrerChoix(TOUT_REFUSER, 0);
    expect(lireChoix(180 * JOUR)).toEqual(TOUT_REFUSER);
    expect(lireChoix(190 * JOUR)).toBeNull();
  });

  it("une valeur abîmée ou d'un ancien format est ignorée", () => {
    localStorage.setItem("lhc_consentement_cookies", "{pas du json");
    expect(lireChoix()).toBeNull();
    localStorage.setItem("lhc_consentement_cookies", JSON.stringify({ choix: "accepte", date: Date.now() }));
    expect(lireChoix()).toBeNull();
  });

  it("tout accepter autorise Google et charge sa balise", () => {
    enregistrerChoix(TOUT_ACCEPTER);
    expect(appels).toEqual([
      ["consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" }],
    ]);
    expect(chargements).toBe(1);
    expect(dataLayer).toEqual([{ event: "lhc_consentement", consentement_mesure: true, consentement_publicite: true }]);
  });

  it("refuser la publicité ne charge pas la balise de Google", () => {
    let pret = false;
    enregistrerChoix({ mesure: true, publicite: false }, Date.now(), () => (pret = true));
    expect(appels[0][2]).toEqual({ ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
    expect(chargements).toBe(0);
    expect(pret).toBe(false);
  });

  it("après un accord, prévient quand la balise Google est prête", () => {
    let quandPret: (() => void) | undefined;
    (globalThis as unknown as { window: { lhcChargerGoogleTag: (f?: () => void) => void } }).window.lhcChargerGoogleTag = (f) => {
      quandPret = f;
    };
    let pret = false;
    enregistrerChoix(TOUT_ACCEPTER, Date.now(), () => (pret = true));
    expect(pret).toBe(false);
    quandPret?.();
    expect(pret).toBe(true);
  });
});
