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
    <div className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs sm:text-sm font-medium">
        <Sparkles className="hidden sm:block w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>
          Offre de lancement : tarif garanti à vie pour toute souscription avant le{" "}
          {LAUNCH_OFFER_END_LABEL}.
        </span>
        <span className="font-semibold whitespace-nowrap">
          Fin dans {days}&nbsp;j {hours}&nbsp;h {minutes}&nbsp;min
        </span>
        <Link to="/tarifs" className="underline underline-offset-2 hover:no-underline whitespace-nowrap">
          Voir les tarifs
        </Link>
      </div>
    </div>
  );
};

export default LaunchBanner;
