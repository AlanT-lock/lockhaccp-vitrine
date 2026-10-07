// Contenu de la page de présentation du PMS (/plan-de-maitrise-sanitaire).
// Les aperçus sont de vraies pages d'un dossier généré par le générateur
// (exemple « Le Bistrot Exemple », restauration commerciale, 2 services).

import tableauCcp from "@/assets/pms/tableau-ccp.webp";
import planNettoyage from "@/assets/pms/plan-nettoyage.webp";
import releveTemperature from "@/assets/pms/releve-temperature.webp";
import huileFriture from "@/assets/pms/huile-friture.webp";
import reception from "@/assets/pms/reception.webp";
import allergenes from "@/assets/pms/allergenes.webp";
import lavageMains from "@/assets/pms/lavage-mains.webp";
// Versions réduites (400 px portrait, 600 px paysage) servies aux petits écrans via srcset.
// Si un aperçu change, régénérer aussi sa version « -petit ».
import tableauCcpPetit from "@/assets/pms/tableau-ccp-petit.webp";
import planNettoyagePetit from "@/assets/pms/plan-nettoyage-petit.webp";
import releveTemperaturePetit from "@/assets/pms/releve-temperature-petit.webp";
import huileFriturePetit from "@/assets/pms/huile-friture-petit.webp";
import receptionPetit from "@/assets/pms/reception-petit.webp";
import allergenesPetit from "@/assets/pms/allergenes-petit.webp";
import lavageMainsPetit from "@/assets/pms/lavage-mains-petit.webp";

export interface PageApercu {
  src: string;
  alt: string;
  /** Dimensions réelles de l'image (évitent le décalage de mise en page). */
  largeur: number;
  hauteur: number;
  /** Version réduite pour les petits écrans, et sa largeur en pixels. */
  srcPetit: string;
  largeurPetit: number;
}

export interface Intercalaire {
  id: string;
  onglet: string;
  titre: string;
  texte: string;
  /** Nombre de documents de cette section dans le dossier d'exemple. */
  documents: number;
  pages: PageApercu[];
}

const portrait = (src: string, srcPetit: string, alt: string): PageApercu =>
  ({ src, alt, largeur: 760, hauteur: 1075, srcPetit, largeurPetit: 400 });
const paysage = (src: string, srcPetit: string, alt: string): PageApercu =>
  ({ src, alt, largeur: 1100, hauteur: 778, srcPetit, largeurPetit: 600 });

export const INTERCALAIRES: Intercalaire[] = [
  {
    id: "dangers",
    documents: 1,
    onglet: "Analyse des dangers",
    titre: "Le tableau des CCP",
    texte:
      "Chaque point critique de votre activité, avec son seuil, la surveillance à faire et la mesure à prendre en cas d'écart.",
    pages: [paysage(tableauCcp, tableauCcpPetit, "Tableau d'analyse des dangers (CCP) d'un restaurant : seuils critiques, surveillance et mesures correctives")],
  },
  {
    id: "nettoyage",
    documents: 1,
    onglet: "Nettoyage",
    titre: "Le plan de nettoyage et de désinfection",
    texte:
      "Zone par zone : chaque surface, sa fréquence et le type de produit à utiliser, avec une colonne pour le responsable.",
    pages: [portrait(planNettoyage, planNettoyagePetit, "Plan de nettoyage et de désinfection par zone : surfaces, fréquences et types de produits")],
  },
  {
    id: "tracabilite",
    documents: 9,
    onglet: "Traçabilité",
    titre: "Les fiches d'enregistrement",
    texte:
      "Une fiche d'une page par équipement froid, par friteuse et par zone de nettoyage, plus la réception des marchandises et le refroidissement.",
    pages: [
      portrait(releveTemperature, releveTemperaturePetit, "Relevé mensuel de température d'une chambre froide, avec consigne et actions correctives"),
      portrait(huileFriture, huileFriturePetit, "Fiche de traçabilité des huiles de friture"),
      portrait(reception, receptionPetit, "Registre de réception des marchandises"),
    ],
  },
  {
    id: "affichage",
    documents: 7,
    onglet: "Affichage",
    titre: "Les affichages obligatoires",
    texte:
      "Tableau des allergènes, lavage des mains, origine des viandes, protection des mineurs : ce qui doit être affiché selon votre activité.",
    pages: [
      paysage(allergenes, allergenesPetit, "Tableau des 14 allergènes à compléter pour chaque plat"),
      portrait(lavageMains, lavageMainsPetit, "Affiche du lavage des mains en 9 étapes"),
    ],
  },
];

