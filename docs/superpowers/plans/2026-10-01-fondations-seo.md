# Fondations techniques SEO — Plan de réalisation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** servir chaque page publique de lockhaccp.fr avec son propre HTML complet (titre, description, canonical, JSON-LD, texte), une vraie 404, `lockhaccp.fr` comme domaine principal, et une ouverture explicite aux robots d'IA.

**Architecture :** une liste unique des pages publiques (`src/pages-publiques.json`) alimente le routeur, la pré-génération, le sitemap et `llms.txt`. À la construction : build client Vite, build SSR de `src/entry-server.tsx`, puis `scripts/prerender.mjs` rend chaque page (React `renderToPipeableStream` + `StaticRouter` + Helmet) dans `dist/<chemin>.html`. Dans le navigateur, `hydrateRoot` reprend le HTML existant. Un test post-build bloque le déploiement si une page est incomplète.

**Tech Stack :** React 18.3, Vite 5.4 (`@vitejs/plugin-react-swc`), react-router-dom 6.30 (`StaticRouter` de `react-router-dom/server`), react-helmet-async 3.0, Vitest, Vercel (`cleanUrls`), GitHub Actions.

**Spec :** `docs/superpowers/specs/2026-10-01-fondations-seo-design.md`

## Global Constraints

- Domaine canonique : `https://lockhaccp.fr` (sans www) ; canonical de l'accueil = `https://lockhaccp.fr/`, des autres pages = `https://lockhaccp.fr<chemin>`.
- Aucun prix ni date de l'offre de lancement écrit en dur : tout passe par `src/lib/launch.ts` (`getActivePricing`).
- Le visiteur ne doit voir aucune différence ; générateur PMS, formulaires, Stripe, analytics, redirection `/app` inchangés.
- Tous les textes visibles en français.
- Pas de nouvelle dépendance npm.
- Travail sur la branche `feat/fondations-seo` ; **pas de déploiement en production sans l'accord d'Alan**.
- Commits terminés par `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.

## Review Focus

1. **URL inconnue** (`/nimporte-quoi`) → statut HTTP 404 et page « introuvable » en `noindex`, jamais l'accueil. Test : `verifierPage` sur `404.html` (Tâche 4) + `curl` en préversion (Tâche 6).
2. **Chargement direct de `/admin/dashboard`** → l'admin s'affiche (coquille vide + rendu client), pas l'accueil hydraté. Test : `curl` en préversion contrôle que `/admin` sert `_shell.html` sans contenu dans `#root` (Tâche 6).
3. **Bascule tarifaire du 01/11/2026** → après reconstruction, HTML et JSON-LD annoncent 24,90 €. Test : `softwareAppJsonLd(now)` à deux dates (Tâche 2).
4. **`/app` sur ordinateur** (aucune redirection par user-agent) → la page « Télécharger l'application » s'affiche, pas une 404. Test : `/app` est dans la liste pré-générée (Tâche 1) et contrôlé par `curl` (Tâche 6).
5. **Anciennes URL** (`/ressources/methode-haccp`, `/tarifs/pro`, `/avantages-ia`) → redirection 301/308 conservée malgré le retrait des routes React équivalentes. Test : `curl` en préversion (Tâche 6).

---

## Structure des fichiers

| Fichier | Rôle |
|---|---|
| `src/pages-publiques.json` (créé) | liste des pages publiques : chemin, libellé du fil d'Ariane, réglages sitemap, présence dans `llms.txt` |
| `src/lib/pages.ts` (créé) | typage de la liste + `filAriane()` |
| `src/lib/pages.test.ts` (créé) | tests de `filAriane` et de la cohérence de la liste |
| `src/routes.tsx` (créé) | association chemin → composant (lazy) |
| `src/App.tsx` (modifié) | séparé en `AppProviders` + `AppContenu`, routes issues de `routes.tsx` |
| `src/main.tsx` (modifié) | `hydrateRoot` si HTML présent |
| `src/entry-server.tsx` (créé) | `render(url)` côté serveur |
| `src/hooks/useApresMontage.ts` (créé) | booléen vrai après le premier rendu navigateur |
| `src/components/Seo.tsx` (modifié) | fil d'Ariane JSON-LD automatique |
| `src/lib/seo-jsonld.ts` (modifié) | `softwareAppJsonLd(now)` |
| `scripts/lib-prerender.mjs` (créé) | fonctions pures : injection HTML, chemins, sitemap, llms, vérification |
| `scripts/lib-prerender.test.mjs` (créé) | tests de ces fonctions |
| `scripts/prerender.mjs` (créé) | orchestration de la pré-génération |
| `scripts/verifier-prerender.mjs` (créé) | contrôle post-build |
| `scripts/generate-sitemap.mjs`, `public/sitemap.xml` (supprimés) | remplacés par la pré-génération |
| `public/robots.txt` (modifié) | robots d'IA |
| `vite.config.ts`, `vitest.config.ts`, `package.json`, `vercel.json` (modifiés) | build |
| `.github/workflows/reconstruction-quotidienne.yml` (créé) | redéploiement chaque nuit |

---

### Tâche 0 : Branche de travail

- [ ] **Étape 1 : créer la branche**

```bash
cd /Users/alantouati/lockhaccp-vitrine
git checkout main && git pull --ff-only && git checkout -b feat/fondations-seo
npx vitest run && npm run typecheck
```
Attendu : tests existants verts, typecheck propre (point de départ connu).

---

### Tâche 1 : Liste unique des pages publiques et fil d'Ariane

**Files :**
- Create : `src/pages-publiques.json`, `src/lib/pages.ts`, `src/lib/pages.test.ts`, `src/routes.tsx`
- Modify : `src/App.tsx`

**Interfaces :**
- Produces : `type PagePublique = { path: string; fil: string; sitemap: { changefreq: string; priority: number } | null; llms: boolean }` ; `PAGES_PUBLIQUES: PagePublique[]` ; `filAriane(path: string, pages?: PagePublique[]): { name: string; path: string }[]` ; `COMPOSANTS: Record<string, ComponentType>` ; `AppProviders({ children, helmetContext? })` ; `AppContenu()`.

