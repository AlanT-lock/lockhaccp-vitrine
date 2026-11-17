// Registres d'enregistrement du PMS, préremplis par le générateur (lot 2).
// Fiches de traçabilité du dossier PMS (v2 du 30/09/2026) : uniquement celles
// retenues par Alan ; la mise en page de chaque fiche est dans pdf/fiches.ts.
import type { Condition, MetierId, Registre } from "./types.ts";

const TOUJOURS: Condition = { toujours: true };
const RESTAURATION: MetierId[] = ["restauration_commerciale", "traiteur", "restauration_collective"];
const CUISSON_AVANCE: MetierId[] = [...RESTAURATION, "boulangerie_patisserie", "boucherie_charcuterie"];

const R852 = "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32004R0852";
const ANNEXE_IV = "https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000041864953";
const REF_ANNEXE_IV_HORS_COLLECTIVE =
  "Règlement (CE) n° 852/2004, annexe II, chapitre IX ; valeurs de l'arrêté du 21 décembre 2009, annexe IV " +
  "(obligatoires en restauration collective, référence pour les autres métiers)";
const REF_ENREGISTREMENTS = "Règlement (CE) n° 852/2004, art. 5 (procédures fondées sur l'HACCP et enregistrements)";

const registre = (g: Omit<Registre, "type" | "statut">): Registre => ({ ...g, type: "registre", statut: "valide" });

export const REGISTRES: Registre[] = [
  registre({
    id: "registre.temperatures",
    titre: "Relevé de température",
    metiers: "tous",
    condition: { question: "equipements.froids", nonVide: true },
    consigne:
      "Relever la température de l'équipement chaque jour (matin et soir pour deux services), cocher la " +
      "conformité et noter l'action corrective en cas d'écart.",
    frequence: "Chaque jour, une fiche par équipement et par mois",
    colonnes: ["Jour", "Température (°C)", "Conformité", "Actions correctives"],
    reference: `${REF_ENREGISTREMENTS} ; arrêté du 21 décembre 2009, annexe I`,
    sourceUrl: R852,
  }),
  registre({
    id: "registre.nettoyage",
    titre: "Nettoyage",
    metiers: "tous",
    condition: TOUJOURS,
    consigne: "Cocher la fréquence du nettoyage réalisé dans la zone et signer.",
    frequence: "Chaque jour, une fiche par zone et par mois",
    colonnes: ["Jour", "Fréquence du nettoyage", "Signature"],
    reference: "Règlement (CE) n° 852/2004, art. 5 et annexe II, chapitres I et V",
    sourceUrl: R852,
  }),
  registre({
    id: "registre.reception",
    titre: "Réception des marchandises",
    metiers: "tous",
    condition: TOUJOURS,
    consigne: "Contrôler chaque livraison (température, état, dates) et noter la conformité.",
    frequence: "À chaque livraison",
    colonnes: ["Date", "Température (°C)", "Nom du fournisseur", "Conformité", "Observations"],
    reference: `${REF_ENREGISTREMENTS} ; arrêté du 21 décembre 2009, annexe I`,
    sourceUrl: R852,
  }),
  registre({
    id: "registre.huile",
    titre: "Huile de friture",
    metiers: [...RESTAURATION, "boulangerie_patisserie"],
    condition: { question: "equipements.friteuses", nonVide: true },
    consigne: "Contrôler l'huile chaque jour d'utilisation ; noter le changement d'huile et le nettoyage.",
    frequence: "Chaque jour d'utilisation, une fiche par friteuse et par mois",
    colonnes: ["Jour", "Conformité de l'huile", "Changement de l'huile", "Nettoyage de la friteuse"],
    reference: "Décret n° 2008-184 du 26 février 2008, art. 8",
    sourceUrl: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000018188420",
  }),
  registre({
    id: "registre.refroidissement",
    titre: "Refroidissement",
    metiers: CUISSON_AVANCE,
    condition: { question: "prep.cuisson_avance", egal: true },
    consigne: "De +63 °C minimum à +10 °C maximum à cœur en moins de 2 heures.",
    frequence: "À chaque refroidissement",
    colonnes: [
      "Date", "Nom du produit", "Température après cuisson (°C)", "Horaire après cuisson",
      "Température après refroidissement (°C)", "Horaire après refroidissement", "Signature",
    ],
    reference: REF_ANNEXE_IV_HORS_COLLECTIVE,
    sourceUrl: ANNEXE_IV,
  }),
  registre({
    id: "registre.plats_temoins",
    titre: "Plats témoins",
    metiers: ["restauration_collective"],
    condition: TOUJOURS,
    consigne: "Conserver un échantillon de chaque plat servi au moins 5 jours entre 0 et +3 °C.",
    frequence: "À chaque service",
    colonnes: ["Date", "Repas", "Plats prélevés", "Date de destruction", "Signature"],
    reference: "Arrêté du 21 décembre 2009, annexe IV",
    sourceUrl: ANNEXE_IV,
  }),
  registre({
    id: "registre.plats_temoins_traiteur",
    titre: "Plats témoins",
    metiers: ["traiteur"],
    condition: { question: "activite.livre_collectivites", egal: true },
    consigne: "Conserver un échantillon de chaque plat livré à une collectivité au moins 5 jours entre 0 et +3 °C.",
    frequence: "À chaque livraison",
    colonnes: ["Date", "Repas", "Plats prélevés", "Date de destruction", "Signature"],
    reference: "Arrêté du 21 décembre 2009, annexe IV",
    sourceUrl: ANNEXE_IV,
  }),
  registre({
    id: "registre.assainissement_poisson",
    titre: "Assainissement du poisson cru",
    metiers: ["restauration_commerciale", "traiteur", "poissonnerie"],
    condition: {
      tous: [
        { question: "prep.poisson_cru", egal: true },
        { question: "prep.poisson_cru_assaini", egal: false },
      ],
    },
    consigne: "Congeler le poisson servi cru à -20 °C à cœur pendant 24 h au moins, ou à -35 °C pendant 15 h.",
    frequence: "À chaque lot congelé sur place",
    colonnes: [
      "Date", "Poisson / lot", "Heure d'entrée", "Température (°C)", "Date et heure de sortie", "Durée respectée", "Signature",
    ],
    reference: "Règlement (CE) n° 853/2004, annexe III, section VIII, chapitre III, partie D",
    sourceUrl: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32004R0853",
  }),
];
