import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMaintenant } from "@/hooks/useMaintenant";
import logoWhite from "@/assets/logo-white.webp";
import { ouvrirBandeauCookies } from "@/lib/consentement";
import { TOUTES_FONCTIONNALITES } from "@/lib/fonctionnalites-liens";
import { APP_URL } from "@/lib/links";

// Pied de page de tout le site. Les liens (maillage interne) sont inchangés : chaque page
// fonctionnalité, l'application, les tarifs, le PMS, le blog et les pages légales.
const LIENS = {
  application: [
    { label: "Logiciel HACCP", href: "/" },
    { label: "Application HACCP et PMS", href: "/application-pms" },
    { label: "Tarifs", href: "/tarifs" },
    { label: "Capteurs connectés", href: "/capteurs-connectes" },
    { label: "Plan de Maîtrise Sanitaire gratuit", href: "/plan-de-maitrise-sanitaire" },
    { label: "Plusieurs établissements", href: "/contact-entreprise" },
  ],
  entreprise: [
    { label: "Demander une démo", href: "/demander-demo" },
    { label: "Contact", href: "/contact" },
    { label: "Ressources", href: "/blog" },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "CGU", href: "/cgu" },
    { label: "Politique de confidentialité", href: "/politique-confidentialite" },
  ],
};

const LIEN = "text-sm text-white/65 transition-colors hover:text-white";

function Colonne({ titre, liens }: { titre: string; liens: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/55">{titre}</h2>
      <ul className="space-y-3">
        {liens.map((l) => (
          <li key={l.href}>
            <Link to={l.href} className={LIEN}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  const annee = useMaintenant().getFullYear();

  return (
    <footer className="bg-[hsl(211_100%_11%)] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Accroche et accès à l'application */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-14 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <div>
            <Link to="/" className="mb-6 inline-flex items-center gap-3">
              <img src={logoWhite} alt="" width={29} height={40} loading="lazy" decoding="async" className="h-10 w-auto" />
              <span className="font-heading text-xl font-bold">LockHACCP</span>
            </Link>
            <p className="max-w-xl font-heading text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
              Vos contrôles HACCP, <span className="text-secondary">sans une feuille de papier.</span>
            </p>
          </div>
          <a
            href={APP_URL}
            className="group inline-flex items-center gap-2 self-start rounded-full bg-white px-6 py-3.5 font-semibold text-primary transition-colors hover:bg-secondary hover:text-white lg:self-auto"
          >
            Essayer gratuitement 14 jours
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Liens */}
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          {/* Fonctionnalités : un lien vers chaque page, sur toutes les pages du site. */}
          <Colonne titre="Fonctionnalités" liens={TOUTES_FONCTIONNALITES.map((f) => ({ label: f.label, href: f.to }))} />
          <Colonne titre="L'application" liens={LIENS.application} />
          <Colonne titre="Entreprise" liens={LIENS.entreprise} />
          <div>
            <Colonne titre="Légal" liens={LIENS.legal} />
            <button type="button" onClick={ouvrirBandeauCookies} className={`mt-3 ${LIEN}`}>
              Gestion des cookies
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-8 text-sm text-white/50 sm:flex-row sm:justify-between">
          <p>© {annee} LockHACCP. Tous droits réservés.</p>
          <p>Conçu avec un formateur en hygiène alimentaire · Données hébergées en Europe</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