- [ ] **Étape 1 : créer `src/pages-publiques.json`**

```json
[
  { "path": "/", "fil": "Accueil", "sitemap": { "changefreq": "weekly", "priority": 1.0 }, "llms": true },
  { "path": "/tarifs", "fil": "Tarifs", "sitemap": { "changefreq": "monthly", "priority": 0.9 }, "llms": true },
  { "path": "/pms", "fil": "Générateur de PMS gratuit", "sitemap": { "changefreq": "monthly", "priority": 0.9 }, "llms": true },
  { "path": "/demander-demo", "fil": "Demander une démo", "sitemap": { "changefreq": "monthly", "priority": 0.9 }, "llms": true },
  { "path": "/contact", "fil": "Contact", "sitemap": { "changefreq": "monthly", "priority": 0.6 }, "llms": true },
  { "path": "/contact-entreprise", "fil": "Contact entreprise", "sitemap": { "changefreq": "monthly", "priority": 0.7 }, "llms": true },
  { "path": "/fonctionnalites/temperatures", "fil": "Relevés de températures", "sitemap": { "changefreq": "monthly", "priority": 0.8 }, "llms": true },
  { "path": "/fonctionnalites/receptions", "fil": "Réception des marchandises", "sitemap": { "changefreq": "monthly", "priority": 0.8 }, "llms": true },
  { "path": "/fonctionnalites/tracabilite", "fil": "Traçabilité", "sitemap": { "changefreq": "monthly", "priority": 0.8 }, "llms": true },
  { "path": "/fonctionnalites/nettoyage", "fil": "Plan de nettoyage", "sitemap": { "changefreq": "monthly", "priority": 0.8 }, "llms": true },
  { "path": "/fonctionnalites/huiles", "fil": "Contrôle des huiles", "sitemap": { "changefreq": "monthly", "priority": 0.8 }, "llms": true },
  { "path": "/fonctionnalites/etiquettes", "fil": "Étiquettes", "sitemap": { "changefreq": "monthly", "priority": 0.8 }, "llms": true },
  { "path": "/fonctionnalites/checklist", "fil": "Checklists", "sitemap": { "changefreq": "monthly", "priority": 0.8 }, "llms": true },
  { "path": "/blog", "fil": "Ressources", "sitemap": { "changefreq": "weekly", "priority": 0.7 }, "llms": true },
  { "path": "/blog/affichages-obligatoires-restaurant-2026", "fil": "Affichages obligatoires", "sitemap": { "changefreq": "monthly", "priority": 0.6 }, "llms": true },
  { "path": "/blog/methode-haccp-guide-complet", "fil": "Méthode HACCP", "sitemap": { "changefreq": "monthly", "priority": 0.6 }, "llms": true },
  { "path": "/app", "fil": "Télécharger l'application", "sitemap": null, "llms": false },
  { "path": "/politique-confidentialite", "fil": "Politique de confidentialité", "sitemap": { "changefreq": "yearly", "priority": 0.3 }, "llms": false },
  { "path": "/cgu", "fil": "CGU", "sitemap": { "changefreq": "yearly", "priority": 0.3 }, "llms": false },
  { "path": "/mentions-legales", "fil": "Mentions légales", "sitemap": { "changefreq": "yearly", "priority": 0.3 }, "llms": false }
]
```

- [ ] **Étape 2 : écrire le test qui échoue `src/lib/pages.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { PAGES_PUBLIQUES, filAriane, type PagePublique } from "./pages";

const pages: PagePublique[] = [
  { path: "/", fil: "Accueil", sitemap: null, llms: true },
  { path: "/blog", fil: "Ressources", sitemap: null, llms: true },
  { path: "/blog/article", fil: "Article", sitemap: null, llms: true },
  { path: "/fonctionnalites/temperatures", fil: "Températures", sitemap: null, llms: true },
];

describe("filAriane", () => {
  it("est vide pour l'accueil", () => {
    expect(filAriane("/", pages)).toEqual([]);
  });
  it("passe par les pages intermédiaires qui existent", () => {
    expect(filAriane("/blog/article", pages)).toEqual([
      { name: "Accueil", path: "/" },
      { name: "Ressources", path: "/blog" },
      { name: "Article", path: "/blog/article" },
    ]);
  });
  it("saute un niveau intermédiaire qui n'est pas une page", () => {
    expect(filAriane("/fonctionnalites/temperatures", pages)).toEqual([
      { name: "Accueil", path: "/" },
      { name: "Températures", path: "/fonctionnalites/temperatures" },
    ]);
  });
  it("est vide pour une page inconnue (admin, 404)", () => {
    expect(filAriane("/admin", pages)).toEqual([]);
  });
});

describe("PAGES_PUBLIQUES", () => {
  it("n'a pas de chemin en double", () => {
    const chemins = PAGES_PUBLIQUES.map((p) => p.path);
    expect(new Set(chemins).size).toBe(chemins.length);
  });
  it("ne contient ni l'admin ni de chemin avec slash final", () => {
    for (const p of PAGES_PUBLIQUES) {
      expect(p.path.startsWith("/admin")).toBe(false);
      if (p.path !== "/") expect(p.path.endsWith("/")).toBe(false);
    }
  });
  it("contient /app (affichée sur ordinateur) hors sitemap", () => {
    const app = PAGES_PUBLIQUES.find((p) => p.path === "/app");
    expect(app?.sitemap).toBeNull();
  });
});
```

- [ ] **Étape 3 : lancer — échec attendu**

Run : `npx vitest run src/lib/pages.test.ts` → FAIL (module `./pages` introuvable).

- [ ] **Étape 4 : écrire `src/lib/pages.ts`**

