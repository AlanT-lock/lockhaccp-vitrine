import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Tag, Printer, QrCode, Calendar, Edit, Wifi, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { APP_URL } from "@/lib/links";

const FeatureLabels = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: demoRef, isVisible: demoVisible } = useScrollAnimation();

  const keyFeatures = [
    {
      icon: Edit,
      title: "Création rapide",
      description: "Créez vos étiquettes en quelques clics avec des modèles personnalisables."
    },
    {
      icon: Printer,
      title: "Impression directe",
      description: "Envoyez vos étiquettes directement vers votre étiqueteuse connectée."
    },
    {
      icon: Calendar,
      title: "DLC automatique",
      description: "Calculez automatiquement les DLC/DDM selon vos règles de conservation."
    },
    {
      icon: QrCode,
      title: "QR Code intégré",
      description: "Ajoutez des QR codes pour une traçabilité optimale de vos productions."
    },
    {
      icon: Tag,
      title: "Multi-formats",
      description: "Adaptez vos étiquettes à différentes tailles et types de conditionnement."
    },
    {
      icon: Wifi,
      title: "Étiqueteuses compatibles",
      description: "Compatible avec les principales marques d'étiqueteuses professionnelles."
    }
  ];

  const labelInfo = [
    { label: "Produit", value: "Sauce bolognaise maison" },
    { label: "Date de production", value: "12/01/2025" },
    { label: "DLC", value: "15/01/2025" },
    { label: "Lot", value: "LOT-2025-0112-001" },
    { label: "Allergènes", value: "Gluten, Céleri" },
    { label: "Conservation", value: "0°C à 4°C" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Étiquettes de production HACCP - LockHACCP" description="Imprimez vos étiquettes de production en un instant. Dates de fabrication, DLC, allergènes : tout est automatique." path="/fonctionnalites/etiquettes" />
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
              <Tag className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Création d'étiquettes</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Créez et imprimez vos <span className="text-primary">étiquettes</span> en un instant
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Générez des étiquettes conformes pour toutes vos productions et envoyez-les 
              directement vers votre étiqueteuse connectée.
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
              Des étiquettes professionnelles en quelques clics
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce qu'il vous faut pour étiqueter vos productions conformément aux normes.
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

      {/* Demo Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div 
              ref={demoRef}
              className={`order-2 lg:order-1 transition-all duration-700 ${
                demoVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
              }`}
            >
              {/* Label Preview */}
              <div className="bg-card rounded-2xl p-6 shadow-card border-2 border-dashed border-border">
                <div className="bg-background rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xs">LH</span>
                      </div>
                      <span className="font-heading font-bold text-sm text-foreground">LockHACCP</span>
                    </div>
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {labelInfo.map((item, index) => (
                      <div 
                        key={item.label}
                        className={`flex justify-between text-sm transition-all duration-500 ${
                          demoVisible ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ transitionDelay: `${400 + index * 75}ms` }}
                      >
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Aperçu de l'étiquette générée
                </p>
              </div>
            </div>

            <div className={`order-1 lg:order-2 transition-all duration-700 ${
              demoVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Étiquettes conformes <span className="text-secondary">automatiquement</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Renseignez le produit, LockHACCP calcule automatiquement la DLC selon vos règles 
                et génère une étiquette complète avec toutes les mentions obligatoires.
              </p>

              <div className="space-y-4">
                {[
                  "Calcul automatique des DLC/DDM",
                  "Mentions obligatoires intégrées",
                  "Gestion des allergènes",
                  "QR code de traçabilité",
                  "Impression en un clic"
                ].map((item, index) => (
                  <div 
                    key={item}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      demoVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                    }`}
                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Printers Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              Compatible avec les principales étiqueteuses
            </h3>
            <p className="text-muted-foreground">
              DYMO, Brother, Zebra, et bien d'autres...
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            {["DYMO", "Brother", "Zebra", "TSC", "Epson"].map((brand) => (
              <span key={brand} className="text-xl font-heading font-bold text-muted-foreground">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 lg:p-16 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Simplifiez l'étiquetage de vos productions
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Essayez LockHACCP et créez vos premières étiquettes en quelques minutes.
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

export default FeatureLabels;
