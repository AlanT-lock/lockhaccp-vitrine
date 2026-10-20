// Reusable JSON-LD blocks for SEO rich results.

import { getActivePricing, isLaunchOfferActive, LAUNCH_OFFER_END } from "@/lib/launch";
import { LIEN_APP_STORE, LIEN_GOOGLE_PLAY } from "@/lib/app-store";

const SITE = "https://lockhaccp.fr";
/** Identifiants stables, pour relier les blocs entre eux (éditeur, auteur, site). */
const ID_ORGANISATION = `${SITE}/#organisation`;
const ID_PERSONNE = `${SITE}/auteur/alan-touati#personne`;

// Adresse et statut : les mêmes que dans les mentions légales (src/pages/LegalNotice.tsx).
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ID_ORGANISATION,
  name: "LockHACCP",
  url: SITE,
  logo: `${SITE}/logo-color.png`,
  founder: { "@id": ID_PERSONNE },
  address: {
    "@type": "PostalAddress",
    streetAddress: "20 anc. Chemin des Vallergues",
    postalCode: "06400",
    addressLocality: "Cannes",
    addressCountry: "FR",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+33-6-46-64-00-23",
      contactType: "customer service",
      email: "contact@lockhaccp.fr",
      areaServed: "FR",
      availableLanguage: ["French"],
    },
  ],
  sameAs: [LIEN_APP_STORE, LIEN_GOOGLE_PLAY],
};

/** Le site lui-même (page d'accueil). */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#site`,
  name: "LockHACCP",
  url: SITE,
  inLanguage: "fr-FR",
  publisher: { "@id": ID_ORGANISATION },
};

// Le prix annoncé aux moteurs de recherche doit être celui réellement en
// vigueur à l'instant de la génération de la page : c'est une fonction, pas
// une constante figée, pour rester exact avant et après la bascule tarifaire.
export function softwareAppJsonLd(now: Date = new Date()): Record<string, unknown> {
  const pricing = getActivePricing(now);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LockHACCP",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    description:
      "Logiciel HACCP pour restaurants : relevés de température, traçabilité, plan de nettoyage, étiquettes de production.",
    publisher: { "@id": ID_ORGANISATION },
    // Abonnement mensuel par établissement. Pendant l'offre de lancement, la date de fin est
    // annoncée (priceValidUntil) ; aucune note (aggregateRating) tant qu'il n'y a pas de vrais avis.
    offers: [
      {
        "@type": "Offer",
        name: "LockHACCP, par établissement",
        price: pricing.mainMonthly.toFixed(2),
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: pricing.mainMonthly.toFixed(2),
          priceCurrency: "EUR",
          unitCode: "MON",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
        },
        url: `${SITE}/tarifs`,
        availability: "https://schema.org/InStock",
        ...(isLaunchOfferActive(now)
          ? { priceValidUntil: new Date(LAUNCH_OFFER_END.getTime() - 1).toISOString().slice(0, 10) }
          : {}),
      },
    ],
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://lockhaccp.fr${item.path}`,
    })),
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: opts.image ?? "https://lockhaccp.fr/og-image.png",
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      "@type": "Organization",
      name: opts.authorName ?? "LockHACCP",
    },
    publisher: {
      "@type": "Organization",
      name: "LockHACCP",
      logo: {
        "@type": "ImageObject",
        url: "https://lockhaccp.fr/logo-color.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lockhaccp.fr${opts.path}`,
    },
  };
}

export function productJsonLd(opts: {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
  url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    brand: { "@type": "Brand", name: "LockHACCP" },
    offers: {
      "@type": "Offer",
      price: opts.price,
      priceCurrency: opts.priceCurrency ?? "EUR",
      url: opts.url,
      availability: "https://schema.org/InStock",
    },
  };
}

export function faqJsonLd(
  items: { question: string; answer: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function personJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": ID_PERSONNE,
    name: "Alan Touati",
    url: `${SITE}/auteur/alan-touati`,
    jobTitle: "Formateur en hygiène alimentaire",
    worksFor: { "@type": "Organization", name: "SF FORMATION" },
    knowsAbout: ["Hygiène alimentaire", "HACCP", "Plan de Maîtrise Sanitaire", "Restauration commerciale"],
  };
}

export function blogPostingJsonLd(opts: {
  titre: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  /** Chemin ou URL de l'illustration de l'article ; l'image de partage par défaut sinon. */
  image?: string;
}): Record<string, unknown> {
  const image = opts.image ? (opts.image.startsWith("http") ? opts.image : `${SITE}${opts.image}`) : `${SITE}/og-image.png`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    image,
    headline: opts.titre,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    inLanguage: "fr-FR",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}${opts.path}` },
    author: {
      "@type": "Person",
      "@id": ID_PERSONNE,
      name: "Alan Touati",
      url: `${SITE}/auteur/alan-touati`,
      jobTitle: "Formateur en hygiène alimentaire",
    },
    publisher: {
      "@type": "Organization",
      "@id": ID_ORGANISATION,
      name: "LockHACCP",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/logo-color.png` },
    },
  };
}
