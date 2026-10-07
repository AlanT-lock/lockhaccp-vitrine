import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RelatedLinks, FEATURE_RELATED } from "@/components/RelatedLinks";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Thermometer, Calendar, Camera, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { ContenuFonctionnalite } from "@/components/ContenuFonctionnalite";
import { CONTENUS } from "@/lib/contenus-fonctionnalites";
import { faqJsonLd } from "@/lib/seo-jsonld";
import { APP_URL } from "@/lib/links";

const FeatureReception = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: processRef, isVisible: processVisible } = useScrollAnimation();

  const keyFeatures = [
    {
      icon: Thermometer,
      title: "Contrôle température",
      description: "Vérifiez la température des produits à réception avec seuils personnalisables par type de marchandise."
    },
    {
      icon: Calendar,
      title: "Vérification DLC/DDM",
      description: "Contrôlez les dates limites de consommation et recevez des alertes pour les produits proches de l'échéance."
    },
    {
      icon: Camera,
      title: "Photos justificatives",
      description: "Prenez des photos en cas d'anomalie pour documenter les non-conformités et les retours fournisseurs."
    },
    {
      icon: FileText,
      title: "Traçabilité fournisseur",
      description: "Enregistrez les numéros de lot, l'origine des produits et les informations du bon de livraison."
    },
    {
      icon: AlertTriangle,
      title: "Gestion des refus",
      description: "Documentez les refus de marchandises avec motif et photo pour vos échanges avec les fournisseurs."
    },
    {
      icon: CheckCircle,
      title: "Validation rapide",
      description: "Validez une réception conforme en quelques clics avec un formulaire optimisé pour la rapidité."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Réception de la livraison",
      description: "Le livreur arrive, vous ouvrez LockHACCP sur votre smartphone ou tablette pour démarrer le contrôle."
    },
    {
      step: "02",
      title: "Contrôle des produits",
      description: "Vérifiez température, DLC, état des emballages et conformité visuelle pour chaque catégorie de produits."
    },
    {
      step: "03",
      title: "Validation ou refus",
      description: "Validez la réception si tout est conforme, ou documentez les anomalies avec photos et commentaires."
    },
    {
      step: "04",
      title: "Archivage automatique",
      description: "Le contrôle est automatiquement enregistré et accessible pour les contrôles sanitaires."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Contrôle à réception HACCP : conforme et rapide" description="Contrôle des marchandises HACCP en quelques clics : températures, photos de non-conformité, traçabilité fournisseurs automatique." path="/fonctionnalites/receptions" jsonLd={faqJsonLd(CONTENUS.receptions.faq.items)} />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={heroRef}
            className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
              heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-light border border-secondary/10 mb-6">
              <Package className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary-texte">Contrôle des réceptions</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Contrôlez chaque <span className="text-primary">réception</span> en toute simplicité
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ne laissez plus rien passer. Vérifiez la conformité de vos livraisons 
              et conservez une traçabilité complète de toutes vos réceptions.
            </p>
            
            <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <a href={APP_URL}>
                  Essayer gratuitement
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/demander-demo">
                  Demander une démo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={featuresRef}
            className={`text-center mb-16 transition-all duration-700 ${
              featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Un contrôle complet à chaque livraison
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tous les points de contrôle HACCP réunis dans une interface simple et intuitive.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 border border-border hover:border-secondary/20 ${
                    featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={processRef}
            className={`text-center mb-16 transition-all duration-700 ${
              processVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Un processus simple en <span className="text-primary">4 étapes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              De la réception à l'archivage, tout est pensé pour vous faire gagner du temps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={step.step}
                className={`relative transition-all duration-500 ${
                  processVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-6xl font-heading font-bold text-primary/10 mb-4">
                  {step.step}
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContenuFonctionnalite id="receptions" />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 lg:p-16 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Simplifiez vos contrôles de réception
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Essayez LockHACCP gratuitement et découvrez une nouvelle façon de gérer vos réceptions.
            </p>
            <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="xl" asChild>
                <a href={APP_URL}>
                  Démarrer l'essai gratuit
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <Button variant="heroOutline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/">
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <RelatedLinks items={[...FEATURE_RELATED.receptions]} />
      <Footer />
    </div>
  );
};

export default FeatureReception;
