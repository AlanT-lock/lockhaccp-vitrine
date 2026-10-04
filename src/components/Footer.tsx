import { Link } from "react-router-dom";
import { useMaintenant } from "@/hooks/useMaintenant";
import logoWhite from "@/assets/logo-white.webp";

const Footer = () => {
  const currentYear = useMaintenant().getFullYear();

  const footerLinks = {
    application: [
      { label: "Solution HACCP", href: "/" },
      { label: "Tarifs", href: "/tarifs" },
      { label: "Plan de Maîtrise Sanitaire gratuit", href: "/plan-de-maitrise-sanitaire" },
    ],
    company: [
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

  return (
    <footer className="bg-foreground py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logoWhite} alt="" width={29} height={40} loading="lazy" decoding="async" className="h-10 w-auto" />
              <span className="font-heading font-bold text-xl text-primary-foreground">
                LockHACCP
              </span>
            </Link>
            <p className="text-primary-foreground/75 text-sm">
              La solution digitale pour simplifier votre conformité HACCP.
            </p>
          </div>

          {/* Application links */}
          <div>
            <h2 className="font-heading text-base font-semibold text-primary-foreground mb-4">L'application</h2>
            <ul className="space-y-3">
              {footerLinks.application.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-primary-foreground/75 hover:text-primary-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h2 className="font-heading text-base font-semibold text-primary-foreground mb-4">Entreprise</h2>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-primary-foreground/75 hover:text-primary-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h2 className="font-heading text-base font-semibold text-primary-foreground mb-4">Légal</h2>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-primary-foreground/75 hover:text-primary-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary-foreground/10">
          <p className="text-center text-primary-foreground/70 text-sm">
            © {currentYear} LockHACCP. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;