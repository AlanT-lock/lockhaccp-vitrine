import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Headphones, RefreshCw, Thermometer, Printer, Tablet } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { APP_URL } from "@/lib/links";

const Pricing = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: plansRef, isVisible: plansVisible } = useScrollAnimation();
  const { ref: optionsRef, isVisible: optionsVisible } = useScrollAnimation();

  const plans = [
    {
      id: "essentiel",
      name: "Essentiel",
      description: "Pour un restaurant individuel",
      price: "14,90€",
      features: [
        "Relevé de température (avec rappel)",
        "Contrôle à réception",
        "Traçabilité",
        "Plan de nettoyage (avec rappel)",
        "T° produit (refroidissement, congélation, réchauffement)",
        "Huile de friture",
        "CheckList personnalisée",
      ],
      highlighted: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Tout l'Essentiel + automatisations",
      price: "29,90€",
      features: [
        "Toutes les fonctionnalités Essentiel",
        "Support client prioritaire",
        "Notifications de rappels avancées",
        "Rapports hebdomadaires automatiques",
        "Compatible équipements connectés",
      ],
      highlighted: true,
    },
    {
      id: "entreprise",
      name: "Entreprise",
      description: "Multi-établissements",
      price: "Sur devis",
      features: [
        "Toutes les fonctionnalités Pro",
        "Solution multi-restaurants",
        "Tableaux de bord consolidés",
        "Accompagnement personnalisé",
      ],
      highlighted: false,
    },
  ];

  const additionalOptions = [
    {
      icon: Thermometer,
      name: "Capteurs de température connectés",
      description: "Surveillez vos enceintes froides 24h/24 avec alertes automatiques",
      includes: [
        "Installation et configuration incluses",
        "SAV réactif sous 24h",
        "Remplacement rapide en cas de panne",
        "Mises à jour automatiques",
      ],
    },
    {
      icon: Printer,
      name: "Étiqueteuse connectée",
      description: "Imprimez vos étiquettes de production directement depuis l'application",
      includes: [
        "Imprimante professionnelle incluse",
        "Configuration et formation",
        "SAV réactif sous 24h",
        "Remplacement express en cas de panne",
      ],
    },
    {
      icon: Tablet,
      name: "Tablette avec protection",
      description: "Tablette professionnelle résistante pour une utilisation en cuisine",
      includes: [
        "Tablette préconfigurée",
        "Protection renforcée incluse",
        "SAV réactif sous 24h",
        "Remplacement express en cas de panne",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Tarifs - LockHACCP" description="À partir de 14,90€/mois. Essai gratuit 3 mois sans engagement. Plan Essentiel pour 1 restaurant, plan Pro avec automatisations." path="/tarifs" />
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
            {/* Trial Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <span className="text-sm font-semibold text-secondary">🎉 Essai gratuit de 3 mois</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Des tarifs adaptés à <span className="text-primary">votre établissement</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Commencez gratuitement pendant 3 mois, sans engagement. Découvrez toutes les fonctionnalités et choisissez l'offre qui vous convient.
            </p>
            <Link to="/demander-demo">
              <Button variant="hero" size="xl">
                Demander une démo gratuite
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={plansRef}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 transition-all duration-500 flex flex-col ${
                  plansVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                } ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground shadow-xl lg:scale-105 border-2 border-secondary z-10"
                    : "bg-card border border-border shadow-card"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full whitespace-nowrap">
                    Le plus populaire
                  </div>
                )}
                
                <Link to={plan.id !== "entreprise" ? `/tarifs/${plan.id}` : "/contact"}>
                  <h3 className={`font-heading text-xl font-bold mb-2 hover:underline ${
                    plan.highlighted ? "text-primary-foreground" : "text-foreground"
                  }`}>
                    {plan.name}
                  </h3>
                </Link>
                <p className={`text-sm mb-4 ${
                  plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                  {plan.description}
                </p>
                
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${
                    plan.highlighted ? "text-primary-foreground" : "text-foreground"
                  }`}>
                    {plan.price}
                  </span>
                  {plan.price !== "Sur devis" && (
                    <span className={`text-sm ${
                      plan.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"
                    }`}>
                      /mois
                    </span>
                  )}
                </div>

                {plan.engagement && (
                  <p className={`text-xs mb-4 p-2 rounded-lg ${
                    plan.highlighted ? "bg-primary-foreground/10 text-primary-foreground/80" : "bg-muted text-muted-foreground"
                  }`}>
                    {plan.engagement}
                  </p>
                )}

                <ul className="space-y-2 mb-6 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? "text-secondary" : "text-primary"
                      }`} />
                      <span className={`text-sm ${
                        plan.highlighted ? "text-primary-foreground/90" : "text-muted-foreground"
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.id === "entreprise" ? (
                  <Link to="/contact-entreprise" className="mt-auto">
                    <Button className="w-full" variant="outline">
                      Nous contacter
                    </Button>
                  </Link>
                ) : (
                  <a href={APP_URL} className="mt-auto">
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "accent" : "outline"}
                    >
                      Essayer 3 mois gratuits
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Options */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Options équipements connectés
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Automatisez encore plus vos contrôles avec nos équipements connectés. 
              SAV inclus et remplacement rapide garantis.
            </p>
          </div>

          <div 
            ref={optionsRef}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {additionalOptions.map((option, index) => (
              <div
                key={option.name}
                className={`bg-card rounded-2xl p-6 border border-border shadow-card transition-all duration-500 ${
                  optionsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                  <option.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {option.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {option.description}
                </p>

                <ul className="space-y-2 mb-4">
                  {option.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/demander-demo">
                  <Button variant="outline" className="w-full" size="sm">
                    En savoir plus
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Service Guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-8 flex-wrap justify-center">
              <div className="flex items-center gap-3">
                <Headphones className="w-6 h-6 text-primary" />
                <span className="text-foreground font-medium">SAV réactif inclus</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-primary" />
                <span className="text-foreground font-medium">Remplacement rapide en cas de panne</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
            Prêt à simplifier votre conformité HACCP ?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Profitez de 3 mois d'essai gratuit et découvrez comment LockHACCP peut transformer votre quotidien.
          </p>
          <Link to="/demander-demo">
            <Button variant="accent" size="xl">
              Demander une démo gratuite
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;