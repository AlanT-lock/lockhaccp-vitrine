// Affiches du PMS : obligatoires pour les clients, hygiène du personnel
// (recommandations) et obligations de l'employeur. Validées par Alan le 29/09/2026.
// `contenu` = ce qui s'imprime ; `noteExploitant` = consigne pour le restaurateur,
// jamais imprimée sur l'affiche.
import type { Affiche, Condition, MetierId } from "./types.ts";

const TOUJOURS: Condition = { toujours: true };
const AVEC_SALARIES: Condition = { question: "personnel.effectif", superieurA: 0 };
const RESTAURATION: MetierId[] = ["restauration_commerciale", "traiteur", "restauration_collective"];
const COMMERCES: MetierId[] = [
  "boulangerie_patisserie",
  "boucherie_charcuterie",
  "poissonnerie",
  "cremerie_fromagerie",
  "epicerie_primeur",
  "glacier_chocolatier",
];

const affiche = (a: Omit<Affiche, "type" | "statut">): Affiche => ({ ...a, type: "affiche", statut: "valide" });

export const AFFICHES: Affiche[] = [
  // ─── Clients ────────────────────────────────────────────────────────────
  affiche({
    id: "affiche.allergenes",
    titre: "Tableau des allergènes",
    public: "clients",
    obligatoire: true,
    metiers: "tous",
    condition: TOUJOURS,
    // Mise en page dans pdf/affiches_design.ts : tableau en paysage (modèle d'Alan,
    // 01/10/2026), une ligne par produit, une colonne par allergène à cocher.
    contenu: "TABLEAU DES ALLERGÈNES\n\n{etablissement.nom}",
    noteExploitant:
      "Inscrire chaque plat ou produit sur une ligne et cocher les allergènes qu'il contient. " +
      "Le tableau doit être tenu à jour et consultable par le client directement, sans avoir à le demander.",
    reference: "Code de la consommation, art. R. 412-12 à R. 412-16 ; règlement (UE) n° 1169/2011, art. 9, 44 et annexe II",
    sourceUrl: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032807848/",
  }),
  affiche({
    id: "affiche.origine_viandes",
    titre: "Origine de nos viandes",
    public: "clients",
    obligatoire: true,
    metiers: RESTAURATION,
    condition: {
      unDe: [
        { question: "prep.viande_bovine", egal: true },
        { question: "prep.autres_viandes_crues", egal: true },
        { question: "prep.produits_viande_achetes", egal: true },
      ],
    },
    // Mise en page dans pdf/affiches_design.ts : une ligne par viande servie
    // (bœuf : né, élevé, abattu ; porc, volaille, agneau : élevé, abattu) et un
    // tableau pour les viandes des préparations achetées prêtes.
    contenu: "L'ORIGINE DE NOS VIANDES\n\n{etablissement.nom}",
    noteExploitant:
      "Indiquer le ou les pays pour chaque viande. « Origine : France » (ou un autre pays) suffit si la naissance, " +
      "l'élevage et l'abattage ont eu lieu dans ce pays. L'information peut aussi figurer sur la carte.",
    reference:
      "Décret n° 2002-1465 du 17 décembre 2002 modifié (décrets n° 2022-65, n° 2024-171 et n° 2025-141)",
    sourceUrl: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000411003",
  }),
  affiche({
    id: "affiche.origine_viande_boucherie",
    titre: "Étiquette type des viandes bovines (vente au détail)",
    public: "clients",
    obligatoire: true,
    metiers: ["boucherie_charcuterie"],
    condition: { question: "prep.viande_bovine", egal: true },
    contenu:
      "VIANDE BOVINE — ÉTIQUETTE À PLACER PRÈS DU PRODUIT\n\n" +
      "Morceau : ________________ Prix au kg : ________\n" +
      "N° de référence de l'animal ou du lot : ________________\n" +
      "Né en : ________ Élevé en : ________\n" +
      "Abattu en : ________ (n° d'agrément de l'abattoir : ________)\n" +
      "Découpé en : ________ (n° d'agrément de l'atelier de découpe : ________)\n" +
      "Catégorie : ________ Type racial : ________",
    noteExploitant:
      "Une étiquette par viande exposée. « Origine : pays » remplace les trois lignes Né / Élevé / Abattu " +
      "seulement si les trois étapes ont eu lieu dans le même pays.",
    reference: "Règlement (CE) n° 1760/2000, art. 13 (étiquetage de la viande bovine)",
    sourceUrl: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32000R1760",
  }),
  affiche({
    id: "affiche.prix_commerce",
    titre: "Étiquette type des prix (commerce de détail)",
    public: "clients",
    obligatoire: true,
    metiers: COMMERCES,
    condition: TOUJOURS,
    contenu:
      "ÉTIQUETTE PRIX — À PLACER SUR CHAQUE PRODUIT EXPOSÉ\n\n" +
      "Produit : ________________\n" +
      "Prix TTC : ________ €\n" +
      "Prix au kilo ou au litre (produits vendus au poids ou au volume) : ________ €",
    noteExploitant:
      "Chaque produit exposé à la vente porte son prix TTC en euros, par étiquette, marquage ou écriteau.",
    reference: "Arrêté du 3 décembre 1987 relatif à l'information du consommateur sur les prix",
    sourceUrl: "https://www.legifrance.gouv.fr/loda/id/LEGITEXT000006057893/",
  }),
  affiche({
    id: "affiche.egalim",
    titre: "Part des produits durables et de qualité (EGalim)",
    public: "clients",
    obligatoire: true,
    metiers: ["restauration_collective"],
    condition: TOUJOURS,
    contenu:
      "CE QUE CONTIENNENT NOS REPAS — ANNÉE ______\n\n" +
      "Produits durables et de qualité : ____ % (dont produits issus de l'agriculture biologique : ____ %)\n" +
      "Actions menées pour développer les produits du commerce équitable : ________________________\n\n" +
      "{etablissement.nom}",
    noteExploitant:
      "Affichage permanent à l'entrée du restaurant, mis à jour au moins une fois par an, et communiqué aussi " +
      "une fois par an par voie électronique.",
    reference: "Code rural et de la pêche maritime, art. L230-5-3",
    sourceUrl: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037549803",
  }),
  affiche({
    id: "affiche.protection_mineurs_alcool",
    titre: "Protection des mineurs et répression de l'ivresse publique (modèle officiel)",
    public: "clients",
    obligatoire: true,
    metiers: ["restauration_commerciale", "traiteur", "epicerie_primeur", "cremerie_fromagerie"],
    condition: { question: "activite.alcool", egal: true },
    contenu: "PROTECTION DES MINEURS ET RÉPRESSION DE L'IVRESSE PUBLIQUE",
    noteExploitant:
      "Le PDF reproduit le modèle officiel de l'arrêté du 17 octobre 2016 : modèle « consommation sur place » " +
      "(près de l'entrée ou du comptoir) pour la restauration, modèle « vente à emporter » (près des rayons " +
      "d'alcool et des caisses) pour les commerces.",
    modeleOfficielUrl: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072665/LEGISCTA000006171207/",
    reference: "Code de la santé publique, art. L3342-4 ; arrêté du 17 octobre 2016 fixant les modèles et lieux d'apposition",
    sourceUrl: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000020895228/",
  }),
  affiche({
    id: "affiche.produits_peche",
    titre: "Étiquette type des produits de la pêche et de l'aquaculture",
    public: "clients",
    obligatoire: true,
    metiers: ["poissonnerie"],
    condition: TOUJOURS,
    contenu:
      "ÉTIQUETTE À PLACER PRÈS DE CHAQUE PRODUIT\n\n" +
      "Dénomination commerciale : ________________ (nom scientifique : ________________)\n" +
      "Méthode de production : pêché / pêché en eaux douces / élevé\n" +
      "Zone de capture ou pays d'élevage : ________________\n" +
      "Engin de pêche : ________________\n" +
      "Décongelé : oui / non Prix au kg : ________",
    noteExploitant: "Une étiquette par produit exposé ; rayer les mentions inutiles.",
    reference: "Règlement (UE) n° 1379/2013, art. 35 et 38",
    sourceUrl: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32013R1379",
  }),
  affiche({
    id: "affiche.origine_fruits_legumes",
    titre: "Pancarte type des fruits et légumes",
    public: "clients",
    obligatoire: true,
    metiers: ["epicerie_primeur"],
    condition: { question: "prep.fruits_legumes_vrac", egal: true },
    contenu:
      "PANCARTE À PLACER PRÈS DE CHAQUE PRODUIT\n\n" +
      "Produit : ________________ Variété : ________________\n" +
      "Pays d'origine : ________________\n" +
      "Catégorie : ________ Calibre : ________\n" +
      "Prix : ________ € le kg / la pièce",
    noteExploitant:
      "Variété, catégorie et calibre : seulement pour les produits soumis à une norme spécifique de commercialisation.",
    reference: "Règlement délégué (UE) 2023/2429 (normes de commercialisation), applicable depuis le 1er janvier 2025",
    sourceUrl: "https://eur-lex.europa.eu/legal-content/fr/ALL/?uri=CELEX%3A32023R2429",
  }),

  // ─── Hygiène du personnel (recommandations) ─────────────────────────────
  affiche({
    id: "affiche.lavage_mains",
    titre: "Lavage des mains",
    public: "personnel",
    obligatoire: false,
    metiers: "tous",
    condition: TOUJOURS,
    contenu:
      "LAVAGE DES MAINS\n\n" +
      "QUAND ? En arrivant au poste, après une pause, après être allé aux toilettes, après s'être mouché, " +
      "après avoir manipulé des déchets, des emballages, des produits crus ou de l'argent, " +
      "et entre deux tâches différentes.\n\n" +
      "COMMENT ?\n1. Mouiller les mains et les avant-bras.\n2. Savonner avec un savon bactéricide " +
      "(distributeur à commande non manuelle).\n3. Frotter au moins 30 secondes : paumes, dos, entre les doigts, " +
      "ongles, poignets.\n4. Rincer abondamment.\n5. Sécher avec un essuie-mains à usage unique.\n" +
      "6. Jeter l'essuie-mains sans toucher la poubelle.",
    reference: "Règlement (CE) n° 852/2004, annexe II, chapitre VIII (hygiène personnelle) ; GBPH",
    sourceUrl: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32004R0852",
  }),

  // ─── Employeur ──────────────────────────────────────────────────────────
  affiche({
    id: "affiche.employeur_inspection_travail",
    titre: "Inspection du travail",
    public: "personnel",
    obligatoire: true,
    metiers: "tous",
    condition: AVEC_SALARIES,
    contenu:
      "INSPECTION DU TRAVAIL\n\nAdresse : ______________________\nTéléphone : ______________\n" +
      "Nom de l'inspecteur compétent : ______________________\n\n{etablissement.nom}",
    reference: "Code du travail, art. D4711-1",
    sourceUrl: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018527636",
  }),
  affiche({
    id: "affiche.employeur_medecine_travail",
    titre: "Service de santé au travail",
    public: "personnel",
    obligatoire: true,
    metiers: "tous",
    condition: AVEC_SALARIES,
    contenu:
      "SERVICE DE SANTÉ AU TRAVAIL\n\nMédecin ou service compétent : ______________________\n" +
      "Adresse : ______________________\nTéléphone : ______________\n\n{etablissement.nom}",
    reference: "Code du travail, art. D4711-1",
    sourceUrl: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018527636",
  }),
  affiche({
    id: "affiche.employeur_convention_collective",
    titre: "Convention collective applicable",
    public: "personnel",
    obligatoire: true,
    metiers: "tous",
    condition: AVEC_SALARIES,
    contenu:
      "CONVENTION COLLECTIVE\n\n" +
      "Convention collective applicable : ______________________ (IDCC ______)\n" +
      "Elle est tenue à votre disposition : ______________________\n" +
      "Vous pouvez la consulter pendant votre temps de travail, en le demandant à : ______________\n\n" +
      "{etablissement.nom}",
    noteExploitant: "La loi impose une information « par tout moyen » ; l'affichage est le moyen le plus courant.",
    reference: "Code du travail, art. R2262-3",
    sourceUrl: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033292505",
  }),
];
