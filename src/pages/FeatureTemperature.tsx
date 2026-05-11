import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Thermometer, Wifi, Bell, BarChart3, Shield, Clock, Smartphone, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import temperaturesImg from "@/assets/screenshots/temperatures.png";
import { Seo } from "@/components/Seo";
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
    icon: Wifi,
    title: "Capteurs connectés",
    description: "Intégrez des capteurs de température IoT pour un suivi automatique 24h/24 sans intervention manuelle."
  }, {
    icon: Bell,
    title: "Alertes instantanées",
    description: "Recevez des notifications SMS ou email en cas de dépassement des seuils critiques de température."
  }, {
    icon: BarChart3,
    title: "Historique complet",
    description: "Consultez l'évolution des températures sur des graphiques détaillés pour chaque équipement."
  }, {
    icon: Shield,
    title: "Conformité garantie",
    description: "Générez automatiquement les rapports de conformité HACCP pour les contrôles sanitaires."
  }, {
    icon: Clock,
    title: "Planification des relevés",
    description: "Configurez des rappels pour les relevés manuels aux heures définies par votre plan HACCP."
  }, {
    icon: Smartphone,
    title: "Application mobile",
    description: "Effectuez vos relevés depuis votre smartphone, même hors connexion, avec synchronisation automatique."
  }];
  const sensorBenefits = ["Surveillance continue 24h/24, 7j/7", "Élimination des erreurs de saisie manuelle", "Détection immédiate des pannes d'équipement", "Réduction des pertes de marchandises", "Historique automatique sans intervention", "Compatible avec tous types de chambres froides"];
  return <div className="min-h-screen bg-background">
      <Seo title="Relevés de température HACCP - LockHACCP" description="Digitalisez vos relevés de température en cuisine. Rappels automatiques, alertes en cas de dépassement, historique consultable." path="/fonctionnalites/temperatures" />
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
                Surveillez vos <span className="text-primary">températures</span> en temps réel
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Digitalisez le suivi des températures de vos réfrigérateurs et congélateurs. 
                Avec ou sans capteurs connectés, restez conforme aux normes HACCP.
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
              <img src={temperaturesImg} alt="Application LockHACCP - Relevé de températures" className="max-w-sm w-full h-auto drop-shadow-2xl rounded-3xl shadow-2xl opacity-80" />
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
              Une solution complète qui s'adapte à votre établissement, avec ou sans équipement connecté.
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-light text-secondary font-medium text-sm mb-4">
                Capteurs IoT
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Intégrez des <span className="text-secondary">capteurs connectés</span> pour un suivi automatique
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                LockHACCP est compatible avec les principaux capteurs de température du marché. 
                Une fois installés, vos relevés sont automatiques et vous êtes alerté en cas de problème, 
                même la nuit ou le week-end.
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
                    <Wifi className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-lg">Capteur connecté</p>
                    <p className="text-sm text-primary-foreground/70">Chambre froide positive</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-primary-foreground/10 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-primary-foreground/70">Température actuelle</span>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full">Conforme</span>
                    </div>
                    <p className="text-4xl font-heading font-bold">3.2°C</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-foreground/10 rounded-xl p-4">
                      <p className="text-xs text-primary-foreground/70 mb-1">Seuil min</p>
                      <p className="text-xl font-bold">0°C</p>
                    </div>
                    <div className="bg-primary-foreground/10 rounded-xl p-4">
                      <p className="text-xs text-primary-foreground/70 mb-1">Seuil max</p>
                      <p className="text-xl font-bold">4°C</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-primary-foreground/50 text-center">
                    Dernière mise à jour : il y a 2 minutes
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
export default FeatureTemperature;