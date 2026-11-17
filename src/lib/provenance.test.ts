import { describe, expect, it } from "vitest";
import { annoterProvenance, heureDeParis, lireProvenance, type Provenance } from "./provenance";

const SITE = "https://lockhaccp.fr";

describe("provenance de la visite", () => {
  it("un clic sur une annonce Google (gclid) vient de Google Ads, avec le mot-clé s'il est transmis", () => {
    expect(
      lireProvenance(`${SITE}/plan-de-maitrise-sanitaire?gclid=abc&utm_campaign=pms&utm_term=pms%20gratuit`, "https://www.google.com/"),
    ).toEqual({ canal: "Google Ads", page_arrivee: "/plan-de-maitrise-sanitaire", campagne: "pms", mot_cle: "pms gratuit", gclid: "abc" });
    expect(lireProvenance(`${SITE}/pms?wbraid=x`, "").canal).toBe("Google Ads");
    expect(lireProvenance(`${SITE}/?utm_source=google&utm_medium=cpc`, "").canal).toBe("Google Ads");
  });

  it("une recherche Google sans annonce est de la recherche naturelle", () => {
    expect(lireProvenance(`${SITE}/blog/difference-pms-haccp`, "https://www.google.fr/")).toEqual({
      canal: "Google (recherche naturelle)",
      page_arrivee: "/blog/difference-pms-haccp",
    });
  });

  it("reconnaît les campagnes marquées, les assistants, les réseaux sociaux et les autres sites", () => {
    expect(lireProvenance(`${SITE}/?utm_source=newsletter&utm_medium=email`, "").canal).toBe("Campagne : newsletter / email");
    expect(lireProvenance(`${SITE}/`, "https://chatgpt.com/").canal).toBe("ChatGPT");
    expect(lireProvenance(`${SITE}/`, "https://l.facebook.com/").canal).toBe("Réseau social : l.facebook.com");
    expect(lireProvenance(`${SITE}/`, "https://www.exemple.fr/article").canal).toBe("Site : exemple.fr");
  });

  it("sans référent, ou depuis le site lui-même, c'est un accès direct", () => {
    expect(lireProvenance(`${SITE}/pms`, "").canal).toBe("Accès direct");
    expect(lireProvenance(`${SITE}/pms`, "https://lockhaccp.fr/tarifs").canal).toBe("Accès direct");
    expect(lireProvenance(`${SITE}/pms`, "https://app.lockhaccp.fr/").canal).toBe("Accès direct");
  });

  it("borne la taille des valeurs", () => {
    const p = lireProvenance(`${SITE}/?gclid=x&utm_term=${"a".repeat(500)}`, "");
    expect(p.mot_cle).toHaveLength(120);
  });

  it("relève source, support et identifiants de clic ; écarte un identifiant trop long", () => {
    const p = lireProvenance(`${SITE}/?utm_source=Google&utm_medium=CPC&utm_campaign=pms-pmax&gbraid=b`, "");
    expect(p).toMatchObject({ canal: "Google Ads", utm_source: "google", utm_medium: "cpc", campagne: "pms-pmax", gbraid: "b" });
    expect(lireProvenance(`${SITE}/?gclid=${"g".repeat(600)}`, "").gclid).toBeUndefined();
  });
});

describe("provenance jointe à la demande de PMS", () => {
  const ARRIVEE = Date.parse("2026-11-16T20:05:00Z"); // 16/11 à 21 h 05 à Paris
  const ANNONCE: Provenance = {
    canal: "Google Ads",
    page_arrivee: "/plan-de-maitrise-sanitaire",
    campagne: "pms-recherche",
    mot_cle: "plan de maitrise sanitaire",
    gclid: "abc",
  };
  const visite = (pageRechargee = false) => ({ provenance: ANNONCE, arriveeLe: ARRIVEE, pageRechargee });

  it("heure de Paris lisible, changement d'heure compris", () => {
    expect(heureDeParis(ARRIVEE)).toBe("16/11 à 21 h 05");
    expect(heureDeParis(Date.parse("2026-07-01T07:30:00Z"))).toBe("01/07 à 09 h 30");
  });

  it("envoi peu après l'arrivée : canal inchangé, heure d'arrivée jointe", () => {
    const p = annoterProvenance(visite(), ARRIVEE + 10 * 60_000, true);
    expect(p).toMatchObject({
      canal: "Google Ads",
      campagne: "pms-recherche",
      arrivee_le: "2026-11-16T20:05:00.000Z",
      page_rechargee: false,
      consentement_publicite: "granted",
      gclid: "abc",
    });
  });

  it("envoi plus d'une heure après l'arrivée : l'heure d'arrivée est dans le canal", () => {
    expect(annoterProvenance(visite(), ARRIVEE + 6 * 3600_000, true).canal).toBe("Google Ads (arrivée le 16/11 à 21 h 05)");
  });

  it("page rechargée ou rouverte : le clic est antérieur, avec l'heure si l'envoi est tardif", () => {
    expect(annoterProvenance(visite(true), ARRIVEE + 60_000, true).canal).toBe("Google Ads (page rechargée, clic antérieur)");
    expect(annoterProvenance(visite(true), ARRIVEE + 3 * 3600_000, true).canal).toBe(
      "Google Ads (page rechargée le 16/11 à 21 h 05, clic antérieur)",
    );
  });

  it("sans accord pour la publicité, aucun identifiant de clic ne part", () => {
    const p = annoterProvenance(visite(), ARRIVEE + 60_000, false);
    expect(p.consentement_publicite).toBe("denied");
    expect(p.gclid).toBeUndefined();
    expect(p.campagne).toBe("pms-recherche");
  });
});
