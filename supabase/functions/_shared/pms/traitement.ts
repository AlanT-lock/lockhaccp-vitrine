// Orchestration d'une demande de PMS, indépendante de Supabase/Resend/Closera
// (dépendances injectées) : validation, limite anti-abus, dossier zip de PDF,
// enregistrement, stockage, puis e-mail et Closera — ces deux derniers n'empêchent jamais le
// visiteur de récupérer son PMS.
import { construireProspect, lireProvenance, type ProspectPms } from "./closera.ts";
import { construireCourriel, type ContenuCourriel } from "./courriel.ts";
import { nomDossierPms, nomFichierPms, zipper } from "./dossier.ts";
import { composerPms } from "./moteur.ts";
import type { DefinitionPdf } from "./pdf/commun.ts";
import { DOSSIER_TRACABILITE, planDossier } from "./pdf/dossier_pdf.ts";
import { REFERENTIEL } from "./referentiel.ts";
import { validerDemande } from "./validation.ts";

/**
 * Résultat de la réservation atomique d'une génération (fonction SQL
 * `pms_reserver_quota`) : « ok », ou le quota dépassé (5/h par connexion,
 * 3/24 h par adresse e-mail, plafond global par heure).
 */
export type Quota = "ok" | "ip" | "email" | "global";

const MESSAGES_QUOTA: Record<Exclude<Quota, "ok">, string> = {
  ip: "Trop de demandes depuis cette connexion : réessayez dans une heure.",
  email: "Plusieurs PMS ont déjà été envoyés à cette adresse e-mail aujourd'hui : réessayez demain.",
  global: "Le générateur reçoit de très nombreuses demandes : réessayez dans quelques minutes.",
};

export interface Dependances {
  reserverQuota(ip: string, email: string): Promise<Quota>;
  enregistrer(ligne: Record<string, unknown>): Promise<string>;
  televerser(chemin: string, fichier: Uint8Array): Promise<void>;
  /** Lien de téléchargement signé ; `nomTelechargement` : nom du fichier enregistré par le navigateur. */
  lienSigne(chemin: string, nomTelechargement: string): Promise<string>;
  mettreAJour(id: string, champs: Record<string, unknown>): Promise<void>;
  envoyerCourriel(a: string, contenu: ContenuCourriel, piece: Uint8Array, nomFichier: string): Promise<void>;
  envoyerProspect(prospect: ProspectPms): Promise<string>;
  rendrePdf(definition: DefinitionPdf): Promise<Uint8Array>;
  maintenant(): Date;
}

export type Resultat =
  | { statut: 200; lien: string; resume: { affiches: number; ccp: number; registres: number } }
  | { statut: 400 | 409 | 429; message: string; erreurs?: string[] };

const texte = (r: Record<string, unknown>, cle: string) => (typeof r[cle] === "string" ? (r[cle] as string) : "");

export async function traiterDemande(
  entree: unknown,
  ip: string,
  deps: Dependances,
  options: { apercu: boolean },
): Promise<Resultat> {
  const v = validerDemande(entree, { sansCoordonnees: options.apercu });
  if (!v.ok) {
    if (v.code === "robot") return { statut: 200, lien: "", resume: { affiches: 0, ccp: 0, registres: 0 } };
    if (v.code === "version") return { statut: 409, message: v.erreurs[0] };
    return { statut: 400, message: "Certaines réponses sont incomplètes ou invalides.", erreurs: v.erreurs };
  }
  const r = v.demande.reponses;
  const pms = composerPms(REFERENTIEL, r, "production");
  const plan = planDossier(pms, r, deps.maintenant());
  const resume = {
    affiches: pms.affiches.length,
    ccp: pms.ccp.length,
    registres: plan.filter((f) => f.chemin.startsWith(`${DOSSIER_TRACABILITE}/`)).length,
  };
  if (options.apercu) return { statut: 200, lien: "", resume };

  const rr = r as unknown as Record<string, unknown>;
  const provenance = lireProvenance(entree);
  const quota = await deps.reserverQuota(ip, texte(rr, "coordonnees.email").toLowerCase());
  if (quota !== "ok") return { statut: 429, message: MESSAGES_QUOTA[quota] };

  const maintenant = deps.maintenant();
  const etablissement = texte(rr, "coordonnees.nom");
  const rendus = [];
  for (const f of plan) rendus.push({ chemin: f.chemin, octets: await deps.rendrePdf(f.definition) });
  const zip = zipper(nomDossierPms(etablissement), rendus);
  const id = await deps.enregistrer({
    email: texte(rr, "coordonnees.email").toLowerCase(),
    telephone: texte(rr, "coordonnees.telephone"),
    etablissement_nom: texte(rr, "coordonnees.nom"),
    adresse: texte(rr, "coordonnees.adresse"),
    code_postal: texte(rr, "coordonnees.code_postal"),
    ville: texte(rr, "coordonnees.ville"),
    metier: r.metier,
    reponses: r,
    version_referentiel: REFERENTIEL.version,
    consentement_at: maintenant.toISOString(),
    // Essai standard de 1 mois, démarré à la création du compte (le défaut 2
    // de la colonne ne vaut que pour les PMS demandés avant le 2026-10-22).
    essai_offert_mois: 1,
    provenance,
  });

  const mois = String(maintenant.getMonth() + 1).padStart(2, "0");
  const chemin = `${maintenant.getFullYear()}/${mois}/${id}.zip`;
  await deps.televerser(chemin, zip);
  // Enregistré tout de suite : la relance (relancer-pms) en a besoin même si
  // la suite échoue.
  await deps.mettreAJour(id, { pdf_path: chemin });
  const lien = await deps.lienSigne(chemin, nomFichierPms(etablissement));

  const suite: Record<string, unknown> = {};
  const erreurs: string[] = [];
  const metier = REFERENTIEL.metiers.find((m) => m.id === r.metier)?.libelle ?? r.metier;

  try {
    await deps.envoyerCourriel(
      texte(rr, "coordonnees.email"),
      construireCourriel({
        etablissement,
        lien,
        metier,
        email: texte(rr, "coordonnees.email"),
      }),
      zip,
      nomFichierPms(etablissement),
    );
    suite.email_envoye = true;
    suite.statut = "envoye";
  } catch (e) {
    suite.email_envoye = false;
    erreurs.push(e instanceof Error ? e.message : String(e));
  }

  try {
    suite.closera_lead_id = await deps.envoyerProspect(construireProspect(r, pms, lien, maintenant, provenance, id));
    suite.closera_envoye = true;
  } catch (e) {
    suite.closera_envoye = false;
    erreurs.push(e instanceof Error ? e.message : String(e));
  }

  if (erreurs.length > 0) suite.derniere_erreur = erreurs.join(" | ").slice(0, 1000);
  try {
    await deps.mettreAJour(id, suite);
  } catch (e) {
    // Le PMS est prêt : le visiteur garde son lien. Au pire, la relance
    // renverra l'e-mail ou le prospect une seconde fois.
    console.error("generer-pms : mise à jour finale impossible", id, e);
  }

  return { statut: 200, lien, resume };
}
