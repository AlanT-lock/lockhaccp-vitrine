import { describe, expect, it } from "vitest";
import { titreComplet } from "./titre";

describe("titreComplet", () => {
  it("ajoute la marque quand elle tient", () => {
    expect(titreComplet("Plan de Maîtrise Sanitaire (PMS) gratuit")).toBe("Plan de Maîtrise Sanitaire (PMS) gratuit | LockHACCP");
  });
  it("garde le titre seul quand la marque le ferait dépasser 60 caractères", () => {
    const t = "Contrôle sanitaire en restaurant : ce que vérifie la DDPP";
    expect(titreComplet(t)).toBe(t);
  });
  it("ne double pas la marque", () => {
    expect(titreComplet("Tarifs LockHACCP : logiciel HACCP")).toBe("Tarifs LockHACCP : logiciel HACCP");
  });
});