```ts
// Source unique des pages publiques : routeur, pré-génération, sitemap, llms.txt.
import liste from "@/pages-publiques.json";

export interface PagePublique {
  path: string;
  /** Libellé court, utilisé dans le fil d'Ariane et llms.txt. */
  fil: string;
  sitemap: { changefreq: string; priority: number } | null;
  /** La page figure-t-elle dans llms.txt ? */
  llms: boolean;
}

export const PAGES_PUBLIQUES: PagePublique[] = liste;

/** Fil d'Ariane d'une page : accueil, pages intermédiaires existantes, page courante. */
export function filAriane(
  path: string,
  pages: PagePublique[] = PAGES_PUBLIQUES,
): { name: string; path: string }[] {
  const courante = pages.find((p) => p.path === path);
  if (!courante || path === "/") return [];
  const parPath = new Map(pages.map((p) => [p.path, p]));
  const segments = path.split("/").filter(Boolean);
  const fil: { name: string; path: string }[] = [];
  const accueil = parPath.get("/");
  if (accueil) fil.push({ name: accueil.fil, path: "/" });
  for (let i = 1; i <= segments.length; i++) {
    const prefixe = "/" + segments.slice(0, i).join("/");
    const page = parPath.get(prefixe);
    if (page) fil.push({ name: page.fil, path: prefixe });
  }
  return fil;
}
```

Si `tsc` refuse l'import JSON : vérifier `"resolveJsonModule": true` dans `tsconfig.app.json` (l'ajouter dans `compilerOptions` sinon).

- [ ] **Étape 5 : lancer — succès attendu**

Run : `npx vitest run src/lib/pages.test.ts` → PASS (7 tests).

- [ ] **Étape 6 : créer `src/routes.tsx`**

```tsx
import { lazy, type ComponentType } from "react";
import Index from "./pages/Index";
import { PAGES_PUBLIQUES } from "./lib/pages";

// Chemin public → composant. Chaque entrée de pages-publiques.json DOIT avoir
// son composant ici (contrôle ci-dessous : le build échoue sinon).
export const COMPOSANTS: Record<string, ComponentType> = {
  "/": Index,
  "/tarifs": lazy(() => import("./pages/Pricing")),
  "/pms": lazy(() => import("./pages/Pms")),
  "/demander-demo": lazy(() => import("./pages/ContactDemo")),
  "/contact": lazy(() => import("./pages/ContactInfo")),
  "/contact-entreprise": lazy(() => import("./pages/ContactEntreprise")),
  "/fonctionnalites/temperatures": lazy(() => import("./pages/FeatureTemperature")),
  "/fonctionnalites/receptions": lazy(() => import("./pages/FeatureReception")),
  "/fonctionnalites/tracabilite": lazy(() => import("./pages/FeatureTracability")),
  "/fonctionnalites/nettoyage": lazy(() => import("./pages/FeatureCleaning")),
  "/fonctionnalites/huiles": lazy(() => import("./pages/FeatureOil")),
  "/fonctionnalites/etiquettes": lazy(() => import("./pages/FeatureLabels")),
  "/fonctionnalites/checklist": lazy(() => import("./pages/FeatureChecklist")),
  "/blog": lazy(() => import("./pages/Resources")),
  "/blog/affichages-obligatoires-restaurant-2026": lazy(() => import("./pages/BlogAffichageObligatoire")),
  "/blog/methode-haccp-guide-complet": lazy(() => import("./pages/BlogMethodeHACCP")),
  "/app": lazy(() => import("./pages/TelechargerApp")),
  "/politique-confidentialite": lazy(() => import("./pages/PrivacyPolicy")),
  "/cgu": lazy(() => import("./pages/TermsOfUse")),
  "/mentions-legales": lazy(() => import("./pages/LegalNotice")),
};

for (const p of PAGES_PUBLIQUES) {
  if (!COMPOSANTS[p.path]) throw new Error(`Page publique sans composant : ${p.path}`);
}
for (const chemin of Object.keys(COMPOSANTS)) {
  if (!PAGES_PUBLIQUES.some((p) => p.path === chemin)) {
    throw new Error(`Composant hors de pages-publiques.json : ${chemin}`);
  }
}

export const AdminLogin = lazy(() => import("./pages/AdminLogin"));
export const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
export const NotFound = lazy(() => import("./pages/NotFound"));
```

- [ ] **Étape 7 : réécrire `src/App.tsx`**

Les routes `/tarifs/essentiel`, `/tarifs/pro`, `/avantages-ia`, `/ressources*` sont retirées côté React : `vercel.json` les redirige déjà en 301 (vérifié en Tâche 6).

```tsx
import { Suspense, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import RouteTracker from "./components/RouteTracker";
import { PAGES_PUBLIQUES } from "./lib/pages";
import { AdminDashboard, AdminLogin, COMPOSANTS, NotFound } from "./routes";

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

export const AppProviders = ({
  children,
  helmetContext,
}: {
  children: ReactNode;
  helmetContext?: { helmet?: HelmetServerState | null };
}) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export const AppContenu = () => (
  <>
    <Toaster />
    <Sonner />
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
    >
      Aller au contenu principal
    </a>
    <ScrollToTop />
    <RouteTracker />
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {PAGES_PUBLIQUES.map(({ path }) => {
          const Page = COMPOSANTS[path];
          return <Route key={path} path={path} element={<Page />} />;
        })}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </>
);

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <AppContenu />
    </BrowserRouter>
  </AppProviders>
);

export default App;
```

Note : le skip link, les Toaster et `ScrollToTop` étaient dans `<BrowserRouter>` ; ils le restent (dans `AppContenu`).

- [ ] **Étape 8 : vérifier**

Run : `npx vitest run && npm run typecheck && npx vite build`
Attendu : tout vert. Puis `npx vite --port 8080` et ouvrir `/`, `/tarifs`, `/pms`, `/admin`, `/xyz` : chaque page s'affiche comme avant.

- [ ] **Étape 9 : commit**

```bash
git add src/pages-publiques.json src/lib/pages.ts src/lib/pages.test.ts src/routes.tsx src/App.tsx tsconfig.app.json
git commit -m "refactor(seo): liste unique des pages publiques, fil d'Ariane, App séparée en providers + contenu"
```

---

### Tâche 2 : Code compatible avec le rendu serveur + JSON-LD daté + fil d'Ariane automatique

