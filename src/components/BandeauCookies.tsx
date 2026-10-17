import { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { stopTracking, trackPageView } from "@/lib/analytics";
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
      "Statistiques de visite du site (pages vues, provenance, temps passé), réservées à LockHACCP, pour améliorer le site.",
  },
  {
    cle: "publicite",
    titre: "Publicité",
    description:
      "Google Ads : mesure de l'efficacité de nos annonces et affichage d'annonces LockHACCP sur d'autres sites. Des données de navigation sont alors transmises à Google.",
  },
];

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
    enregistrerChoix(choix);
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
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex gap-4">
          <Cookie className="hidden h-8 w-8 flex-shrink-0 text-secondary md:block" aria-hidden="true" />
          <div className="space-y-1">
            <h2 id={idTitre} className="font-heading text-base font-semibold">
              Vos choix en matière de cookies
            </h2>
            <p className="text-sm leading-relaxed text-primary-foreground/90">
              Avec votre accord, nous utilisons des cookies pour mesurer l'audience du site et l'efficacité de nos
              annonces Google Ads. Vous pouvez tout refuser sans que cela gêne votre visite, et changer d'avis à tout
              moment via « Gestion des cookies » en bas de page.{" "}
              <Link
                to="/politique-confidentialite"
                className="font-semibold text-primary-foreground underline underline-offset-2 hover:no-underline"
              >
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </div>

        {details && (
          <ul className="space-y-3">
            {FINALITES.map(({ cle, titre, description }) => {
              const id = `${idTitre}-${cle}`;
              return (
                <li key={cle} className="flex items-start justify-between gap-4 rounded-lg bg-primary-foreground/10 p-3">
                  <div>
                    <label htmlFor={id} className="text-sm font-semibold">
                      {titre}
                    </label>
                    <p className="text-xs leading-relaxed text-primary-foreground/80">{description}</p>
                  </div>
                  <Switch
                    id={id}
                    checked={brouillon[cle]}
                    onCheckedChange={(coche) => setBrouillon((b) => ({ ...b, [cle]: coche }))}
                    className="mt-1 data-[state=checked]:bg-secondary data-[state=unchecked]:bg-primary-foreground/30"
                  />
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          {details ? (
            <Button
              variant="link"
              onClick={() => choisir(brouillon)}
              className="text-primary-foreground underline underline-offset-2 sm:mr-auto"
            >
              Enregistrer mes choix
            </Button>
          ) : (
            <Button
              variant="link"
              onClick={() => setDetails(true)}
              className="text-primary-foreground underline underline-offset-2 sm:mr-auto"
            >
              Personnaliser
            </Button>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => choisir(TOUT_REFUSER)}
              className="flex-1 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary sm:w-36 sm:flex-none"
            >
              Tout refuser
            </Button>
            <Button variant="secondary" onClick={() => choisir(TOUT_ACCEPTER)} className="flex-1 sm:w-36 sm:flex-none">
              Tout accepter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BandeauCookies;
