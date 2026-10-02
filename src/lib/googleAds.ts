// Conversions Google Ads de la campagne PMS (balise gtag chargée dans index.html).
// « commence » : le visiteur choisit son métier (1re étape du questionnaire) ;
// « genere » : le dossier PMS a été créé avec succès.

const CONVERSIONS = {
  commence: "AW-18490045299/SiVLCLLPio4dEPPm3vBE",
  genere: "AW-18490045299/jzJHCLXPio4dEPPm3vBE",
} as const;

type Conversion = keyof typeof CONVERSIONS;

// Une seule conversion de chaque type par chargement de page.
const dejaEnvoyees = new Set<Conversion>();

export function conversionPms(type: Conversion): void {
  if (dejaEnvoyees.has(type)) return;
  const gtag = (typeof window !== "undefined" ? (window as { gtag?: (...a: unknown[]) => void }).gtag : undefined);
  if (typeof gtag !== "function") return; // balise bloquée ou absente
  dejaEnvoyees.add(type);
  gtag("event", "conversion", { send_to: CONVERSIONS[type], value: 1.0, currency: "EUR" });
}

export function reinitialiserPourTests(): void {
  dejaEnvoyees.clear();
}
