import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, FileText, ScanLine, MessageCircle, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

const AIFeatures = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();

  const aiFeatures = [
    {
      icon: FileText,
      title: "Analyse automatique des bons de livraison",
      description: "Gagnez un temps précieux lors de vos réceptions de marchandises. Notre IA scanne et analyse automatiquement vos bons de livraison pour extraire les informations essentielles.",
      benefits: [
        "Numérisation instantanée des documents",
        "Extraction automatique des produits, quantités et prix",
        "Historique complet consultable à tout moment",
      ],
    },
    {
      icon: ScanLine,
      title: "Analyse des étiquettes produit",
      description: "Scannez simplement les étiquettes de vos produits pour relever automatiquement les informations critiques. Plus de saisie manuelle fastidieuse.",
      benefits: [
        "Reconnaissance des DLC (Date Limite de Consommation)",
        "Extraction des numéros de lot",
        "Traçabilité simplifiée et automatisée",
      ],
    },
    {
      icon: Bot,
      title: "Bot Expert HACCP intégré",
      description: "Posez vos questions à notre assistant IA spécialisé en HACCP. Il vous guide dans vos procédures et répond à toutes vos interrogations réglementaires.",
      benefits: [
        "Réponses instantanées 24h/24",
        "Base de connaissances HACCP complète",
        "Conseils personnalisés selon votre activité",
        "Mises à jour réglementaires automatiques",
      ],
    },
    {
      icon: MessageCircle,
      title: "Contact avec un expert humain",
      description: "Besoin d'un avis d'expert ? Nos spécialistes HACCP sont disponibles pour vous accompagner. Obtenez une réponse personnalisée en moins de 10 minutes.",
      benefits: [
        "Experts HACCP certifiés",
        "Réponse garantie sous 10 minutes",
        "Accompagnement personnalisé",
        "Disponible du lundi au samedi",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Intelligence artificielle pour la restauration - LockHACCP" description="Automatisations intelligentes pour la conformité HACCP : analyse prédictive, détection d'anomalies, rapports automatiques." path="/avantages-ia" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <Bot className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold text-secondary">Intelligence Artificielle</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
              L'IA au service de votre <span className="text-primary">conformité HACCP</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              LockHACCP intègre des fonctionnalités d'intelligence artificielle pour automatiser 
              vos tâches les plus chronophages et vous faire gagner un temps précieux au quotidien.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="xl">
                Découvrir en démo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={featuresRef} className="space-y-16">
            {aiFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${
                  featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="bg-card rounded-2xl p-8 border border-border shadow-card-hover">
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-20 h-20 text-primary/30" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Response Time */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 lg:p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-8">
              <Clock className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Réponse garantie sous 10 minutes
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Nos experts HACCP sont disponibles pour répondre à toutes vos questions. 
              Que ce soit pour une interrogation réglementaire ou un conseil pratique, 
              vous obtenez une réponse personnalisée en moins de 10 minutes.
            </p>
            <Link to="/contact">
              <Button variant="accent" size="xl">
                Demander une démo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIFeatures;
