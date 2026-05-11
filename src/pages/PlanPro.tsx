import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Thermometer, Printer, Tablet, Wifi, Shield, Headphones } from "lucide-react";
import { APP_URL } from "@/lib/links";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

const PlanPro = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: equipmentRef, isVisible: equipmentVisible } = useScrollAnimation();

  const baseFeatures = [
    "Toutes les fonctionnalités Essentiel",
    "Support client prioritaire",
    "Contrôle à réception automatisé",
    "Intégration du PMS compris",
    "Intégration des produits finis",
    "Notification des rappels conso",
    "Rapports hebdomadaires",
  ];

  const proFeatures = [
    {
      icon: Thermometer,
      name: "Relevé de température automatisé",
      description: "Les capteurs connectés enregistrent automatiquement les températures de vos enceintes froides 24h/24.",
      benefits: [
        "Surveillance continue",
        "Alertes instantanées",
        "Plus de relevés manuels",
        "Historique complet",
      ],
    },
    {
      icon: Printer,
      name: "Étiqueteuse connectée",
      description: "Imprimez vos étiquettes de production (DLC, lot, allergènes) directement depuis l'application.",
      benefits: [
        "Impression en 1 clic",
        "Étiquettes conformes",
        "Modèles personnalisables",
        "Gain de temps considérable",
      ],
    },
    {
      icon: Tablet,
      name: "Tablette avec protection",
      description: "Une tablette professionnelle préconfigurée avec coque de protection pour une utilisation en cuisine.",
      benefits: [
        "Prête à l'emploi",
        "Résistante aux chocs",
        "Application préinstallée",
        "Support dédié",
      ],
    },
  ];

  const equipmentDetails = [
    {
      icon: Wifi,
      title: "Installation incluse",
      description: "Nos techniciens installent et configurent tous les équipements dans votre établissement.",
    },
    {
      icon: Headphones,
      title: "SAV réactif sous 24h",
      description: "En cas de problème, notre équipe intervient rapidement pour vous dépanner.",
    },
    {
      icon: Shield,
      title: "Remplacement express",
      description: "Équipement défaillant ? Nous vous envoyons un remplacement sous 24-48h.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Plan Pro à 29,90€/mois - LockHACCP" description="Le plan Pro LockHACCP : toutes les fonctionnalités HACCP avec automatisations, rapports et support prioritaire à 29,90€/mois." path="/tarifs/pro" />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={headerRef}
            className={`text-center max-w-3xl mx-auto transition-all duration-700 ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-sm font-semibold text-primary">Plan Pro • Automatisations</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Le plan <span className="text-primary">complet</span> pour aller plus loin
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Toutes les fonctionnalités Essentiel, avec en plus les automatisations, les rapports et le support prioritaire.
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-4xl font-bold text-foreground">29,90€</span>
              <span className="text-muted-foreground">/mois</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={APP_URL}>
                <Button variant="hero" size="xl">
                  Essayer 3 mois gratuits
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/demander-demo">
                <Button variant="outline" size="xl">
                  Demander une démo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Base Features */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Toutes les fonctionnalités Essentiel incluses
              </h2>
              <p className="text-muted-foreground">
                Le plan Pro inclut l'ensemble des fonctionnalités du plan Essentiel.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {baseFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 bg-card rounded-lg p-4 border border-border"
                >
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pro Features */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Équipements connectés inclus
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Automatisez vos contrôles avec des équipements professionnels fournis et installés.
            </p>
          </div>

          <div
            ref={featuresRef}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {proFeatures.map((feature, index) => (
              <div
                key={feature.name}
                className={`bg-card rounded-2xl p-6 border-2 border-primary/20 shadow-card transition-all duration-500 ${
                  featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {feature.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Guarantee */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={equipmentRef}
            className={`max-w-4xl mx-auto transition-all duration-700 ${
              equipmentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Service et garantie inclus
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {equipmentDetails.map((detail) => (
                <div
                  key={detail.title}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-4">
                    <detail.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {detail.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {detail.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
            Passez à l'automatisation complète
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Profitez de 3 mois d'essai gratuit, sans engagement. Configuration en 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={APP_URL}>
              <Button variant="accent" size="xl">
                Essayer 3 mois gratuits
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
            <Link to="/demander-demo">
              <Button
                size="xl"
                className="bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground/20 hover:bg-primary-foreground/20"
              >
                Demander une démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlanPro;