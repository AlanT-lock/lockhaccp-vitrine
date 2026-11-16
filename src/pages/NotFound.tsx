import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Home, MessageCircle } from "lucide-react";

// Raccourcis vers les pages les plus utiles.
const RACCOURCIS = [
  { to: "/tarifs", libelle: "Tarifs" },
  { to: "/plan-de-maitrise-sanitaire", libelle: "PMS gratuit" },
  { to: "/application-pms", libelle: "L'application" },
  { to: "/blog", libelle: "Ressources" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404: route inconnue ->", location.pathname);
  }, [location.pathname]);

  // Pas de fond propre : le fond animé du site (halos) apparaît derrière.
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <Seo title="Page introuvable" description="La page que vous cherchez n'existe pas ou a été déplacée." noindex />
      <div className="relative w-full max-w-xl text-center">
        <p
          aria-hidden="true"
          className="pointer-events-none select-none font-heading text-[clamp(8rem,28vw,13rem)] font-extrabold leading-none tracking-[-0.06em] text-primary/10"
        >
          404
        </p>
        <div className="-mt-[clamp(3rem,10vw,5rem)] rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_40px_80px_-45px_hsl(211_100%_20%/0.5)] sm:p-10">
          <h1 className="font-heading text-[clamp(1.8rem,4vw,2.4rem)] font-extrabold tracking-[-0.03em] text-foreground">
            Cette page n'existe pas
          </h1>
          <p className="mt-3 text-muted-foreground">Vérifiez l'adresse ou revenez à la page d'accueil.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="hero" size="lg" asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">
                <MessageCircle className="h-4 w-4" />
                Nous contacter
              </Link>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-2 border-t border-border/80 pt-6">
            {RACCOURCIS.map((r) => (
              <li key={r.to}>
                <Link
                  to={r.to}
                  className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  {r.libelle}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
