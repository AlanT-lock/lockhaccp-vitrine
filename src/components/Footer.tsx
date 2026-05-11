import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-white.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    application: [
      { label: "Solution HACCP", href: "/" },
      { label: "Avantages IA", href: "/avantages-ia" },
      { label: "Tarifs", href: "/tarifs" },
    ],
    company: [
      { label: "Demander une démo", href: "/demander-demo" },
      { label: "Contact", href: "/contact" },
      { label: "Ressources", href: "/ressources" },
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
              <img src={logoWhite} alt="LockHACCP Logo" className="h-10 w-auto" />
              <span className="font-heading font-bold text-xl text-primary-foreground">
                LockHACCP
              </span>
            </Link>
            <p className="text-primary-foreground/60 text-sm">
              La solution digitale pour simplifier votre conformité HACCP.
            </p>
          </div>

          {/* Application links */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">L'application</h4>
            <ul className="space-y-3">
              {footerLinks.application.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary-foreground/10">
          <p className="text-center text-primary-foreground/40 text-sm">
            © {currentYear} LockHACCP. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;