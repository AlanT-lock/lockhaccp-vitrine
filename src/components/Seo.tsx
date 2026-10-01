import { Helmet } from "react-helmet-async";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { filAriane } from "@/lib/pages";

const SITE_URL = "https://lockhaccp.fr";
const DEFAULT_OG = `${SITE_URL}/og-image.png`;

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  /** Optional JSON-LD object(s) to embed for rich results */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export const Seo = ({
  title,
  description,
  path,
  image = DEFAULT_OG,
  noindex,
  jsonLd,
}: SeoProps) => {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;
  const fullTitle = title.includes("LockHACCP")
    ? title
    : `${title} | LockHACCP`;
  const ldFournis = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  // Fil d'Ariane ajouté automatiquement, sauf si la page fournit déjà le sien.
  const aDejaUnFil = ldFournis.some((ld) => ld["@type"] === "BreadcrumbList");
  const fil = path && !aDejaUnFil ? filAriane(path) : [];
  const ldArray = fil.length ? [...ldFournis, breadcrumbJsonLd(fil)] : ldFournis;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="LockHACCP" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};
