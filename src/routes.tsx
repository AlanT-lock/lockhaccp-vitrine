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