/** Arborescence réelle du dossier d'exemple (restaurant, 2 services, 4 équipements froids). */
export const ARBORESCENCE: { dossier: string; fichiers: string[] }[] = [
  { dossier: "", fichiers: ["Tableau CCP.pdf", "Plan de nettoyage et de désinfection.pdf"] },
  {
    dossier: "Traçabilité",
    fichiers: [
      "Réception des marchandises.pdf",
      "Relevé de température - Chambre froide viandes.pdf",
      "Relevé de température - Frigo légumes.pdf",
      "Relevé de température - Vitrine desserts.pdf",
      "Relevé de température - Congélateur.pdf",
      "Nettoyage - Préparation.pdf",
      "Nettoyage - Stockage.pdf",
      "Huile de friture - Friteuse frites.pdf",
      "Refroidissement.pdf",
    ],
  },
  {
    dossier: "Affichage obligatoire",
    fichiers: [
      "Tableau des allergènes.pdf",
      "Origine de nos viandes.pdf",
      "Protection des mineurs et répression de l'ivresse publique.pdf",
      "Lavage des mains.pdf",
      "Inspection du travail.pdf",
      "Service de santé au travail.pdf",
      "Convention collective applicable.pdf",
    ],
  },
];

export const NB_DOCUMENTS_EXEMPLE = ARBORESCENCE.reduce((n, d) => n + d.fichiers.length, 0);

export const FAQ_PMS = [
  {
    question: "Le Plan de Maîtrise Sanitaire est-il obligatoire pour un restaurant ?",
    answer:
      "Le règlement (CE) n° 852/2004 oblige tout exploitant du secteur alimentaire à appliquer des procédures fondées sur les principes HACCP et à conserver les enregistrements qui le prouvent. Le Plan de Maîtrise Sanitaire est le dossier qui rassemble ces éléments. Le document portant ce nom n'est formellement exigé que des établissements soumis à agrément sanitaire, mais c'est ce que l'inspecteur demande à voir lors d'un contrôle en restaurant.",
  },
  {
    question: "Que vérifie l'inspecteur de la DDPP lors d'un contrôle ?",
    answer:
      "Il regarde l'hygiène des locaux et du personnel, puis vos documents : analyse des dangers, relevés de températures, plan de nettoyage, réception des marchandises, traçabilité et affichages. En restauration commerciale, il vérifie aussi qu'au moins une personne de l'établissement a suivi la formation de 14 heures en hygiène alimentaire.",
  },
  {
    question: "Le PMS est-il vraiment gratuit ?",
    answer:
      "Oui. Vous indiquez seulement votre e-mail, votre téléphone et le nom de votre établissement pour recevoir le dossier. Aucun paiement ni carte bancaire n'est demandé.",
  },
  {
    question: "Combien de temps faut-il pour le créer ?",
    answer:
      "Environ 10 minutes. Le questionnaire porte sur votre métier, vos préparations, vos équipements froids, vos friteuses et vos zones de nettoyage. Le dossier arrive ensuite par e-mail.",
  },
  {
    question: "Mon activité n'est pas un restaurant, le PMS est-il adapté ?",
    answer:
      "Le générateur couvre 9 métiers : restauration commerciale et collective, traiteur, boulangerie-pâtisserie, boucherie-charcuterie, poissonnerie, crèmerie-fromagerie, épicerie-primeur, glacier-chocolatier. Le contenu change selon le métier choisi.",
  },
  {
    question: "Que se passe-t-il si l'inspecteur trouve une non-conformité ?",
    answer:
      "Tout dépend de la gravité. Pour des écarts mineurs, vous recevez un courrier qui les liste. Pour des écarts plus sérieux, c'est une mise en demeure avec un délai pour corriger, et souvent une nouvelle visite. Si la santé des clients est menacée, le préfet peut ordonner la fermeture administrative. Le résultat est publié sur Alim'confiance pendant un an, sur quatre niveaux.",
  },
  {
    question: "Faut-il mettre le PMS à jour ?",
    answer:
      "Oui, il doit correspondre à votre activité réelle : un nouvel équipement froid, une nouvelle préparation ou une nouvelle zone de nettoyage se reportent dans le dossier. Avec le générateur, il suffit de refaire le questionnaire pour obtenir un dossier à jour.",
  },
  {
    question: "Faut-il utiliser l'application LockHACCP ?",
    answer:
      "Non. Le dossier s'imprime et se remplit à la main. L'application remplace simplement les fiches papier : relevés sur téléphone, rappels, photos des étiquettes et historique prêt pour le contrôle. Deux mois d'essai sont offerts avec votre PMS.",
  },
];
