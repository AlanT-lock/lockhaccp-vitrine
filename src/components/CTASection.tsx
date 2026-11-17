import { Link } from "react-router-dom";
import { ArrowRight, Check, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SIGNUP_URL } from "@/lib/links";
import { VIDEOS_APP, VIDEO_HAUTEUR, VIDEO_LARGEUR } from "@/lib/videos-app";
import { Telephone3D } from "@/components/accueil/Telephone3D";

// Appel final (accueil et pages produit). Le téléphone montre une image fixe (pas une vidéo de plus).
interface PropsCta {
  titre?: string;
  texte?: string;
  capture?: { src: string; alt: string };
}

const CAPTURE_ACCUEIL = {
  src: VIDEOS_APP.historique.cle,
  alt: "Nettoyage du jour : 15 surfaces sur 15 nettoyées, zones Cuisine, Plonge et Sanitaires terminées",
};

const CTASection = ({
  titre = "Prêt à simplifier votre conformité HACCP ?",
  texte = "Créez votre compte et tenez vos premiers relevés dès aujourd'hui. Votre Plan de Maîtrise Sanitaire gratuit paramètre l'application pour vous.",
  capture = CAPTURE_ACCUEIL,
}: PropsCta) => (
  <section id="contact" className="px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-32">
    <div className="container relative mx-auto overflow-hidden rounded-[2.5rem] bg-primary px-5 py-14 text-white sm:px-12 sm:py-16 lg:px-16 lg:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-[hsl(211_100%_45%)]/40 blur-3xl" />
      </div>

      <div className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="text-center lg:col-span-7 lg:text-left">
          <h2 className="font-heading text-[clamp(2.2rem,4.8vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.03em] [text-wrap:balance]">
            {/* Espace insécable avant « ? » : le point d'interrogation ne part jamais seul à la ligne. */}
            {titre.replace(/ ([?!:;])/g, "\u00a0$1")}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80 lg:mx-0">
            {texte}
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/85 lg:justify-start">
            {["14 jours d'essai, sans carte bancaire", "Sans engagement", "Paramétrage offert"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-secondary" strokeWidth={3} />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button variant="accent" size="xl" asChild className="group">
              <a href={SIGNUP_URL}>
                Essayer gratuitement
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button size="xl" className="border-2 border-white/25 bg-white/10 text-white hover:bg-white/20" asChild>
              <Link to="/demander-demo">Demander une démo</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-col items-center gap-3 text-sm text-white/80 sm:flex-row sm:gap-8 lg:justify-start">
            <a href="mailto:contact@lockhaccp.fr" className="flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4" /> contact@lockhaccp.fr
            </a>
            <a href="tel:+33646640023" className="flex items-center gap-2 hover:text-white">
              <Phone className="h-4 w-4" /> 06 46 64 00 23
            </a>
          </div>
        </div>

        <div className="mx-auto hidden w-[15rem] lg:col-span-5 lg:block xl:w-[16.5rem]">
          <Telephone3D inclinaison="gauche">
            <img
              src={capture.src}
              alt={capture.alt}
              width={VIDEO_LARGEUR}
              height={VIDEO_HAUTEUR}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </Telephone3D>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
