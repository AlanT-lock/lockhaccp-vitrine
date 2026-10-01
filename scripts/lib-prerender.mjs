// Fonctions pures de la pré-génération (testées dans lib-prerender.test.mjs).

export const SITE = "https://lockhaccp.fr";

export function fichierPour(path) {
  return path === "/" ? "index.html" : `${path.slice(1)}.html`;
}

export function canonicalAttendu(path) {
  return path === "/" ? `${SITE}/` : `${SITE}${path}`;
}

/** Retire du gabarit les balises SEO par défaut (Helmet fournit celles de chaque page). */
export function retirerBalisesSeo(gabarit) {
  return gabarit
    .replace(/[ \t]*<title>[\s\S]*?<\/title>\s*\n?/, "")
    .replace(/[ \t]*<meta name="description"[^>]*>\s*\n?/, "")
    .replace(/[ \t]*<link rel="canonical"[^>]*>\s*\n?/, "")
    .replace(/[ \t]*<meta property="og:[^"]*"[^>]*>\s*\n?/g, "")
    .replace(/[ \t]*<meta name="twitter:(?!site")[^"]*"[^>]*>\s*\n?/g, "");
}

/** Instant de construction, relu à l'hydratation (src/lib/maintenant.ts, META_INSTANT). */
export function metaInstant(date) {
  return `<meta name="lhc-instant" content="${date.toISOString()}" />`;
}

export function injecter(gabarit, head, html) {
  const racineVide = '<div id="root"></div>';
  if (!gabarit.includes(racineVide) || !gabarit.includes("</head>")) {
    throw new Error("Gabarit inattendu : <div id=\"root\"></div> ou </head> introuvable");
  }
  return gabarit
    .replace("</head>", `${head}\n</head>`)
    .replace(racineVide, `<div id="root">${html}</div>`);
}

export function genererSitemap(pages, date) {
  const urls = pages
    .filter((p) => p.sitemap)
    .map(
      (p) => `  <url>
    <loc>${canonicalAttendu(p.path)}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${p.sitemap.changefreq}</changefreq>
    <priority>${p.sitemap.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const euros = (n) => `${n.toFixed(2).replace(".", ",")} €`;

export function genererLlms({ pages, descriptions, prix }) {
  const ligne = (p) => `- [${p.fil}](${canonicalAttendu(p.path)}): ${descriptions[p.path] ?? ""}`.trimEnd();
  const visibles = pages.filter((p) => p.llms);
  const sections = [
    ["Pages principales", visibles.filter((p) => !p.path.startsWith("/fonctionnalites/") && !p.path.startsWith("/blog"))],
    ["Fonctionnalités", visibles.filter((p) => p.path.startsWith("/fonctionnalites/"))],
    ["Ressources", visibles.filter((p) => p.path.startsWith("/blog"))],
  ].filter(([, liste]) => liste.length);

  return `# LockHACCP

> LockHACCP est une application mobile et web française de gestion de l'hygiène alimentaire (HACCP) pour la restauration commerciale et collective : relevés de températures, réception des marchandises, traçabilité, plan de nettoyage, contrôle des huiles de friture, étiquettes de production et checklists, avec export des enregistrements pour les contrôles sanitaires.

- Tarif : ${euros(prix.mainMonthly)} par mois et par établissement, toutes fonctionnalités incluses ; ${euros(prix.extraMonthly)} par mois par établissement supplémentaire. Essai gratuit, sans engagement.
- Générateur gratuit de Plan de Maîtrise Sanitaire (PMS) personnalisé, en ligne : ${SITE}/pms
- Disponible sur iPhone, iPad, Android et navigateur web.
- Contact : contact@lockhaccp.fr

${sections.map(([titre, liste]) => `## ${titre}\n\n${liste.map(ligne).join("\n")}`).join("\n\n")}
`;
}

const decoder = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

export function extraireDescription(html) {
  const m = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/);
  return m ? decoder(m[1]) : null;
}

export function verifierPage(html, path, { texteMin = 300 } = {}) {
  const erreurs = [];
  if (!/<title[^>]*>[^<]+<\/title>/.test(html)) erreurs.push("titre manquant");
  if (!extraireDescription(html)) erreurs.push("meta description manquante");
  const racine = html.match(/<div id="root">([\s\S]*)<\/div>\s*(<script|<\/body>)/);
  const contenu = racine ? racine[1] : "";
  if (path === null) {
    if (!/<meta[^>]*name="robots"[^>]*noindex/.test(html)) erreurs.push("404 sans noindex");
    return erreurs;
  }
  const canon = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/);
  if (!canon || canon[1] !== canonicalAttendu(path)) {
    erreurs.push(`canonical ${canon ? canon[1] : "absent"} au lieu de ${canonicalAttendu(path)}`);
  }
  const h1 = (contenu.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) erreurs.push(`${h1} h1 au lieu de 1`);
  const texte = contenu.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (texte.length < texteMin) erreurs.push(`texte trop court (${texte.length} < ${texteMin})`);
  return erreurs;
}

/** Liens internes d'une page qui ne pointent vers aucune page générée (ex. article pas encore publié). */
export function liensInternesCasses(html, cheminsGeneres) {
  const casses = new Set();
  for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
    if (href.startsWith("//")) continue;
    const chemin = href.split(/[?#]/)[0] || "/";
    if (chemin.startsWith("/admin") || /\.[a-z0-9]+$/i.test(chemin)) continue;
    if (!cheminsGeneres.has(chemin)) casses.add(chemin);
  }
  return [...casses];
}
