import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { useParallax } from "@/hooks/useParallax";
import { APP_URL } from "@/lib/links";

const CTASection = () => {
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();
  const { ref: contactRef, isVisible: contactVisible } = useScrollAnimation();
  const { ref: bgRef1, style: bgStyle1 } = useParallax({ speed: 0.5, direction: 'up', scale: true, scaleRange: [0.9, 1.1] });
  const { ref: bgRef2, style: bgStyle2 } = useParallax({ speed: 0.3, direction: 'down' });

  return (
    <section id="contact" className="py-20 lg:py-32 bg-gradient-hero relative overflow-hidden">
      {/* Parallax background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          ref={bgRef1}
          className="absolute -top-20 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          style={bgStyle1}
        />
        <div 
          ref={bgRef2}
          className="absolute -bottom-20 left-1/3 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"
          style={bgStyle2}
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* CTA Card */}
          <div
            ref={ctaRef}
            className={`relative bg-primary rounded-3xl p-8 lg:p-16 overflow-hidden transition-all duration-700 ${
              ctaVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
            }`}
          >
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Prêt à simplifier votre conformité HACCP ?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Rejoignez les centaines de professionnels de la restauration qui ont déjà digitalisé leurs contrôles sanitaires avec LockHACCP.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={APP_URL}>
                  <Button variant="accent" size="xl">
                    Essayer gratuitement
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
                <Link to="/demander-demo">
                  <Button
                    size="xl"
                    className="bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground/20 hover:bg-primary-foreground/20"
                  >
                    Demander une démo
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        {/* Contact info */}
        <div 
          ref={contactRef}
          className="mt-16 grid sm:grid-cols-2 gap-8 text-center max-w-xl mx-auto"
        >
        {[
            { icon: Mail, label: "Email", value: "contact@lockhaccp.fr" },
            { icon: Phone, label: "Téléphone", value: "06 46 64 00 23" },
          ].map((item, index) => (
            <div 
              key={item.label}
              className={`flex flex-col items-center transition-all duration-500 ${
                contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
              <p className="font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
