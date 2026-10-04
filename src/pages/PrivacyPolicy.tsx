import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Politique de confidentialité - LockHACCP" description="Politique de confidentialité de LockHACCP : collecte, traitement et protection de vos données personnelles. Conformité RGPD." path="/politique-confidentialite" />
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-muted-foreground mb-12">Date de mise à jour : 29/09/2026</p>

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
                Exception : les coordonnées saisies dans le générateur de PMS gratuit sont également transmises à notre partenaire SF FORMATION (voir la section 10).
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
                Pour exercer vos droits, vous pouvez nous contacter à l'adresse : <a href="mailto:contact@lockhaccp.fr" className="text-primary underline underline-offset-2 hover:no-underline">contact@lockhaccp.fr</a>
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
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">10. Générateur de PMS gratuit</h2>
              <p className="text-muted-foreground">
                Lorsque vous demandez votre Plan de Maîtrise Sanitaire (PMS) gratuit sur lockhaccp.fr/pms, nous collectons :
              </p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>le nom et l'adresse de votre établissement, votre adresse e-mail et votre numéro de téléphone ;</li>
                <li>vos réponses au questionnaire (activité, équipements, nettoyage, personnel).</li>
              </ul>
              <p className="text-muted-foreground mt-4">Ces données servent à :</p>
              <ul className="text-muted-foreground list-disc list-inside mt-2 space-y-1">
                <li>produire votre PMS et vous l'envoyer par e-mail ;</li>
                <li>vous recontacter par e-mail ou par téléphone au sujet de votre PMS, de l'application LockHACCP et, le cas échéant, des formations en hygiène alimentaire ;</li>
                <li>pré-configurer l'application LockHACCP si vous vous y inscrivez.</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong>Base légale :</strong> votre accord, donné en cochant la case prévue avant l'envoi, et notre intérêt légitime à présenter à des professionnels des métiers de bouche des services liés à leur activité.
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>Destinataires :</strong> LockHACCP et son partenaire SF FORMATION (SASU, siège à Cannes, SIRET 841 840 390 00022), organisme de formation à l'hygiène alimentaire, dans l'outil de gestion des contacts duquel vos coordonnées et un résumé de vos réponses sont enregistrés. Nos sous-traitants techniques (hébergement des données et envoi des e-mails) n'y accèdent que pour leur mission.
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>Durée de conservation :</strong> 3 ans à compter de notre dernier échange avec vous. Le lien de téléchargement de votre PMS expire au bout de 30 jours.
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>Vous opposer à être recontacté :</strong> à tout moment et sans justification, en cliquant sur le lien de désinscription de nos e-mails, en le disant lors d'un appel ou en écrivant à contact@lockhaccp.fr. Vos droits décrits à la section 8 s'appliquent aussi à ces données.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">11. Modification de la politique</h2>
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
