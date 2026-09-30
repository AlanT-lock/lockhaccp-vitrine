// FICHIER GÉNÉRÉ par lockhaccp/scripts/pms/synchroniser_vitrine.ts — ne pas modifier.
// Suggestions du questionnaire : zones et surfaces à nettoyer, équipements
// froids proposés selon le métier. Le visiteur coche, décoche ou ajoute ;
// rien de ceci n'est imprimé sans avoir été confirmé.
import type { MetierId } from "./types";

export type Frequence = "Quotidien" | "Hebdo" | "Mensuel";

export interface SurfaceProposee {
  nom: string;
  frequence: Frequence;
  /** Présente dans presque tous les établissements : précochée. */
  courante: boolean;
}

export interface ZoneProposee {
  nom: string;
  /** Zone présente dans presque tous les établissements du métier : précochée. */
  precochee: boolean;
  surfaces: SurfaceProposee[];
}

type Surface = [nom: string, frequence: Frequence, courante?: boolean];

/** Surfaces d'un type de zone ; `courante` vaut vrai sauf mention contraire. */
const surfaces = (liste: Surface[]): SurfaceProposee[] =>
  liste.map(([nom, frequence, courante = true]) => ({ nom, frequence, courante }));

// Catalogue des types de zones et de leurs surfaces. Les zones de l'app
// (lib/helpers/zones_types.dart) en sont un sous-ensemble.
const Q = "Quotidien", H = "Hebdo", M = "Mensuel";
const CATALOGUE: Record<string, SurfaceProposee[]> = {
  "Cuisine": surfaces([
    ["Plans de travail", Q], ["Piano et plaques", Q], ["Four", H], ["Hotte et filtres", H], ["Sols", Q], ["Murs", M],
    ["Poignées et interrupteurs", Q], ["Éviers et lave-mains", Q], ["Poubelles", Q], ["Planches à découper", Q],
    ["Ustensiles et petit matériel", Q], ["Réfrigérateurs (intérieur)", H], ["Étagères", H],
    ["Friteuse", H, false], ["Trancheuse", Q, false], ["Robot et mixeur", Q, false], ["Salamandre", H, false],
    ["Plafond", M, false], ["Grilles d'évacuation", H, false],
  ]),
  "Laboratoire traiteur": surfaces([
    ["Plans de travail", Q], ["Matériel de cuisson", Q], ["Four", H], ["Hotte et filtres", H], ["Sols", Q], ["Murs", M],
    ["Poignées et interrupteurs", Q], ["Éviers et lave-mains", Q], ["Poubelles", Q], ["Planches à découper", Q],
    ["Ustensiles et petit matériel", Q], ["Cellule de refroidissement", H], ["Machine sous vide", Q, false],
    ["Trancheuse", Q, false], ["Robot et mixeur", Q, false], ["Plafond", M, false],
  ]),
  "Légumerie": surfaces([
    ["Plans de travail", Q], ["Éviers", Q], ["Sols", Q], ["Murs", M], ["Bacs de lavage", Q],
    ["Éplucheuse", Q, false], ["Essoreuse", Q, false], ["Coupe-légumes", Q, false],
  ]),
  "Plonge": surfaces([
    ["Bacs de plonge", Q], ["Lave-vaisselle", Q], ["Sols", Q], ["Murs", M], ["Siphons et grilles", H],
    ["Égouttoirs et étagères", H], ["Poubelles", Q], ["Adoucisseur et bac à sel", M, false],
  ]),
  "Réserve": surfaces([
    ["Étagères", H], ["Sols", H], ["Murs", M], ["Bacs de stockage", M, false], ["Portes et poignées", H, false],
  ]),
  "Chambre froide positive": surfaces([
    ["Sols", H], ["Étagères et clayettes", H], ["Murs et plafond", M], ["Joints et poignées de porte", H],
    ["Évaporateur (extérieur)", M, false], ["Crochets et rails", H, false],
  ]),
  "Chambre froide négative": surfaces([
    ["Sols", M], ["Étagères et clayettes", M], ["Murs et plafond", M], ["Joints et poignées de porte", M],
    ["Dégivrage complet", M, false],
  ]),
  "Bar": surfaces([
    ["Comptoir", Q], ["Machine à café", Q], ["Évier du bar", Q], ["Sols", Q], ["Réfrigérateurs du bar", H],
    ["Tireuse à bière", H, false], ["Machine à glaçons", M, false], ["Étagères à verres", H, false],
  ]),
  "Fournil": surfaces([
    ["Pétrin", Q], ["Plans de travail", Q], ["Sols", Q], ["Four (extérieur)", H], ["Murs", M],
    ["Chambre de pousse", H], ["Grilles et plaques", H], ["Façonneuse", H, false], ["Diviseuse", Q, false],
    ["Plafond", M, false],
  ]),
  "Laboratoire pâtisserie": surfaces([
    ["Plans de travail", Q], ["Batteur et mélangeur", Q], ["Ustensiles et petit matériel", Q], ["Sols", Q],
    ["Armoires froides", H], ["Murs", M], ["Éviers et lave-mains", Q], ["Laminoir", Q, false],
    ["Poches et douilles", Q, false], ["Four", H, false],
  ]),
  "Laboratoire boucherie": surfaces([
    ["Billots et plans de découpe", Q], ["Hachoir", Q], ["Couteaux et ustensiles", Q], ["Sols", Q], ["Murs", H],
    ["Éviers et lave-mains", Q], ["Trancheuse", Q, false], ["Scie à os", Q, false], ["Poussoir", Q, false],
    ["Machine sous vide", Q, false],
  ]),
  "Laboratoire poissonnerie": surfaces([
    ["Plans de découpe", Q], ["Couteaux et ustensiles", Q], ["Bacs", Q], ["Sols", Q], ["Murs", H],
    ["Éviers et lave-mains", Q], ["Machine à glace", M, false], ["Écailleuse", Q, false],
  ]),
  "Laboratoire glacier": surfaces([
    ["Plans de travail", Q], ["Turbine", Q], ["Pasteurisateur", Q], ["Moules", Q], ["Ustensiles et petit matériel", Q],
    ["Sols", Q], ["Murs", M], ["Tempéreuse", Q, false], ["Cellule de surgélation", H, false],
  ]),
  "Étal": surfaces([
    ["Étal et bacs à glace", Q], ["Balance", Q], ["Plans de découpe", Q], ["Sols", Q], ["Couteaux", Q],
    ["Vitre de l'étal", Q, false],
  ]),
  "Magasin": surfaces([
    ["Vitrines", Q], ["Comptoir", Q], ["Balance", Q], ["Sols", Q], ["Étagères et présentoirs", H],
    ["Caisse et terminal de paiement", Q, false], ["Vitres", H, false], ["Trancheuse", Q, false],
    ["Pinces et ustensiles de service", Q, false],
  ]),
  "Cave d'affinage": surfaces([
    ["Planches d'affinage", H], ["Étagères", H], ["Sols", H], ["Murs", M], ["Portes et poignées", H, false],
  ]),
  "Sanitaires": surfaces([
    ["Toilettes", Q], ["Lavabos", Q], ["Sols", Q], ["Poignées et interrupteurs", Q], ["Murs", M, false],
    ["Distributeurs de savon et d'essuie-mains", H, false],
  ]),
  "Vestiaires": surfaces([["Sols", H], ["Casiers", M], ["Bancs", H], ["Poignées et interrupteurs", H, false]]),
  "Local poubelles": surfaces([["Conteneurs", H], ["Sols", H], ["Murs", M], ["Grille d'évacuation", M, false]]),
  "Zone de livraison": surfaces([
    ["Sols", Q], ["Chariots et bacs de transport", Q], ["Conteneurs isothermes", Q], ["Quai et portes", H, false],
  ]),
  "Véhicule de livraison": surfaces([
    ["Caisson frigorifique", H], ["Bacs isothermes", Q], ["Poignées et portes", H], ["Sols du caisson", H],
  ]),
};