**Files :**
- Create : `src/hooks/useApresMontage.ts`, `src/lib/seo-jsonld.test.ts`
- Modify : `src/pages/Pricing.tsx:204-207`, `src/integrations/supabase/client.ts`, `src/components/Navbar.tsx:15`, `src/components/LaunchBanner.tsx`, `src/lib/seo-jsonld.ts:27-47`, `src/components/Seo.tsx`, `src/pages/Index.tsx:21`

**Interfaces :**
- Consumes : `filAriane(path)` (Tâche 1), `breadcrumbJsonLd(items)` (existant).
- Produces : `useApresMontage(): boolean` ; `softwareAppJsonLd(now?: Date)`.

- [ ] **Étape 1 : test qui échoue `src/lib/seo-jsonld.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { softwareAppJsonLd } from "./seo-jsonld";

const prix = (d: Date) =>
  ((softwareAppJsonLd(d).offers as { price: string }[])[0]).price;

describe("softwareAppJsonLd", () => {
  it("annonce le prix de lancement avant la bascule", () => {
    expect(prix(new Date("2026-10-15T12:00:00Z"))).toBe("14.90");
  });
  it("annonce la grille courante après le 1er novembre 2026", () => {
    expect(prix(new Date("2026-11-02T12:00:00Z"))).toBe("24.90");
  });
});
```

Run : `npx vitest run src/lib/seo-jsonld.test.ts` → FAIL sur le 2ᵉ test (la date est ignorée).

- [ ] **Étape 2 : `softwareAppJsonLd(now)`** — dans `src/lib/seo-jsonld.ts`, remplacer la signature et la 1ʳᵉ ligne :

```ts
export function softwareAppJsonLd(now: Date = new Date()): Record<string, unknown> {
  const pricing = getActivePricing(now);
```

Run : `npx vitest run src/lib/seo-jsonld.test.ts` → PASS.

- [ ] **Étape 3 : `src/hooks/useApresMontage.ts`**

```ts
import { useEffect, useState } from "react";

/**
 * Faux au rendu serveur et au premier rendu navigateur (hydratation), vrai ensuite.
 * À utiliser pour tout affichage qui dépend de l'heure ou de l'appareil du visiteur,
 * afin que le HTML pré-généré et le premier rendu navigateur soient identiques.
 */
export function useApresMontage(): boolean {
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  return monte;
}
```

- [ ] **Étape 4 : Supabase sans `localStorage` côté serveur** — `src/integrations/supabase/client.ts`, remplacer `storage: localStorage,` par :

```ts
      // Pré-génération (Node) : pas de localStorage, la session n'est pas persistée.
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
```

- [ ] **Étape 5 : Navbar** — `src/components/Navbar.tsx`, remplacer la ligne 15 par :

```tsx
  const apresMontage = useApresMontage();
  // Sur téléphone : lien direct vers l'App Store ou Google Play (calculé après
  // hydratation ; avant, /app redirige déjà côté serveur selon l'appareil).
  const lienApp = apresMontage
    ? lienTelechargement(navigator.userAgent, navigator.maxTouchPoints ?? 0)
    : "/app";
```
et ajouter `import { useApresMontage } from "@/hooks/useApresMontage";`.

- [ ] **Étape 6 : LaunchBanner** — `src/components/LaunchBanner.tsx` : le compte à rebours (minutes) diffère forcément entre la construction et la visite. Remplacer le corps du composant jusqu'au `return` par :

```tsx
const LaunchBanner = () => {
  const apresMontage = useApresMontage();
  const [countdown, setCountdown] = useState<CountdownParts | null>(() => getCountdown());

  useEffect(() => {
    setCountdown(getCountdown());
    const intervalId = window.setInterval(() => {
      setCountdown(getCountdown());
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  // L'offre de lancement est terminée : le bandeau ne rend plus rien du tout.
  if (!countdown) {
    return null;
  }

  const { days, hours, minutes } = countdown;
```
et remplacer le `<span>` du compte à rebours par :

```tsx
        {apresMontage && (
          <span className="font-semibold whitespace-nowrap">
            Fin dans {days}&nbsp;j {hours}&nbsp;h {minutes}&nbsp;min
          </span>
        )}
```
Ajouter `import { useApresMontage } from "@/hooks/useApresMontage";`.

- [ ] **Étape 7 : fil d'Ariane automatique dans `Seo`** — `src/components/Seo.tsx` : ajouter les imports

```tsx
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { filAriane } from "@/lib/pages";
```
et remplacer la ligne `const ldArray = …` par :

```tsx
  const ldFournis = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  // Fil d'Ariane ajouté automatiquement, sauf si la page fournit déjà le sien.
  const aDejaUnFil = ldFournis.some((ld) => ld["@type"] === "BreadcrumbList");
  const fil = path && !aDejaUnFil ? filAriane(path) : [];
  const ldArray = fil.length ? [...ldFournis, breadcrumbJsonLd(fil)] : ldFournis;
```

