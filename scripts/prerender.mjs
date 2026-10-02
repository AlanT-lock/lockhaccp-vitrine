#!/usr/bin/env node
// Pré-génère chaque page publique dans dist/, plus 404.html, _shell.html, sitemap.xml, llms.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  extraireDescription, fichierPour, metaInstant, genererLlms, genererSitemap, injecter, retirerBalisesSeo,
} from "./lib-prerender.mjs";

const racine = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(racine, "dist");
// Un seul instant pour tout le build : rendu serveur et hydratation l'utilisent tous deux.
// Fixé AVANT l'import du rendu serveur : la liste des articles publiés en dépend.
// LHC_INSTANT=2026-11-07T12:00:00Z permet de simuler une date future (contrôle des articles programmés).
const instant = globalThis.__LHC_INSTANT__ ?? (process.env.LHC_INSTANT ? new Date(process.env.LHC_INSTANT) : new Date());
globalThis.__LHC_INSTANT__ = instant;

const { render, PAGES_PUBLIQUES, getActivePricing } = await import(
  pathToFileURL(join(racine, "dist-ssr", "entry-server.js")).href
);

const gabarit = readFileSync(join(dist, "index.html"), "utf8");
// Coquille vide pour l'admin (rendu client uniquement).
writeFileSync(join(dist, "_shell.html"), gabarit);
const base = retirerBalisesSeo(gabarit).replace("</head>", () => `${metaInstant(instant)}\n</head>`);

const ecrire = (fichier, contenu) => {
  const cible = join(dist, fichier);
  mkdirSync(dirname(cible), { recursive: true });
  writeFileSync(cible, contenu);
};

const descriptions = {};
for (const page of PAGES_PUBLIQUES) {
  const { html, head } = await render(page.path);
  descriptions[page.path] = extraireDescription(head) ?? "";
  ecrire(fichierPour(page.path), injecter(base, head, html));
}

const introuvable = await render("/__page-introuvable__");
ecrire("404.html", injecter(base, introuvable.head, introuvable.html));

ecrire("sitemap.xml", genererSitemap(PAGES_PUBLIQUES, instant.toISOString().slice(0, 10)));
ecrire("llms.txt", genererLlms({ pages: PAGES_PUBLIQUES, descriptions, prix: getActivePricing(instant) }));

// Liste exacte des pages générées, relue par verifier-prerender.mjs.
writeFileSync(join(racine, "dist-ssr", "pages.json"), JSON.stringify(PAGES_PUBLIQUES));

console.log(`✓ ${PAGES_PUBLIQUES.length} pages pré-générées + 404, sitemap.xml, llms.txt`);
