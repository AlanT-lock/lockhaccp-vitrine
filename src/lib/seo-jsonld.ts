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
      name: "Essentiel",
      price: "14.90",
      priceCurrency: "EUR",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "29.90",
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
