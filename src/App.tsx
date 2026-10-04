import { lazy, Suspense, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import RouteTracker from "./components/RouteTracker";
import { PAGES_FIXES } from "./lib/pages";
import { AdminDashboard, AdminLogin, BlogArticle, COMPOSANTS, NotFound } from "./routes";
import { useApresMontage } from "./hooks/useApresMontage";

// Hors du chemin critique : chargées seulement une fois la page affichée et hydratée.
const Notifications = lazy(() => import("./components/Notifications"));

// L'état « monté » vit ICI et non dans AppContenu : une mise à jour d'un parent pendant
// que la page (chargée à la demande) s'hydrate forcerait React à tout redessiner (erreur #421).
const NotificationsDifferees = () => {
  const apresMontage = useApresMontage();
  if (!apresMontage) return null;
  return (
    <Suspense fallback={null}>
      <Notifications />
    </Suspense>
  );
};

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
        {children}
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export const AppContenu = () => (
  <>
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
