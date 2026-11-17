// Type de produit d'entretien indiqué dans le plan de nettoyage, déduit du nom
// de la surface (catalogue ou surface ajoutée par le visiteur) :
//   sols → détergent sol ; intérieur du four → décapant ;
//   surfaces grasses et matériel de préparation → dégraissant-désinfectant ;
//   le reste → nettoyant-désinfectant.
export type ProduitNettoyage =
  | "Nettoyant-désinfectant"
  | "Dégraissant-désinfectant"
  | "Décapant four"
  | "Détergent sol";

const normaliser = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const SOL = /\bsols?\b/;
const FOUR_INTERIEUR = /\bfours?\b(?!.*exterieur)/;
const GRAS = new RegExp(
  [
    "hotte", "filtre", "piano", "plaque", "friteuse", "materiel de cuisson", "salamandre", "plancha", "\\bgrills?\\b",
    "four", "plans? de travail", "plans? de (decoupe|coupe)", "billot", "planche", "hachoir", "trancheuse",
    "scie", "poussoir", "robot", "mixeur", "batteur", "petrin", "laminoir", "faconneuse", "diviseuse",
    "ecailleuse", "machine sous vide",
  ].join("|"),
);

export function produitPourSurface(surface: string): ProduitNettoyage {
  const s = normaliser(surface);
  if (SOL.test(s)) return "Détergent sol";
  if (FOUR_INTERIEUR.test(s)) return "Décapant four";
  if (GRAS.test(s)) return "Dégraissant-désinfectant";
  return "Nettoyant-désinfectant";
}

/** Usage de chaque type de produit, pour la légende du plan de nettoyage. */
export const USAGE_PRODUIT: Record<ProduitNettoyage, string> = {
  "Nettoyant-désinfectant": "surfaces et équipements peu gras",
  "Dégraissant-désinfectant": "surfaces grasses et matériel de préparation",
  "Décapant four": "intérieur du four (graisses cuites)",
  "Détergent sol": "sols",
};
