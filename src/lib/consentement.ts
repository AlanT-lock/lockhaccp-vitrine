// Consentement aux cookies, choisi dans le bandeau (src/components/BandeauCookies.tsx).
// Deux finalités, chacune refusée tant que le visiteur n'a pas accepté :
// - « mesure » : statistiques de visite du site (src/lib/analytics.ts) ;
// - « publicite » : Google Ads (balise de index.html), conversions et publicité ciblée.
// index.html lit le même enregistrement au chargement : garder la clé et les durées identiques.

export type ChoixCookies = { mesure: boolean; publicite: boolean };

const CLE = "lhc_consentement_cookies";
const MOIS_MS = 30.4375 * 24 * 60 * 60 * 1000;
// Durées recommandées par la CNIL avant de reposer la question.
const VALIDITE_ACCORD_MS = 13 * MOIS_MS;
const VALIDITE_REFUS_MS = 6 * MOIS_MS;

export const TOUT_ACCEPTER: ChoixCookies = { mesure: true, publicite: true };
export const TOUT_REFUSER: ChoixCookies = { mesure: false, publicite: false };

export const EVENEMENT_OUVRIR_BANDEAU = "lhc:ouvrir-bandeau-cookies";

type FenetreGoogle = Window & {
  gtag?: (...a: unknown[]) => void;
  dataLayer?: unknown[];
  lhcChargerGoogleTag?: (quandPret?: () => void) => void;
};

/** Choix encore valable, ou null s'il n'y en a pas (ou plus) : le bandeau doit s'afficher. */
export function lireChoix(maintenant = Date.now()): ChoixCookies | null {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return null;
    const { mesure, publicite, date } = JSON.parse(brut) as Record<string, unknown>;
    if (typeof mesure !== "boolean" || typeof publicite !== "boolean" || typeof date !== "number") return null;
    const validite = mesure || publicite ? VALIDITE_ACCORD_MS : VALIDITE_REFUS_MS;
    return maintenant - date < validite ? { mesure, publicite } : null;
  } catch {
    return null; // stockage indisponible (navigation privée) ou valeur abîmée
  }
}

/**
 * Enregistre le choix et l'applique tout de suite à Google (Consent Mode v2).
 * `quandGoogleTagPret` : en cas d'accord pour la publicité, appelé une fois la balise Google
 * chargée (index.html), pour lui envoyer les conversions survenues avant la réponse.
 */
export function enregistrerChoix(choix: ChoixCookies, maintenant = Date.now(), quandGoogleTagPret?: () => void): void {
  try {
    localStorage.setItem(CLE, JSON.stringify({ ...choix, date: maintenant }));
  } catch {
    /* stockage indisponible : le choix vaut pour cette page, le bandeau reviendra */
  }
  const w = window as FenetreGoogle;
  const etat = (accorde: boolean) => (accorde ? "granted" : "denied");
  w.gtag?.("consent", "update", {
    ad_storage: etat(choix.publicite),
    ad_user_data: etat(choix.publicite),
    ad_personalization: etat(choix.publicite),
    analytics_storage: etat(choix.mesure),
  });
  // Déclencheur possible pour les balises ajoutées plus tard dans Google Tag Manager.
  w.dataLayer?.push({ event: "lhc_consentement", consentement_mesure: choix.mesure, consentement_publicite: choix.publicite });
  if (!choix.publicite) supprimerCookiesGoogleAds();
  else if (w.lhcChargerGoogleTag) w.lhcChargerGoogleTag(quandGoogleTagPret);
  else quandGoogleTagPret?.();
}

/** Retrait du consentement : efface ce que Google Ads a déposé sur lockhaccp.fr. */
function supprimerCookiesGoogleAds(): void {
  try {
    for (const cle of Object.keys(localStorage)) if (cle.startsWith("_gcl_")) localStorage.removeItem(cle);
  } catch {
    /* stockage indisponible */
  }
  const morceaux = window.location.hostname.split(".");
  const domaines = ["", window.location.hostname, "." + morceaux.slice(-2).join(".")];
  for (const cookie of document.cookie.split(";")) {
    const nom = cookie.split("=")[0].trim();
    if (!nom.startsWith("_gcl_")) continue;
    for (const domaine of domaines) {
      document.cookie = `${nom}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domaine ? `; domain=${domaine}` : ""}`;
    }
  }
}

/** Réaffiche le bandeau (lien « Gestion des cookies » du pied de page). */
export function ouvrirBandeauCookies(): void {
  window.dispatchEvent(new Event(EVENEMENT_OUVRIR_BANDEAU));
}
