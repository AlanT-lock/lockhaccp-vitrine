import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplets, Gauge, History, AlertTriangle, FileText, TrendingDown, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { APP_URL } from "@/lib/links";

const FeatureOil = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();

  const keyFeatures = [
    {
      icon: Gauge,
      title: "Enregistrement des tests",
      description: "Enregistrez les résultats de vos tests polaires avec seuils de conformité personnalisables."
    },
    {
      icon: History,
      title: "Suivi de l'historique",
      description: "Consultez l'évolution de la qualité de chaque bain d'huile dans le temps."
    },
    {
      icon: AlertTriangle,
      title: "Alertes de changement",
      description: "Recevez des alertes lorsque l'huile approche du seuil de remplacement."
    },
    {
      icon: FileText,
      title: "Rapports de conformité",
      description: "Générez des rapports prouvant le suivi régulier de vos huiles de friture."
    },
    {
      icon: TrendingDown,
      title: "Analyse des coûts",
      description: "Suivez la durée de vie de vos huiles et optimisez vos coûts de remplacement."
    },
    {
      icon: Droplets,
      title: "Multi-friteuses",
      description: "Gérez plusieurs friteuses avec identification claire de chaque équipement."
    }
  ];

  const regulations = [
    {
      title: "Seuil réglementaire",
      value: "25%",
      description: "Taux de composés polaires maximum autorisé"
    },
    {
      title: "Fréquence recommandée",
      value: "Quotidien",
      description: "Test à effectuer chaque jour d'utilisation"
    },
    {
      title: "Archivage",
      value: "5 ans",
      description: "Durée de conservation des registres"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Suivi de l'huile de friture - LockHACCP" description="Contrôlez la qualité de votre huile de friture. Mesures, alertes, historique conforme aux exigences sanitaires." path="/fonctionnalites/huiles" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/10 mb-6">
              <Droplets className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Contrôle huiles de friture</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Maîtrisez la qualité de vos <span className="text-primary">huiles de friture</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Testez, enregistrez et suivez la conformité de vos huiles de friture. 
              Restez en règle avec la réglementation et optimisez vos coûts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={APP_URL}>
                <Button variant="hero" size="xl">
                  Essayer gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/demander-demo">
                <Button variant="heroOutline" size="xl">
                  Demander une démo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Regulations Section */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {regulations.map((reg, index) => (
              <div 
                key={reg.title}
                className="text-center text-primary-foreground"
              >
                <p className="text-4xl font-heading font-bold mb-2">{reg.value}</p>
                <p className="font-medium mb-1">{reg.title}</p>
                <p className="text-sm text-primary-foreground/70">{reg.description}</p>
              </div>
            ))}
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
              Un suivi complet de vos huiles de friture
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              De l'enregistrement du test à la génération du rapport, tout est simplifié.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 border border-border hover:border-primary/20 ${
                    featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
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

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={benefitsRef}
            className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          >
            <div className={`transition-all duration-700 ${
              benefitsVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Pourquoi contrôler vos <span className="text-secondary">huiles de friture</span> ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Au-delà de l'obligation réglementaire, le contrôle régulier des huiles de friture 
                garantit la qualité de vos produits et la santé de vos clients.
              </p>

              <div className="space-y-4">
                {[
                  "Conformité à la réglementation HACCP",
                  "Prévention des risques pour la santé",
                  "Amélioration du goût des produits frits",
                  "Optimisation des coûts de remplacement",
                  "Traçabilité complète pour les contrôles"
                ].map((item, index) => (
                  <div 
                    key={item}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      benefitsVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}
                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`bg-card rounded-2xl p-6 shadow-card border border-border transition-all duration-700 ${
              benefitsVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}>
              <h3 className="font-heading font-bold text-foreground mb-6">Dernier test enregistré</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div>
                    <p className="font-medium text-foreground">Friteuse #1</p>
                    <p className="text-sm text-muted-foreground">Test du 12/01/2025</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-heading font-bold text-green-600">18%</p>
                    <p className="text-xs text-green-600">Conforme</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-secondary-light rounded-xl border border-secondary/20">
                  <div>
                    <p className="font-medium text-foreground">Friteuse #2</p>
                    <p className="text-sm text-muted-foreground">Test du 12/01/2025</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-heading font-bold text-secondary">22%</p>
                    <p className="text-xs text-secondary">Surveillance</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Prochains changements prévus</p>
                  <p className="font-medium text-foreground">Friteuse #2 : dans ~3 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 lg:p-16 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Simplifiez le contrôle de vos huiles
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Essayez LockHACCP gratuitement et digitalisez vos contrôles d'huile de friture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={APP_URL}>
                <Button variant="accent" size="xl">
                  Démarrer l'essai gratuit
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/">
                <Button variant="heroOutline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeatureOil;
