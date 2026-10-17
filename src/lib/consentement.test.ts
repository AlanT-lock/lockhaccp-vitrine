import { beforeEach, describe, expect, it } from "vitest";
import { enregistrerChoix, lireChoix } from "./consentement";

const JOUR = 24 * 60 * 60 * 1000;

describe("choix du bandeau cookies", () => {
  beforeEach(() => {
    const donnees = new Map<string, string>();
    (globalThis as unknown as { localStorage: Pick<Storage, "getItem" | "setItem"> }).localStorage = {
      getItem: (k) => donnees.get(k) ?? null,
      setItem: (k, v) => void donnees.set(k, v),
    };
  });

  it("aucun choix au départ : le bandeau s'affiche", () => {
    expect(lireChoix()).toBeNull();
  });

  it("un accord reste valable 13 mois", () => {
    enregistrerChoix("accepte", 0);
    expect(lireChoix(390 * JOUR)).toBe("accepte");
    expect(lireChoix(400 * JOUR)).toBeNull();
  });

  it("un refus reste valable 6 mois", () => {
    enregistrerChoix("refuse", 0);
    expect(lireChoix(180 * JOUR)).toBe("refuse");
    expect(lireChoix(190 * JOUR)).toBeNull();
  });

  it("une valeur abîmée est ignorée", () => {
    localStorage.setItem("lhc_consentement_cookies", "{pas du json");
    expect(lireChoix()).toBeNull();
  });
});
