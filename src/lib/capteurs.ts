// Option « Capteurs connectés » : source unique des montants, des textes et de
// l'état de vente pour le site (page tarifs et page /capteurs-connectes).
// Mêmes montants que dans l'app, la console et Stripe (spec du 28/10/2026).

import { formatPriceEUR, MENTION_TVA } from "@/lib/launch";
import { APP_URL } from "@/lib/links";

/**
 * L'option est-elle déjà achetable ? Oui : prix Stripe « Capteur connecté »
 * créés le 28/10/2026 (STRIPE_PRICE_CAPTEUR_MENSUEL / _ANNUEL). À `false`, le
 * bouton de commande devient « Être prévenu » et mène au formulaire de contact.
 */
export const CAPTEURS_EN_VENTE = true;

/** Prix TTC par capteur et par mois, passerelle incluse. */
export const PRIX_CAPTEUR_MENSUEL = 4.9;
/** Prix TTC par capteur et par an (10 mois payés). */
export const PRIX_CAPTEUR_ANNUEL = 49;

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

export const PRIX_CAPTEUR_LIBELLE = `${formatPriceEUR(PRIX_CAPTEUR_MENSUEL)} TTC par capteur et par mois`;

/** Points clés, repris sur la page tarifs et la page dédiée. */
export const POINTS_CAPTEURS = [
  "Passerelle incluse, sans supplément",
  "Sans engagement, sans frais de mise en service",
  "Alertes par notification, e-mail et SMS, même la nuit et le week-end",
  "Installation en 5 minutes : le kit arrive déjà configuré",
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
    question: "Comment résilier l'option ?",
    answer:
      "Depuis l'application, à tout moment. L'option s'arrête à la fin de la période déjà payée. Vous nous renvoyez ensuite le matériel, rien de plus.",
  },
  {
    question: "Quel matériel vais-je recevoir ?",
    answer:
      "Un capteur par frigo, chambre froide ou congélateur, avec une sonde fine qui passe dans le joint de la porte : la sonde va dans l'enceinte, le boîtier reste dehors. Et une passerelle qui se branche sur votre box internet, par câble ou en Wi-Fi. Le matériel reste notre propriété, vous ne l'achetez pas.",
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
    answer: `TTC : ${formatPriceEUR(PRIX_CAPTEUR_MENSUEL)} par capteur et par mois, rien à ajouter. ${MENTION_TVA}.`,
  },
];

/** Comparaison honnête avec les offres habituelles du marché (relevé le 28/10/2026, sans nommer personne). */
export const COMPARAISON_CAPTEURS: { critere: string; lockhaccp: string; marche: string }[] = [
  { critere: "Prix par capteur", lockhaccp: `${formatPriceEUR(PRIX_CAPTEUR_MENSUEL)} TTC par mois`, marche: "5 à 7 € HT par mois" },
  { critere: "Passerelle", lockhaccp: "Incluse", marche: "Souvent facturée en plus, autour de 12 € HT par mois" },
  { critere: "Mise en service", lockhaccp: "Gratuite", marche: "Souvent facturée, parfois plusieurs centaines d'euros" },
  { critere: "Engagement", lockhaccp: "Aucun", marche: "Souvent 1 à 3 ans" },
];

/** Données structurées Product/Offer. Disponibilité en précommande tant que l'option n'est pas en vente. */
export function capteursProductJsonLd(enVente: boolean = CAPTEURS_EN_VENTE): Record<string, unknown> {
  const url = `https://lockhaccp.fr${CHEMIN_CAPTEURS}`;
  const prix = PRIX_CAPTEUR_MENSUEL.toFixed(2);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Capteur de température connecté LockHACCP",
    description:
      "Capteur de température connecté pour frigos et congélateurs de restaurant, passerelle incluse, alertes par notification, e-mail et SMS, relevés automatiques dans le registre HACCP.",
    image: "https://lockhaccp.fr/og-image.png",
    brand: { "@type": "Brand", name: "LockHACCP" },
    offers: {
      "@type": "Offer",
      price: prix,
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: prix,
        priceCurrency: "EUR",
        valueAddedTaxIncluded: true,
        unitCode: "MON",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
      url,
      availability: enVente ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    },
  };
}
