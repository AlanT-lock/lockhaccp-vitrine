# Chantier 1 — Fondations techniques SEO et visibilité IA

**Date** : 2026-10-01 — **Statut** : conception validée par Alan
**Dépôt** : `lockhaccp-vitrine` (React 18 + Vite 5 + react-router 6 + react-helmet-async, Vercel)

Premier des 4 chantiers « visibilité » (1. fondations techniques, 2. page de présentation du PMS,
3. blog, 4. visibilité externe et conversion). Les chantiers 2 et 3 n'ont d'effet que si celui-ci
est livré.

## Problèmes constatés (2026-10-01)

1. **Le site est une SPA pure** : toute URL (`/pms`, `/tarifs`, articles…) renvoie le même
   `index.html` — titre, description et `canonical` de l'accueil, `<div id="root">` vide. Les
   robots qui n'exécutent pas le JavaScript (Bing en partie, GPTBot, ClaudeBot, PerplexityBot,
   aperçus de liens) ne voient aucun contenu ; Google voit un canonical qui pointe vers l'accueil.
2. **Domaine contradictoire** : `lockhaccp.fr` redirige en **307** vers `www.lockhaccp.fr`, alors
   que le sitemap et tous les canonical désignent `lockhaccp.fr`.
3. **Soft 404** : une URL inconnue répond 200 avec l'accueil.
4. Le sitemap est une liste écrite à la main, séparée des routes de `App.tsx`.

Search Console : propriété de domaine déjà vérifiée (TXT `google-site-verification` sur
`lockhaccp.fr`). `lockhaccp.com` n'a plus d'enregistrement A (hors périmètre).

## Objectif et critères de réussite

- Chaque page publique est servie avec **son propre HTML complet** : titre, description,
  canonical = sa propre URL sur `https://lockhaccp.fr`, Open Graph, JSON-LD, H1 et texte visible
  sans JavaScript.
- `www.lockhaccp.fr/*` → **301** vers `lockhaccp.fr/*`.
- Une URL inconnue répond **404**.
- Le visiteur ne voit aucune différence ; le générateur PMS, les formulaires, le tunnel Stripe,
  l'analytics et la redirection `/app` fonctionnent comme avant.
- Les robots d'IA sont autorisés et disposent d'un `llms.txt`.

## Conception

### 1. Source unique des routes

Nouveau fichier `src/routes.tsx` : tableau de routes publiques
`{ path, load: () => import(...), sitemap: { changefreq, priority } | null }` plus les redirections
React existantes (`/tarifs/essentiel`, `/ressources/*`…). Il alimente :
- `App.tsx` (rendu navigateur, composants `lazy`) ;
- le script de pré-génération (liste des pages à produire) ;
- `scripts/generate-sitemap.mjs` et `llms.txt` (fin de la liste manuelle).

Les pages admin (`/admin`, `/admin/dashboard`) et `/app` sont marquées non pré-générées.

### 2. Pré-génération à la construction (approche A, validée)

- `src/entry-server.tsx` : rend `<App>` avec `StaticRouter` + `HelmetProvider` (contexte) via
  `renderToPipeableStream` en attendant `onAllReady` (les pages `lazy` sont donc résolues).
- `scripts/prerender.mjs` : après `vite build` (client) et `vite build --ssr src/entry-server.tsx`,
  pour chaque route publique, injecte dans le gabarit `dist/index.html` :
  le `<head>` produit par Helmet (en remplaçant titre/description/canonical/OG par défaut) et le
  HTML de la page dans `#root`. Écrit `dist/<chemin>.html` (accueil : `dist/index.html`).
- Génère `dist/404.html` (page `NotFound`, `noindex`).
- `src/main.tsx` : `hydrateRoot` si `#root` contient du HTML, sinon `createRoot` (pages admin,
  développement local).
- `package.json` : `build` = build client + build SSR + prerender ; `prebuild` sitemap conservé.
- `vercel.json` : `cleanUrls: true` ; la réécriture fourre-tout `/(.*) → /index.html` est
  remplacée par une réécriture limitée à `/admin` et `/admin/(.*)` ; les autres URL inconnues
  tombent sur `404.html` avec un statut 404.

