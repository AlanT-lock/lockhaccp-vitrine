import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404: route inconnue ->", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <Seo title="Page introuvable" description="La page que vous cherchez n'existe pas ou a été déplacée." noindex />
      <div className="text-center max-w-md">
        <p className="text-7xl font-heading font-bold text-primary mb-4">404</p>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
          Cette page n'existe pas
        </h1>
        <p className="text-muted-foreground mb-8">
          Vérifiez l'adresse ou revenez à la page d'accueil.
        </p>
        <div className="flex flex-col items-center sm:flex-row gap-3 justify-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact">
              <ArrowLeft className="w-4 h-4" />
              Nous contacter
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
