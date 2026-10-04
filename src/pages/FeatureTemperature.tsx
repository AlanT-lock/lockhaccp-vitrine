import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RelatedLinks, FEATURE_RELATED } from "@/components/RelatedLinks";
import { Button } from "@/components/ui/button";
import { ArrowRight, Thermometer, Bell, BarChart3, Shield, Clock, Smartphone, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import temperaturesImg from "@/assets/screenshots/temperatures.webp";
import temperaturesImgPetit from "@/assets/screenshots/temperatures-petit.webp";
import { Seo } from "@/components/Seo";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { APP_URL } from "@/lib/links";
const FeatureTemperature = () => {
  const {
    ref: heroRef,
    isVisible: heroVisible
  } = useScrollAnimation();
  const {
    ref: featuresRef,
    isVisible: featuresVisible
  } = useScrollAnimation();
  const {
    ref: sensorsRef,
    isVisible: sensorsVisible
  } = useScrollAnimation();
  const keyFeatures = [{
    icon: Bell,
    title: "Rappel chaque matin",
    description: "Une notification vous rappelle les relevés du jour, selon vos jours d'ouverture et vos services."
  }, {
    icon: Thermometer,
    title: "Une consigne par équipement",
    description: "Chaque frigo, chambre froide ou congélateur a sa consigne : l'application indique tout de suite si le relevé est conforme."
  }, {
    icon: Shield,
    title: "Action corrective notée",
    description: "En cas d'écart, vous indiquez ce qui a été fait. C'est exactement ce que l'inspecteur veut voir."
  }, {
    icon: BarChart3,
    title: "Historique complet",
    description: "Retrouvez tous les relevés de chaque équipement, avec la date, l'heure et la personne qui l'a saisi."
  }, {
    icon: Clock,
    title: "Rapport hebdomadaire",
    description: "Chaque semaine, un récapitulatif par e-mail des contrôles faits et de ceux qui manquent."
  }, {
    icon: Smartphone,
    title: "Sur téléphone et tablette",
    description: "Le relevé se fait en quelques secondes devant l'équipement, sans fiche papier à remplir."
  }];
  const sensorBenefits = ["Plus de fiche papier oubliée", "Consigne affichée à chaque relevé", "Écart signalé tout de suite", "Action corrective tracée", "Historique prêt pour le contrôle", "Accès pour chaque membre de l'équipe"];
  return <div className="min-h-screen bg-background">
      <Seo title="Relevé de température HACCP sur téléphone - LockHACCP" description="Relevé de température HACCP de vos frigos et congélateurs sur téléphone : rappel chaque matin, consigne par équipement, actions correctives, historique pour la DDPP." path="/fonctionnalites/temperatures" jsonLd={breadcrumbJsonLd([{name:"Accueil",path:"/"},{name:"Fonctionnalités",path:"/"},{name:"Températures",path:"/fonctionnalites/temperatures"}])} />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div ref={heroRef} className={`transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/10 mb-6">
                <Thermometer className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Relevé de températures</span>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Relevez vos <span className="text-primary">températures</span> en quelques secondes
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Fini les fiches papier : chaque relevé de vos réfrigérateurs et congélateurs se fait sur
                téléphone, avec la consigne affichée et un rappel chaque matin.
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
              <img src={temperaturesImg} srcSet={`${temperaturesImgPetit} 480w, ${temperaturesImg} 768w`} sizes="(min-width: 640px) 384px, calc(100vw - 2rem)" alt="Application LockHACCP - Relevé de températures" width={384} height={831} {...{ fetchpriority: "high" }} className="max-w-sm w-full h-auto drop-shadow-2xl rounded-3xl shadow-2xl opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={featuresRef} className={`text-center mb-16 transition-all duration-700 ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tout ce dont vous avez besoin pour le suivi des températures
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pensé pour la cuisine : rapide à saisir, simple à montrer lors d'un contrôle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return <div key={feature.title} className={`bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 border border-border hover:border-primary/20 ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{
              transitionDelay: `${index * 100}ms`
            }}>
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
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

      {/* Sensors Integration Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div ref={sensorsRef} className={`transition-all duration-700 ${sensorsVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-light text-secondary-texte font-medium text-sm mb-4">
                Au quotidien
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Un relevé en <span className="text-secondary-texte">quelques secondes</span>, devant l&apos;équipement
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Vous saisissez la température lue, l'application la compare à la consigne de l'équipement
                et, en cas d'écart, vous demande ce qui a été fait. Tout est daté et signé, prêt à être
                montré à l'inspecteur.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {sensorBenefits.map((benefit, index) => <div key={benefit} className={`flex items-center gap-2 transition-all duration-500 ${sensorsVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`} style={{
                transitionDelay: `${300 + index * 75}ms`
              }}>
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>)}
              </div>
            </div>

            <div className={`relative transition-all duration-700 ${sensorsVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
              <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <Thermometer className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-lg">Relevé du matin</p>
                    <p className="text-sm text-primary-foreground/70">Chambre froide positive</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-primary-foreground/10 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-primary-foreground/70">Température relevée</span>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full">Conforme</span>
                    </div>
                    <p className="text-4xl font-heading font-bold">3,2 °C</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-foreground/10 rounded-xl p-4">
                      <p className="text-xs text-primary-foreground/70 mb-1">Consigne min</p>
                      <p className="text-xl font-bold">0°C</p>
                    </div>
                    <div className="bg-primary-foreground/10 rounded-xl p-4">
                      <p className="text-xs text-primary-foreground/70 mb-1">Consigne max</p>
                      <p className="text-xl font-bold">4°C</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-primary-foreground/50 text-center">
                    Saisi à 8 h 12 par le chef de cuisine
                  </p>
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
              Prêt à digitaliser vos relevés de température ?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Commencez gratuitement et découvrez comment LockHACCP peut simplifier votre quotidien.
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

      <RelatedLinks items={[...FEATURE_RELATED.temperatures]} />
      <Footer />
    </div>;
};
export default FeatureTemperature;