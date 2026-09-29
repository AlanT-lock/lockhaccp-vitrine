// FICHIER GÉNÉRÉ par lockhaccp/scripts/pms/synchroniser_vitrine.ts — ne pas modifier.
// Suggestions du questionnaire : zones, équipements froids et produits
// d'entretien proposés selon le métier. Le visiteur garde, renomme ou retire
// chaque élément ; rien de ceci n'est imprimé sans avoir été confirmé.
import type { MetierId } from "./types";

export type Frequence = "Quotidien" | "Hebdo" | "Mensuel";

export interface ZoneProposee {
  nom: string;
  surfaces: { nom: string; frequence: Frequence }[];
}

const z = (nom: string, surfaces: [string, Frequence][]): ZoneProposee => ({
  nom,
  surfaces: surfaces.map(([n, frequence]) => ({ nom: n, frequence })),
});

/** Zones types de l'app LockHACCP (lib/helpers/zones_types.dart). */
const ZONES_RESTAURANT: ZoneProposee[] = [
  z("Cuisine", [
    ["Plans de travail", "Quotidien"], ["Piano et plaques", "Quotidien"], ["Sols", "Quotidien"],
    ["Poignées et interrupteurs", "Quotidien"], ["Hotte et filtres", "Hebdo"], ["Murs", "Mensuel"],
  ]),
  z("Plonge", [["Bacs de plonge", "Quotidien"], ["Lave-vaisselle", "Quotidien"], ["Sols", "Quotidien"], ["Siphons", "Hebdo"]]),
  z("Réserve", [["Étagères", "Hebdo"], ["Sols", "Hebdo"], ["Chambres froides", "Hebdo"]]),
  z("Salle", [["Tables", "Quotidien"], ["Sols", "Quotidien"], ["Comptoir", "Quotidien"]]),
  z("Sanitaires", [["Toilettes", "Quotidien"], ["Lavabos", "Quotidien"], ["Sols", "Quotidien"]]),
  z("Vestiaires", [["Sols", "Hebdo"], ["Casiers", "Mensuel"]]),
];

export const ZONES_PROPOSEES: Record<MetierId, ZoneProposee[]> = {
  restauration_commerciale: ZONES_RESTAURANT,
  traiteur: ZONES_RESTAURANT,
  restauration_collective: [
    z("Cuisine", [["Plans de travail", "Quotidien"], ["Matériel de cuisson", "Quotidien"], ["Sols", "Quotidien"], ["Hotte et filtres", "Hebdo"], ["Murs", "Mensuel"]]),
    z("Légumerie", [["Plans de travail", "Quotidien"], ["Éviers", "Quotidien"], ["Sols", "Quotidien"]]),
    z("Plonge", [["Bacs de plonge", "Quotidien"], ["Lave-vaisselle", "Quotidien"], ["Sols", "Quotidien"], ["Siphons", "Hebdo"]]),
    z("Réserve", [["Étagères", "Hebdo"], ["Sols", "Hebdo"], ["Chambres froides", "Hebdo"]]),
    z("Salle de restauration", [["Tables", "Quotidien"], ["Chaises", "Hebdo"], ["Sols", "Quotidien"], ["Self et rampes", "Quotidien"]]),
    z("Sanitaires", [["Toilettes", "Quotidien"], ["Lavabos", "Quotidien"], ["Sols", "Quotidien"]]),
  ],
  boulangerie_patisserie: [
    z("Fournil", [["Pétrin", "Quotidien"], ["Plans de travail", "Quotidien"], ["Sols", "Quotidien"], ["Four (extérieur)", "Hebdo"], ["Murs", "Mensuel"]]),
    z("Laboratoire pâtisserie", [["Plans de travail", "Quotidien"], ["Batteur et ustensiles", "Quotidien"], ["Sols", "Quotidien"], ["Armoires froides", "Hebdo"]]),
    z("Magasin", [["Vitrines", "Quotidien"], ["Comptoir", "Quotidien"], ["Sols", "Quotidien"]]),
    z("Réserve", [["Étagères", "Hebdo"], ["Sols", "Hebdo"]]),
  ],
  boucherie_charcuterie: [
    z("Laboratoire", [["Billots et plans de découpe", "Quotidien"], ["Hachoir", "Quotidien"], ["Trancheuse", "Quotidien"], ["Sols", "Quotidien"], ["Murs", "Hebdo"]]),
    z("Chambre froide", [["Sols", "Hebdo"], ["Crochets et rails", "Hebdo"], ["Murs", "Mensuel"]]),
    z("Magasin", [["Vitrines", "Quotidien"], ["Comptoir", "Quotidien"], ["Balance", "Quotidien"], ["Sols", "Quotidien"]]),
    z("Plonge", [["Bacs de plonge", "Quotidien"], ["Sols", "Quotidien"]]),
  ],
  poissonnerie: [
    z("Étal", [["Étal et bacs à glace", "Quotidien"], ["Balance", "Quotidien"], ["Sols", "Quotidien"]]),
    z("Laboratoire", [["Plans de découpe", "Quotidien"], ["Ustensiles", "Quotidien"], ["Sols", "Quotidien"], ["Murs", "Hebdo"]]),
    z("Chambre froide", [["Sols", "Hebdo"], ["Étagères", "Hebdo"]]),
    z("Plonge", [["Bacs de plonge", "Quotidien"], ["Sols", "Quotidien"]]),
  ],
  cremerie_fromagerie: [
    z("Magasin", [["Vitrines", "Quotidien"], ["Plans de coupe", "Quotidien"], ["Couteaux et fils à couper", "Quotidien"], ["Sols", "Quotidien"]]),
    z("Cave", [["Planches d'affinage", "Hebdo"], ["Sols", "Hebdo"], ["Murs", "Mensuel"]]),
    z("Réserve", [["Étagères", "Hebdo"], ["Sols", "Hebdo"]]),
  ],
  epicerie_primeur: [
    z("Magasin", [["Étals et rayons", "Quotidien"], ["Balance", "Quotidien"], ["Comptoir", "Quotidien"], ["Sols", "Quotidien"]]),
    z("Réserve", [["Étagères", "Hebdo"], ["Sols", "Hebdo"]]),
    z("Chambre froide", [["Sols", "Hebdo"], ["Étagères", "Hebdo"]]),
  ],
  glacier_chocolatier: [
    z("Laboratoire", [["Plans de travail", "Quotidien"], ["Turbine et pasteurisateur", "Quotidien"], ["Ustensiles", "Quotidien"], ["Sols", "Quotidien"]]),
    z("Magasin", [["Vitrines", "Quotidien"], ["Comptoir", "Quotidien"], ["Sols", "Quotidien"]]),
    z("Réserve", [["Étagères", "Hebdo"], ["Sols", "Hebdo"]]),
  ],
};

