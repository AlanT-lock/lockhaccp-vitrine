// Prospect envoyé à Closera (compte SF FORMATION) à chaque PMS généré :
// coordonnées, métier, provenance de la visite et une note qui résume ce qui sert à l'appel.
import { REFERENTIEL } from "./referentiel.ts";
import type { ElementListe, PmsCompose, Reponses } from "./types.ts";

// Provenance de la visite, envoyée par le site avec la demande de PMS
// (src/lib/provenance.ts de lockhaccp-vitrine) : facultative, champs connus
// seulement, chacun borné. Le canal arrive annoté quand la campagne vient d'un
// clic antérieur (« Google Ads (page rechargée, clic antérieur) »).
export interface Provenance {
  canal: string;
  page_arrivee?: string;
  campagne?: string;
  mot_cle?: string;
  utm_source?: string;
  utm_medium?: string;
  /** Identifiants du clic Google Ads : envoyés par le site seulement avec l'accord pour la publicité. */
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  /** Arrivée sur la page (ISO 8601). */
  arrivee_le?: string;
  /** Page rechargée, rouverte ou revenue par « Précédent » : paramètres d'un clic antérieur. */
  page_rechargee?: boolean;
  consentement_publicite?: "granted" | "denied";
}

const CHAMPS_PROVENANCE = ["canal", "page_arrivee", "campagne", "mot_cle", "utm_source", "utm_medium"] as const;
const IDENTIFIANTS_CLIC = ["gclid", "gbraid", "wbraid"] as const;
// Un identifiant tronqué serait faux : écarté s'il ne respecte pas ce format.
const IDENTIFIANT_CLIC = /^[A-Za-z0-9_-]{1,512}$/;

export function lireProvenance(entree: unknown): Provenance | null {
  if (typeof entree !== "object" || entree === null) return null;
  const brute = (entree as Record<string, unknown>).provenance;
  if (typeof brute !== "object" || brute === null || Array.isArray(brute)) return null;
  const b = brute as Record<string, unknown>;
  const p: Record<string, unknown> = {};
  for (const c of CHAMPS_PROVENANCE) {
    const v = b[c];
    if (typeof v === "string" && v.trim() !== "") p[c] = v.trim().slice(0, 120);
  }
  if (!p.canal) return null;
  for (const c of IDENTIFIANTS_CLIC) {
    const v = b[c];
    if (typeof v === "string" && IDENTIFIANT_CLIC.test(v.trim())) p[c] = v.trim();
  }
  if (typeof b.arrivee_le === "string" && !Number.isNaN(Date.parse(b.arrivee_le))) {
    p.arrivee_le = new Date(b.arrivee_le).toISOString();
  }
  if (typeof b.page_rechargee === "boolean") p.page_rechargee = b.page_rechargee;
  if (b.consentement_publicite === "granted" || b.consentement_publicite === "denied") {
    p.consentement_publicite = b.consentement_publicite;
  }
  return p as unknown as Provenance;
}

/**
 * Clic publicitaire transmis à Closera (champ `attribution`), rangé dans sa table
 * `lead_attributions` et affiché sur la fiche (« Clic publicitaire »). `submissionId`
 * (identifiant de la ligne `pms_demandes`) rend l'envoi idempotent côté Closera.
 */
export interface AttributionPms {
  submission_id: string | null;
  submitted_at: string;
  landed_at: string | null;
  page_reloaded: boolean | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  landing_url: string | null;
  consent_ad_user_data: "granted" | "denied" | null;
  consent_ad_personalization: "granted" | "denied" | null;
}

export function attributionPourClosera(p: Provenance | null, envoyeeLe: Date, submissionId?: string): AttributionPms | null {
  if (!p) return null;
  const consentement = p.consentement_publicite ?? null;
  return {
    submission_id: submissionId ?? null,
    submitted_at: envoyeeLe.toISOString(),
    landed_at: p.arrivee_le ?? null,
    page_reloaded: p.page_rechargee ?? null,
    gclid: p.gclid ?? null,
    gbraid: p.gbraid ?? null,
    wbraid: p.wbraid ?? null,
    utm_source: p.utm_source ?? null,
    utm_medium: p.utm_medium ?? null,
    utm_campaign: p.campagne ?? null,
    utm_term: p.mot_cle ?? null,
    landing_url: p.page_arrivee ? `https://lockhaccp.fr${p.page_arrivee}` : null,
    consent_ad_user_data: consentement,
    consent_ad_personalization: consentement,
  };
}

