import { describe, expect, it } from "vitest";
import { dateFr, finEssaiOfferte } from "./essai";

describe("fin de l'essai offert (même règle que le serveur)", () => {
  it("2 mois après la demande, dernier jour du mois si besoin", () => {
    expect(dateFr(finEssaiOfferte(new Date(2026, 9, 1)))).toBe("01/12/2026");
    expect(dateFr(finEssaiOfferte(new Date(2026, 11, 31)))).toBe("28/02/2027");
  });
});
