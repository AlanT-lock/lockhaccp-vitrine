// Provenance de la visite (annonce Google, recherche Google, autre site, accès direct),
// relevée à l'arrivée sur le site et jointe à la demande de PMS : elle apparaît sur la
// fiche du prospect dans Closera. Gardée en mémoire seulement, rien n'est enregistré sur
// l'appareil du visiteur : elle vaut pour la visite en cours, jusqu'au rechargement de la page.
//
// Les paramètres d'une annonce restent dans l'adresse tant que le visiteur ne change pas de
// page : un onglet rechargé ou rouvert (le téléphone recharge les onglets mis en veille)
// les relit, parfois des heures après le clic. La provenance le signale (`page_rechargee`,
// heure d'arrivée) pour qu'une demande tardive ne soit pas attribuée au jour du clic.

export interface Provenance {
  /** « Google Ads », « Google (recherche naturelle) », « Site : … », « Accès direct »… */
  canal: string;
  /** Première page vue, sans paramètres. */
  page_arrivee: string;
  /** utm_campaign, s'il est présent. */
  campagne?: string;
  /** utm_term : le mot-clé Google Ads, quand le suffixe d'URL de la campagne le transmet. */
  mot_cle?: string;
  utm_source?: string;
  utm_medium?: string;
  /** Identifiants du clic Google Ads. */
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
}

/** Ce qui part avec la demande de PMS : la provenance, annotée au moment de l'envoi. */
export interface ProvenanceEnvoyee extends Provenance {
  /** Arrivée sur la page (ISO 8601, UTC). */
  arrivee_le: string;
  /** Page rechargée, rouverte ou revenue par « Précédent » : les paramètres viennent d'un clic antérieur. */
  page_rechargee: boolean;
}

interface ProvenanceVisite {
  provenance: Provenance;
  arriveeLe: number;
  pageRechargee: boolean;
}

const TAILLE_MAX = 120;
const TAILLE_MAX_IDENTIFIANT = 512;
const IDENTIFIANTS_CLIC_GOOGLE = ["gclid", "gbraid", "wbraid"] as const;
const RESEAUX_SOCIAUX = ["facebook", "instagram", "linkedin", "tiktok", "youtube", "pinterest", "x.com", "t.co"];
/** Au-delà, la demande part longtemps après l'arrivée : l'heure d'arrivée est affichée. */
export const DELAI_ENVOI_TARDIF_MS = 60 * 60 * 1000;

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
  if (source) provenance.utm_source = source;
  if (support) provenance.utm_medium = support;
  for (const k of IDENTIFIANTS_CLIC_GOOGLE) {
    // Un identifiant tronqué serait faux : trop long, il est écarté.
    const v = (p.get(k) ?? "").trim();
    if (v && v.length <= TAILLE_MAX_IDENTIFIANT) provenance[k] = v;
  }
  return provenance;
}

/** « 16/11 à 21 h 05 », heure de Paris. */
export function heureDeParis(ms: number): string {
  const parties = Object.fromEntries(
    new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(ms))
      .map((x) => [x.type, x.value]),
  );
  return `${parties.day}/${parties.month} à ${parties.hour} h ${parties.minute}`;
}

/**
 * Provenance à joindre à la demande envoyée à `maintenant`. Le canal est annoté quand la
 * campagne n'est peut-être plus celle du jour (page rechargée, arrivée plus d'une heure
 * avant l'envoi) : la fonction `generer-pms` l'écrit tel quel dans la note Closera.
 */
export function annoterProvenance(visite: ProvenanceVisite, maintenant: number): ProvenanceEnvoyee {
  const reste = visite.provenance;
  const annotations: string[] = [];
  const tardif = maintenant - visite.arriveeLe > DELAI_ENVOI_TARDIF_MS;
  if (visite.pageRechargee) {
    annotations.push(`page rechargée${tardif ? ` le ${heureDeParis(visite.arriveeLe)}` : ""}, clic antérieur`);
  } else if (tardif) {
    annotations.push(`arrivée le ${heureDeParis(visite.arriveeLe)}`);
  }
  return {
    ...reste,
    canal: annotations.length ? court(`${reste.canal} (${annotations.join(", ")})`) : reste.canal,
    arrivee_le: new Date(visite.arriveeLe).toISOString(),
    page_rechargee: visite.pageRechargee,
  };
}

/** La page a-t-elle été rechargée, rouverte (onglet mis en veille) ou revenue par « Précédent » ? */
function pageRechargee(): boolean {
  try {
    if ((document as Document & { wasDiscarded?: boolean }).wasDiscarded) return true;
    const navigation = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
    return navigation?.type === "reload" || navigation?.type === "back_forward";
  } catch {
    return false;
  }
}

let provenanceVisite: ProvenanceVisite | null = null;

/** À appeler une fois, au démarrage, avant toute navigation interne (main.tsx). */
export function noterProvenance(): void {
  if (provenanceVisite || typeof window === "undefined") return;
  try {
    provenanceVisite = {
      provenance: lireProvenance(window.location.href, document.referrer),
      arriveeLe: Date.now(),
      pageRechargee: pageRechargee(),
    };
  } catch {
    provenanceVisite = null;
  }
}

/** Provenance à joindre à une demande envoyée maintenant, ou null si elle n'a pas été relevée. */
export function provenanceDeLaVisite(maintenant = Date.now()): ProvenanceEnvoyee | null {
  if (!provenanceVisite) return null;
  return annoterProvenance(provenanceVisite, maintenant);
}

export function reinitialiserProvenancePourTests(): void {
  provenanceVisite = null;
}
