import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EVENEMENT_OUVRIR_BANDEAU, enregistrerChoix, lireChoix, type ChoixCookies } from "@/lib/consentement";

// Bandeau cookies, chargé après l'affichage de la page (voir App.tsx).
// Il n'agit pas sur le suivi : voir src/lib/consentement.ts.
const BandeauCookies = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(() => lireChoix() === null);

  useEffect(() => {
    const ouvrir = () => setVisible(true);
    window.addEventListener(EVENEMENT_OUVRIR_BANDEAU, ouvrir);
    return () => window.removeEventListener(EVENEMENT_OUVRIR_BANDEAU, ouvrir);
  }, []);

  if (!visible || pathname.startsWith("/admin")) return null;

  const choisir = (choix: ChoixCookies) => {
    enregistrerChoix(choix);
    setVisible(false);
  };

  return (
    <section
      aria-label="Gestion des cookies"
      className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-secondary bg-primary text-primary-foreground shadow-2xl"
    >
      <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:gap-6 lg:px-8">
        <Cookie className="hidden h-8 w-8 flex-shrink-0 text-secondary md:block" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-primary-foreground/90">
          Nous utilisons des cookies pour mesurer l'audience du site et l'efficacité de nos annonces.{" "}
          <Link
            to="/politique-confidentialite"
            className="font-semibold text-primary-foreground underline underline-offset-2 hover:no-underline"
          >
            En savoir plus
          </Link>
        </p>
        <div className="flex flex-shrink-0 gap-3">
          <Button
            variant="outline"
            onClick={() => choisir("refuse")}
            className="flex-1 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary md:w-32 md:flex-none"
          >
            Refuser
          </Button>
          <Button variant="secondary" onClick={() => choisir("accepte")} className="flex-1 md:w-32 md:flex-none">
            Accepter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BandeauCookies;
