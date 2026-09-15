import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { getCountdown, LAUNCH_OFFER_END_LABEL, type CountdownParts } from "@/lib/launch";

const REFRESH_INTERVAL_MS = 60_000; // 1 minute

const LaunchBanner = () => {
  const [countdown, setCountdown] = useState<CountdownParts | null>(() => getCountdown());

  useEffect(() => {
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

  return (
    <Link
      to="/tarifs"
      aria-label="Voir les tarifs de l'offre de lancement"
      className="block bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-[11px] leading-tight sm:text-sm sm:leading-normal font-medium">
        <Sparkles className="hidden sm:block w-4 h-4 flex-shrink-0" aria-hidden="true" />
        {/* Formulation courte : seule visible sous le point de rupture sm (écrans mobiles). */}
        <span className="sm:hidden font-semibold">Offre de lancement</span>
        {/* Formulation longue : réservée aux écrans moyens et plus, où la place ne manque pas. */}
        <span className="hidden sm:inline">
          Offre de lancement : tarif garanti à vie pour toute souscription avant le{" "}
          {LAUNCH_OFFER_END_LABEL}.
        </span>
        <span className="font-semibold whitespace-nowrap">
          Fin dans {days}&nbsp;j {hours}&nbsp;h {minutes}&nbsp;min
        </span>
        {/* Simple texte, pas un <Link> : la bannière entière est déjà le lien, imbriquer
            un second lien à l'intérieur serait invalide en HTML et casserait l'accessibilité. */}
        <span className="hidden sm:inline underline underline-offset-2 whitespace-nowrap">
          Voir les tarifs
        </span>
      </div>
    </Link>
  );
};

export default LaunchBanner;