- [ ] **Étape 7 bis : JSON-LD Logiciel sur `/tarifs`** (exigé par la spec, absent aujourd'hui) — `src/pages/Pricing.tsx` : ajouter `softwareAppJsonLd` à l'import depuis `@/lib/seo-jsonld` et `softwareAppJsonLd(),` en tête du tableau `jsonLd={[…]}`.

- [ ] **Étape 8 : vérifier qu'aucun module ne touche au navigateur au chargement**

Run :
```bash
grep -rnE "^(const|let|export const) .*(window|document|localStorage|navigator)\." src --include='*.ts' --include='*.tsx' | grep -v "components/ui"
```
Attendu : aucune ligne. Sinon, envelopper l'accès dans `typeof window !== "undefined"`.

Run : `npx vitest run && npm run typecheck` → vert.

- [ ] **Étape 9 : commit**

```bash
git add src/pages/Pricing.tsx src/hooks/useApresMontage.ts src/lib/seo-jsonld.ts src/lib/seo-jsonld.test.ts src/integrations/supabase/client.ts src/components/Navbar.tsx src/components/LaunchBanner.tsx src/components/Seo.tsx
git commit -m "feat(seo): composants compatibles rendu serveur, JSON-LD daté, fil d'Ariane automatique"
```

---

### Tâche 3 : Fonctions pures de pré-génération (TDD)

**Files :**
- Create : `scripts/lib-prerender.mjs`, `scripts/lib-prerender.test.mjs`
- Modify : `vitest.config.ts`

**Interfaces :**
- Produces (exports de `scripts/lib-prerender.mjs`) :
  - `SITE = "https://lockhaccp.fr"`
  - `fichierPour(path: string): string` — `"/"` → `"index.html"`, `"/a/b"` → `"a/b.html"`
  - `canonicalAttendu(path: string): string` — `"/"` → `"https://lockhaccp.fr/"`, sinon `SITE + path`
  - `retirerBalisesSeo(gabarit: string): string` — retire du `<head>` : `<title>`, meta description, link canonical, metas `og:*`, metas `twitter:*` sauf `twitter:site`
  - `injecter(gabarit: string, head: string, html: string): string`
  - `genererSitemap(pages, date: string): string`
  - `genererLlms({ pages, descriptions: Record<string,string>, prix: { mainMonthly, extraMonthly } }): string`
  - `extraireDescription(html: string): string | null`
  - `verifierPage(html: string, path: string | null, { texteMin?: number }): string[]` — liste d'erreurs (vide = OK) ; `path = null` → contrôle de la 404 (doit contenir `noindex`).

- [ ] **Étape 1 : inclure les tests de `scripts/`** — `vitest.config.ts`, remplacer la ligne `test` :

```ts
  test: { environment: "node", include: ["src/**/*.test.ts", "scripts/**/*.test.mjs"] },
```

- [ ] **Étape 2 : tests qui échouent `scripts/lib-prerender.test.mjs`**

```js
import { describe, expect, it } from "vitest";
import {
  canonicalAttendu, extraireDescription, fichierPour, genererLlms, genererSitemap,
  injecter, retirerBalisesSeo, verifierPage,
} from "./lib-prerender.mjs";

const GABARIT = `<!doctype html><html lang="fr"><head>
<meta charset="UTF-8" />
<title>Défaut</title>
<meta name="description" content="Défaut" />
<link rel="canonical" href="https://lockhaccp.fr/" />
<meta property="og:title" content="Défaut" />
<meta name="twitter:site" content="@LockHACCP" />
<meta name="twitter:title" content="Défaut" />
<link rel="icon" href="/favicon-32x32.png" />
</head><body><div id="root"></div><script type="module" src="/assets/index.js"></script></body></html>`;

describe("fichierPour / canonicalAttendu", () => {
  it("place l'accueil dans index.html", () => expect(fichierPour("/")).toBe("index.html"));
  it("place une page imbriquée dans un .html", () =>
    expect(fichierPour("/fonctionnalites/huiles")).toBe("fonctionnalites/huiles.html"));
  it("canonical de l'accueil avec slash", () => expect(canonicalAttendu("/")).toBe("https://lockhaccp.fr/"));
  it("canonical d'une page", () => expect(canonicalAttendu("/pms")).toBe("https://lockhaccp.fr/pms"));
});

describe("retirerBalisesSeo + injecter", () => {
  it("retire les balises par défaut mais garde favicon et twitter:site", () => {
    const g = retirerBalisesSeo(GABARIT);
    expect(g).not.toContain("<title>");
    expect(g).not.toContain('name="description"');
    expect(g).not.toContain('rel="canonical"');
    expect(g).not.toContain("og:title");
    expect(g).not.toContain("twitter:title");
    expect(g).toContain("twitter:site");
    expect(g).toContain("favicon-32x32.png");
  });
  it("injecte le head avant </head> et le HTML dans #root", () => {
    const out = injecter(retirerBalisesSeo(GABARIT), "<title>Page</title>", "<main><h1>Bonjour</h1></main>");
    expect(out).toContain("<title>Page</title>\n</head>");
    expect(out).toContain('<div id="root"><main><h1>Bonjour</h1></main></div>');
  });
  it("refuse un gabarit sans #root vide", () => {
    expect(() => injecter("<html><head></head><body></body></html>", "", "x")).toThrow();
  });
});

describe("genererSitemap", () => {
  it("liste seulement les pages avec réglages sitemap", () => {
    const xml = genererSitemap(
      [
        { path: "/", fil: "Accueil", sitemap: { changefreq: "weekly", priority: 1 }, llms: true },
        { path: "/app", fil: "App", sitemap: null, llms: false },
      ],
      "2026-10-01",
    );
    expect(xml).toContain("<loc>https://lockhaccp.fr/</loc>");
    expect(xml).not.toContain("/app");
    expect(xml).toContain("<lastmod>2026-10-01</lastmod>");
    expect(xml).toContain("<priority>1.0</priority>");
  });
});

describe("genererLlms", () => {
  const pages = [
    { path: "/", fil: "Accueil", sitemap: null, llms: true },
    { path: "/fonctionnalites/huiles", fil: "Contrôle des huiles", sitemap: null, llms: true },
    { path: "/blog/x", fil: "Article X", sitemap: null, llms: true },
    { path: "/cgu", fil: "CGU", sitemap: null, llms: false },
  ];
  const txt = genererLlms({
    pages,
    descriptions: { "/": "Accueil desc", "/fonctionnalites/huiles": "Huiles desc", "/blog/x": "X desc" },
    prix: { mainMonthly: 24.9, extraMonthly: 9.9 },
  });
  it("commence par le titre H1 et un résumé", () => {
    expect(txt.startsWith("# LockHACCP\n\n> ")).toBe(true);
  });
  it("annonce le prix en vigueur au format français", () => {
    expect(txt).toContain("24,90 €");
    expect(txt).toContain("9,90 €");
  });
  it("range les pages par section avec URL absolue et description", () => {
    expect(txt).toContain("## Fonctionnalités\n\n- [Contrôle des huiles](https://lockhaccp.fr/fonctionnalites/huiles): Huiles desc");
    expect(txt).toContain("## Ressources\n\n- [Article X](https://lockhaccp.fr/blog/x): X desc");
  });
  it("exclut les pages llms:false", () => expect(txt).not.toContain("CGU"));
});

describe("extraireDescription", () => {
  it("lit la meta description générée par Helmet", () => {
    expect(extraireDescription('<meta data-rh="true" name="description" content="Bonjour &amp; bienvenue"/>'))
      .toBe("Bonjour & bienvenue");
  });
});

describe("verifierPage", () => {
  const texte = "Contenu ".repeat(60);
  const ok = (path, extra = "") => `<html><head><title data-rh="true">T</title>
<meta data-rh="true" name="description" content="D"/>
<link data-rh="true" rel="canonical" href="${canonicalAttendu(path)}"/>${extra}
</head><body><div id="root"><h1>Titre</h1><p>${texte}</p></div></body></html>`;

  it("accepte une page complète", () => expect(verifierPage(ok("/pms"), "/pms")).toEqual([]));
  it("signale un canonical qui pointe ailleurs", () => {
    expect(verifierPage(ok("/"), "/pms").join()).toMatch(/canonical/);
  });
  it("signale l'absence de h1 et un texte trop court", () => {
    const html = '<html><head><title>T</title><meta name="description" content="D"/><link rel="canonical" href="https://lockhaccp.fr/pms"/></head><body><div id="root"><p>court</p></div></body></html>';
    const erreurs = verifierPage(html, "/pms").join();
    expect(erreurs).toMatch(/h1/);
    expect(erreurs).toMatch(/texte/);
  });
  it("exige noindex sur la 404", () => {
    expect(verifierPage(ok("/x"), null).join()).toMatch(/noindex/);
    expect(verifierPage(ok("/x", '<meta name="robots" content="noindex,nofollow"/>'), null)).toEqual([]);
  });
});
```

Run : `npx vitest run scripts` → FAIL (module introuvable).

- [ ] **Étape 3 : implémenter `scripts/lib-prerender.mjs`**

```js
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
```

- [ ] **Étape 4 : lancer** — `npx vitest run scripts` → PASS. Puis `npx vitest run` → tout vert.

- [ ] **Étape 5 : commit**

```bash
git add scripts/lib-prerender.mjs scripts/lib-prerender.test.mjs vitest.config.ts
git commit -m "feat(seo): fonctions de pré-génération (injection, sitemap, llms.txt, vérification) et tests"
```

---

### Tâche 4 : Rendu serveur, pré-génération et contrôle post-build

**Files :**
- Create : `src/entry-server.tsx`, `scripts/prerender.mjs`, `scripts/verifier-prerender.mjs`
- Modify : `src/main.tsx`, `vite.config.ts`, `package.json`, `vercel.json`, `public/robots.txt`
- Delete : `scripts/generate-sitemap.mjs`, `public/sitemap.xml`

**Interfaces :**
- Consumes : `AppProviders`, `AppContenu` (Tâche 1) ; `PAGES_PUBLIQUES` (Tâche 1) ; `getActivePricing` ; toutes les fonctions de `scripts/lib-prerender.mjs` (Tâche 3).
- Produces : `render(url: string): Promise<{ html: string; head: string }>` (export de `dist-ssr/entry-server.js`) ; `dist/<page>.html`, `dist/404.html`, `dist/_shell.html`, `dist/sitemap.xml`, `dist/llms.txt`.

- [ ] **Étape 1 : `src/entry-server.tsx`**

```tsx
import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import type { HelmetServerState } from "react-helmet-async";
import { AppContenu, AppProviders } from "./App";

export { PAGES_PUBLIQUES } from "./lib/pages";
export { getActivePricing } from "./lib/launch";

/** Rend une URL en HTML complet (pages lazy résolues) + balises <head> de Helmet. */
export function render(url: string): Promise<{ html: string; head: string }> {
  const helmetContext: { helmet?: HelmetServerState | null } = {};
  return new Promise((resolve, reject) => {
    let html = "";
    let echec: unknown = null;
    const sortie = new Writable({
      write(chunk, _enc, suite) {
        html += chunk.toString();
        suite();
      },
    });
    sortie.on("finish", () => {
      if (echec) return reject(echec);
      const h = helmetContext.helmet;
      if (!h) return reject(new Error(`Helmet n'a rien produit pour ${url}`));
      const head = [h.title, h.meta, h.link, h.script].map((b) => b.toString()).join("\n");
      resolve({ html, head });
    });
    const { pipe } = renderToPipeableStream(
      <AppProviders helmetContext={helmetContext}>
        <StaticRouter location={url}>
          <AppContenu />
        </StaticRouter>
      </AppProviders>,
      {
        onAllReady() {
          pipe(sortie);
        },
        onShellError(err) {
          reject(err);
        },
        onError(err) {
          echec = err;
        },
      },
    );
  });
}
```

- [ ] **Étape 2 : `src/main.tsx`**

```tsx
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const racine = document.getElementById("root")!;
// Pages pré-générées : on reprend le HTML existant. Admin et développement : rendu complet.
if (racine.hasChildNodes()) {
  hydrateRoot(racine, <App />);
} else {
  createRoot(racine).render(<App />);
}
```

- [ ] **Étape 3 : `vite.config.ts`** — `manualChunks` ne doit s'appliquer qu'au build client (au build SSR, react est externe). Remplacer `export default defineConfig({` … par une fonction :

```ts
export default defineConfig(({ isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              "react-vendor": ["react", "react-dom", "react-router-dom"],
              "ui-vendor": [
                "@radix-ui/react-dialog",
                "@radix-ui/react-dropdown-menu",
                "@radix-ui/react-navigation-menu",
                "@radix-ui/react-toast",
                "@radix-ui/react-tooltip",
              ],
              supabase: ["@supabase/supabase-js"],
            },
          },
        },
  },
}));
```

- [ ] **Étape 4 : `scripts/prerender.mjs`**

```js
#!/usr/bin/env node
// Pré-génère chaque page publique dans dist/, plus 404.html, _shell.html, sitemap.xml, llms.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  extraireDescription, fichierPour, genererLlms, genererSitemap, injecter, retirerBalisesSeo,
} from "./lib-prerender.mjs";

