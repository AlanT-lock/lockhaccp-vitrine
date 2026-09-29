// FICHIER GÉNÉRÉ par lockhaccp/scripts/pms/synchroniser_vitrine.ts — ne pas modifier.
// Types d'équipements froids et leur consigne par défaut, proposée dans le
// questionnaire (le restaurateur peut l'ajuster). Valeurs issues de l'annexe I
// de l'arrêté du 21 décembre 2009, pour la denrée la plus exigeante qu'on y range
// habituellement. Validées par Alan le 29/09/2026.
import type { TypeEquipementFroid } from "./types";

const ANNEXE_I = "Arrêté du 21 décembre 2009, annexe I";

export const TYPES_EQUIPEMENTS_FROIDS: TypeEquipementFroid[] = [
  { type: "refrigerateur", libelle: "Réfrigérateur", consigneMin: 0, consigneMax: 4, reference: `${ANNEXE_I} (denrées très périssables +4 °C)`, statut: "valide" },
  { type: "chambre_froide_positive", libelle: "Chambre froide positive", consigneMin: 0, consigneMax: 3, reference: `${ANNEXE_I} (abats +3 °C, préparations élaborées +3 °C)`, statut: "valide" },
  { type: "vitrine_refrigeree", libelle: "Vitrine réfrigérée", consigneMin: 0, consigneMax: 4, reference: `${ANNEXE_I} (+3 °C si pâtisseries à la crème ou plats cuisinés)`, statut: "valide" },
  { type: "vitrine_poisson", libelle: "Étal ou vitrine à poisson", consigneMin: 0, consigneMax: 2, reference: `${ANNEXE_I} (produits de la pêche frais +2 °C)`, statut: "valide" },
  { type: "congelateur", libelle: "Congélateur", consigneMax: -18, reference: `${ANNEXE_I} (-18 °C)`, statut: "valide" },
  { type: "chambre_froide_negative", libelle: "Chambre froide négative", consigneMax: -18, reference: `${ANNEXE_I} (-18 °C)`, statut: "valide" },
  { type: "conservateur_glaces", libelle: "Conservateur ou vitrine à glaces", consigneMax: -18, reference: `${ANNEXE_I} (glaces et crèmes glacées -18 °C)`, statut: "valide" },
  { type: "cave_affinage", libelle: "Cave d'affinage", consigneMin: 8, consigneMax: 14, reference: "Température fixée par le fabricant ou selon le fromage (GBPH des produits laitiers)", statut: "valide" },
];
