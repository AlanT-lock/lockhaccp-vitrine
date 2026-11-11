// Option « Capteurs connectés » : source unique des montants, des textes et de
// l'état de vente pour le site (page tarifs et page /capteurs-connectes).
// Mêmes montants que dans l'app, la console et Stripe : vente de kit en paiement
// unique depuis le 02/11/2026 (spec lockhaccp 2026-11-01-capteurs-vente-kit).

import { formatPriceEUR, MENTION_TVA } from "@/lib/launch";
import { APP_URL } from "@/lib/links";

/**
 * L'option est-elle déjà achetable ? Oui : vente de kit ouverte le 02/11/2026
 * (prix Stripe STRIPE_PRICE_PASSERELLE / STRIPE_PRICE_CAPTEUR). À `false`, le
 * bouton de commande devient « Être prévenu » et mène au formulaire de contact.
 */
export const CAPTEURS_EN_VENTE = true;

/** Passerelle : une fois par établissement, paiement unique, prix net (TVA non applicable). */
export const PRIX_PASSERELLE = 200;
/** Capteur : paiement unique, prix net (TVA non applicable). */
export const PRIX_CAPTEUR = 60;
/** Délai de livraison annoncé avant le paiement. */
export const DELAI_LIVRAISON_LIBELLE = "sous 10 jours maximum";

/** Prix d'un kit : passerelle (si elle est due) + n capteurs. */
export function prixKit(nbCapteurs: number, avecPasserelle = true): number {
  return PRIX_CAPTEUR * nbCapteurs + (avecPasserelle ? PRIX_PASSERELLE : 0);
}

export const CHEMIN_CAPTEURS = "/capteurs-connectes";

/** Sujet passé au formulaire de contact pour préremplir le message. */
export const SUJET_CONTACT_CAPTEURS = "capteurs";
export const MESSAGE_CONTACT_CAPTEURS =
  "Bonjour, je souhaite être prévenu dès que les capteurs de température connectés seront disponibles. Nombre de frigos et congélateurs à équiper : ";

/** Lien du bouton de commande : l'app quand l'option est en vente, sinon le formulaire de contact. */
export function lienCommandeCapteurs(enVente: boolean = CAPTEURS_EN_VENTE): { href: string; libelle: string; externe: boolean } {
  return enVente
    ? { href: APP_URL, libelle: "Ajouter des capteurs", externe: true }
    : { href: `/contact?sujet=${SUJET_CONTACT_CAPTEURS}#formulaire`, libelle: "Bientôt disponible : être prévenu", externe: false };
}

export const PRIX_KIT_LIBELLE = `Passerelle ${formatPriceEUR(PRIX_PASSERELLE)} + ${formatPriceEUR(PRIX_CAPTEUR)} par capteur`;

/** Points clés, repris sur la page tarifs et la page dédiée. */
export const POINTS_CAPTEURS = [
  "Paiement unique, sans abonnement capteurs",
  "Le matériel vous appartient",
  "Livraison comprise, sous 10 jours maximum",
  "Kit préconfiguré : branchez la passerelle sur votre box, posez un capteur dans chaque enceinte",
  "Alertes par notification, e-mail et SMS, même la nuit et le week-end",
  "Relevés écrits tout seuls dans votre registre des températures",
];

