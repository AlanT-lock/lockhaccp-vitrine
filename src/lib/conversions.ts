// Conversions du site, signalées à Google Tag Manager (événements dans dataLayer) :
// c'est GTM qui les transmet à Google Ads (balises « Suivi des conversions Google Ads »,
// voir docs/tag-manager-conversions.md). Le site n'envoie plus rien directement à Google Ads.
// Rien n'est signalé sans l'accord du visiteur pour la publicité (src/lib/consentement.ts).

import { lireChoix } from "./consentement";

export type Conversion =
  | "conversion_pms_commence" // 1re étape du questionnaire PMS (choix du métier)
  | "conversion_pms_genere" // dossier PMS créé avec succès
  | "conversion_demo" // formulaire « Demander une démo » envoyé
  | "conversion_contact" // formulaire de contact envoyé (détail : formulaire = info | entreprise)
  | "conversion_inscription" // clic vers l'inscription sur app.lockhaccp.fr
  | "conversion_app" // clic vers l'App Store ou Google Play (détail : store)
  | "conversion_telephone" // clic sur un numéro de téléphone
  | "conversion_email"; // clic sur une adresse e-mail

// Conversions comptées une seule fois par chargement de page (le visiteur peut revenir en arrière).
const UNE_FOIS_PAR_PAGE = new Set<Conversion>(["conversion_pms_commence", "conversion_pms_genere"]);
const dejaEnvoyees = new Set<Conversion>();
// Conversions survenues avant toute réponse au bandeau (souvent : métier choisi avant d'avoir
// répondu) : gardées en mémoire, envoyées si le visiteur accepte la publicité pendant la visite,
// oubliées s'il refuse ou ne répond pas.
let enAttente: { nom: Conversion; details: Record<string, string> }[] = [];

type FenetreDataLayer = { dataLayer?: unknown[] };
const fenetre = () => (typeof window !== "undefined" ? (window as FenetreDataLayer) : undefined);

export function signalerConversion(nom: Conversion, details: Record<string, string> = {}): void {
  if (UNE_FOIS_PAR_PAGE.has(nom) && dejaEnvoyees.has(nom)) return;
  const choix = lireChoix();
  if (choix && !choix.publicite) return; // publicité refusée
  const w = fenetre();
  if (!w) return;
  dejaEnvoyees.add(nom);
  if (!choix) enAttente.push({ nom, details });
  else (w.dataLayer ??= []).push({ event: nom, ...details });
}

/**
 * Réponse au bandeau. Accord : à appeler une fois la balise Google prête (elle a relevé le clic
 * sur l'annonce), pour que les conversions en attente lui soient rattachées. Refus : on les oublie.
 */
export function traiterConversionsEnAttente(publicite: boolean): void {
  const envoyer = enAttente;
  enAttente = [];
  const w = fenetre();
  if (!publicite || !w) return;
  for (const { nom, details } of envoyer) (w.dataLayer ??= []).push({ event: nom, ...details });
}

const HOTES_STORES: Record<string, string> = { "apps.apple.com": "app_store", "play.google.com": "google_play" };
const HOTE_INSCRIPTION = "app.lockhaccp.fr";

/**
 * Conversion correspondant à un lien cliqué, ou null. Les liens marqués
 * data-suivi="connexion" (clients existants qui se connectent) ne comptent pas.
 */
export function conversionPourLien(
  href: string,
  suivi: string | null,
): { nom: Conversion; details?: Record<string, string> } | null {
  if (suivi === "connexion") return null;
  if (href.startsWith("tel:")) return { nom: "conversion_telephone" };
  if (href.startsWith("mailto:")) return { nom: "conversion_email" };
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.hostname === HOTE_INSCRIPTION) return { nom: "conversion_inscription" };
  const store = HOTES_STORES[url.hostname];
  return store ? { nom: "conversion_app", details: { store } } : null;
}

/** Suit les clics sur tous les liens du site (inscription, stores, téléphone, e-mail). */
export function suivreClicsConversions(): void {
  document.addEventListener(
    "click",
    (e) => {
      const lien = (e.target as Element | null)?.closest?.("a[href]");
      if (!(lien instanceof HTMLAnchorElement)) return;
      const conversion = conversionPourLien(lien.href, lien.getAttribute("data-suivi"));
      if (conversion) signalerConversion(conversion.nom, conversion.details);
    },
    { capture: true },
  );
}

export function reinitialiserPourTests(): void {
  dejaEnvoyees.clear();
  enAttente = [];
}
