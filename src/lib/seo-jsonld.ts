// Reusable JSON-LD blocks for SEO rich results.

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LockHACCP",
  url: "https://lockhaccp.fr",
  logo: "https://lockhaccp.fr/logo-color.png",
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
  sameAs: [],
};

export const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LockHACCP",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description:
    "Logiciel HACCP pour restaurants : relevés de température, traçabilité, plan de nettoyage, étiquettes de production.",
  offers: [
    {
      "@type": "Offer",
      name: "LockHACCP",
      price: "24.90",
      priceCurrency: "EUR",
    },
  ],
  aggregateRating: undefined,
};

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
