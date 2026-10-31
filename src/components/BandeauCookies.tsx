import { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { stopTracking, trackPageView } from "@/lib/analytics";
import { traiterConversionsEnAttente } from "@/lib/conversions";
import {
  EVENEMENT_OUVRIR_BANDEAU,
  TOUT_ACCEPTER,
  TOUT_REFUSER,
  enregistrerChoix,
  lireChoix,
  type ChoixCookies,
} from "@/lib/consentement";

// Bandeau cookies, chargé après l'affichage de la page (voir App.tsx).
// Règles CNIL : rien n'est déposé avant l'accord, ne rien choisir vaut refus,
// « Tout refuser » aussi simple et visible que « Tout accepter », choix par finalité,
// et possibilité de changer d'avis à tout moment (lien du pied de page).

const FINALITES: { cle: keyof ChoixCookies; titre: string; description: string }[] = [
  {
    cle: "mesure",
    titre: "Mesure d'audience",
    description:
      "Statistiques de visite, réservées à LockHACCP.",
  },
  {
    cle: "publicite",
    titre: "Publicité",
    description:
      "Google Ads : mesure de nos annonces et publicité ciblée. Données transmises à Google.",
  },
];

const LIEN = "font-semibold text-primary-foreground underline underline-offset-2 hover:no-underline";

const BandeauCookies = () => {
  const { pathname, search } = useLocation();
  const idTitre = useId();
  const [visible, setVisible] = useState(() => lireChoix() === null);
  const [details, setDetails] = useState(false);
  const [brouillon, setBrouillon] = useState<ChoixCookies>(() => lireChoix() ?? TOUT_REFUSER);

  useEffect(() => {
    const ouvrir = () => {
      setBrouillon(lireChoix() ?? TOUT_REFUSER);
      setDetails(true);
      setVisible(true);
    };
    window.addEventListener(EVENEMENT_OUVRIR_BANDEAU, ouvrir);
    return () => window.removeEventListener(EVENEMENT_OUVRIR_BANDEAU, ouvrir);
  }, []);

  if (!visible || pathname.startsWith("/admin")) return null;

  const choisir = (choix: ChoixCookies) => {
    const avant = lireChoix();
    // Conversions survenues avant la réponse : envoyées une fois la balise Google prête, ou oubliées.
    enregistrerChoix(choix, Date.now(), () => traiterConversionsEnAttente(true));
    if (!choix.publicite) traiterConversionsEnAttente(false);
    if (!choix.mesure) stopTracking();
    else if (!avant?.mesure) trackPageView(pathname + search); // la page en cours n'avait pas été comptée
    setVisible(false);
    setDetails(false);
  };

  return (
    <section
      aria-labelledby={idTitre}
      className="fixed inset-x-0 bottom-0 z-40 max-h-[85vh] overflow-y-auto border-t-4 border-secondary bg-primary text-primary-foreground shadow-2xl"
    >
      <div className="container mx-auto flex flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:flex-wrap md:items-center md:gap-x-6 lg:px-8">
        <div className="flex items-center gap-3 md:flex-1">
          <Cookie className="hidden h-7 w-7 flex-shrink-0 text-secondary md:block" aria-hidden="true" />
          <p className="text-xs leading-snug text-primary-foreground/90 sm:text-sm">
            <span id={idTitre} className="font-semibold text-primary-foreground">
              Cookies :
            </span>{" "}
            avec votre accord, nous mesurons l'audience et nos annonces Google Ads.{" "}
            {!details && (
              <>
                <button type="button" onClick={() => setDetails(true)} className={LIEN}>
                  Personnaliser
                </button>
                {" · "}
              </>
            )}
            <Link to="/politique-confidentialite" className={LIEN}>
              En savoir plus
            </Link>
          </p>
        </div>

        {details && (
          <ul className="space-y-2 md:order-last md:w-full">
            {FINALITES.map(({ cle, titre, description }) => {
              const id = `${idTitre}-${cle}`;
              return (
                <li key={cle} className="flex items-center justify-between gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2">
                  <div>
                    <label htmlFor={id} className="text-sm font-semibold">
                      {titre}
                    </label>
                    <p className="text-xs leading-snug text-primary-foreground/80">{description}</p>
                  </div>
                  <Switch
                    id={id}
                    checked={brouillon[cle]}
                    onCheckedChange={(coche) => setBrouillon((b) => ({ ...b, [cle]: coche }))}
                    className="data-[state=checked]:bg-secondary data-[state=unchecked]:bg-primary-foreground/30"
                  />
                </li>
              );
            })}
            <li className="text-right">
              <button type="button" onClick={() => choisir(brouillon)} className={`${LIEN} text-sm`}>
                Enregistrer mes choix
              </button>
            </li>
          </ul>
        )}

        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => choisir(TOUT_REFUSER)}
            className="flex-1 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary md:w-32 md:flex-none"
          >
            Tout refuser
          </Button>
          <Button size="sm" variant="secondary" onClick={() => choisir(TOUT_ACCEPTER)} className="flex-1 md:w-32 md:flex-none">
            Tout accepter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BandeauCookies;