export interface EquipementPropose {
  nom: string;
  type: string;
}

const e = (nom: string, type: string): EquipementPropose => ({ nom, type });

export const EQUIPEMENTS_PROPOSES: Record<MetierId, EquipementPropose[]> = {
  restauration_commerciale: [e("Chambre froide positive", "chambre_froide_positive"), e("Réfrigérateur cuisine", "refrigerateur"), e("Congélateur", "congelateur")],
  traiteur: [e("Chambre froide positive", "chambre_froide_positive"), e("Réfrigérateur", "refrigerateur"), e("Congélateur", "congelateur")],
  restauration_collective: [e("Chambre froide positive", "chambre_froide_positive"), e("Chambre froide négative", "chambre_froide_negative"), e("Armoire produits laitiers", "refrigerateur")],
  boulangerie_patisserie: [e("Vitrine pâtisseries", "vitrine_refrigeree"), e("Armoire froide laboratoire", "refrigerateur"), e("Congélateur", "congelateur")],
  boucherie_charcuterie: [e("Chambre froide", "chambre_froide_positive"), e("Vitrine viandes", "vitrine_refrigeree"), e("Congélateur", "congelateur")],
  poissonnerie: [e("Étal réfrigéré", "vitrine_poisson"), e("Chambre froide", "chambre_froide_positive"), e("Congélateur", "congelateur")],
  cremerie_fromagerie: [e("Vitrine fromages", "vitrine_refrigeree"), e("Cave d'affinage", "cave_affinage"), e("Réfrigérateur produits laitiers", "refrigerateur")],
  epicerie_primeur: [e("Réfrigérateur produits frais", "refrigerateur"), e("Congélateur", "congelateur")],
  glacier_chocolatier: [e("Conservateur à glaces", "conservateur_glaces"), e("Vitrine de service", "conservateur_glaces"), e("Réfrigérateur", "refrigerateur")],
};

export interface ProduitExemple {
  nom: string;
  usage: string;
  dilution: string;
  temps_action_min: number;
  rincage: boolean;
}

/** Exemples pré-remplis : le visiteur remplace le nom et la dilution par ceux de ses produits. */
export const PRODUITS_EXEMPLES: ProduitExemple[] = [
  { nom: "Dégraissant", usage: "Dégraissant", dilution: "Selon l'étiquette", temps_action_min: 5, rincage: true },
  { nom: "Détergent-désinfectant", usage: "Détergent-désinfectant", dilution: "Selon l'étiquette", temps_action_min: 5, rincage: true },
  { nom: "Désinfectant de surfaces", usage: "Désinfectant", dilution: "Prêt à l'emploi", temps_action_min: 5, rincage: false },
  { nom: "Détartrant", usage: "Détartrant", dilution: "Selon l'étiquette", temps_action_min: 15, rincage: true },
];
