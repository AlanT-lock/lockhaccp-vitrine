import { describe, expect, it } from "vitest";
import { LIEN_APP_STORE, LIEN_GOOGLE_PLAY, storePourAgent } from "./app-store";

describe("redirection vers le bon store (chantier C)", () => {
  it("iPhone et iPad → App Store", () => {
    expect(storePourAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15", 5)).toBe(LIEN_APP_STORE);
    expect(storePourAgent("Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X)", 5)).toBe(LIEN_APP_STORE);
  });
  it("iPad récent (se présente comme un Mac, avec écran tactile) → App Store", () => {
    expect(storePourAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15", 5)).toBe(LIEN_APP_STORE);
  });
  it("Android → Google Play", () => {
    expect(storePourAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8)", 5)).toBe(LIEN_GOOGLE_PLAY);
  });
  it("ordinateur → pas de redirection (page de choix)", () => {
    expect(storePourAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 0)).toBeNull();
    expect(storePourAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 0)).toBeNull();
  });
});
