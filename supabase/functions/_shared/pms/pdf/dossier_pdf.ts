// Plan du dossier PMS : la liste des fichiers PDF à produire pour un
// établissement, avec leur chemin dans le dossier et leur définition pdfmake.
//   Tableau CCP.pdf, Plan de nettoyage et de désinfection.pdf,
//   Traçabilité/…, Affichage obligatoire/…
import { formaterConsigne } from "../moteur.ts";
import { REFERENTIEL } from "../referentiel.ts";
import type { ElementListe, PmsCompose, Reponses } from "../types.ts";
import type { DefinitionPdf } from "./commun.ts";
import { definirAffiche } from "./affiches_design.ts";
import { definirPlanNettoyage, definirTableauCcp, titreAffiche } from "./documents.ts";
import { type ContexteFiche, definirFiche, type IdFiche } from "./fiches.ts";

export interface FichierPdf {
  /** Chemin relatif dans le dossier PMS, par exemple « Traçabilité/Nettoyage - Cuisine.pdf ». */
  chemin: string;
  definition: DefinitionPdf;
}

export const DOSSIER_TRACABILITE = "Traçabilité";
export const DOSSIER_AFFICHES = "Affichage obligatoire";

/** Nom de fichier sans caractère interdit, sans espaces multiples, 60 caractères au plus. */
export function nomDeFichier(nom: string): string {
  // deno-lint-ignore no-control-regex
  const propre = nom.replace(/[\\/:*?"<>|\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return [...propre].slice(0, 60).join("").trim() || "Sans nom";
}

const liste = (r: Reponses, cle: string) => (Array.isArray(r[cle]) ? (r[cle] as ElementListe[]) : []);

/** Fiches de traçabilité à produire, selon les registres retenus par le moteur. */
function fichesDe(pms: PmsCompose, r: Reponses): { nom: string; id: IdFiche; ctx: ContexteFiche }[] {
  const retenus = new Set(pms.registres.map((g) => g.id));
  const out: { nom: string; id: IdFiche; ctx: ContexteFiche }[] = [];
  if (retenus.has("registre.reception")) out.push({ nom: "Réception des marchandises", id: "reception", ctx: {} });
  if (retenus.has("registre.temperatures")) {
    const releves = typeof r["activite.services_par_jour"] === "number" && r["activite.services_par_jour"] >= 2 ? 2 : 1;
    for (const eq of liste(r, "equipements.froids")) {
      const type = REFERENTIEL.typesEquipementsFroids.find((t) => t.type === eq.type)?.libelle ?? String(eq.type ?? "");
      out.push({
        nom: `Relevé de température - ${nomDeFichier(eq.nom)}`,
        id: "temperatures",
        ctx: { equipement: { nom: eq.nom, type, consigne: formaterConsigne(eq) }, releves },
      });
    }
  }
  if (retenus.has("registre.nettoyage")) {
    for (const z of liste(r, "nettoyage.zones")) {
      out.push({ nom: `Nettoyage - ${nomDeFichier(z.nom)}`, id: "nettoyage", ctx: { zone: z.nom } });
    }
  }
  if (retenus.has("registre.huile")) {
    for (const f of liste(r, "equipements.friteuses")) {
      out.push({ nom: `Huile de friture - ${nomDeFichier(f.nom)}`, id: "huile", ctx: { friteuse: f.nom } });
    }
  }
  if (retenus.has("registre.refroidissement")) out.push({ nom: "Refroidissement", id: "refroidissement", ctx: {} });
  if (retenus.has("registre.plats_temoins") || retenus.has("registre.plats_temoins_traiteur")) {
    out.push({ nom: "Plats témoins", id: "plats_temoins", ctx: {} });
  }
  if (retenus.has("registre.assainissement_poisson")) {
    out.push({ nom: "Assainissement du poisson cru", id: "assainissement_poisson", ctx: {} });
  }
  return out;
}

export function planDossier(pms: PmsCompose, r: Reponses, _jour: Date): FichierPdf[] {
  const fichiers: FichierPdf[] = [
    { chemin: "Tableau CCP.pdf", definition: definirTableauCcp(pms, r) },
    { chemin: "Plan de nettoyage et de désinfection.pdf", definition: definirPlanNettoyage(r) },
    ...fichesDe(pms, r).map((f) => ({
      chemin: `${DOSSIER_TRACABILITE}/${f.nom}.pdf`,
      definition: definirFiche(f.id, f.ctx),
    })),
    ...pms.affiches.map((a) => ({
      chemin: `${DOSSIER_AFFICHES}/${nomDeFichier(titreAffiche(a).replace(/\s*\(modèle officiel\)/, ""))}.pdf`,
      definition: definirAffiche(a, r),
    })),
  ];
  // Deux équipements ou deux zones de même nom (à la casse près, car macOS et
  // Windows ne distinguent pas « Frigo » de « frigo ») : « … (2).pdf ».
  const pris = new Set<string>();
  return fichiers.map((f) => {
    let chemin = f.chemin;
    for (let n = 2; pris.has(chemin.toLowerCase()); n++) chemin = f.chemin.replace(/\.pdf$/, ` (${n}).pdf`);
    pris.add(chemin.toLowerCase());
    return chemin === f.chemin ? f : { ...f, chemin };
  });
}