/** Zone du catalogue ; `nom` peut renommer le type (« Laboratoire » pour « Laboratoire boucherie »). */
const zone = (type: string, precochee: boolean, nom = type): ZoneProposee => ({
  nom,
  precochee,
  surfaces: CATALOGUE[type].map((s) => ({ ...s })),
});

export const ZONES_PROPOSEES: Record<MetierId, ZoneProposee[]> = {
  restauration_commerciale: [
    zone("Cuisine", true), zone("Plonge", true), zone("Réserve", true), zone("Sanitaires", true),
    zone("Chambre froide positive", false), zone("Chambre froide négative", false), zone("Bar", false),
    zone("Vestiaires", false), zone("Local poubelles", false),
  ],
  traiteur: [
    zone("Laboratoire traiteur", true, "Laboratoire"), zone("Plonge", true), zone("Réserve", true),
    zone("Chambre froide positive", true), zone("Sanitaires", true), zone("Chambre froide négative", false),
    zone("Zone de livraison", false), zone("Véhicule de livraison", false), zone("Vestiaires", false),
    zone("Local poubelles", false),
  ],
  restauration_collective: [
    zone("Cuisine", true), zone("Légumerie", true), zone("Plonge", true), zone("Réserve", true),
    zone("Chambre froide positive", true), zone("Chambre froide négative", true),
    zone("Sanitaires", true), zone("Vestiaires", true), zone("Local poubelles", true), zone("Zone de livraison", false),
  ],
  boulangerie_patisserie: [
    zone("Fournil", true), zone("Laboratoire pâtisserie", true), zone("Magasin", true), zone("Réserve", true),
    zone("Sanitaires", true), zone("Chambre froide positive", false), zone("Plonge", false), zone("Vestiaires", false),
  ],
  boucherie_charcuterie: [
    zone("Laboratoire boucherie", true, "Laboratoire"), zone("Chambre froide positive", true, "Chambre froide"),
    zone("Magasin", true), zone("Plonge", true), zone("Sanitaires", true), zone("Réserve", false),
    zone("Chambre froide négative", false), zone("Local poubelles", false), zone("Vestiaires", false),
  ],
  poissonnerie: [
    zone("Étal", true), zone("Laboratoire poissonnerie", true, "Laboratoire"),
    zone("Chambre froide positive", true, "Chambre froide"), zone("Plonge", true), zone("Sanitaires", true),
    zone("Réserve", false), zone("Local poubelles", false), zone("Vestiaires", false),
  ],
  cremerie_fromagerie: [
    zone("Magasin", true), zone("Réserve", true), zone("Sanitaires", true), zone("Cave d'affinage", false),
    zone("Chambre froide positive", false, "Chambre froide"), zone("Plonge", false),
  ],
  epicerie_primeur: [
    zone("Magasin", true), zone("Réserve", true), zone("Sanitaires", true),
    zone("Chambre froide positive", false, "Chambre froide"), zone("Local poubelles", false),
  ],
  glacier_chocolatier: [
    zone("Laboratoire glacier", true, "Laboratoire"), zone("Magasin", true), zone("Réserve", true),
    zone("Sanitaires", true), zone("Plonge", false),
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
