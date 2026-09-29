#!/usr/bin/env node
// Auto-generate public/sitemap.xml from a static route map.
// Run via `npm run prebuild` (wired in package.json).

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const SITE_URL = "https://lockhaccp.fr";

/** @type {Array<{path: string, changefreq: string, priority: number}>} */
const routes = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/tarifs", changefreq: "monthly", priority: 0.9 },
  { path: "/pms", changefreq: "monthly", priority: 0.9 },
  { path: "/demander-demo", changefreq: "monthly", priority: 0.9 },
  { path: "/contact", changefreq: "monthly", priority: 0.6 },
  { path: "/contact-entreprise", changefreq: "monthly", priority: 0.7 },
  { path: "/fonctionnalites/temperatures", changefreq: "monthly", priority: 0.8 },
  { path: "/fonctionnalites/receptions", changefreq: "monthly", priority: 0.8 },
  { path: "/fonctionnalites/tracabilite", changefreq: "monthly", priority: 0.8 },
  { path: "/fonctionnalites/nettoyage", changefreq: "monthly", priority: 0.8 },
  { path: "/fonctionnalites/huiles", changefreq: "monthly", priority: 0.8 },
  { path: "/fonctionnalites/etiquettes", changefreq: "monthly", priority: 0.8 },
  { path: "/fonctionnalites/checklist", changefreq: "monthly", priority: 0.8 },
  { path: "/blog", changefreq: "weekly", priority: 0.7 },
  { path: "/blog/affichages-obligatoires-restaurant-2026", changefreq: "monthly", priority: 0.6 },
  { path: "/blog/methode-haccp-guide-complet", changefreq: "monthly", priority: 0.6 },
  { path: "/politique-confidentialite", changefreq: "yearly", priority: 0.3 },
  { path: "/cgu", changefreq: "yearly", priority: 0.3 },
  { path: "/mentions-legales", changefreq: "yearly", priority: 0.3 },
];

const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "..", "public", "sitemap.xml");
writeFileSync(out, xml);
console.log(`✓ sitemap.xml généré (${routes.length} URLs) → ${out}`);
