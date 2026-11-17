// Contrôle d'une demande de PMS reçue du site : version du référentiel,
// champ piège, métier, type et taille de chaque réponse visible, coordonnées.
// Les réponses à des questions non posées sont retirées. Fonction pure.
import { questionsVisibles } from "./moteur.ts";
import { REFERENTIEL } from "./referentiel.ts";
import type { ElementListe, MetierId, Question, Reponses, ValeurReponse } from "./types.ts";

export interface DemandePms {
  version: string;
  reponses: Reponses;
  site_web?: string;
}

export type ResultatValidation =
  | { ok: true; demande: DemandePms }
  | { ok: false; code: "version" | "robot" | "invalide"; erreurs: string[] };

const TEXTE_MAX = 200;
const NOM_MAX = 80;
const LISTE_MAX = 30;
const FROIDS_MAX = 20;
// Chaque friteuse et chaque zone produit un PDF : plafonds qui gardent le
// dossier sous le temps de calcul d'une fonction Edge (~2 s de CPU).
const FRITEUSES_MAX = 5;
const ZONES_MAX = 15;
const SURFACES_MAX = 150;
const USAGE_MAX = 80;
const DILUTION_MAX = 40;
/** Champs acceptés dans chaque type de liste ; les autres sont retirés. */
const CHAMPS: Record<string, string[]> = {
  liste_equipements_froids: ["nom", "type", "consigne_min", "consigne_max"],
  liste_friteuses: ["nom"],
  liste_zones: ["nom", "surfaces"],
  liste_produits_entretien: ["nom", "usage", "dilution", "temps_action_min", "rincage"],
};
const CHAMPS_SURFACE = ["nom", "frequence"];
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const FREQUENCES = ["Quotidien", "Hebdo", "Mensuel"];
const TYPES_FROIDS = new Set(REFERENTIEL.typesEquipementsFroids.map((t) => t.type));
const METIERS = new Set<string>(REFERENTIEL.metiers.map((m) => m.id));

const estObjet = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
const nomValide = (x: unknown) => typeof x === "string" && x.trim() !== "" && x.trim().length <= NOM_MAX;
const nombre = (x: unknown) => typeof x === "number" && Number.isFinite(x);
const texteCourt = (x: unknown, max: number) => x === undefined || (typeof x === "string" && x.length <= max);
const garder = (o: Record<string, unknown>, champs: string[]) =>
  Object.fromEntries(Object.entries(o).filter(([k]) => champs.includes(k)));

/** Retire les champs inconnus des éléments d'une liste (et de leurs surfaces). */
function filtrerChamps(q: Question, v: ValeurReponse): ValeurReponse {
  const champs = CHAMPS[q.type];
  if (!champs || !Array.isArray(v) || !v.every(estObjet)) return v;
  return (v as ElementListe[]).map((e) => {
    const f = garder(e, champs);
    if (Array.isArray(f.surfaces)) f.surfaces = f.surfaces.map((s) => (estObjet(s) ? garder(s, CHAMPS_SURFACE) : s));
    return f as ElementListe;
  });
}

/** Message d'erreur pour une réponse, ou null si elle est conforme au type de la question. */
function controler(q: Question, v: ValeurReponse): string | null {
  const ko = (raison: string) => `${q.id} : ${raison}`;
  switch (q.type) {
    case "oui_non":
      return typeof v === "boolean" ? null : ko("oui ou non attendu");
    case "nombre":
      return Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 100000 ? null : ko("nombre entier positif attendu");
    case "texte":
      if (typeof v !== "string" || v.trim() === "") return ko("texte vide");
      return v.trim().length <= TEXTE_MAX ? null : ko(`texte trop long (${TEXTE_MAX} caractères au plus)`);
    case "jours":
      return Array.isArray(v) && v.every((j) => JOURS.includes(j as string)) ? null : ko("jours invalides");
    case "choix_unique":
      return (q.options ?? []).some((o) => o.valeur === v) ? null : ko("choix invalide");
    case "choix_multiple":
      return Array.isArray(v) && v.every((x) => (q.options ?? []).some((o) => o.valeur === x)) ? null : ko("choix invalide");
    default:
      return controlerListe(q, v);
  }
}

