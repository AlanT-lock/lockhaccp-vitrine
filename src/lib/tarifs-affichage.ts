// Affichage des tarifs en paiement annuel : équivalent mensuel et économie.
// Les montants eux-mêmes restent dans `launch.ts` (mêmes valeurs que l'app et Stripe).

export type Facturation = "annuel" | "mensuel";

/** Prix annuel ramené au mois, arrondi au centime : 249 € par an -> 20,75 € par mois. */
export function mensuelEquivalent(annuel: number): number {
  return Math.round((annuel / 12) * 100) / 100;
}

/** Économie d'une année payée d'un coup par rapport à 12 mois : 24,90 € et 249 € -> 49,80 €. */
export function economieAnnuelle(mensuel: number, annuel: number): number {
  return Math.round((mensuel * 12 - annuel) * 100) / 100;
}
