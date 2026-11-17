// FICHIER GÉNÉRÉ par lockhaccp/scripts/pms/synchroniser_vitrine.ts — ne pas modifier.
// supabase/functions/_shared/pms/types.ts
// Référentiel du générateur de PMS : types partagés par le moteur, la fonction
// Edge (lot 2) et l'export de relecture. TypeScript pur, sans import Deno/Node.

export type MetierId =
  | "restauration_commerciale"
  | "traiteur"
  | "restauration_collective"
  | "boulangerie_patisserie"
  | "boucherie_charcuterie"
  | "poissonnerie"
  | "cremerie_fromagerie"
  | "epicerie_primeur"
  | "glacier_chocolatier";

export interface Metier {
  id: MetierId;
  libelle: string;
  description: string;
}

/** Élément d'une réponse de type liste (équipement, zone, produit…). */
export interface ElementListe {
  nom: string;
  [cle: string]: string | number | boolean | ElementListe[] | undefined;
}

export type ValeurReponse = boolean | number | string | string[] | ElementListe[];

export interface Reponses {
  metier: MetierId;
  [questionId: string]: ValeurReponse | undefined;
}

export type Condition =
  | { toujours: true }
  | { question: string; egal: boolean | string | number }
  | { question: string; contient: string }
  | { question: string; nonVide: true }
  | { question: string; superieurA: number }
  | { tous: Condition[] }
  | { unDe: Condition[] }
  | { non: Condition };

export type Statut = "a_relire" | "valide";

export type TypeQuestion =
  | "oui_non"
  | "choix_unique"
  | "choix_multiple"
  | "nombre"
  | "texte"
  | "jours"
  | "liste_equipements_froids"
  | "liste_friteuses"
  | "liste_zones"
  | "liste_produits_entretien";

export interface Question {
  id: string;
  /** Étape du questionnaire (1 à 8, voir la spec §6). */
  etape: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  texte: string;
  aide?: string;
  type: TypeQuestion;
  options?: { valeur: string; libelle: string }[];
  metiers: MetierId[] | "tous";
  condition: Condition;
  obligatoire: boolean;
}

interface ElementBase {
  id: string;
  titre: string;
  metiers: MetierId[] | "tous";
  condition: Condition;
  /** Texte réglementaire (« Décret n° 2002-1465 du 17 décembre 2002, art. 1 »). */
  reference: string;
  /** Lien Légifrance / EUR-Lex vérifié, ou "" pour une recommandation GBPH. */
  sourceUrl: string;
  statut: Statut;
}

export interface Affiche extends ElementBase {
  type: "affiche";
  public: "clients" | "personnel";
  /** false = recommandation (GBPH), présentée comme telle. */
  obligatoire: boolean;
  /** Gabarit du texte affiché, avec placeholders {…}. Uniquement ce qui s'imprime sur l'affiche. */
  contenu: string;
  /** Consigne destinée à l'exploitant (où l'afficher, quoi compléter). Jamais imprimée sur l'affiche. */
  noteExploitant?: string;
  /** Lien vers le modèle officiel à reproduire tel quel, quand un texte en impose un. */
  modeleOfficielUrl?: string;
}

export interface LigneCCP extends ElementBase {
  type: "ccp";
  /** Libellé de la colonne « CCP ». */
  libelle: string;
  seuil: string;
  surveillance: string;
  correctives: string;
  /** true : une ligne par équipement froid, placeholders {equipement.*} disponibles. */
  parEquipementFroid?: boolean;
}

export interface Registre extends ElementBase {
  type: "registre";
  /** Consigne imprimée en tête du registre. */
  consigne: string;
  frequence: string;
  /** Colonnes fixes, ou une colonne par équipement froid. */
  colonnes: string[] | { parEquipementFroid: true; avant: string[]; apres: string[] };
}

export type Element = Affiche | LigneCCP | Registre;

/** Consigne par défaut d'un type d'équipement froid, proposée dans le questionnaire. */
export interface TypeEquipementFroid {
  type: string;
  libelle: string;
  consigneMin?: number;
  consigneMax: number;
  reference: string;
  statut: Statut;
}

export interface Referentiel {
  version: string;
  metiers: Metier[];
  questions: Question[];
  affiches: Affiche[];
  ccp: LigneCCP[];
  registres: Registre[];
  typesEquipementsFroids: TypeEquipementFroid[];
}

export type Mode = "production" | "relecture";

export interface PmsCompose {
  affiches: (Affiche & { contenuRendu: string })[];
  ccp: (LigneCCP & { rendu: { libelle: string; seuil: string; surveillance: string; correctives: string } })[];
  registres: (Registre & { colonnesRendues: string[]; consigneRendue: string })[];
}
