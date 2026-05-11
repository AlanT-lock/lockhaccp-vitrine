import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardCheck, Settings, Users, Bell, BarChart3, FileText, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { APP_URL } from "@/lib/links";

const FeatureChecklist = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: customRef, isVisible: customVisible } = useScrollAnimation();

  const keyFeatures = [
    {
      icon: Settings,
      title: "100% personnalisable",
      description: "Créez des checklists adaptées aux spécificités de votre établissement et de vos points de contrôle."
    },
    {
      icon: Users,
      title: "Attribution par rôle",
      description: "Assignez les checklists aux membres de l'équipe selon leurs responsabilités."
    },
    {
      icon: Bell,
      title: "Rappels intelligents",
      description: "Recevez des notifications aux heures définies pour ne jamais oublier un contrôle."
    },
    {
      icon: BarChart3,
      title: "Suivi de conformité",
      description: "Visualisez le taux de complétion et identifiez les points d'amélioration."
    },
    {
      icon: FileText,
      title: "Rapports automatiques",
      description: "Générez des rapports de synthèse pour vos contrôles internes et externes."
    },
    {
      icon: ClipboardCheck,
      title: "Validation rapide",
      description: "Complétez vos checklists en quelques clics depuis n'importe quel appareil."
    }
  ];

  const checklistExamples = [
    {
      title: "Ouverture",
      items: [
        { name: "Vérifier les températures des chambres froides", checked: true },
        { name: "Contrôler les dates des produits", checked: true },
        { name: "Vérifier la propreté des surfaces", checked: true },
        { name: "Contrôler le fonctionnement des équipements", checked: false },
      ]
    },
    {
      title: "Fermeture",
      items: [
        { name: "Nettoyer les plans de travail", checked: false },
        { name: "Ranger les produits entamés", checked: false },
        { name: "Vider les poubelles", checked: false },
        { name: "Vérifier les températures de conservation", checked: false },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Check-lists personnalisées - LockHACCP" description="Créez vos propres check-lists d'ouverture, fermeture, contrôles. Suivez l'avancement en temps réel." path="/fonctionnalites/checklist" />
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
              <ClipboardCheck className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Checklist personnalisée</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Des <span className="text-primary">checklists</span> adaptées à votre établissement
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Créez des checklists sur mesure pour tous vos points de contrôle. 
              Ouverture, fermeture, service... ne laissez rien au hasard.
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
              Des checklists pensées pour votre quotidien
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexibles, intuitives et toujours accessibles pour vos équipes.
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

      {/* Custom Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div 
              ref={customRef}
              className={`transition-all duration-700 ${
                customVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
              }`}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Adaptez les contrôles à <span className="text-secondary">votre réalité</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Chaque restaurant est unique. LockHACCP vous permet de créer des checklists 
                qui correspondent exactement à vos besoins et aux exigences de votre plan HACCP.
              </p>

              <div className="space-y-4">
                {[
                  "Checklists d'ouverture et de fermeture",
                  "Contrôles spécifiques par poste de travail",
                  "Vérifications lors des changements d'équipe",
                  "Audits internes personnalisés",
                  "Points de contrôle critiques (CCP)"
                ].map((item, index) => (
                  <div 
                    key={item}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      customVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}
                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`space-y-4 transition-all duration-700 ${
              customVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}>
              {checklistExamples.map((checklist, idx) => (
                <div 
                  key={checklist.title}
                  className="bg-card rounded-2xl p-6 shadow-card border border-border"
                  style={{ transitionDelay: `${idx * 200}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-bold text-foreground">{checklist.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {checklist.items.filter(i => i.checked).length}/{checklist.items.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {checklist.items.map((item, index) => (
                      <div 
                        key={item.name}
                        className={`flex items-center gap-3 transition-all duration-500 ${
                          customVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                        }`}
                        style={{ transitionDelay: `${400 + idx * 200 + index * 75}ms` }}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          item.checked 
                            ? "bg-primary border-primary" 
                            : "border-border"
                        }`}>
                          {item.checked && (
                            <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm ${item.checked ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 lg:p-16 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Créez vos checklists personnalisées
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Commencez gratuitement et adaptez LockHACCP à vos besoins spécifiques.
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

export default FeatureChecklist;
