import { beforeEach, describe, expect, it } from "vitest";
import { conversionPourLien, reinitialiserPourTests, signalerConversion, traiterConversionsEnAttente } from "./conversions";

const g = globalThis as unknown as { window?: { dataLayer?: unknown[] }; localStorage?: Pick<Storage, "getItem"> };
let consentement: { mesure: boolean; publicite: boolean } | null;

describe("conversions signalées à Google Tag Manager", () => {
  beforeEach(() => {
    g.window = { dataLayer: [] };
    consentement = { mesure: false, publicite: true };
    g.localStorage = { getItem: () => (consentement ? JSON.stringify({ ...consentement, date: Date.now() }) : null) };
    reinitialiserPourTests();
  });

  it("pousse l'événement et ses détails dans dataLayer", () => {
    signalerConversion("conversion_contact", { formulaire: "info" });
    expect(g.window?.dataLayer).toEqual([{ event: "conversion_contact", formulaire: "info" }]);
  });

  it("« PMS commencé » ne compte qu'une fois par page, même si le métier change", () => {
    signalerConversion("conversion_pms_commence");
    signalerConversion("conversion_pms_commence");
    expect(g.window?.dataLayer).toHaveLength(1);
  });

  it("les clics peuvent compter plusieurs fois", () => {
    signalerConversion("conversion_telephone");
    signalerConversion("conversion_telephone");
    expect(g.window?.dataLayer).toHaveLength(2);
  });

  it("rien ne part sans accord pour la publicité", () => {
    consentement = null;
    signalerConversion("conversion_demo");
    consentement = { mesure: true, publicite: false };
    signalerConversion("conversion_pms_genere");
    expect(g.window?.dataLayer).toEqual([]);
  });

  it("avant toute réponse au bandeau, la conversion attend : envoyée si le visiteur accepte", () => {
    consentement = null;
    signalerConversion("conversion_pms_commence");
    signalerConversion("conversion_pms_commence");
    expect(g.window?.dataLayer).toEqual([]);
    consentement = { mesure: false, publicite: true };
    traiterConversionsEnAttente(true);
    expect(g.window?.dataLayer).toEqual([{ event: "conversion_pms_commence" }]);
    traiterConversionsEnAttente(true);
    expect(g.window?.dataLayer).toHaveLength(1);
  });

  it("… et oubliée s'il refuse", () => {
    consentement = null;
    signalerConversion("conversion_pms_genere");
    traiterConversionsEnAttente(false);
    traiterConversionsEnAttente(true);
    expect(g.window?.dataLayer).toEqual([]);
  });

  it("reconnaît les liens à suivre", () => {
    expect(conversionPourLien("https://app.lockhaccp.fr/", null)).toEqual({ nom: "conversion_inscription" });
    expect(conversionPourLien("https://app.lockhaccp.fr/", "connexion")).toBeNull();
    expect(conversionPourLien("https://apps.apple.com/fr/app/lockhaccp/id6747192726", null)).toEqual({
      nom: "conversion_app",
      details: { store: "app_store" },
    });
    expect(conversionPourLien("https://play.google.com/store/apps/details?id=fr.lockhaccp.app", null)?.details).toEqual({
      store: "google_play",
    });
    expect(conversionPourLien("tel:0646640023", null)).toEqual({ nom: "conversion_telephone" });
    expect(conversionPourLien("mailto:contact@lockhaccp.fr", null)).toEqual({ nom: "conversion_email" });
    expect(conversionPourLien("https://lockhaccp.fr/tarifs", null)).toBeNull();
    expect(conversionPourLien("https://lockhaccp.fr/app", null)).toBeNull();
  });
});
