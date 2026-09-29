// Logique du questionnaire PMS (sans interface) : étapes, questions visibles,
// contrôle de chaque étape, réponses pré-remplies selon le métier, brouillon
// conservé dans le navigateur. Les données viennent de ./genere (copie du
// référentiel validé, voir lockhaccp/scripts/pms/synchroniser_vitrine.ts).
import { questionsVisibles } from "./genere/moteur";
import { QUESTIONS } from "./genere/questions";
import { TYPES_EQUIPEMENTS_FROIDS } from "./genere/equipements";
import { EQUIPEMENTS_PROPOSES, PRODUITS_EXEMPLES, ZONES_PROPOSEES } from "./genere/suggestions";
import type { ElementListe, MetierId, Question, Reponses } from "./genere/types";

export const ETAPES = [
  { titre: "Votre métier", sousTitre: "Votre PMS sera entièrement adapté à votre activité." },
  { titre: "Votre activité", sousTitre: "Jours d'ouverture, services et façons de vendre." },
  { titre: "Ce que vous préparez", sousTitre: "Pour n'inclure que les dangers qui vous concernent." },
  { titre: "Vos équipements", sousTitre: "Chaque équipement froid aura sa ligne dans votre tableau HACCP." },
  { titre: "Votre nettoyage", sousTitre: "Vos zones, vos surfaces et vos produits d'entretien." },
  { titre: "Votre personnel", sousTitre: "Pour les affichages et le registre de formation." },
  { titre: "Récapitulatif", sousTitre: "Vérifiez ce que contiendra votre PMS." },
  { titre: "Vos coordonnées", sousTitre: "Ces informations apparaîtront sur vos affiches et vos registres." },
] as const;

const CLE_BROUILLON = "lockhaccp-pms-brouillon";

export function questionsDeLEtape(etape: number, r: Reponses): Question[] {
  if (!r.metier) return [];
  return questionsVisibles(QUESTIONS, r).filter((q) => q.etape === etape);
}

export function reponsesInitiales(metier: MetierId): Reponses {
  const types = new Map(TYPES_EQUIPEMENTS_FROIDS.map((t) => [t.type, t]));
  const froids: ElementListe[] = EQUIPEMENTS_PROPOSES[metier].map((e) => {
    const t = types.get(e.type);
    const el: ElementListe = { nom: e.nom, type: e.type, consigne_max: t?.consigneMax ?? 4 };
    if (t?.consigneMin !== undefined) el.consigne_min = t.consigneMin;
    return el;
  });
  return {
    metier,
    "activite.jours_ouverture": [],
    "activite.modes_vente": [],
    "equipements.froids": froids,
    "nettoyage.zones": ZONES_PROPOSEES[metier].map((z) => ({ nom: z.nom, surfaces: z.surfaces.map((s) => ({ ...s })) })),
    "nettoyage.produits": PRODUITS_EXEMPLES.map((p) => ({ ...p })),
  } as Reponses;
}

/** Ne garde que les réponses aux questions encore posées. */
export function nettoyerReponses(r: Reponses): Reponses {
  const visibles = new Set(questionsVisibles(QUESTIONS, r).map((q) => q.id));
  const propre: Reponses = { metier: r.metier };
  for (const [cle, valeur] of Object.entries(r)) if (visibles.has(cle)) propre[cle] = valeur;
  return propre;
}

const nomValide = (e: ElementListe) => typeof e.nom === "string" && e.nom.trim() !== "";

function erreurQuestion(q: Question, v: unknown): string | null {
  const vide = v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
  if (vide) {
    if (!q.obligatoire) return null;
    if (q.type === "oui_non") return "Répondez par oui ou non.";
    if (q.type === "jours") return "Choisissez au moins un jour.";
    if (q.type === "choix_multiple" || q.type === "choix_unique") return "Choisissez au moins une option.";
    if (q.type.startsWith("liste_")) return "Ajoutez au moins un élément.";
    return "Ce champ est obligatoire.";
  }
  if (q.type === "nombre" && !(Number.isInteger(v) && (v as number) >= 0)) return "Indiquez un nombre entier.";
  if (q.type === "texte" && String(v).trim().length > 200) return "200 caractères au plus.";
  if (q.type.startsWith("liste_")) {
    const liste = v as ElementListe[];
    if (!liste.every(nomValide)) return "Donnez un nom à chaque élément.";
    if (q.type === "liste_zones" && !liste.every((z) => Array.isArray(z.surfaces) && (z.surfaces as ElementListe[]).length > 0 && (z.surfaces as ElementListe[]).every(nomValide))) {
      return "Chaque zone doit avoir au moins une surface nommée.";
    }
  }
  return null;
}

/** Erreurs de l'étape, par identifiant de question (vide = on peut continuer). */
export function erreursEtape(etape: number, r: Reponses): Record<string, string> {
  const erreurs: Record<string, string> = {};
  if (etape === 1) {
    if (!r.metier) erreurs.metier = "Choisissez votre métier.";
    return erreurs;
  }
  for (const q of questionsDeLEtape(etape, r)) {
    const e = erreurQuestion(q, r[q.id]);
    if (e) erreurs[q.id] = e;
  }
  if (etape === 8) {
    const email = String(r["coordonnees.email"] ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) erreurs["coordonnees.email"] = "Adresse e-mail invalide.";
    const tel = String(r["coordonnees.telephone"] ?? "").replace(/\D/g, "");
    if (tel && (tel.length < 10 || tel.length > 15)) erreurs["coordonnees.telephone"] = "Numéro de téléphone invalide.";
    if (r["coordonnees.consentement"] !== true) {
      erreurs["coordonnees.consentement"] = "Cochez cette case pour recevoir votre PMS.";
    }
  }
  return erreurs;
}

export function sauverBrouillon(reponses: Reponses, etape: number): void {
  try {
    localStorage.setItem(CLE_BROUILLON, JSON.stringify({ reponses, etape }));
  } catch {
    // Navigation privée ou stockage bloqué : le questionnaire fonctionne sans brouillon.
  }
}

export function lireBrouillon(): { reponses: Reponses; etape: number } | null {
  try {
    const brut = localStorage.getItem(CLE_BROUILLON);
    if (!brut) return null;
    const b = JSON.parse(brut);
    return b && b.reponses?.metier ? b : null;
  } catch {
    return null;
  }
}

export function effacerBrouillon(): void {
  try {
    localStorage.removeItem(CLE_BROUILLON);
  } catch {
    // sans effet
  }
}