### 3. Code dépendant du navigateur (à rendre compatible serveur)

| Endroit | Correction |
|---|---|
| `integrations/supabase/client.ts` (`storage: localStorage`) | garde `typeof window !== "undefined"` |
| `Navbar.tsx` (lien de téléchargement selon l'appareil) | valeur `/app` au rendu, lien réel calculé dans un `useEffect` |
| `LaunchBanner.tsx`, `Footer.tsx` (année), compte à rebours | valeurs dépendantes de la date calculées après montage, ou rendu stable |
| `lib/analytics.ts`, `ScrollToTop`, hooks `window.*` | déjà dans des effets — vérifier qu'aucun accès n'a lieu au chargement du module |

**Prix de lancement** : `getActivePricing()` change le 01/11/2026 (14,90 € → 24,90 €). Le HTML
étant figé à la construction, une **reconstruction quotidienne** est mise en place :
workflow GitHub Actions planifié (`cron` chaque nuit) qui appelle un **Deploy Hook Vercel**
(secret `VERCEL_DEPLOY_HOOK_URL` du dépôt GitHub). Effet secondaire utile : `lastmod` du sitemap
à jour. Côté navigateur, la grille affichée reste calculée à l'exécution (pas de régression si la
reconstruction échoue un jour).

### 4. Domaine, robots, IA, données structurées

- **Domaine** : `lockhaccp.fr` devient le domaine principal du projet Vercel ; `www.lockhaccp.fr`
  redirige en 301 vers lui (réglage du projet Vercel, par CLI/API si les droits le permettent,
  sinon action d'Alan guidée pas à pas).
- **`public/robots.txt`** : `Allow` pour tous, blocs explicites pour Googlebot, Bingbot, GPTBot,
  OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended,
  Applebot-Extended ; `Disallow: /admin` conservé ; ligne `Sitemap`.
- **`llms.txt`** (généré au build) : présentation en Markdown de LockHACCP (ce que c'est, pour
  qui, prix courant, générateur PMS gratuit, essai offert), liste des pages clés avec une ligne
  de description chacune.
- **JSON-LD** : `Organization` (accueil), `SoftwareApplication` avec `offers` (accueil et
  `/tarifs`, prix issu de `getActivePricing()` au build), `BreadcrumbList` sur toutes les pages
  hors accueil (généré par `Seo` à partir du chemin), `FAQPage` là où une FAQ est affichée.
  Les JSON-LD existants sont repris, pas dupliqués.

## Vérification

- **Test automatique post-build** (`scripts/verifier-prerender.mjs`, lancé dans `npm run build`) :
  pour chaque route publique, le fichier HTML existe et contient un `<title>` unique, une meta
  description, `canonical` = `https://lockhaccp.fr<chemin>`, exactement un `<h1>`, et au moins 300
  caractères de texte dans `#root`. Échec du build sinon.
- Tests unitaires existants (`npx vitest run`) toujours verts ; `npm run typecheck` propre.
- **Préversion Vercel** : contrôle par `curl` (statuts 200/301/404, HTML par page, `robots.txt`,
  `llms.txt`, sitemap) ; contrôle manuel dans le navigateur : absence d'erreur d'hydratation en
  console, générateur PMS de bout en bout jusqu'à l'envoi, formulaire de contact, page tarifs.

## Actions d'Alan (après mise en ligne)

1. Bing Webmaster Tools : « Importer depuis Google Search Console » (≈ 2 min).
2. Envoyer `https://lockhaccp.fr/sitemap.xml` dans Search Console et Bing.
3. Ajouter le secret `VERCEL_DEPLOY_HOOK_URL` au dépôt GitHub si je ne peux pas le faire.

## Hors périmètre

Contenu (chantiers 2 et 3), fiche Google Business et annuaires (chantier 4), `lockhaccp.com`,
refonte visuelle.
