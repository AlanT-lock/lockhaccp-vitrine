import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Conditions générales d'utilisation - LockHACCP" description="Conditions générales d'utilisation du service LockHACCP." path="/cgu" />
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Conditions Générales d'Utilisation (CGU)
          </h1>
          <p className="text-muted-foreground mb-8">Date de mise à jour : 09/06/2025</p>

          <p className="text-muted-foreground mb-12">
            Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») encadrent l'accès et l'utilisation de l'application mobile/web LockHACCP, éditée par :
          </p>

          <ul className="text-muted-foreground list-none space-y-1 mb-12">
            <li><strong className="text-foreground">Nom commercial :</strong> LockHACCP</li>
            <li><strong className="text-foreground">Statut juridique :</strong> Entreprise individuelle (auto-entrepreneur)</li>
            <li><strong className="text-foreground">SIRET :</strong> 898 193 214 00019</li>
            <li><strong className="text-foreground">Email de contact :</strong> contact@lockhaccp.fr</li>
            <li><strong className="text-foreground">Site web :</strong> https://lockhaccp.fr</li>
          </ul>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">1. Objet</h2>
              <p className="text-muted-foreground">
                LockHACCP est une application SaaS destinée aux professionnels de la restauration pour les aider à gérer leur plan de maîtrise sanitaire (PMS) et leurs obligations HACCP.
              </p>
              <p className="text-muted-foreground mt-4">
                L'accès et l'utilisation de l'application impliquent l'acceptation pleine et entière des présentes CGU.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">2. Accès à l'application</h2>
              <p className="text-muted-foreground">
                L'accès à l'application est réservé aux utilisateurs ayant créé un compte, à titre gratuit ou payant.
              </p>
              <p className="text-muted-foreground mt-4">
                L'utilisateur doit fournir des informations exactes et s'engage à les maintenir à jour.
              </p>
              <p className="text-muted-foreground mt-4">
                LockHACCP se réserve le droit de refuser ou suspendre l'accès à un utilisateur en cas de non-respect des présentes CGU.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">3. Fonctionnalités proposées</h2>
              <p className="text-muted-foreground">L'application LockHACCP permet notamment :</p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>Le suivi des relevés de températures</li>
                <li>La traçabilité des produits</li>
                <li>La gestion des réceptions de marchandises</li>
                <li>La planification des nettoyages et contrôles</li>
                <li>Le contrôle des huiles de friture</li>
                <li>Le contrôle des températures produit (ex: refroidissement)</li>
                <li>L'historique des actions réalisées</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Ces fonctionnalités sont susceptibles d'évoluer à tout moment sans préavis.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">4. Obligations de l'utilisateur</h2>
              <p className="text-muted-foreground">L'utilisateur s'engage à :</p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>Ne pas utiliser l'application à des fins illégales</li>
                <li>Ne pas perturber le bon fonctionnement du service</li>
                <li>Ne pas porter atteinte aux droits de tiers</li>
                <li>Respecter les lois et réglementations applicables</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">5. Propriété intellectuelle</h2>
              <p className="text-muted-foreground">
                Tous les éléments de l'application et du site lockhaccp.fr (marques, textes, logos, visuels, structure…) sont la propriété exclusive de LockHACCP. Toute reproduction ou exploitation sans autorisation est interdite.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">6. Responsabilité</h2>
              <p className="text-muted-foreground">
                LockHACCP met tout en œuvre pour assurer un service de qualité, mais ne peut être tenu responsable :
              </p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>En cas d'erreur, bug ou indisponibilité temporaire</li>
                <li>En cas de perte de données liée à l'usage incorrect de l'application</li>
                <li>En cas d'utilisation frauduleuse ou abusive par un tiers</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                L'utilisateur reste seul responsable des données qu'il saisit et de leur véracité.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">7. Données personnelles</h2>
              <p className="text-muted-foreground">
                L'utilisation de l'application implique la collecte de données à caractère personnel. Celles-ci sont traitées conformément à la <a href="/politique-confidentialite" className="text-primary hover:underline">Politique de confidentialité</a>.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">8. Suspension ou suppression de compte</h2>
              <p className="text-muted-foreground">LockHACCP se réserve le droit de suspendre ou supprimer un compte utilisateur :</p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>En cas de non-respect des CGU</li>
                <li>En cas d'inactivité prolongée</li>
                <li>Sur demande de l'utilisateur</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                La suppression d'un compte entraîne l'effacement progressif des données associées, sauf obligation légale contraire.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">9. Modification des CGU</h2>
              <p className="text-muted-foreground">
                LockHACCP se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés via l'application ou par email.
              </p>
              <p className="text-muted-foreground mt-4">
                L'utilisation du service après modification vaut acceptation des nouvelles CGU.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">10. Loi applicable - Juridiction</h2>
              <p className="text-muted-foreground">
                Les présentes CGU sont soumises au droit français. En cas de litige, les parties tenteront une résolution amiable avant toute action judiciaire. À défaut, le tribunal compétent sera celui du lieu de domiciliation du responsable de LockHACCP.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfUse;
