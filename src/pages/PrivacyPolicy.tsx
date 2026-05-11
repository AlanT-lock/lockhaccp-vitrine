import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Politique de confidentialité - LockHACCP" description="Politique de confidentialité et traitement des données personnelles de LockHACCP, conforme RGPD." path="/politique-confidentialite" />
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-muted-foreground mb-12">Date de mise à jour : 09/06/2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">1. Responsable du traitement</h2>
              <p className="text-muted-foreground">Le responsable de traitement est :</p>
              <ul className="text-muted-foreground list-none space-y-1 mt-2">
                <li><strong className="text-foreground">LockHACCP</strong></li>
                <li>Entreprise individuelle</li>
                <li>SIRET : 898 193 214 00019</li>
                <li>Email de contact : contact@lockhaccp.fr</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">2. Données collectées</h2>
              <p className="text-muted-foreground">LockHACCP peut collecter les données personnelles suivantes :</p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>Nom</li>
                <li>Prénom</li>
                <li>Adresse email</li>
                <li>Nom commercial de l'établissement</li>
                <li>Numéro de téléphone</li>
                <li>Adresse postale</li>
              </ul>
              <p className="text-muted-foreground mt-4">Aucune donnée bancaire ni information sensible n'est collectée à ce jour.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">3. Finalités du traitement</h2>
              <p className="text-muted-foreground">Les données sont collectées pour les finalités suivantes :</p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>Création et gestion des comptes utilisateurs</li>
                <li>Accès aux fonctionnalités de l'application HACCP</li>
                <li>Communication avec les utilisateurs (support, alertes, rappels…)</li>
                <li>Amélioration du service et suivi statistique</li>
                <li>Respect des obligations légales (traçabilité, sécurité)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">4. Base légale du traitement</h2>
              <p className="text-muted-foreground">Les traitements effectués par LockHACCP reposent sur les bases légales suivantes :</p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>Exécution d'un contrat (accès au service SaaS)</li>
                <li>Consentement (formulaires, contact volontaire)</li>
                <li>Obligations légales (archivage, sécurité)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">5. Destinataires des données</h2>
              <p className="text-muted-foreground">
                Les données sont strictement destinées à LockHACCP. Elles peuvent être temporairement transmises à des sous-traitants techniques (ex. : hébergement, outil d'emailing), dans la limite nécessaire à leur mission.
              </p>
              <p className="text-muted-foreground mt-4">
                Aucun transfert de données hors UE n'est effectué, sauf dans le cadre de l'hébergement (ex. : FlutterFlow), dans ce cas protégés par des clauses contractuelles types (SCC) ou un encadrement équivalent.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">6. Durée de conservation</h2>
              <p className="text-muted-foreground">Les données sont conservées :</p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>Pendant toute la durée de l'utilisation de l'application</li>
                <li>Et jusqu'à 2 ans après la dernière activité, sauf obligation légale contraire</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">7. Sécurité des données</h2>
              <p className="text-muted-foreground">
                LockHACCP met en place toutes les mesures techniques et organisationnelles raisonnables pour protéger les données personnelles contre la perte, l'accès non autorisé ou la divulgation (serveurs sécurisés, accès restreint, sauvegardes régulières).
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">8. Vos droits</h2>
              <p className="text-muted-foreground">Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>Droit d'accès</li>
                <li>Droit de rectification</li>
                <li>Droit de suppression</li>
                <li>Droit d'opposition</li>
                <li>Droit à la portabilité</li>
                <li>Droit à la limitation du traitement</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Pour exercer vos droits, vous pouvez nous contacter à l'adresse : <a href="mailto:contact@lockhaccp.fr" className="text-primary hover:underline">contact@lockhaccp.fr</a>
              </p>
              <p className="text-muted-foreground mt-2">Une réponse vous sera apportée sous un délai de 15 jours maximum.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">9. Cookies</h2>
              <p className="text-muted-foreground">
                Le site lockhaccp.fr utilise uniquement des cookies techniques et de mesure d'audience anonymisés. Aucun cookie publicitaire n'est déposé sans consentement.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">10. Modification de la politique</h2>
              <p className="text-muted-foreground">
                Cette politique peut être modifiée à tout moment pour rester conforme à la réglementation. Toute mise à jour sera indiquée sur cette page avec sa date.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
