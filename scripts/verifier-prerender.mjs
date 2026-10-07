#!/usr/bin/env node
// Contrôle post-build : échoue (code 1) si une page pré-générée est incomplète.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fichierPour, liensInternesCasses, verifierLongueurs, verifierPage } from "./lib-prerender.mjs";

const racine = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(racine, "dist");
// Écrite par prerender.mjs : pages fixes + articles publiés au moment du build.
const pages = JSON.parse(readFileSync(join(racine, "dist-ssr", "pages.json"), "utf8"));

const erreurs = [];
const titres = new Map();
const generes = new Set(pages.map((p) => p.path));
for (const { path } of pages) {
  const fichier = join(dist, fichierPour(path));
  if (!existsSync(fichier)) { erreurs.push(`${path} : fichier ${fichierPour(path)} absent`); continue; }
  const html = readFileSync(fichier, "utf8");
  for (const e of verifierPage(html, path)) erreurs.push(`${path} : ${e}`);
  // Les pages en noindex (ex. /app) ne sont pas concernées par l'affichage dans Google.
  if (!/<meta[^>]*name="robots"[^>]*noindex/.test(html)) {
    for (const e of verifierLongueurs(html)) erreurs.push(`${path} : ${e}`);
  }
  for (const l of liensInternesCasses(html, generes)) erreurs.push(`${path} : lien vers ${l}, page inexistante`);
  const titre = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1];
  if (titre && titres.has(titre)) erreurs.push(`${path} : titre identique à ${titres.get(titre)}`);
  if (titre) titres.set(titre, path);
}
for (const e of verifierPage(readFileSync(join(dist, "404.html"), "utf8"), null)) erreurs.push(`404 : ${e}`);
for (const f of ["_shell.html", "sitemap.xml", "llms.txt", "robots.txt"]) {
  if (!existsSync(join(dist, f))) erreurs.push(`${f} absent`);
}

if (erreurs.length) {
  console.error(`✗ Pré-génération incomplète :\n  - ${erreurs.join("\n  - ")}`);
  process.exit(1);
}
console.log(`✓ ${pages.length} pages vérifiées (titre, description et leurs longueurs, canonical, h1, texte) + 404`);
