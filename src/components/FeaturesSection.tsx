import { 
  Thermometer, 
  Package, 
  FileSearch, 
  Sparkles, 
  Droplets, 
  Tag, 
  ClipboardCheck,
  ArrowRight
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { useParallax } from "@/hooks/useParallax";

const features = [
  {
    icon: Thermometer,
    title: "Relevé de températures",
    description: "Surveillez en temps réel les températures de vos réfrigérateurs et congélateurs avec alertes automatiques.",
    color: "primary",
    link: "/fonctionnalites/temperatures"
  },
  {
    icon: Package,
    title: "Contrôle des réceptions",
    description: "Vérifiez la conformité de chaque livraison : température, DLC, état des emballages et traçabilité.",
    color: "secondary",
    link: "/fonctionnalites/receptions"
  },
  {
    icon: FileSearch,
    title: "Traçabilité produits",
    description: "Suivez l'origine et le parcours de tous vos produits pour une traçabilité complète et instantanée.",
    color: "primary",
    link: "/fonctionnalites/tracabilite"
  },
  {
    icon: Sparkles,
    title: "Plan de nettoyage",
    description: "Gérez et suivez votre plan de nettoyage avec des rappels et validations pour chaque zone.",
    color: "secondary",
    link: "/fonctionnalites/nettoyage"
  },
  {
    icon: Droplets,
    title: "Contrôle huiles de friture",
    description: "Testez et enregistrez la qualité de vos huiles de friture pour garantir leur conformité.",
    color: "primary",
    link: "/fonctionnalites/huiles"
  },
  {
    icon: Tag,
    title: "Création d'étiquettes",
    description: "Créez et imprimez vos étiquettes de production directement vers votre étiqueteuse connectée.",
    color: "secondary",
    link: "/fonctionnalites/etiquettes"
  },
  {
    icon: ClipboardCheck,
    title: "Checklist personnalisée",
    description: "Adaptez votre checklist aux points de contrôle spécifiques de votre établissement.",
    color: "primary",
    link: "/fonctionnalites/checklist"
  },
];

const FeaturesSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: parallaxBg1, style: parallaxStyle1 } = useParallax({ speed: 0.3, direction: 'up' });
  const { ref: parallaxBg2, style: parallaxStyle2 } = useParallax({ speed: 0.5, direction: 'down' });
  
  return (
    <section id="features" className="py-20 lg:py-32 bg-muted/30 relative overflow-hidden">
      {/* Parallax background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          ref={parallaxBg1}
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          style={parallaxStyle1}
        />
        <div 
          ref={parallaxBg2}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          style={parallaxStyle2}
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div 
          ref={headerRef}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-light text-secondary font-medium text-sm mb-4">
            Fonctionnalités
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Tout ce dont vous avez besoin pour votre{" "}
            <span className="text-primary">conformité HACCP</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Une suite complète d'outils pour digitaliser et simplifier tous vos contrôles sanitaires au quotidien.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isPrimary = feature.color === "primary";
            
            return (
              <FeatureCard 
                key={feature.title}
                icon={Icon}
                title={feature.title}
                description={feature.description}
                isPrimary={isPrimary}
                index={index}
                link={feature.link}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  isPrimary: boolean;
  index: number;
  link: string;
}

const FeatureCard = ({ icon: Icon, title, description, isPrimary, index, link }: FeatureCardProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <Link to={link}>
      <div
        ref={ref}
        className={`group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 border border-border hover:border-primary/20 cursor-pointer h-full ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        style={{ transitionDelay: `${index * 75}ms` }}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          isPrimary ? "bg-primary-light" : "bg-secondary-light"
        }`}>
          <Icon className={`w-6 h-6 ${isPrimary ? "text-primary" : "text-secondary"}`} />
        </div>

        <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>En savoir plus</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

export default FeaturesSection;
