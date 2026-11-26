import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RelatedLinks } from "@/components/RelatedLinks";
import { FaqSection } from "@/components/FaqSection";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Accent, Surtitre, TITRE_H2 } from "@/components/design/elements";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  AlertTriangle,
  Check,
  Bell,
  BatteryFull,
  CheckCircle,
  ClipboardCheck,
  Moon,
  PauseCircle,
  Plug,
  Radio,
  Thermometer,
  Wifi,
} from "lucide-react";
import { faqJsonLd } from "@/lib/seo-jsonld";
import { formatPriceEUR, MENTION_TVA } from "@/lib/launch";
import {
  CAPTEURS_EN_VENTE,
  CHEMIN_CAPTEURS,
  COMPARAISON_CAPTEURS,
  FAQ_CAPTEURS,
  POINTS_CAPTEURS,
  PRIX_CAPTEUR,
  PRIX_PASSERELLE,
  prixKit,
  capteursProductJsonLd,
  lienCommandeCapteurs,
} from "@/lib/capteurs";

/** Bouton de commande : l'app si l'option est en vente, sinon « Être prévenu » (formulaire de contact). */
const BoutonCommande = ({ variant = "hero" }: { variant?: "hero" | "accent" }) => {
  const lien = lienCommandeCapteurs();
  return (
    <Button variant={variant} size="xl" asChild className="group">
      {lien.externe ? (
        <a href={lien.href}>
          {lien.libelle}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </a>
      ) : (
        <Link to={lien.href}>
          {lien.libelle}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </Button>
  );
};

const ETAPES = [
  {
    icon: Plug,
    titre: "Branchez la passerelle",
    texte: "Sur votre box internet, par câble ou en Wi-Fi. Elle arrive déjà configurée pour votre établissement.",
  },
  {
    icon: Thermometer,
    titre: "Posez les capteurs",
    texte: "La sonde au milieu du frigo, le boîtier à l'extérieur. Vous scannez le capteur et choisissez l'équipement dans l'application.",
  },
  {
    icon: CheckCircle,
    titre: "C'est fini",
    texte: "La première mesure arrive en quelques minutes. Ensuite, une mesure toutes les 10 minutes, jour et nuit.",
  },
];

const AVANTAGES = [
  {
    icon: Moon,
    titre: "Alertes la nuit et le week-end",
    texte: "Une panne à 2 h du matin ? Vous recevez une notification et un e-mail, et non pas une mauvaise surprise le lendemain.",
  },
  {
    icon: Bell,
    titre: "Un deuxième contact prévenu",
    texte: "Si personne ne répond « Je m'en occupe » dans les 30 minutes, une deuxième personne est prévenue par e-mail.",
  },
  {
    icon: ClipboardCheck,
    titre: "Registre rempli tout seul",
    texte: "Les relevés s'écrivent dans votre registre des températures. Plus de saisie pour les enceintes équipées.",
  },
  {
    icon: PauseCircle,
    titre: "Pause en un geste",
    texte: "Dégivrage, livraison, nettoyage : mettez le capteur en pause et évitez les fausses alertes.",
  },
  {
    icon: Wifi,
    titre: "Coupure détectée",
    texte: "Si un capteur ou la passerelle ne donne plus de nouvelles pendant une heure, vous êtes prévenu.",
  },
  {
    icon: BatteryFull,
    titre: "Piles longue durée",
    texte: "Environ 5 ans d'autonomie. L'application vous prévient quand les piles faiblissent.",
  },
];

/** Visuel du hero : une alerte en pleine nuit, et la façon dont elle remonte (exemple). */
function AlerteDeNuit() {
  const etapes = [
    { heure: "2 h 14", texte: "Notification et e-mail au gérant" },
    { heure: "2 h 44", texte: "E-mail au deuxième contact" },
    { heure: "2 h 51", texte: "« Je m'en occupe », porte mal fermée", fait: true },
  ];
  return (
    <div className="relative mx-auto max-w-md">
      <div className="relative overflow-hidden rounded-[2rem] bg-[hsl(211_100%_13%)] p-7 text-white shadow-[0_40px_80px_-40px_hsl(211_100%_15%/0.9)] sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/50 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm text-white/70">
              <Moon className="h-4 w-4 text-secondary" /> Cette nuit
            </span>
            <span className="whitespace-nowrap font-heading text-sm font-bold text-white/80">2 h 14</span>
          </div>
          <div className="mt-6 rounded-2xl bg-white p-5 text-foreground">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Thermometer className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-heading font-bold">Chambre froide</p>
                <p className="text-xs text-muted-foreground">Mesure il y a 4 min</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                <AlertTriangle className="h-3.5 w-3.5" /> Alerte
              </span>
            </div>
            <p className="mt-4 font-heading text-5xl font-extrabold tracking-tight text-red-700">7,8 °C</p>
            <p className="mt-1 text-sm text-muted-foreground">Au-dessus de +4 °C depuis 35 min</p>
          </div>
          <ol className="mt-6 space-y-3">
            {etapes.map((e) => (
              <li key={e.heure} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    e.fait ? "bg-emerald-500" : "bg-white/15"
                  }`}
                >
                  {e.fait ? <Check className="h-3 w-3 text-white" strokeWidth={3} /> : <Bell className="h-3 w-3 text-secondary" />}
                </span>
                <span className="shrink-0 whitespace-nowrap font-heading font-bold tabular-nums text-white">{e.heure}</span>
                <span className="text-white/75">{e.texte}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="flotte-doux absolute -left-10 -top-5 hidden items-center sm:flex gap-2 rounded-2xl border border-white/60 bg-white/90 py-2 pl-2 pr-4 shadow-[0_12px_30px_-12px_hsl(211_100%_20%/0.35)]">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light">
          <Radio className="h-[1.125rem] w-[1.125rem] text-primary" />
        </span>
        <span className="text-left">
          <span className="block text-[0.8rem] font-bold text-foreground">Une mesure toutes les 10 min</span>
          <span className="block text-[0.7rem] text-muted-foreground">Jour et nuit</span>
        </span>
      </div>
    </div>
  );
}

const CapteursConnectes = () => (
  <div className="min-h-screen">
    <Seo
      title="Capteur de température connecté pour restaurant"
      description={`Capteurs de température connectés pour vos frigos : alertes la nuit, relevés HACCP automatiques. Kit : passerelle ${formatPriceEUR(PRIX_PASSERELLE)} + ${formatPriceEUR(PRIX_CAPTEUR)} par capteur, sans abonnement.`}
      path={CHEMIN_CAPTEURS}
      jsonLd={[capteursProductJsonLd(), faqJsonLd(FAQ_CAPTEURS)]}
    />
    <Navbar />

    <main>
      {/* En-tête */}
      <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
            <div className="text-center lg:col-span-7 lg:text-left">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                <Radio className="h-4 w-4" />
                Capteurs connectés{CAPTEURS_EN_VENTE ? "" : " : bientôt disponible"}
              </p>
              <h1 className="font-heading text-[clamp(2.3rem,5.4vw,4.3rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-foreground">
                Vos frigos <Accent>surveillés jour et nuit</Accent>
              </h1>
              <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0">
                Un petit capteur dans chaque frigo, chambre froide ou congélateur. Si la température monte, vous êtes
                prévenu tout de suite, même la nuit. Et les relevés s'écrivent tout seuls dans votre registre HACCP.
              </p>
              <div className="mx-auto mt-8 inline-flex flex-col items-center gap-1 rounded-2xl border border-border/80 bg-white/85 px-6 py-4 lg:mx-0 lg:items-start">
                <p className="text-foreground">
                  <span className="font-heading text-4xl font-extrabold tracking-tight text-primary">{formatPriceEUR(PRIX_CAPTEUR)}</span>{" "}
                  par capteur, en paiement unique, + {formatPriceEUR(PRIX_PASSERELLE)} pour la passerelle.
                </p>
                <p className="text-sm text-muted-foreground">
                  Sans abonnement capteurs, livraison comprise, le matériel vous appartient. {MENTION_TVA}.
                </p>
              </div>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <BoutonCommande />
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/tarifs">Voir tous les tarifs</Link>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <AlerteDeNuit />
            </div>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <Surtitre>Installation</Surtitre>
            <h2 className={TITRE_H2}>Installé en 5 minutes, sans technicien</h2>
            <p className="mt-5 text-lg text-muted-foreground">Nous préparons le kit pour votre établissement. Vous n'avez rien à régler.</p>
          </div>
          <ol className="relative mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <span aria-hidden="true" className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 md:block" />
            {ETAPES.map((e, i) => (
              <li key={e.titre} className="relative rounded-3xl border border-border/80 bg-white/80 p-7 text-center md:border-0 md:bg-transparent md:p-0">
                <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_14px_30px_-12px_hsl(211_100%_26%/0.6)]">
                  <e.icon className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-extrabold text-secondary-foreground">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-6 font-heading text-lg font-bold text-foreground">{e.titre}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground md:px-3">{e.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end">
            <h2 className={`${TITRE_H2} lg:col-span-7`}>Ce que font les capteurs pour vous</h2>
            <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-5">
              Une panne de froid peut coûter tout un stock. Les capteurs vous laissent le temps d'agir.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AVANTAGES.map((a, i) => (
              <div
                key={a.titre}
                className="group rounded-3xl border border-border/80 bg-white/80 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_24px_50px_-24px_hsl(211_100%_20%/0.35)]"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <a.icon className="h-6 w-6" />
                  </span>
                  <span aria-hidden="true" className="font-heading text-sm font-extrabold tabular-nums text-primary/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-heading text-lg font-bold text-foreground">{a.titre}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{a.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prix et comparaison */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-border/80 bg-white/90 shadow-[0_30px_70px_-45px_hsl(211_100%_20%/0.45)] lg:grid-cols-2">
            <div className="relative overflow-hidden bg-[hsl(211_100%_13%)] p-8 text-white sm:p-12">
              <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/50 blur-3xl" />
              <div className="relative">
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-secondary">Le prix</p>
                <h2 className="font-heading text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
                  Vous payez une fois, c'est à vous
                </h2>
                <p className="mt-6 leading-relaxed text-white/75">
                  Passerelle {formatPriceEUR(PRIX_PASSERELLE)} (une par établissement) et {formatPriceEUR(PRIX_CAPTEUR)} par
                  capteur, livraison comprise. Exemple : 3 frigos et 1 congélateur, 4 capteurs, soit{" "}
                  {formatPriceEUR(prixKit(4))} une seule fois. Les relevés automatiques et les alertes fonctionnent avec
                  votre abonnement LockHACCP, ou pendant votre période d'essai.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/[0.08] p-5">
                    <p className="font-heading text-3xl font-extrabold text-secondary">{formatPriceEUR(PRIX_CAPTEUR)}</p>
                    <p className="mt-1 text-sm text-white/70">par capteur</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.08] p-5">
                    <p className="font-heading text-3xl font-extrabold text-white">{formatPriceEUR(PRIX_PASSERELLE)}</p>
                    <p className="mt-1 text-sm text-white/70">la passerelle</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 sm:p-12">
              <ul className="space-y-3">
                {POINTS_CAPTEURS.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-foreground">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light">
                      <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <BoutonCommande />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-4xl">
            <h3 className="mb-8 text-center font-heading text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-[-0.02em] text-foreground">
              Comparé aux offres habituelles
            </h3>
            <div className="rounded-3xl border border-border/80 bg-white/90 p-2 shadow-[0_30px_70px_-45px_hsl(211_100%_20%/0.4)] sm:p-3">
              <table className="block w-full text-left sm:table">
                <thead className="hidden sm:table-header-group">
                  <tr>
                    <th scope="col" className="w-[30%] px-5 py-4" />
                    <th scope="col" className="rounded-t-2xl bg-primary px-5 py-4 text-sm font-semibold text-white">LockHACCP</th>
                    <th scope="col" className="px-5 py-4 text-sm font-semibold text-muted-foreground">Offres habituelles</th>
                  </tr>
                </thead>
                <tbody className="block sm:table-row-group">
                  {COMPARAISON_CAPTEURS.map((l, i) => (
                    <tr key={l.critere} className="block border-b border-border/70 p-4 last:border-0 sm:table-row sm:p-0">
                      <th scope="row" className="block pb-3 font-heading font-bold text-foreground sm:table-cell sm:px-5 sm:py-5">
                        {l.critere}
                      </th>
                      <td
                        className={`flex gap-2 rounded-xl bg-primary-light/60 p-3 text-foreground sm:table-cell sm:rounded-none sm:bg-primary/[0.06] sm:px-5 sm:py-5 ${
                          i === COMPARAISON_CAPTEURS.length - 1 ? "sm:rounded-b-2xl" : ""
                        }`}
                      >
                        <span className="shrink-0 font-semibold text-primary sm:hidden">LockHACCP :</span>
                        {l.lockhaccp}
                      </td>
                      <td className="flex gap-2 pt-2 text-muted-foreground sm:table-cell sm:px-5 sm:py-5">
                        <span className="shrink-0 font-semibold text-muted-foreground/80 sm:hidden">Ailleurs :</span>
                        {l.marche}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Offres habituelles : fourchettes constatées en octobre 2026 sur les offres publiques de capteurs connectés
              pour la restauration. Chaque offre a ses conditions : comparez avant de choisir.
            </p>
          </div>
        </div>
      </section>

      <FaqSection
        items={FAQ_CAPTEURS}
        title="Questions fréquentes sur les capteurs"
        description="Ce qu'il faut savoir avant d'équiper vos frigos."
      />

      {/* Dernier appel */}
      <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-32">
        <div className="container relative mx-auto overflow-hidden rounded-[2.5rem] bg-primary px-5 py-14 text-center text-white sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
            <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-[hsl(211_100%_45%)]/40 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl">
            <h2 className="font-heading text-[clamp(2.2rem,4.8vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.03em] [text-wrap:balance]">
              Dormez tranquille, vos frigos sont surveillés
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              {CAPTEURS_EN_VENTE
                ? "Ajoutez des capteurs dans l'application (Paramètres > Capteurs connectés) ou sur app.lockhaccp.fr, dans Abonnement. Le kit part préconfiguré."
                : "Les capteurs arrivent très bientôt. Laissez-nous un message, nous vous prévenons dès qu'ils sont disponibles."}
            </p>
            <div className="mt-10">
              <BoutonCommande variant="accent" />
            </div>
          </div>
        </div>
      </section>

      <RelatedLinks
        items={[
          { to: "/fonctionnalites/temperatures", label: "Relevés de température", description: "Pour les enceintes sans capteur, le relevé sur téléphone." },
          { to: "/blog/releve-temperature-restaurant-regles-fiche", label: "Relevé de température en restaurant : règles et fiche", description: "Seuils, fréquence et fiche à tenir." },
          { to: "/tarifs", label: "Tarifs LockHACCP", description: "L'abonnement et ses options." },
          { to: "/plan-de-maitrise-sanitaire", label: "Plan de Maîtrise Sanitaire gratuit", description: "Votre dossier PMS en 10 minutes." },
        ]}
      />
    </main>
    <Footer />
  </div>
);

export default CapteursConnectes;
