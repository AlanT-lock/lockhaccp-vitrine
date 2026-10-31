import { describe, expect, it } from "vitest";
import { lireProvenance } from "./provenance";

const SITE = "https://lockhaccp.fr";

describe("provenance de la visite", () => {
  it("un clic sur une annonce Google (gclid) vient de Google Ads, avec le mot-clé s'il est transmis", () => {
    expect(
      lireProvenance(`${SITE}/plan-de-maitrise-sanitaire?gclid=abc&utm_campaign=pms&utm_term=pms%20gratuit`, "https://www.google.com/"),
    ).toEqual({ canal: "Google Ads", page_arrivee: "/plan-de-maitrise-sanitaire", campagne: "pms", mot_cle: "pms gratuit" });
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
});
