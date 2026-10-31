// Provenance de la visite (annonce Google, recherche Google, autre site, accès direct),
// relevée à l'arrivée sur le site et jointe à la demande de PMS : elle apparaît sur la
// fiche du prospect dans Closera. Gardée en mémoire seulement, rien n'est enregistré sur
// l'appareil du visiteur : elle vaut pour la visite en cours, jusqu'au rechargement de la page.

export interface Provenance {
  /** « Google Ads », « Google (recherche naturelle) », « Site : … », « Accès direct »… */
  canal: string;
  /** Première page vue, sans paramètres. */
  page_arrivee: string;
  /** utm_campaign, s'il est présent. */
  campagne?: string;
  /** utm_term : le mot-clé Google Ads, quand le suffixe d'URL de la campagne le transmet. */
  mot_cle?: string;
}

const TAILLE_MAX = 120;
const IDENTIFIANTS_CLIC_GOOGLE = ["gclid", "gbraid", "wbraid"];
const RESEAUX_SOCIAUX = ["facebook", "instagram", "linkedin", "tiktok", "youtube", "pinterest", "x.com", "t.co"];

const court = (s: string | null | undefined) => (s ?? "").trim().slice(0, TAILLE_MAX);

function canalDuReferent(referent: string, hoteSite: string): string {
  let hote: string;
  try {
    hote = new URL(referent).hostname.replace(/^www\./, "");
  } catch {
    return "Accès direct";
  }
  if (!hote || hote === hoteSite || hote.endsWith(`.${hoteSite}`)) return "Accès direct";
  if (/(^|\.)google\.[a-z.]+$/.test(hote)) return "Google (recherche naturelle)";
  if (/(^|\.)bing\.com$/.test(hote)) return "Bing (recherche naturelle)";
  if (hote === "chatgpt.com" || hote === "chat.openai.com") return "ChatGPT";
  if (hote.endsWith("perplexity.ai")) return "Perplexity";
  if (RESEAUX_SOCIAUX.some((r) => hote === r || hote.includes(`${r}.`))) return `Réseau social : ${court(hote)}`;
  return `Site : ${court(hote)}`;
}

/** Provenance d'une visite arrivée sur `adresse` depuis `referent` (document.referrer). */
export function lireProvenance(adresse: string, referent: string, hoteSite = "lockhaccp.fr"): Provenance {
  const url = new URL(adresse);
  const p = url.searchParams;
  const source = court(p.get("utm_source")).toLowerCase();
  const support = court(p.get("utm_medium")).toLowerCase();
  let canal: string;
  if (IDENTIFIANTS_CLIC_GOOGLE.some((k) => p.get(k)) || (source === "google" && ["cpc", "ppc", "paid"].includes(support))) {
    canal = "Google Ads";
  } else if (source) {
    canal = court(`Campagne : ${source}${support ? ` / ${support}` : ""}`);
  } else {
    canal = canalDuReferent(referent, hoteSite);
  }
  const provenance: Provenance = { canal, page_arrivee: court(url.pathname) || "/" };
  const campagne = court(p.get("utm_campaign"));
  const motCle = court(p.get("utm_term"));
  if (campagne) provenance.campagne = campagne;
  if (motCle) provenance.mot_cle = motCle;
  return provenance;
}

let provenanceVisite: Provenance | null = null;

/** À appeler une fois, au démarrage, avant toute navigation interne (main.tsx). */
export function noterProvenance(): void {
  if (provenanceVisite || typeof window === "undefined") return;
  try {
    provenanceVisite = lireProvenance(window.location.href, document.referrer);
  } catch {
    provenanceVisite = null;
  }
}

export const provenanceDeLaVisite = (): Provenance | null => provenanceVisite;

export function reinitialiserProvenancePourTests(): void {
  provenanceVisite = null;
}
