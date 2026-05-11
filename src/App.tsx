import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import RouteTracker from "./components/RouteTracker";
import Index from "./pages/Index";

const NotFound = lazy(() => import("./pages/NotFound"));
const FeatureTemperature = lazy(() => import("./pages/FeatureTemperature"));
const FeatureReception = lazy(() => import("./pages/FeatureReception"));
const FeatureTracability = lazy(() => import("./pages/FeatureTracability"));
const FeatureCleaning = lazy(() => import("./pages/FeatureCleaning"));
const FeatureOil = lazy(() => import("./pages/FeatureOil"));
const FeatureLabels = lazy(() => import("./pages/FeatureLabels"));
const FeatureChecklist = lazy(() => import("./pages/FeatureChecklist"));
const Pricing = lazy(() => import("./pages/Pricing"));
const ContactInfo = lazy(() => import("./pages/ContactInfo"));
const ContactDemo = lazy(() => import("./pages/ContactDemo"));
const ContactEntreprise = lazy(() => import("./pages/ContactEntreprise"));
const AIFeatures = lazy(() => import("./pages/AIFeatures"));
const Resources = lazy(() => import("./pages/Resources"));
const BlogAffichageObligatoire = lazy(() => import("./pages/BlogAffichageObligatoire"));
const BlogMethodeHACCP = lazy(() => import("./pages/BlogMethodeHACCP"));
const PlanEssentiel = lazy(() => import("./pages/PlanEssentiel"));
const PlanPro = lazy(() => import("./pages/PlanPro"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
              <Route path="/" element={<Index />} />
              <Route path="/fonctionnalites/temperatures" element={<FeatureTemperature />} />
              <Route path="/fonctionnalites/receptions" element={<FeatureReception />} />
              <Route path="/fonctionnalites/tracabilite" element={<FeatureTracability />} />
              <Route path="/fonctionnalites/nettoyage" element={<FeatureCleaning />} />
              <Route path="/fonctionnalites/huiles" element={<FeatureOil />} />
              <Route path="/fonctionnalites/etiquettes" element={<FeatureLabels />} />
              <Route path="/fonctionnalites/checklist" element={<FeatureChecklist />} />
              <Route path="/tarifs" element={<Pricing />} />
              <Route path="/tarifs/essentiel" element={<PlanEssentiel />} />
              <Route path="/tarifs/pro" element={<PlanPro />} />
              <Route path="/contact" element={<ContactInfo />} />
              <Route path="/contact-entreprise" element={<ContactEntreprise />} />
              <Route path="/demander-demo" element={<ContactDemo />} />
              <Route path="/avantages-ia" element={<AIFeatures />} />
              <Route path="/ressources" element={<Resources />} />
              <Route path="/ressources/affichage-obligatoire-restaurant" element={<BlogAffichageObligatoire />} />
              <Route path="/ressources/methode-haccp" element={<BlogMethodeHACCP />} />
              <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
              <Route path="/cgu" element={<TermsOfUse />} />
              <Route path="/mentions-legales" element={<LegalNotice />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
