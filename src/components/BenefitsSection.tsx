import { Shield, Clock, FileCheck, Smartphone } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallax } from "@/hooks/useParallax";

const benefits = [
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Réduisez de 70% le temps consacré à vos contrôles quotidiens grâce à la digitalisation.",
    stat: "70%",
    statLabel: "de temps gagné",
  },
  {
    icon: Shield,
    title: "Conformité garantie",
    description: "Restez toujours en règle avec les normes HACCP grâce aux rappels et alertes automatiques.",
    stat: "100%",
    statLabel: "conforme",
  },
  {
    icon: FileCheck,
    title: "Traçabilité complète",
    description: "Accédez à l'historique complet de tous vos contrôles en quelques clics.",
    stat: "24/7",
    statLabel: "accessible",
  },
  {
    icon: Smartphone,
    title: "Mobilité totale",
    description: "Effectuez vos contrôles depuis n'importe quel appareil, même hors connexion.",
    stat: "0",
    statLabel: "papier",
  },
];

const BenefitsSection = () => {
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation();
  const { ref: bgRef1, style: bgStyle1 } = useParallax({ speed: 0.4, direction: 'up' });
  const { ref: bgRef2, style: bgStyle2 } = useParallax({ speed: 0.6, direction: 'down' });

  return (
    <section id="benefits" className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Parallax background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          ref={bgRef1}
          className="absolute top-1/4 -right-32 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"
          style={bgStyle1}
        />
        <div 
          ref={bgRef2}
          className="absolute bottom-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          style={bgStyle2}
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <div 
            ref={leftRef}
            className={`transition-all duration-700 ${
              leftVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-light text-primary font-medium text-sm mb-4">
              Pourquoi LockHACCP ?
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Concentrez-vous sur votre métier,{" "}
              <span className="text-secondary">pas sur la paperasse</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              LockHACCP transforme la gestion de votre conformité sanitaire en un processus simple, 
              rapide et fiable. Plus de formulaires papier, plus d'oublis, plus de stress lors des contrôles.
            </p>

            {/* Benefits list */}
            <div className="space-y-4">
              {benefits.slice(0, 2).map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div 
                    key={benefit.title} 
                    className={`flex items-start gap-4 transition-all duration-500 ${
                      leftVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}
                    style={{ transitionDelay: `${300 + index * 150}ms` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Stats grid */}
          <div 
            ref={rightRef}
            className="grid grid-cols-2 gap-4 lg:gap-6"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className={`rounded-2xl p-6 lg:p-8 transition-all duration-500 h-full ${
                    index % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                  } ${index === 1 ? "lg:translate-y-8" : ""} ${index === 3 ? "lg:translate-y-8" : ""} ${
                    rightVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Icon className={`w-8 h-8 mb-4 ${index % 2 === 0 ? "text-primary-foreground/80" : "text-secondary"}`} />
                  <p className={`text-4xl lg:text-5xl font-heading font-bold mb-1 ${
                    index % 2 === 0 ? "text-primary-foreground" : "text-foreground"
                  }`}>
                    {benefit.stat}
                  </p>
                  <p className={`text-sm font-medium ${
                    index % 2 === 0 ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}>
                    {benefit.statLabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