export const FAQ_CAPTEURS = [
  {
    question: "Que se passe-t-il si internet coupe ?",
    answer:
      "Les capteurs continuent de mesurer. Si la passerelle ne reçoit plus rien pendant une heure, vous recevez une alerte « capteur muet » qui vous invite à vérifier la box internet et la prise de la passerelle. Pendant une coupure, les mesures ne remontent pas : pensez à faire un relevé à la main si la coupure dure.",
  },
  {
    question: "Faut-il changer les piles ?",
    answer:
      "Rarement : les piles durent environ 5 ans. L'application vous prévient quand elles faiblissent, bien avant qu'elles soient vides.",
  },
  {
    question: "Faut-il payer un abonnement pour les capteurs ?",
    answer:
      "Non. Le kit se paie une seule fois : passerelle 200 € (une par établissement) et 60 € par capteur, livraison comprise. Les relevés automatiques et les alertes fonctionnent avec votre abonnement LockHACCP, ou pendant votre période d'essai. Pour ajouter un capteur plus tard, vous ne payez que le capteur.",
  },
  {
    question: "Quel matériel vais-je recevoir ?",
    answer:
      "Un capteur par frigo, chambre froide ou congélateur, avec une sonde fine qui passe dans le joint de la porte : la sonde va dans l'enceinte, le boîtier reste dehors. Et une passerelle qui se branche sur votre box internet, par câble ou en Wi-Fi. Le kit arrive préconfiguré pour votre établissement, et le matériel vous appartient.",
  },
  {
    question: "Qui reçoit les alertes ?",
    answer:
      "Vous choisissez jusqu'à deux personnes. La première reçoit une notification, un e-mail et un SMS. Si personne ne répond « Je m'en occupe » dans les 30 minutes, la deuxième personne reçoit à son tour un SMS et un e-mail.",
  },
  {
    question: "Et pendant un dégivrage ou une livraison ?",
    answer:
      "Vous mettez le capteur en pause en un geste (1 heure pour un dégivrage, 30 minutes pour une livraison). Pas de fausse alerte pendant ce temps.",
  },
  {
    question: "Les relevés automatiques sont-ils acceptés lors d'un contrôle ?",
    answer:
      "Oui : chaque relevé est daté, enregistré dans votre registre des températures et marqué « Capteur automatique ». Les alertes, ce qui a été fait et par qui sont gardés avec. Vous montrez tout depuis l'application.",
  },
  {
    question: "Les prix sont-ils HT ou TTC ?",
    answer: `Ce sont des prix nets, rien à ajouter : ${formatPriceEUR(PRIX_PASSERELLE)} la passerelle et ${formatPriceEUR(PRIX_CAPTEUR)} par capteur, livraison comprise. ${MENTION_TVA}.`,
  },
];

/** Comparaison honnête avec les offres habituelles du marché (relevé le 28/10/2026, sans nommer personne). */
export const COMPARAISON_CAPTEURS: { critere: string; lockhaccp: string; marche: string }[] = [
  { critere: "Prix par capteur", lockhaccp: `${formatPriceEUR(PRIX_CAPTEUR)}, une seule fois`, marche: "5 à 7 € HT par mois, tant que vous gardez l'offre" },
  { critere: "Passerelle", lockhaccp: `${formatPriceEUR(PRIX_PASSERELLE)}, une seule fois par établissement`, marche: "Souvent autour de 12 € HT par mois" },
  { critere: "Mise en service", lockhaccp: "Aucuns frais : le kit arrive préconfiguré", marche: "Souvent facturée, parfois plusieurs centaines d'euros" },
  { critere: "Engagement", lockhaccp: "Aucun : le matériel vous appartient", marche: "Souvent 1 à 3 ans" },
];

/** Données structurées Product/Offer. Disponibilité en précommande tant que l'option n'est pas en vente. */
export function capteursProductJsonLd(enVente: boolean = CAPTEURS_EN_VENTE): Record<string, unknown> {
  const url = `https://lockhaccp.fr${CHEMIN_CAPTEURS}`;
  const prix = PRIX_CAPTEUR.toFixed(2);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Capteur de température connecté LockHACCP",
    description:
      "Capteur de température connecté pour frigos et congélateurs de restaurant, vendu en kit avec sa passerelle (200 €, une par établissement), alertes par notification, e-mail et SMS, relevés automatiques dans le registre HACCP.",
    image: "https://lockhaccp.fr/og-image.png",
    brand: { "@type": "Brand", name: "LockHACCP" },
    offers: {
      "@type": "Offer",
      price: prix,
      priceCurrency: "EUR",
      url,
      availability: enVente ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    },
  };
}