const racine = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(racine, "dist");
const { render, PAGES_PUBLIQUES, getActivePricing } = await import(
  pathToFileURL(join(racine, "dist-ssr", "entry-server.js")).href
);

const gabarit = readFileSync(join(dist, "index.html"), "utf8");
// Coquille vide pour l'admin (rendu client uniquement).
writeFileSync(join(dist, "_shell.html"), gabarit);
const base = retirerBalisesSeo(gabarit);

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

ecrire("sitemap.xml", genererSitemap(PAGES_PUBLIQUES, new Date().toISOString().slice(0, 10)));
ecrire("llms.txt", genererLlms({ pages: PAGES_PUBLIQUES, descriptions, prix: getActivePricing() }));

console.log(`✓ ${PAGES_PUBLIQUES.length} pages pré-générées + 404, sitemap.xml, llms.txt`);
```

- [ ] **Étape 5 : `scripts/verifier-prerender.mjs`**

```js
#!/usr/bin/env node
// Contrôle post-build : échoue (code 1) si une page pré-générée est incomplète.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fichierPour, verifierPage } from "./lib-prerender.mjs";

const racine = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(racine, "dist");
const pages = JSON.parse(readFileSync(join(racine, "src", "pages-publiques.json"), "utf8"));

const erreurs = [];
const titres = new Map();
for (const { path } of pages) {
  const fichier = join(dist, fichierPour(path));
  if (!existsSync(fichier)) { erreurs.push(`${path} : fichier ${fichierPour(path)} absent`); continue; }
  const html = readFileSync(fichier, "utf8");
  for (const e of verifierPage(html, path)) erreurs.push(`${path} : ${e}`);
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
console.log(`✓ ${pages.length} pages vérifiées (titre, description, canonical, h1, texte) + 404`);
```

- [ ] **Étape 6 : `package.json`** — remplacer les scripts `prebuild` et `build` par :

```json
    "build": "vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs && node scripts/verifier-prerender.mjs",
```
(supprimer la ligne `"prebuild"`).

- [ ] **Étape 7 : supprimer l'ancien sitemap**

```bash
git rm scripts/generate-sitemap.mjs public/sitemap.xml
```

- [ ] **Étape 8 : `public/robots.txt`**

```
# Accès ouvert à tous les robots, administration exclue.
User-agent: *
Allow: /
Disallow: /admin

# Moteurs de recherche et assistants d'IA : accès explicitement autorisé.
# (Un groupe nommé remplace le groupe « * » : la règle /admin y est répétée.)
User-agent: Googlebot
User-agent: Bingbot
User-agent: Applebot
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
Allow: /
Disallow: /admin

Sitemap: https://lockhaccp.fr/sitemap.xml
```

- [ ] **Étape 9 : `vercel.json`** — trois changements :
  1. `"buildCommand": "vite build"` → `"buildCommand": "npm run build"` (sinon Vercel saute la pré-génération).
  2. Ajouter `"cleanUrls": true,` après `"outputDirectory"`.
  3. Remplacer le bloc `rewrites` par :

```json
  "rewrites": [
    { "source": "/admin", "destination": "/_shell.html" },
    { "source": "/admin/(.*)", "destination": "/_shell.html" }
  ],
```
  et ajouter `llms\\.txt` à la règle de cache des fichiers racine : `"source": "/(favicon.*|apple-touch-icon\\.png|robots\\.txt|sitemap\\.xml|llms\\.txt)"`.

- [ ] **Étape 10 : construire et vérifier**

Run : `npm run build`
Attendu : `✓ 20 pages pré-générées…` puis `✓ 20 pages vérifiées…`.
En cas d'erreur SSR sur une dépendance (`ERR_REQUIRE_ESM`, `Cannot use import statement`) : ajouter le paquet fautif dans `ssr: { noExternal: ["<paquet>"] }` de `vite.config.ts`, relancer.
En cas d'échec du vérificateur sur une page (texte trop court, h1 multiple) : corriger la page ou, pour un texte court légitime, le signaler à Alan — ne pas baisser le seuil global.

Contrôles manuels :
```bash
grep -o "<title[^>]*>[^<]*" dist/pms.html
grep -c "Plan de Maîtrise Sanitaire" dist/pms.html
head -20 dist/llms.txt
grep -c "<url>" dist/sitemap.xml   # attendu : 19
grep -c "<h1" dist/_shell.html      # attendu : 0
```

- [ ] **Étape 11 : vérifier l'hydratation en local**

```bash
npx serve dist -l 4173 --no-clipboard &   # serve applique cleanUrls par défaut
```
Ouvrir avec Playwright `http://localhost:4173/`, `/tarifs`, `/pms`, `/fonctionnalites/huiles` : lire la console, **aucune** erreur `Hydration` / `did not match` / `Minified React error #418|#423|#425`. Sur `/pms`, avancer de 2 étapes dans le questionnaire. Arrêter le serveur.
Si une erreur d'hydratation apparaît : identifier le composant (rendu dépendant de l'heure, de l'appareil ou de `window`) et le passer derrière `useApresMontage()` (Tâche 2).

- [ ] **Étape 12 : tests + commit**

```bash
npx vitest run && npm run typecheck
git add -A src/entry-server.tsx src/main.tsx vite.config.ts package.json vercel.json public/robots.txt scripts/
git commit -m "feat(seo): pré-génération de chaque page, 404 réelle, sitemap et llms.txt générés, robots d'IA autorisés"
```

---

### Tâche 5 : Reconstruction quotidienne

**Files :**
- Create : `.github/workflows/reconstruction-quotidienne.yml`

- [ ] **Étape 1 : le workflow**

```yaml
name: Reconstruction quotidienne
# Le HTML est figé à la construction : on reconstruit chaque nuit pour que les
# prix (bascule du 01/11/2026), le bandeau et la date du sitemap restent à jour.
# 23:15 UTC = 00:15 à Paris en hiver, 01:15 en été.
on:
  schedule:
    - cron: "15 23 * * *"
  workflow_dispatch:

jobs:
  redeployer:
    runs-on: ubuntu-latest
    steps:
      - name: Déclencher le deploy hook Vercel
        env:
          HOOK: ${{ secrets.VERCEL_DEPLOY_HOOK_URL }}
        run: |
          test -n "$HOOK" || { echo "Secret VERCEL_DEPLOY_HOOK_URL manquant"; exit 1; }
          curl -fsS -X POST "$HOOK"
```

- [ ] **Étape 2 : commit**

```bash
git add .github/workflows/reconstruction-quotidienne.yml
git commit -m "ci: reconstruction quotidienne du site via deploy hook Vercel"
```

- [ ] **Étape 3 (après la mise en production, Tâche 7)** : créer le deploy hook (Vercel → projet `lockhaccp-vitrine` → Settings → Git → Deploy Hooks, nom `nuit`, branche `main`) puis `gh secret set VERCEL_DEPLOY_HOOK_URL --repo AlanT-lock/lockhaccp-vitrine` (valeur collée, jamais affichée). Si l'une des deux opérations n'est pas faisable depuis le terminal, guider Alan pas à pas. Lancer une fois à la main : `gh workflow run "Reconstruction quotidienne"` et vérifier qu'un déploiement Vercel démarre.

---

### Tâche 6 : Préversion Vercel et contrôles « comme un robot »

- [ ] **Étape 1 : pousser la branche** (Vercel crée une préversion)

```bash
git push -u origin feat/fondations-seo
vercel ls lockhaccp-vitrine | head -5   # récupérer l'URL de préversion, attendre « Ready »
```
Noter l'URL dans `$P` (ex. `https://lockhaccp-vitrine-git-feat-fondations-seo-….vercel.app`). Si la préversion est protégée (401), utiliser `vercel curl` ou le lien de contournement du skill `vercel:access-protected-vercel-deployment`.

- [ ] **Étape 2 : statuts HTTP**

```bash
for u in / /pms /tarifs /fonctionnalites/huiles /blog/methode-haccp-guide-complet /app /admin /admin/dashboard /nimporte-quoi /sitemap.xml /robots.txt /llms.txt; do
  printf "%-45s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' "$P$u")"; done
```
Attendu : tout en 200 sauf `/nimporte-quoi` → **404**.

- [ ] **Étape 3 : redirections héritées**

```bash
for u in /ressources /ressources/methode-haccp /tarifs/pro /avantages-ia /pms.html; do
  curl -s -o /dev/null -w "$u %{http_code} → %{redirect_url}\n" "$P$u"; done
```
Attendu : 301/308 vers `/blog`, `/blog/methode-haccp-guide-complet`, `/tarifs`, `/tarifs`, `/pms`.

- [ ] **Étape 4 : HTML vu par un robot sans JavaScript**

```bash
for u in /pms /tarifs /fonctionnalites/huiles; do
  curl -s -A "GPTBot" "$P$u" | grep -o '<title[^>]*>[^<]*\|rel="canonical" href="[^"]*"' ; done
curl -s "$P/admin/dashboard" | grep -c '<div id="root"></div>'   # attendu : 1 (coquille vide)
curl -s "$P/nimporte-quoi" | grep -c noindex                     # attendu : ≥ 1
```

- [ ] **Étape 5 : contrôle navigateur de la préversion** (Playwright) : console sans erreur d'hydratation sur `/`, `/tarifs`, `/pms`, `/blog/methode-haccp-guide-complet` ; questionnaire PMS parcouru jusqu'au récapitulatif (sans envoyer) ; formulaire de contact affiché ; `/admin` affiche l'écran de connexion ; sur `/tarifs`, le prix affiché est celui du jour.

- [ ] **Étape 6 : corriger** tout écart dans la tâche qui possède le code, re-pousser, refaire les contrôles en échec.

---

### Tâche 7 : Domaine principal et mise en production (avec accord d'Alan)

- [ ] **Étape 1 : présenter à Alan** le résultat des contrôles de la Tâche 6 et **demander son accord** pour fusionner dans `main` (= mise en production).

- [ ] **Étape 2 : après accord, fusionner et pousser**

```bash
git checkout main && git merge --ff-only feat/fondations-seo && git push origin main
```
Attendre le déploiement « Ready » (`vercel ls lockhaccp-vitrine`).

- [ ] **Étape 3 : domaine principal** — objectif : `lockhaccp.fr` sert le site, `www.lockhaccp.fr` redirige en permanent (308) vers `lockhaccp.fr`. Tenter par la CLI Vercel (`vercel domains inspect lockhaccp.fr`, puis l'API projet `PATCH /v9/projects/lockhaccp-vitrine/domains/www.lockhaccp.fr` avec `{"redirect":"lockhaccp.fr","redirectStatusCode":308}` et `PATCH …/domains/lockhaccp.fr` avec `{"redirect":null}`, via `vercel api` si disponible). Sinon, guider Alan : Vercel → projet → Settings → Domains → `lockhaccp.fr` : Edit → aucune redirection ; `www.lockhaccp.fr` : Edit → « Redirect to lockhaccp.fr », « 308 Permanent Redirect ».

- [ ] **Étape 4 : vérifier en production**

```bash
curl -sI https://lockhaccp.fr/pms | grep -i "^HTTP"                       # 200
curl -sI https://www.lockhaccp.fr/pms | grep -i "^HTTP\|^location"        # 308 → https://lockhaccp.fr/pms
curl -s -o /dev/null -w "%{http_code}\n" https://lockhaccp.fr/nimporte-quoi  # 404
curl -s https://lockhaccp.fr/llms.txt | head -5
```

- [ ] **Étape 5 : deploy hook + secret** (Tâche 5, étape 3).

- [ ] **Étape 6 : actions d'Alan**, à lui transmettre en fin de chantier :
  1. Bing Webmaster Tools → « Importer depuis Google Search Console ».
  2. Search Console et Bing → Sitemaps → `https://lockhaccp.fr/sitemap.xml`.
  3. Search Console → Inspection d'URL sur `https://lockhaccp.fr/pms` → « Demander l'indexation ».

- [ ] **Étape 7 : mettre à jour la mémoire** (`project_lockhaccp.md`, section vitrine : pré-génération, liste `pages-publiques.json` à compléter pour toute nouvelle page, reconstruction nocturne).
