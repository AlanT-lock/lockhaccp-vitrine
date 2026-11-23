import { useEffect, useId, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { stopTracking, trackPageView } from "@/lib/analytics";
import { traiterConversionsEnAttente } from "@/lib/conversions";
import {
  EVENEMENT_OUVRIR_FENETRE_COOKIES,
  TOUT_ACCEPTER,
  TOUT_REFUSER,
  enregistrerChoix,
  lireChoix,
  type ChoixCookies,
} from "@/lib/consentement";

// Fenêtre cookies, chargée après l'affichage de la page (voir App.tsx).
// Première visite : fenêtre au centre de l'écran, « Personnaliser » ou « Tout accepter » ;
// elle ne se ferme qu'avec une réponse. Le refus se fait dans « Personnaliser »
// (« Tout refuser », ou « Enregistrer mes choix » : tout y est décoché au départ).
// Rien n'est déposé avant l'accord, et le visiteur peut changer d'avis à tout moment
// (lien « Gestion des cookies » du pied de page : la fenêtre s'ouvre alors sur le détail
// et peut être refermée sans rien changer).

const FINALITES: { cle: keyof ChoixCookies; titre: string; description: string }[] = [
  {
    cle: "mesure",
    titre: "Mesure d'audience",
    description:
      "Pages vues, provenance des visites, temps passé : ces statistiques (nos propres outils et Google Analytics) nous aident à améliorer le site.",
  },
  {
    cle: "publicite",
    titre: "Suivi des campagnes",
    description:
      "Indique quelles annonces Google amènent des visites et des demandes, et adapte les annonces LockHACCP que vous voyez ensuite. Données transmises à Google.",
  },
];

// Pages que le visiteur doit pouvoir lire avant de répondre.
const PAGES_SANS_FENETRE = ["/politique-confidentialite", "/mentions-legales", "/cgu"];

const LIGNE = "flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/50 px-4 py-3";

const FenetreCookies = () => {
  const { pathname, search } = useLocation();
  const idBase = useId();
  const contenu = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => lireChoix() === null);
  const [details, setDetails] = useState(false);
  // Ouverte depuis le pied de page : le visiteur peut la refermer sans rien changer.
  const [demandee, setDemandee] = useState(false);
  const [brouillon, setBrouillon] = useState<ChoixCookies>(() => lireChoix() ?? TOUT_REFUSER);

  useEffect(() => {
    const ouvrir = () => {
      setBrouillon(lireChoix() ?? TOUT_REFUSER);
      setDetails(true);
      setDemandee(true);
      setVisible(true);
    };
    window.addEventListener(EVENEMENT_OUVRIR_FENETRE_COOKIES, ouvrir);
    return () => window.removeEventListener(EVENEMENT_OUVRIR_FENETRE_COOKIES, ouvrir);
  }, []);

  if (!visible || pathname.startsWith("/admin")) return null;
  if (!demandee && PAGES_SANS_FENETRE.includes(pathname)) return null;

  const fermer = () => {
    setDemandee(false);
    setDetails(false);
    // Sans réponse enregistrée, la question reste posée sur les autres pages.
    setVisible(lireChoix() === null);
  };

  const choisir = (choix: ChoixCookies) => {
    const avant = lireChoix();
    // Conversions survenues avant la réponse : avec la publicité, envoyées une fois la balise
    // Google prête ; avec la mesure seule, tout de suite (pour GA4) ; sinon oubliées.
    enregistrerChoix(choix, Date.now(), () => traiterConversionsEnAttente(true));
    if (!choix.publicite) traiterConversionsEnAttente(choix.mesure);
    if (!choix.mesure) stopTracking();
    else if (!avant?.mesure) trackPageView(pathname + search); // la page en cours n'avait pas été comptée
    setVisible(false);
    setDetails(false);
    setDemandee(false);
  };

  // Première visite : ni Échap ni clic à côté ne ferment la fenêtre.
  const retenir = (e: Event) => {
    if (!demandee) e.preventDefault();
  };

  return (
    <Dialog.Root open onOpenChange={(ouverte) => !ouverte && demandee && fermer()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-foreground/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          ref={contenu}
          onEscapeKeyDown={retenir}
          onPointerDownOutside={retenir}
          onInteractOutside={retenir}
          onOpenAutoFocus={(e) => {
            // Pas de bouton présélectionné : le visiteur choisit lui-même.
            e.preventDefault();
            contenu.current?.focus();
          }}
          className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-background text-foreground shadow-2xl outline-none duration-300 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-6 sm:inset-0 sm:m-auto sm:h-fit sm:max-w-lg sm:rounded-3xl"
        >
          {/* Le texte défile si l'écran est petit ; les boutons restent toujours visibles. */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-1 pt-6 sm:px-8 sm:pt-8">
            {details && !demandee && (
              <button
                type="button"
                onClick={() => setDetails(false)}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Retour
              </button>
            )}
            {demandee && (
              <Dialog.Close
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Dialog.Close>
            )}

            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary/20">
                <Cookie className="h-6 w-6 text-secondary-texte" aria-hidden="true" />
              </span>
              <Dialog.Title className="font-heading text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">
                {details ? "Vos préférences" : "Nous utilisons des cookies"}
              </Dialog.Title>
            </div>

            <Dialog.Description className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {details ? (
                <>Activez ou désactivez chaque usage. Vous pourrez revenir sur vos choix à tout moment, en bas de chaque page.</>
              ) : (
                <>
                  Ils font fonctionner le site, mesurent sa fréquentation et l'efficacité de nos campagnes, pour vous
                  proposer un site plus utile. Vous pouvez tout accepter ou choisir en détail.
                </>
              )}{" "}
              <Link to="/politique-confidentialite" className="font-semibold text-primary underline underline-offset-2 hover:no-underline">
                En savoir plus
              </Link>
            </Dialog.Description>

            {details && (
              <ul className="mt-5 space-y-3">
                <li className={LIGNE}>
                  <div>
                    <p className="text-sm font-semibold">Fonctionnement du site</p>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      Mémorisent vos choix de cookies et le brouillon de votre PMS. Indispensables, ils ne peuvent pas être
                      désactivés.
                    </p>
                  </div>
                  <span className="flex-shrink-0 whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    Toujours actifs
                  </span>
                </li>
                {FINALITES.map(({ cle, titre, description }) => {
                  const id = `${idBase}-${cle}`;
                  return (
                    <li key={cle} className={LIGNE}>
                      <div>
                        <label htmlFor={id} className="text-sm font-semibold">
                          {titre}
                        </label>
                        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{description}</p>
                      </div>
                      <Switch
                        id={id}
                        checked={brouillon[cle]}
                        onCheckedChange={(coche) => setBrouillon((b) => ({ ...b, [cle]: coche }))}
                        className="mt-0.5"
                      />
                    </li>
                  );
                })}
              </ul>
            )}

          </div>

          {details ? (
            <div className="flex flex-col-reverse gap-2.5 px-6 pb-6 pt-5 sm:flex-row sm:items-center sm:gap-3 sm:px-8 sm:pb-8">
              <Button variant="ghost" onClick={() => choisir(TOUT_REFUSER)} className="text-muted-foreground sm:mr-auto sm:px-3">
                Tout refuser
              </Button>
              <Button variant="outline" onClick={() => choisir(brouillon)}>
                Enregistrer mes choix
              </Button>
              <Button onClick={() => choisir(TOUT_ACCEPTER)}>Tout accepter</Button>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-3 px-6 pb-6 pt-6 sm:flex-row sm:px-8 sm:pb-8">
              <Button variant="outline" size="lg" onClick={() => setDetails(true)} className="sm:flex-1">
                Personnaliser
              </Button>
              <Button size="lg" onClick={() => choisir(TOUT_ACCEPTER)} className="sm:flex-1">
                Tout accepter
              </Button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FenetreCookies;
