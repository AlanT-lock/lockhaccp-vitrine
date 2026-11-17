# Fonction `generer-pms`, version 19 : clic Google Ads transmis à Closera

À déployer sur le projet Supabase `ndoxvlikhmmixvhuqczs`, depuis le dossier qui contient
le code complet de la fonction (version 18 en ligne, 27 fichiers), puis :

```bash
supabase functions deploy generer-pms --project-ref ndoxvlikhmmixvhuqczs --no-verify-jwt
```

## Pourquoi

Depuis le 17/11/2026, le site joint à la provenance (`src/lib/provenance.ts`) :

| Champ | Contenu |
| --- | --- |
| `canal` | annoté quand la campagne n'est peut-être plus celle du jour : « Google Ads (page rechargée, clic antérieur) », « Google Ads (arrivée le 16/11 à 21 h 05) » |
| `utm_source`, `utm_medium` | paramètres de l'annonce |
| `gclid`, `gbraid`, `wbraid` | identifiant du clic Google Ads, **seulement avec l'accord pour la publicité** |
| `arrivee_le` | heure d'arrivée sur la page (ISO 8601) |
| `page_rechargee` | page rechargée, rouverte ou revenue par « Précédent » |
| `consentement_publicite` | `granted` / `denied` |

La version 18 n'en garde que `canal`, `page_arrivee`, `campagne`, `mot_cle` (liste blanche
de `lireProvenance`). Le canal annoté s'affiche donc déjà dans la note Closera ; le reste est
ignoré sans erreur. La version 19 garde ces champs dans `pms_demandes.provenance` et envoie
le clic à Closera (`attribution`), qui l'enregistre dans `lead_attributions` et l'affiche sur
la fiche (section « Clic publicitaire »).

## `_shared/pms/provenance.ts` (remplace le fichier)

```ts
// Provenance de la visite, envoyée par le site avec la demande de PMS
// (src/lib/provenance.ts de lockhaccp-vitrine) : facultative, champs connus
// seulement, chacun borné. Affichée sur la fiche du prospect dans Closera.

export interface Provenance {
  canal: string;
  page_arrivee?: string;
  campagne?: string;
  mot_cle?: string;
  utm_source?: string;
  utm_medium?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  arrivee_le?: string;
  page_rechargee?: boolean;
  consentement_publicite?: "granted" | "denied";
}

const CHAMPS = ["canal", "page_arrivee", "campagne", "mot_cle", "utm_source", "utm_medium"] as const;
const IDENTIFIANTS = ["gclid", "gbraid", "wbraid"] as const;
const TAILLE_MAX = 120;
const IDENTIFIANT = /^[A-Za-z0-9_-]{1,512}$/;

export function lireProvenance(entree: unknown): Provenance | null {
  if (typeof entree !== "object" || entree === null) return null;
  const brute = (entree as Record<string, unknown>).provenance;
  if (typeof brute !== "object" || brute === null || Array.isArray(brute)) return null;
  const b = brute as Record<string, unknown>;
  const p: Record<string, unknown> = {};
  for (const c of CHAMPS) {
    const v = b[c];
    if (typeof v === "string" && v.trim() !== "") p[c] = v.trim().slice(0, TAILLE_MAX);
  }
  if (!p.canal) return null;
  // Identifiant tronqué = faux : écarté s'il ne respecte pas le format.
  for (const c of IDENTIFIANTS) {
    const v = b[c];
    if (typeof v === "string" && IDENTIFIANT.test(v.trim())) p[c] = v.trim();
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

/** « Google Ads · mot-clé « pms gratuit » · campagne pms-recherche · arrivée sur /plan-de-maitrise-sanitaire ». */
export function decrireProvenance(p: Provenance | null): string {
  if (!p) return "non transmise";
  const morceaux = [p.canal];
  if (p.mot_cle) morceaux.push(`mot-clé « ${p.mot_cle} »`);
  if (p.campagne) morceaux.push(`campagne ${p.campagne}`);
  if (p.page_arrivee) morceaux.push(`arrivée sur ${p.page_arrivee}`);
  return morceaux.join(" · ");
}

/**
 * Attribution envoyée à Closera avec le prospect (`POST /api/extension/leads`, champ
 * `attribution`), rangée dans `lead_attributions` : une ligne par demande de PMS.
 * `submissionId` (identifiant de la ligne `pms_demandes`) rend l'envoi idempotent.
 */
export function attributionPourClosera(p: Provenance | null, envoyeeLe: Date, submissionId?: string) {
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
```

## `_shared/pms/closera.ts`

Ajouter `attribution` au prospect envoyé à Closera (le type `ProspectPms` gagne le champ
`attribution?: ReturnType<typeof attributionPourClosera>`), dans `construireProspect` :

```ts
import { attributionPourClosera, decrireProvenance, type Provenance } from "./provenance.ts";

// … dans l'objet renvoyé par construireProspect(r, pms, lienPdf, date, provenance) :
    attribution: attributionPourClosera(provenance, date),
```

`envoyerProspect` doit transmettre ce champ tel quel dans le lead posté à Closera (à côté de
`source: "pms"`, `company_name`, `email`, `notes`…). Si l'identifiant de la ligne
`pms_demandes` est connu à cet endroit, le passer en 3e argument (`submission_id`) : un
renvoi de la même demande ne crée alors pas de seconde ligne d'attribution et ne renotifie
pas les administrateurs.

## Vérifier

1. Ouvrir `https://lockhaccp.fr/plan-de-maitrise-sanitaire?gclid=TEST123&utm_source=google&utm_medium=cpc&utm_campaign=essai&utm_term=pms`, accepter les cookies, générer un PMS de test.
2. Dans Closera, la fiche du prospect affiche « Clic publicitaire » : campagne `essai`, mot-clé `pms`, identifiant `TEST123`, heure d'arrivée.
3. Supprimer le prospect de test.
