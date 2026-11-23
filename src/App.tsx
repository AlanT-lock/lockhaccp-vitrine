import { lazy, Suspense, type ReactNode } from "react";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import RouteTracker from "./components/RouteTracker";
import { PAGES_FIXES } from "./lib/pages";
import { AdminDashboard, AdminLogin, BlogArticle, COMPOSANTS, NotFound } from "./routes";
import { useApresMontage } from "./hooks/useApresMontage";
import { FondAnime } from "./components/FondAnime";

// Hors du chemin critique : chargés seulement une fois la page affichée et hydratée.
const Notifications = lazy(() => import("./components/Notifications"));
const FenetreCookies = lazy(() => import("./components/FenetreCookies"));

// L'état « monté » vit DANS la frontière Suspense (ContenuDiffere), jamais au-dessus :
// - au-dessus de la page, une mise à jour pendant que la page s'hydrate forcerait React à
//   tout redessiner (erreur #421) ;
// - au-dessus de la frontière, la mise à jour pouvait arriver avant que React ait hydraté
//   cette frontière (il le fait plus tard, en basse priorité) : elle restait alors
//   « déshydratée » pour toujours, et la fenêtre cookies ne s'affichait jamais.
// Ici, l'effet de ContenuDiffere ne s'exécute qu'une fois la frontière hydratée.
// La frontière est rendue dès le serveur (vide) pour que serveur et navigateur concordent.
const ContenuDiffere = () => {
  const apresMontage = useApresMontage();
  if (!apresMontage) return null;
  return (
    <>
      <Notifications />
      <FenetreCookies />
    </>
  );
};

const NotificationsDifferees = () => (
  <Suspense fallback={null}>
    <ContenuDiffere />
  </Suspense>
);

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
}) => <HelmetProvider context={helmetContext}>{children}</HelmetProvider>;

export const AppContenu = () => (
  <>
    <FondAnime />
    <NotificationsDifferees />
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
        {PAGES_FIXES.map(({ path }) => {
          const Page = COMPOSANTS[path];
          return <Route key={path} path={path} element={<Page />} />;
        })}
        <Route path="/blog/:slug" element={<BlogArticle />} />
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