/** « Google Ads · mot-clé « pms gratuit » · arrivée sur /plan-de-maitrise-sanitaire ». */
export function decrireProvenance(p: Provenance | null): string {
  if (!p) return "non transmise";
  const morceaux = [p.canal];
  if (p.mot_cle) morceaux.push(`mot-clé « ${p.mot_cle} »`);
  if (p.campagne) morceaux.push(`campagne ${p.campagne}`);
  if (p.page_arrivee) morceaux.push(`arrivée sur ${p.page_arrivee}`);
  return morceaux.join(" · ");
}

export interface ProspectPms {
  source: "pms";
  company_name: string;
  phone: string;
  email: string;
  address: string;
  activity_domain: string;
  notes: string;
  attribution?: AttributionPms | null;
}

const texte = (r: Reponses, cle: string) => (typeof r[cle] === "string" ? (r[cle] as string) : "");
const liste = (r: Reponses, cle: string) => (Array.isArray(r[cle]) ? (r[cle] as ElementListe[]) : []);
const ouiNon = (v: unknown) => (v === true ? "oui" : "non");
const jour = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

export function construireProspect(
  r: Reponses,
  pms: PmsCompose,
  lienPdf: string,
  date: Date,
  provenance: Provenance | null = null,
  demandeId?: string,
): ProspectPms {
  const metier = REFERENTIEL.metiers.find((m) => m.id === r.metier)?.libelle ?? r.metier;
  const lignes = [`[${jour(date)}] PMS demandé sur lockhaccp.fr (${metier})`, `Provenance : ${decrireProvenance(provenance)}`];
  if (r["personnel.formation_hygiene"] === false) lignes.push("⚠ Aucune personne formée à l'hygiène alimentaire");
  lignes.push(`Formation hygiène : ${ouiNon(r["personnel.formation_hygiene"])}`);
  if (typeof r["personnel.effectif"] === "number") lignes.push(`Salariés : ${r["personnel.effectif"]}`);
  lignes.push(`Équipements froids : ${liste(r, "equipements.froids").length}`);
  if ("equipements.friteuses" in r || liste(r, "equipements.friteuses").length > 0) {
    lignes.push(`Friteuse : ${ouiNon(liste(r, "equipements.friteuses").length > 0)}`);
  }
  if (r["prep.cuisson_avance"] !== undefined) lignes.push(`Préparations à l'avance : ${ouiNon(r["prep.cuisson_avance"])}`);
  const modes = Array.isArray(r["activite.modes_vente"]) ? (r["activite.modes_vente"] as string[]) : [];
  if (modes.length > 0) lignes.push(`Vente : ${modes.join(", ")}`);
  if (r["activite.alcool"] !== undefined) lignes.push(`Alcool : ${ouiNon(r["activite.alcool"])}`);
  lignes.push(`Contenu du PMS : ${pms.affiches.length} affiches, ${pms.ccp.length} lignes CCP, ${pms.registres.length} registres`);
  lignes.push("Essai : 1 mois offert à l'inscription sur l'app");
  lignes.push(`PMS : ${lienPdf}`);

  return {
    source: "pms",
    company_name: texte(r, "coordonnees.nom"),
    phone: texte(r, "coordonnees.telephone"),
    email: texte(r, "coordonnees.email"),
    address: `${texte(r, "coordonnees.adresse")}, ${texte(r, "coordonnees.code_postal")} ${texte(r, "coordonnees.ville")}`,
    activity_domain: metier,
    notes: lignes.join("\n"),
    attribution: attributionPourClosera(provenance, date, demandeId),
  };
}

/** Envoi à `POST /api/extension/leads` de Closera ; renvoie l'identifiant du prospect. */
export async function envoyerProspect(url: string, jeton: string, prospect: ProspectPms, delaiMs = 8000): Promise<string> {
  const reponse = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" },
    body: JSON.stringify({ leads: [prospect] }),
    signal: AbortSignal.timeout(delaiMs),
  });
  if (!reponse.ok) throw new Error(`Closera ${reponse.status} : ${await reponse.text()}`);
  const corps = await reponse.json() as {
    errors?: { error: string }[];
    results?: { lead_id: string }[];
  };
  if (corps.errors && corps.errors.length > 0) throw new Error(`Closera : ${corps.errors[0].error}`);
  const id = corps.results?.[0]?.lead_id;
  if (!id) throw new Error("Closera : identifiant du prospect absent de la réponse");
  return id;
}
