// Source unique de vérité pour l'offre de lancement LockHACCP.
//
// L'offre de lancement (grille réduite, garantie à vie) court jusqu'au
// 31 octobre 2026 inclus. Elle bascule vers la grille courante à l'instant
// ci-dessous, qui correspond à minuit heure de Paris le 1er novembre 2026
// (Paris est à UTC+1 en novembre : le changement d'heure a eu lieu le
// 25 octobre 2026).
//
// Aucun montant ni aucune date lié à cette offre ne doit être écrit en dur
// ailleurs dans le code : toute page ou composant qui doit afficher un prix
// ou une date de bascule importe ces valeurs depuis ce fichier.

/** Instant exact de la bascule (fin de l'offre de lancement / début de la grille courante). */
export const LAUNCH_OFFER_END = new Date("2026-10-31T23:00:00Z");

/** Libellés de dates, pour affichage. */
export const LAUNCH_OFFER_END_LABEL = "31 octobre 2026";
export const CURRENT_PRICING_START_LABEL = "1er novembre 2026";

/** Une grille de tarifs : établissement principal + établissement supplémentaire. */
export interface PricingGrid {
  mainMonthly: number;
  mainYearly: number;
  extraMonthly: number;
  extraYearly: number;
  /** Formulation de la remise annuelle telle qu'elle doit être annoncée. */
  annualDiscountLabel: string;
}

/** Offre de lancement : en vigueur jusqu'au 31 octobre 2026 inclus, garantie à vie. */
export const LAUNCH_PRICING: PricingGrid = {
  mainMonthly: 14.9,
  mainYearly: 143,
  extraMonthly: 4.9,
  extraYearly: 47,
  annualDiscountLabel: "20 % de remise",
};

/** Grille courante : en vigueur à partir du 1er novembre 2026. */
export const CURRENT_PRICING: PricingGrid = {
  mainMonthly: 24.9,
  mainYearly: 249,
  extraMonthly: 9.9,
  extraYearly: 99,
  annualDiscountLabel: "2 mois offerts (soit 17 % de remise)",
};

/** L'offre de lancement court-elle encore à l'instant `now` ? */
export function isLaunchOfferActive(now: Date = new Date()): boolean {
  return now.getTime() < LAUNCH_OFFER_END.getTime();
}

/** Grille effectivement en vigueur à l'instant `now`. */
export function getActivePricing(now: Date = new Date()): PricingGrid {
  return isLaunchOfferActive(now) ? LAUNCH_PRICING : CURRENT_PRICING;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
}

/**
 * Temps restant avant la bascule, en jours / heures / minutes.
 * Retourne `null` si l'offre de lancement est terminée à l'instant `now`.
 */
export function getCountdown(now: Date = new Date()): CountdownParts | null {
  const diffMs = LAUNCH_OFFER_END.getTime() - now.getTime();
  if (diffMs <= 0) {
    return null;
  }

  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes };
}

/**
 * Formate un montant en euros à la française : `14.9` -> "14,90€",
 * `143` -> "143€" (pas de décimales inutiles pour un montant rond).
 */
export function formatPriceEUR(amount: number): string {
  const cents = Math.round(amount * 100);
  const hasCents = cents % 100 !== 0;
  const value = hasCents
    ? (cents / 100).toFixed(2).replace(".", ",")
    : String(Math.round(amount));
  return `${value}€`;
}