function controlerListe(q: Question, v: ValeurReponse): string | null {
  const ko = (raison: string) => `${q.id} : ${raison}`;
  if (!Array.isArray(v) || !v.every(estObjet)) return ko("liste attendue");
  if (v.length > LISTE_MAX) return ko(`${LISTE_MAX} éléments au plus`);
  const elements = v as ElementListe[];
  if (!elements.every((e) => nomValide(e.nom))) return ko(`chaque élément doit avoir un nom (${NOM_MAX} caractères au plus)`);
  switch (q.type) {
    case "liste_equipements_froids":
      if (elements.length > FROIDS_MAX) return ko(`${FROIDS_MAX} équipements au plus`);
      return elements.every((e) =>
          TYPES_FROIDS.has(e.type as string) && nombre(e.consigne_max) &&
          (e.consigne_min === undefined || nombre(e.consigne_min))
        )
        ? null
        : ko("type ou consigne d'équipement invalide");
    case "liste_friteuses":
      return elements.length > FRITEUSES_MAX ? ko(`${FRITEUSES_MAX} friteuses au plus`) : null;
    case "liste_zones": {
      if (elements.length > ZONES_MAX) return ko(`${ZONES_MAX} zones au plus`);
      const valides = elements.every((e) =>
        Array.isArray(e.surfaces) && e.surfaces.length <= LISTE_MAX &&
        (e.surfaces as unknown[]).every((s) => estObjet(s) && nomValide(s.nom) && FREQUENCES.includes(s.frequence as string))
      );
      if (!valides) return ko("surfaces invalides");
      const total = elements.reduce((n, e) => n + (e.surfaces as unknown[]).length, 0);
      return total <= SURFACES_MAX ? null : ko(`${SURFACES_MAX} surfaces au plus au total`);
    }
    case "liste_produits_entretien":
      return elements.every((e) =>
          texteCourt(e.usage, USAGE_MAX) &&
          texteCourt(e.dilution, DILUTION_MAX) &&
          (e.temps_action_min === undefined ||
            (Number.isInteger(e.temps_action_min) && (e.temps_action_min as number) >= 0 &&
              (e.temps_action_min as number) <= 1440)) &&
          (e.rincage === undefined || typeof e.rincage === "boolean")
        )
        ? null
        : ko("produit invalide");
    default:
      return null;
  }
}

/**
 * Copie profonde où chaque chaîne perd ses caractères de contrôle et ses
 * espaces de bord, et où les listes de chaînes perdent leurs doublons.
 */
function nettoyer<T>(x: T): T {
  // deno-lint-ignore no-control-regex
  if (typeof x === "string") return x.replace(/[\u0000-\u001f\u007f]/g, "").trim() as T;
  if (Array.isArray(x)) {
    const copie = x.map(nettoyer);
    return (copie.every((e) => typeof e === "string") ? [...new Set(copie)] : copie) as T;
  }
  if (estObjet(x)) return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, nettoyer(v)])) as T;
  return x;
}

/**
 * `sansCoordonnees` (aperçu avant l'étape 8) : les questions de l'étape 8 ne
 * sont ni exigées ni conservées.
 */
export function validerDemande(entree: unknown, options: { sansCoordonnees?: boolean } = {}): ResultatValidation {
  if (!estObjet(entree) || !estObjet(entree.reponses)) {
    return { ok: false, code: "invalide", erreurs: ["Demande illisible"] };
  }
  if (entree.version !== REFERENTIEL.version) {
    return { ok: false, code: "version", erreurs: ["Le questionnaire a été mis à jour : rechargez la page"] };
  }
  if (typeof entree.site_web === "string" && entree.site_web.trim() !== "") {
    return { ok: false, code: "robot", erreurs: ["Demande refusée"] };
  }
  const brutes = nettoyer(entree.reponses) as Record<string, unknown>;
  if (typeof brutes.metier !== "string" || !METIERS.has(brutes.metier)) {
    return { ok: false, code: "invalide", erreurs: ["Métier inconnu"] };
  }

  // Les conditions d'affichage se jugent sur les réponses reçues ; on ne garde
  // ensuite que les réponses aux questions effectivement posées.
  const visibles = questionsVisibles(REFERENTIEL.questions, brutes as Reponses)
    .filter((q) => !(options.sansCoordonnees && q.etape === 8));
  const reponses: Reponses = { metier: brutes.metier as MetierId };
  const erreurs: string[] = [];

  for (const q of visibles) {
    const brute = brutes[q.id] as ValeurReponse | undefined;
    // Un texte facultatif effacé (« » après nettoyage) vaut absence de réponse.
    const videFacultatif = !q.obligatoire && q.type === "texte" && brute === "";
    if (brute === undefined || brute === null || videFacultatif) {
      if (q.obligatoire) erreurs.push(`${q.id} : réponse manquante`);
      continue;
    }
    const v = filtrerChamps(q, brute);
    const erreur = controler(q, v);
    if (erreur) erreurs.push(erreur);
    else reponses[q.id] = v;
  }

  const email = reponses["coordonnees.email"];
  if (typeof email === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    erreurs.push("coordonnees.email : adresse e-mail invalide");
  }
  const tel = reponses["coordonnees.telephone"];
  if (typeof tel === "string") {
    const chiffres = tel.replace(/\D/g, "").length;
    if (chiffres < 10 || chiffres > 15) erreurs.push("coordonnees.telephone : numéro de téléphone invalide");
  }
  if (reponses["coordonnees.consentement"] === false) {
    erreurs.push("coordonnees.consentement : le consentement est nécessaire pour recevoir votre PMS");
  }

  if (erreurs.length > 0) return { ok: false, code: "invalide", erreurs };
  return { ok: true, demande: { version: REFERENTIEL.version, reponses } };
}
