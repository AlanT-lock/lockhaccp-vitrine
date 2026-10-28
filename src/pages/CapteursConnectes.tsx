import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RelatedLinks } from "@/components/RelatedLinks";
import { FaqSection } from "@/components/FaqSection";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import {
  ArrowRight,
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
  PRIX_CAPTEUR_ANNUEL,
  PRIX_CAPTEUR_MENSUEL,
  capteursProductJsonLd,
  lienCommandeCapteurs,
} from "@/lib/capteurs";

/** Bouton de commande : l'app si l'option est en vente, sinon « Être prévenu » (formulaire de contact). */
const BoutonCommande = ({ variant = "hero" }: { variant?: "hero" | "accent" }) => {
  const lien = lienCommandeCapteurs();
  return (
    <Button variant={variant} size="xl" asChild>
      {lien.externe ? (
        <a href={lien.href}>
          {lien.libelle}
          <ArrowRight className="w-5 h-5" />
        </a>
      ) : (
        <Link to={lien.href}>
          {lien.libelle}
          <ArrowRight className="w-5 h-5" />
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
    texte: "Une panne à 2 h du matin ? Vous recevez une notification, un e-mail et un SMS, et non pas une mauvaise surprise le lendemain.",
  },
  {
    icon: Bell,
    titre: "Un deuxième contact prévenu",
    texte: "Si personne ne répond « Je m'en occupe » dans les 30 minutes, une deuxième personne reçoit un SMS.",
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

const CapteursConnectes = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: etapesRef, isVisible: etapesVisible } = useScrollAnimation();
  const { ref: avantagesRef, isVisible: avantagesVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Capteur de température connecté pour restaurant"
        description={`Capteurs de température connectés pour vos frigos : alertes SMS la nuit, relevés HACCP automatiques. ${formatPriceEUR(PRIX_CAPTEUR_MENSUEL)} TTC par capteur et par mois, sans engagement.`}
        path={CHEMIN_CAPTEURS}
        jsonLd={[capteursProductJsonLd(), faqJsonLd(FAQ_CAPTEURS)]}
      />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-hero overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div
                ref={heroRef}
                className={`transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/10 mb-6">
                  <Radio className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Capteurs connectés{CAPTEURS_EN_VENTE ? "" : " : bientôt disponible"}
                  </span>
                </div>

                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                  Vos frigos <span className="text-primary">surveillés jour et nuit</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                  Un petit capteur dans chaque frigo, chambre froide ou congélateur. Si la température monte, vous
                  êtes prévenu tout de suite, même la nuit. Et les relevés s'écrivent tout seuls dans votre registre
                  HACCP.
                </p>

                <p className="text-lg text-foreground mb-8">
                  <span className="font-heading text-3xl font-bold text-primary">{formatPriceEUR(PRIX_CAPTEUR_MENSUEL)}</span>{" "}
                  TTC par capteur et par mois, passerelle incluse.
                  <span className="block text-sm text-muted-foreground mt-1">
                    Sans engagement, sans frais de mise en service. {MENTION_TVA}.
                  </span>
                </p>

                <div className="flex flex-col items-start sm:flex-row gap-4">
                  <BoutonCommande />
                  <Button variant="heroOutline" size="xl" asChild>
                    <Link to="/tarifs">Voir tous les tarifs</Link>
                  </Button>
                </div>
              </div>

              {/* Exemple d'alerte */}
              <div
                className={`relative transition-all duration-700 ${heroVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
              >
                <div className="bg-primary rounded-2xl p-8 text-primary-foreground max-w-md mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                      <Thermometer className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-lg">Chambre froide</p>
                      <p className="text-sm text-primary-foreground/70">Mesure il y a 4 min</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-primary-foreground/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-primary-foreground/70">Température</span>
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-200 rounded-full">Alerte</span>
                      </div>
                      <p className="text-4xl font-heading font-bold">7,8 °C</p>
                      <p className="text-xs text-primary-foreground/70 mt-1">Au-dessus de +4 °C depuis 35 min</p>
                    </div>
                    <div className="bg-primary-foreground/10 rounded-xl p-4 text-sm space-y-1">
                      <p>2 h 14 : notification, e-mail et SMS au gérant</p>
                      <p>2 h 44 : SMS au deuxième contact</p>
                      <p>2 h 51 : « Je m'en occupe », porte mal fermée</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={etapesRef}
              className={`text-center mb-12 transition-all duration-700 ${etapesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Installé en 5 minutes, sans technicien
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nous préparons le kit pour votre établissement. Vous n'avez rien à régler.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {ETAPES.map((e, i) => (
                <div key={e.titre} className="bg-card rounded-2xl p-6 border border-border shadow-card">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
                    <e.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{e.titre}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{e.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={avantagesRef}
              className={`text-center mb-12 transition-all duration-700 ${avantagesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ce que font les capteurs pour vous
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une panne de froid peut coûter tout un stock. Les capteurs vous laissent le temps d'agir.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AVANTAGES.map((a) => (
                <div
                  key={a.titre}
                  className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 border border-border hover:border-primary/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                    <a.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{a.titre}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{a.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prix et comparaison */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
              Un prix simple, tout compris
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
              {formatPriceEUR(PRIX_CAPTEUR_MENSUEL)} TTC par capteur et par mois, ou {formatPriceEUR(PRIX_CAPTEUR_ANNUEL)} TTC par
              an (2 mois offerts). Exemple : 3 frigos et 1 congélateur, 4 capteurs, soit{" "}
              {formatPriceEUR(PRIX_CAPTEUR_MENSUEL * 4)} TTC par mois. L'option s'ajoute à votre abonnement LockHACCP.
            </p>

            <ul className="grid sm:grid-cols-2 gap-3 mb-12">
              {POINTS_CAPTEURS.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{p}</span>
                </li>
              ))}
            </ul>

            <h3 className="font-heading text-2xl font-bold text-foreground mb-4 text-center">
              Comparé aux offres habituelles
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th scope="col" className="p-4 font-semibold text-foreground"></th>
                    <th scope="col" className="p-4 font-semibold text-primary">LockHACCP</th>
                    <th scope="col" className="p-4 font-semibold text-muted-foreground">Offres habituelles</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARAISON_CAPTEURS.map((l) => (
                    <tr key={l.critere} className="border-b border-border last:border-0">
                      <th scope="row" className="p-4 text-left font-medium text-foreground">{l.critere}</th>
                      <td className="p-4 text-foreground">{l.lockhaccp}</td>
                      <td className="p-4 text-muted-foreground">{l.marche}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Offres habituelles : fourchettes constatées en octobre 2026 sur les offres publiques de capteurs
              connectés pour la restauration. Chaque offre a ses conditions : comparez avant de choisir.
            </p>
          </div>
        </section>

        <FaqSection
          items={FAQ_CAPTEURS}
          title="Questions fréquentes sur les capteurs"
          description="Ce qu'il faut savoir avant d'équiper vos frigos."
        />

        {/* CTA */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-3xl p-8 lg:p-16 text-center">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
                Dormez tranquille, vos frigos sont surveillés
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                {CAPTEURS_EN_VENTE
                  ? "Ajoutez des capteurs dans l'application (Paramètres > Capteurs connectés) ou sur app.lockhaccp.fr, dans Abonnement. Le kit part préconfiguré."
                  : "Les capteurs arrivent très bientôt. Laissez-nous un message, nous vous prévenons dès qu'ils sont disponibles."}
              </p>
              <BoutonCommande variant="accent" />
            </div>
          </div>
        </section>
      </main>

      <RelatedLinks
        items={[
          { to: "/fonctionnalites/temperatures", label: "Relevés de température", description: "Pour les enceintes sans capteur, le relevé sur téléphone." },
          { to: "/tarifs", label: "Tarifs LockHACCP", description: "L'abonnement et ses options." },
          { to: "/plan-de-maitrise-sanitaire", label: "Plan de Maîtrise Sanitaire gratuit", description: "Votre dossier PMS en 10 minutes." },
        ]}
      />
      <Footer />
    </div>
  );
};

export default CapteursConnectes;
