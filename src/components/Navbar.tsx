import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoColor from "@/assets/logo-color.png";
import { APP_URL } from "@/lib/links";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const location = useLocation();

  const featureLinks = [
    { label: "Températures", href: "/fonctionnalites/temperatures" },
    { label: "Réception marchandise", href: "/fonctionnalites/receptions" },
    { label: "Traçabilité", href: "/fonctionnalites/tracabilite" },
    { label: "Plan de nettoyage", href: "/fonctionnalites/nettoyage" },
    { label: "Contrôle des huiles", href: "/fonctionnalites/huiles" },
    { label: "Étiquettes", href: "/fonctionnalites/etiquettes" },
    { label: "Checklist personnalisée", href: "/fonctionnalites/checklist" },
  ];

  const navLinks = [
    { label: "Avantages IA", href: "/avantages-ia" },
    { label: "Ressources", href: "/ressources" },
    { label: "Tarifs", href: "/tarifs" },
    { label: "Contact", href: "/contact" },
  ];

  const isCurrentPath = (path: string) => location.pathname === path;
  const isFeaturePath = () => location.pathname.startsWith("/fonctionnalites");

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logoColor} alt="LockHACCP Logo" className="h-10 w-auto" />
            <span className="font-heading font-bold text-xl text-foreground">
              Lock<span className="text-primary">HACCP</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Solution HACCP with dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsSolutionOpen(true)}
              onMouseLeave={() => setIsSolutionOpen(false)}
            >
              <Link
                to="/"
                className={`transition-colors font-medium flex items-center gap-1 ${
                  isCurrentPath("/") || isFeaturePath()
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Solution HACCP
                <ChevronDown className={`h-4 w-4 transition-transform ${isSolutionOpen ? "rotate-180" : ""}`} />
              </Link>
              
              {/* Dropdown menu */}
              {isSolutionOpen && (
                <div className="absolute top-full left-0 pt-2 w-64">
                  <div className="bg-background border border-border rounded-lg shadow-lg py-2 animate-fade-in">
                    {featureLinks.map((feature) => (
                      <Link
                        key={feature.label}
                        to={feature.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isCurrentPath(feature.href)
                            ? "text-primary bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {feature.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`transition-colors font-medium ${
                  isCurrentPath(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={APP_URL}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Connexion
            </a>
            <Link to="/demander-demo">
              <Button variant="hero" size="sm">
                Demander une démo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {/* Solution HACCP with expandable features */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsSolutionOpen(!isSolutionOpen)}
                  aria-expanded={isSolutionOpen}
                  aria-controls="mobile-solution-submenu"
                  className={`w-full flex items-center justify-between py-2 transition-colors font-medium ${
                    isCurrentPath("/") || isFeaturePath()
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Solution HACCP
                  <ChevronDown className={`h-4 w-4 transition-transform ${isSolutionOpen ? "rotate-180" : ""}`} />
                </button>
                {isSolutionOpen && (
                  <div id="mobile-solution-submenu" className="pl-4 flex flex-col gap-1 mt-1">
                    <Link
                      to="/"
                      className="py-1.5 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Vue d'ensemble
                    </Link>
                    {featureLinks.map((feature) => (
                      <Link
                        key={feature.label}
                        to={feature.href}
                        className={`py-1.5 text-sm ${
                          isCurrentPath(feature.href)
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {feature.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`transition-colors font-medium py-2 ${
                    isCurrentPath(link.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <a
                  href={APP_URL}
                  className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Connexion
                </a>
                <Link to="/demander-demo" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="hero" className="w-full">
                    Demander une démo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    <span id="main-content" tabIndex={-1} className="sr-only">
      Contenu principal
    </span>
    </>
  );
};

export default Navbar;
