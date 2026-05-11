import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Calendar, Bell, Users, CheckSquare, BarChart3, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import nettoyageImg from "@/assets/screenshots/nettoyage.png";
import { Seo } from "@/components/Seo";
import { APP_URL } from "@/lib/links";
const FeatureCleaning = () => {
  const {
    ref: heroRef,
    isVisible: heroVisible
  } = useScrollAnimation();
  const {
    ref: featuresRef,
    isVisible: featuresVisible
  } = useScrollAnimation();
  const {
    ref: demoRef,
    isVisible: demoVisible
  } = useScrollAnimation();
  const keyFeatures = [{
    icon: Calendar,
    title: "Planning personnalisé",
    description: "Créez votre plan de nettoyage adapté à votre établissement avec fréquences et zones définies."
  }, {
    icon: Bell,
    title: "Rappels automatiques",
    description: "Recevez des notifications pour ne jamais oublier une tâche de nettoyage planifiée."
  }, {
    icon: Users,
    title: "Attribution des tâches",
    description: "Assignez les tâches à vos équipes et suivez qui a effectué chaque nettoyage."
  }, {
    icon: CheckSquare,
    title: "Validation simple",
    description: "Validez les nettoyages effectués en un clic avec signature électronique."
  }, {
    icon: BarChart3,
    title: "Suivi de conformité",
    description: "Visualisez le taux de réalisation de votre plan de nettoyage sur des tableaux de bord."
  }, {
    icon: Sparkles,
    title: "Fiches techniques",
    description: "Accédez aux protocoles de nettoyage et fiches produits directement depuis l'application."
  }];
  const zones = [{
    name: "Cuisine",
    progress: 100,
    status: "Terminé"
  }, {
    name: "Chambre froide",
    progress: 100,
    status: "Terminé"
  }, {
    name: "Salle",
    progress: 75,
    status: "En cours"
  }, {
    name: "Sanitaires",
    progress: 0,
    status: "À faire"
  }];
  return <div className="min-h-screen bg-background">
      <Seo title="Plan de nettoyage HACCP - LockHACCP" description="Planifiez et suivez vos tâches de nettoyage. Rappels, validation, historique pour les contrôles sanitaires." path="/fonctionnalites/nettoyage" />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div ref={heroRef} className={`transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-light border border-secondary/10 mb-6">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">Plan de nettoyage</span>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Un <span className="text-primary">plan de nettoyage</span> toujours à jour
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Planifiez, suivez et validez toutes vos opérations de nettoyage. 
                Gardez une trace irréprochable pour les contrôles sanitaires.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
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

            <div className={`relative flex justify-center transition-all duration-700 ${heroVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
              <img src={nettoyageImg} alt="Application LockHACCP - Plan de nettoyage" className="max-w-sm w-full h-auto drop-shadow-2xl shadow-2xl rounded-3xl opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={featuresRef} className={`text-center mb-16 transition-all duration-700 ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Gérez votre plan de nettoyage efficacement
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des outils pensés pour simplifier le quotidien de vos équipes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return <div key={feature.title} className={`bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 border border-border hover:border-secondary/20 ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{
              transitionDelay: `${index * 100}ms`
            }}>
                  <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div ref={demoRef} className={`transition-all duration-700 ${demoVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Visualisez l'avancement en <span className="text-secondary">temps réel</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Suivez la progression du plan de nettoyage par zone et par équipe. 
                Identifiez rapidement les tâches en retard et réagissez en conséquence.
              </p>
              
              <div className="space-y-3">
                {["Vision claire de l'avancement quotidien", "Alertes en cas de tâches non réalisées", "Historique consultable à tout moment", "Rapports pour les contrôles sanitaires"].map((item, index) => <div key={item} className={`flex items-center gap-3 transition-all duration-500 ${demoVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`} style={{
                transitionDelay: `${300 + index * 100}ms`
              }}>
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>)}
              </div>
            </div>

            <div className={`bg-card rounded-2xl p-6 shadow-card border border-border transition-all duration-700 ${demoVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-foreground">Plan de nettoyage</h3>
                <span className="text-sm text-muted-foreground">Aujourd'hui</span>
              </div>
              
              <div className="space-y-4">
                {zones.map((zone, index) => <div key={zone.name} className={`transition-all duration-500 ${demoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{
                transitionDelay: `${400 + index * 100}ms`
              }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{zone.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${zone.progress === 100 ? "bg-green-100 text-green-700" : zone.progress > 0 ? "bg-secondary-light text-secondary" : "bg-muted text-muted-foreground"}`}>
                        {zone.status}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${zone.progress === 100 ? "bg-green-500" : "bg-secondary"}`} style={{
                    width: demoVisible ? `${zone.progress}%` : "0%",
                    transitionDelay: `${600 + index * 150}ms`
                  }} />
                    </div>
                  </div>)}
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progression globale</span>
                  <span className="text-2xl font-heading font-bold text-primary">69%</span>
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
              Digitalisez votre plan de nettoyage
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Fini les fiches papier perdues. Passez au digital avec LockHACCP.
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
    </div>;
};
export default FeatureCleaning;