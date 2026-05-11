import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_URL } from "@/lib/links";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero pt-20 overflow-hidden">
      {/* Static background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Video — shown first on mobile, second on desktop */}
          <div
            className="relative animate-fade-up order-first lg:order-last"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-md aspect-[9/16] bg-gradient-to-br from-primary/20 via-secondary/15 to-primary/10 rounded-3xl blur-2xl scale-105" />
              </div>

              <div className="relative w-full max-w-md aspect-[9/16] overflow-hidden rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.35),0_10px_30px_-10px_rgba(0,0,0,0.25)] ring-1 ring-white/10">
                <video
                  src="/videos/hero-video.mp4"
                  poster="/logo-color.png"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="text-center lg:text-left order-last lg:order-first">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/10 mb-6 animate-fade-up">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Solution HACCP complète</span>
            </div>

            <h1
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              Simplifiez votre conformité <span className="text-primary">HACCP</span>
            </h1>

            <p
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              LockHACCP digitalise tous vos contrôles sanitaires : températures, réceptions,
              traçabilité, nettoyage et plus encore. Gagnez du temps et restez conforme.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <a href={APP_URL}>
                <Button variant="hero" size="xl">
                  Démarrer gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/demander-demo">
                <Button variant="heroOutline" size="xl">
                  Demander une démo
                </Button>
              </Link>
            </div>

            <div
              className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Configuration en 5 min</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Support inclus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
