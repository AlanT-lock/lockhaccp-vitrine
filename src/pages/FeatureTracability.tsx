import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileSearch, QrCode, History, Search, FileText, Shield, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { APP_URL } from "@/lib/links";

const FeatureTracability = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollAnimation();

  const keyFeatures = [
    {
      icon: QrCode,
      title: "Scan de codes-barres",
      description: "Scannez les codes-barres et QR codes pour identifier instantanément l'origine et le parcours des produits."
    },
    {
      icon: History,
      title: "Historique complet",
      description: "Retrouvez l'historique de chaque produit : date de réception, fournisseur, lot, conditions de stockage."
    },
    {
      icon: Search,
      title: "Recherche instantanée",
      description: "Recherchez un produit par numéro de lot, date ou fournisseur en quelques secondes."
    },
    {
      icon: FileText,
      title: "Export de données",
      description: "Exportez vos données de traçabilité en PDF ou Excel pour les contrôles sanitaires."
    },
    {
      icon: Shield,
      title: "Rappel produit facilité",
      description: "En cas de rappel produit, identifiez immédiatement les lots concernés et leur destination."
    },
    {
      icon: FileSearch,
      title: "Audit trail",
      description: "Gardez une trace de toutes les modifications avec horodatage et identification utilisateur."
    }
  ];

  const benefits = [
    {
      title: "Répondez aux contrôles en quelques minutes",
      description: "Lors d'un contrôle sanitaire, retrouvez instantanément l'origine de n'importe quel produit sans chercher dans des classeurs."
    },
    {
      title: "Gérez les rappels produits efficacement",
      description: "En cas d'alerte sanitaire, identifiez immédiatement les lots concernés et prenez les mesures appropriées."
    },
    {
      title: "Renforcez la confiance de vos clients",
      description: "Montrez à vos clients que vous maîtrisez parfaitement l'origine et la qualité de vos produits."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Traçabilité alimentaire HACCP - LockHACCP" description="Suivez l'origine de chaque produit. Numéros de lots, DLC, fournisseurs : la traçabilité totale en un clic." path="/fonctionnalites/tracabilite" />
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
              <FileSearch className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Traçabilité produits</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Une <span className="text-primary">traçabilité</span> complète et instantanée
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Suivez l'origine et le parcours de tous vos produits. 
              De la réception à l'assiette, maîtrisez votre chaîne d'approvisionnement.
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
              Outils de traçabilité puissants
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce qu'il vous faut pour assurer une traçabilité irréprochable de vos produits.
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
            className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${
              benefitsVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-8">
                Pourquoi la traçabilité est <span className="text-secondary">essentielle</span> ?
              </h2>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit.title}
                    className={`flex gap-4 transition-all duration-500 ${
                      benefitsVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`bg-muted rounded-2xl p-8 transition-all duration-700 ${
              benefitsVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}>
              <div className="space-y-4">
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <QrCode className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Lot #2024-1234</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Produit</p>
                      <p className="font-medium text-foreground">Saumon frais</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Origine</p>
                      <p className="font-medium text-foreground">Norvège</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fournisseur</p>
                      <p className="font-medium text-foreground">Océan Frais</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">DLC</p>
                      <p className="font-medium text-foreground">18/01/2025</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-xl p-4 border border-border">
                  <p className="text-sm font-medium text-foreground mb-2">Historique</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Réception</span>
                      <span className="text-foreground">12/01/2025 - 08:32</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temp. réception</span>
                      <span className="text-green-600">2.1°C ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stockage</span>
                      <span className="text-foreground">Chambre froide A</span>
                    </div>
                  </div>
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
              Maîtrisez votre traçabilité dès aujourd'hui
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Rejoignez les professionnels qui font confiance à LockHACCP pour leur traçabilité.
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

export default FeatureTracability;
