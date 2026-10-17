// Choix du visiteur sur le bandeau cookies (src/components/BandeauCookies.tsx).
// Volontairement, ce choix n'a pour l'instant AUCUN effet sur le suivi : la balise Google Ads
// (index.html) et Google Tag Manager se chargent et suivent les conversions quoi qu'il arrive.
// Le choix est seulement enregistré, pour ne plus afficher le bandeau et pour pouvoir
// l'appliquer plus tard (Consent Mode de Google) sans redemander aux visiteurs.

export type ChoixCookies = "accepte" | "refuse";

const CLE = "lhc_consentement_cookies";
const MOIS_MS = 30.4375 * 24 * 60 * 60 * 1000;
// Durées recommandées par la CNIL avant de reposer la question.
const VALIDITE_MS: Record<ChoixCookies, number> = { accepte: 13 * MOIS_MS, refuse: 6 * MOIS_MS };

export const EVENEMENT_OUVRIR_BANDEAU = "lhc:ouvrir-bandeau-cookies";

/** Choix encore valable, ou null s'il n'y en a pas (ou plus) : le bandeau doit s'afficher. */
export function lireChoix(maintenant = Date.now()): ChoixCookies | null {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return null;
    const { choix, date } = JSON.parse(brut) as { choix?: unknown; date?: unknown };
    if ((choix !== "accepte" && choix !== "refuse") || typeof date !== "number") return null;
    return maintenant - date < VALIDITE_MS[choix] ? choix : null;
  } catch {
    return null; // stockage indisponible (navigation privée) ou valeur abîmée
  }
}

export function enregistrerChoix(choix: ChoixCookies, maintenant = Date.now()): void {
  try {
    localStorage.setItem(CLE, JSON.stringify({ choix, date: maintenant }));
  } catch {
    /* stockage indisponible : le bandeau réapparaîtra à la prochaine visite */
  }
}

/** Réaffiche le bandeau (lien « Gestion des cookies » du pied de page). */
export function ouvrirBandeauCookies(): void {
  window.dispatchEvent(new Event(EVENEMENT_OUVRIR_BANDEAU));
}
