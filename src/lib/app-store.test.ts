import { describe, expect, it } from "vitest";
import { LIEN_APP_STORE, LIEN_GOOGLE_PLAY, lienTelechargement, storePourAgent } from "./app-store";
import vercel from "../../vercel.json";

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

describe("bouton « Télécharger l'app » de l'en-tête (Alan, 01/10/2026)", () => {
  it("sur téléphone, lien direct vers le store", () => {
    expect(lienTelechargement("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)", 5)).toBe(LIEN_APP_STORE);
    expect(lienTelechargement("Mozilla/5.0 (Linux; Android 14; Pixel 8)", 5)).toBe(LIEN_GOOGLE_PLAY);
  });
  it("sur ordinateur, page de choix /app", () => {
    expect(lienTelechargement("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 0)).toBe("/app");
  });
});

describe("QR code : /app redirige côté serveur, sans afficher le site (Alan, 01/10/2026)", () => {
  type Redirection = { source: string; destination: string; permanent: boolean; has?: { type: string; key: string; value: string }[] };
  const redirections = (vercel as { redirects: Redirection[] }).redirects;
  const cible = (agent: string) =>
    redirections.find((r) =>
      r.source === "/app" &&
      (r.has ?? []).every((h) => h.type === "header" && h.key === "user-agent" && new RegExp(`^${h.value}$`).test(agent))
    )?.destination;

  it("iPhone et iPad → App Store", () => {
    expect(cible("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15")).toBe(LIEN_APP_STORE);
    expect(cible("Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X)")).toBe(LIEN_APP_STORE);
  });
  it("Android → Google Play", () => {
    expect(cible("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36")).toBe(LIEN_GOOGLE_PLAY);
  });
  it("ordinateur → pas de redirection serveur (page de choix)", () => {
    expect(cible("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBeUndefined();
  });
  it("redirections temporaires (le navigateur ne les garde pas en mémoire)", () => {
    for (const r of redirections.filter((x) => x.source === "/app")) expect(r.permanent).toBe(false);
  });
});
