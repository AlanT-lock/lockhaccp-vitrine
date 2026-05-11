import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Thermometer, ThermometerSnowflake, ClipboardCheck, Package, Sparkles, Clock, Calendar } from "lucide-react";
import { APP_URL } from "@/lib/links";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

const PlanEssentiel = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();

  const features = [
    {
      icon: Thermometer,
      name: "Relevé de température avec rappel",
      description: "Enregistrez les températures de vos enceintes froides avec des rappels automatiques pour ne jamais oublier un contrôle.",
      benefits: [
        "Rappels programmables",
        "Historique des relevés",
        "Alertes en cas d'anomalie",
      ],
    },
    {
      icon: Package,
      name: "Contrôle à réception (simple)",
      description: "Vérifiez facilement la conformité de vos livraisons : température, état des produits, DLC.",
      benefits: [
        "Formulaire de contrôle rapide",
        "Photos de non-conformités",
        "Historique des réceptions",
      ],
    },
    {
      icon: ClipboardCheck,
      name: "Traçabilité (simple)",
      description: "Suivez l'origine de vos produits et assurez une traçabilité de base conforme aux exigences HACCP.",
      benefits: [
        "Suivi des lots",
        "Historique consultable",
        "Export des données",
      ],
    },
    {
      icon: Calendar,
      name: "Plan de nettoyage avec rappel",
      description: "Planifiez et suivez vos opérations de nettoyage avec des rappels pour ne rien oublier.",
      benefits: [
        "Planning personnalisable",
        "Rappels automatiques",
        "Validation des tâches",
      ],
    },
    {
      icon: ThermometerSnowflake,
      name: "Température produit",
      description: "Suivez les températures de refroidissement, congélation et réchauffement de vos préparations.",
      benefits: [
        "Refroidissement rapide",
        "Congélation contrôlée",
        "Réchauffement sécurisé",
      ],
    },
    {
      icon: Sparkles,
      name: "Huile de friture",
      description: "Contrôlez la qualité de vos huiles de friture et respectez les seuils réglementaires.",
      benefits: [
        "Test de qualité",
        "Historique des changements",
        "Rappels de contrôle",
      ],
    },
    {
      icon: Clock,
      name: "CheckList personnalisée",
      description: "Créez vos propres checklists adaptées aux points de contrôle spécifiques de votre établissement.",
      benefits: [
        "100% personnalisable",
        "Validation quotidienne",
        "Suivi des actions",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Plan Essentiel à 14,90€/mois - LockHACCP" description="Le plan Essentiel LockHACCP : toutes les fonctionnalités HACCP de base pour un restaurant individuel à 14,90€/mois. Sans engagement." path="/tarifs/essentiel" />
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
              <span className="text-sm font-semibold text-primary">Plan Essentiel</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
              L'essentiel pour démarrer votre <span className="text-primary">conformité HACCP</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Idéal pour un restaurant individuel. Toutes les fonctionnalités de base pour digitaliser vos contrôles sanitaires.
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-4xl font-bold text-foreground">14,90€</span>
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

      {/* Features Detail */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Fonctionnalités incluses
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour assurer votre conformité HACCP au quotidien.
            </p>
          </div>

          <div
            ref={featuresRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`bg-card rounded-2xl p-6 border border-border shadow-card transition-all duration-500 ${
                  featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {feature.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
            Prêt à démarrer avec le plan Essentiel ?
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

export default PlanEssentiel;