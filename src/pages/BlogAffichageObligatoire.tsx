import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowLeft, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { Seo } from "@/components/Seo";

const BlogAffichageObligatoire = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Affichages obligatoires en restaurant : guide complet 2026" description="Tous les affichages obligatoires pour les restaurants en France : règles d'hygiène, allergènes, origines des viandes, prix." path="/ressources/affichage-obligatoire-restaurant" />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/ressources" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux ressources
            </Link>
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Réglementation
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              Affichage obligatoire en restaurant : Guide complet 2024
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                13 décembre 2024
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                8 min de lecture
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=500&fit=crop"
              alt="Restaurant moderne avec affichages conformes"
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            
            {/* Introduction */}
            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <p className="text-lg text-foreground leading-relaxed m-0">
                En tant que restaurateur, vous êtes soumis à de nombreuses obligations légales, 
                dont celle d'afficher certaines informations dans votre établissement. Ces affichages 
                ne sont pas de simples formalités administratives : ils protègent vos clients, 
                valorisent votre professionnalisme et vous mettent en conformité avec la loi.
              </p>
            </div>

            {/* Section 1 */}
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-secondary" />
              Pourquoi être en conformité avec l'affichage obligatoire ?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              L'affichage obligatoire en restaurant n'est pas une option, c'est une exigence légale. 
              Ne pas respecter ces obligations peut entraîner :
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Des amendes conséquentes</strong> : les sanctions peuvent aller de 450€ à plusieurs milliers d'euros selon la nature de l'infraction.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Une fermeture administrative</strong> : en cas de manquements graves ou répétés, les autorités peuvent ordonner la fermeture de votre établissement.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Une atteinte à votre réputation</strong> : les clients sont de plus en plus attentifs aux normes d'hygiène et de sécurité.
                </span>
              </li>
            </ul>

            {/* Section 2 */}
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-secondary" />
              Que doit-on obligatoirement afficher ?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Voici la liste complète des affichages obligatoires dans un établissement de restauration :
            </p>

            {/* Affichage à l'extérieur */}
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              📍 À l'extérieur de l'établissement
            </h3>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
              <ul className="space-y-3 m-0">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Les prix des menus et cartes</strong> : affichés de manière visible et lisible depuis l'extérieur, avec les prix TTC.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">La licence de débit de boissons</strong> : le numéro de licence doit être visible.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">L'interdiction de vente d'alcool aux mineurs</strong> : panneau obligatoire à l'entrée.
                  </span>
                </li>
              </ul>
            </div>

            {/* Affichage à l'intérieur */}
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              🏠 À l'intérieur de l'établissement
            </h3>
            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6 mb-6">
              <ul className="space-y-3 m-0">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Les prix des boissons et denrées</strong> : tarifs clairement affichés avec mention du service compris ou non.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">L'origine des viandes bovines</strong> : obligatoire depuis 2002, avec mention du pays de naissance, d'élevage et d'abattage.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">L'information sur les allergènes</strong> : conformément au règlement INCO (UE) 1169/2011, les 14 allergènes majeurs doivent être portés à la connaissance du consommateur, par écrit ou sur demande.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">L'affiche "fait maison"</strong> : mention obligatoire pour les plats préparés sur place à partir de produits bruts.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">L'interdiction de fumer</strong> : signalétique obligatoire dans tous les espaces fermés.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Les consignes de sécurité incendie</strong> : plan d'évacuation et numéros d'urgence (ERP).
                  </span>
                </li>
              </ul>
            </div>

            {/* Affichage cuisine */}
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              👨‍🍳 En cuisine et zones de stockage (obligations du paquet hygiène)
            </h3>
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <ul className="space-y-3 m-0">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Les instructions d'hygiène</strong> : affichage des bonnes pratiques (lavage des mains, tenue vestimentaire, etc.) conformément au règlement CE 852/2004.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Les températures de conservation</strong> : rappel des températures réglementaires selon l'arrêté du 21 décembre 2009 (ex: +4°C max pour les produits réfrigérés).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Le plan de maîtrise sanitaire (PMS)</strong> : document obligatoire décrivant les mesures HACCP, accessible et à jour.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Le plan de nettoyage et désinfection</strong> : planning visible, accessible à tous les employés avec les produits et fréquences.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-secondary" />
              Les avantages d'un affichage conforme
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Au-delà de l'aspect légal, un affichage bien pensé présente de nombreux avantages :
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-semibold text-foreground mb-2">🛡️ Protection juridique</h4>
                <p className="text-sm text-muted-foreground m-0">
                  En cas de litige, vous pouvez prouver que vous avez informé vos clients conformément à la loi.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-semibold text-foreground mb-2">⭐ Image professionnelle</h4>
                <p className="text-sm text-muted-foreground m-0">
                  Un affichage clair et soigné renforce la confiance de vos clients envers votre établissement.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-semibold text-foreground mb-2">🤝 Transparence</h4>
                <p className="text-sm text-muted-foreground m-0">
                  Les clients apprécient de connaître l'origine des produits et les informations sur les allergènes.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-semibold text-foreground mb-2">✅ Sérénité lors des contrôles</h4>
                <p className="text-sm text-muted-foreground m-0">
                  Fini le stress des inspections : votre établissement est en règle.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">
              À quoi sert concrètement cet affichage ?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              L'affichage obligatoire remplit plusieurs fonctions essentielles :
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Informer le consommateur</strong> : il permet aux clients de faire des choix éclairés, notamment en cas d'allergies alimentaires.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Prévenir les risques</strong> : les consignes de sécurité et d'hygiène protègent aussi bien vos clients que votre personnel.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Encadrer les pratiques</strong> : pour votre équipe, ces affichages servent de rappels permanents des bonnes pratiques.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Faciliter les contrôles</strong> : les inspecteurs vérifient systématiquement la présence de ces affichages.
                </span>
              </li>
            </ul>

            {/* Conclusion */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-8 mt-12">
              <h3 className="text-xl font-bold text-foreground mb-4">
                En résumé
              </h3>
              <p className="text-muted-foreground leading-relaxed m-0">
                L'affichage obligatoire en restaurant est bien plus qu'une contrainte administrative : 
                c'est un outil de professionnalisation de votre établissement. En respectant ces obligations, 
                vous protégez vos clients, vos employés et votre activité. Prenez le temps de vérifier 
                régulièrement que tous vos affichages sont à jour et conformes à la réglementation en vigueur.
              </p>
            </div>

          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogAffichageObligatoire;
