import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RelatedLinks, FEATURE_RELATED } from "@/components/RelatedLinks";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Calendar, Bell, Users, CheckSquare, BarChart3, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import nettoyageImg from "@/assets/screenshots/nettoyage.webp";
import nettoyageImgPetit from "@/assets/screenshots/nettoyage-petit.webp";
import { Seo } from "@/components/Seo";
import { ContenuFonctionnalite } from "@/components/ContenuFonctionnalite";
import { CONTENUS } from "@/lib/contenus-fonctionnalites";
import { faqJsonLd } from "@/lib/seo-jsonld";
import { PlanningNettoyageExemple } from "@/components/PlanningNettoyageExemple";
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
    description: "Validez les nettoyages effectués en un clic : la tâche est datée et signée par la personne connectée."
  }, {
    icon: BarChart3,
    title: "Suivi de conformité",
    description: "Suivez ce qui a été fait et ce qui manque, dans l'application et dans le récapitulatif hebdomadaire."
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
      <Seo title="Planning de nettoyage cuisine HACCP" description="Planning de nettoyage cuisine sur téléphone : zones, fréquences, rappels chaque matin, tâches validées et signées. Un plan de nettoyage HACCP toujours à jour." path="/fonctionnalites/nettoyage" jsonLd={faqJsonLd(CONTENUS.nettoyage.faq.items)} />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div ref={heroRef} className={`transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-light border border-secondary/10 mb-6">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary-texte">Plan de nettoyage</span>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Votre <span className="text-primary">planning de nettoyage</span> cuisine, toujours à jour
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Planifiez, suivez et validez toutes vos opérations de nettoyage. 
                Gardez une trace irréprochable pour les contrôles sanitaires.
              </p>
              
              <div className="flex flex-col items-start sm:flex-row gap-4">
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

            <div className={`relative flex justify-center transition-all duration-700 ${heroVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
              <img src={nettoyageImg} srcSet={`${nettoyageImgPetit} 480w, ${nettoyageImg} 768w`} sizes="(min-width: 640px) 384px, calc(100vw - 2rem)" alt="Application LockHACCP - Plan de nettoyage" width={384} height={831} {...{ fetchpriority: "high" }} className="max-w-sm w-full h-auto drop-shadow-2xl shadow-2xl rounded-3xl opacity-80" />
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
                Voyez d'un coup d'œil <span className="text-secondary-texte">ce qui reste à faire</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Suivez la progression du plan de nettoyage par zone et par équipe. 
                Identifiez rapidement les tâches en retard et réagissez en conséquence.
              </p>
              
              <div className="space-y-3">
                {["Vision claire de l'avancement quotidien", "Rappel chaque matin des tâches du jour", "Historique consultable à tout moment", "Rapports pour les contrôles sanitaires"].map((item, index) => <div key={item} className={`flex items-center gap-3 transition-all duration-500 ${demoVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`} style={{
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
                      <span className={`text-xs px-2 py-1 rounded-full ${zone.progress === 100 ? "bg-green-100 text-green-700" : zone.progress > 0 ? "bg-secondary-light text-secondary-texte" : "bg-muted text-muted-foreground"}`}>
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

      <ContenuFonctionnalite id="nettoyage">
        <PlanningNettoyageExemple />
      </ContenuFonctionnalite>

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

      <RelatedLinks items={[...FEATURE_RELATED.nettoyage]} />
      <Footer />
    </div>;
};
export default FeatureCleaning;