import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowLeft, CheckCircle, ClipboardList, Thermometer, Shield, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";

const BlogMethodeHACCP = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="La méthode HACCP : guide pratique pour les restaurateurs" description="Comprendre les 7 principes HACCP et les appliquer concrètement dans son restaurant. Guide pratique avec exemples." path="/ressources/methode-haccp" />
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
              HACCP
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              La méthode HACCP : Guide complet pour les restaurateurs
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                12 décembre 2024
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                10 min de lecture
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
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=500&fit=crop"
              alt="Cuisine professionnelle respectant les normes HACCP"
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
                La méthode HACCP (Hazard Analysis Critical Control Point) est le système de référence 
                pour garantir la sécurité alimentaire dans les établissements de restauration. 
                Obligatoire depuis 2006 en France, elle impose aux restaurateurs de mettre en place 
                des procédures strictes pour maîtriser les risques sanitaires. Voici tout ce que vous 
                devez savoir pour être en conformité.
              </p>
            </div>

            {/* Section 1 */}
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-secondary" />
              Qu'est-ce que la méthode HACCP ?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              HACCP signifie "Hazard Analysis Critical Control Point", soit en français 
              "Analyse des Dangers et Points Critiques pour leur Maîtrise". C'est une méthode 
              préventive qui vise à identifier, évaluer et maîtriser les dangers significatifs 
              au regard de la sécurité alimentaire.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Cette méthode repose sur <strong className="text-foreground">7 principes fondamentaux</strong> et 
              nécessite la mise en place de nombreuses procédures documentées.
            </p>

            {/* Les 7 principes */}
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6 flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-secondary" />
              Les 7 principes de la méthode HACCP
            </h2>
            <div className="space-y-4 mb-8">
              {[
                { num: 1, title: "Analyser les dangers", desc: "Identifier tous les dangers potentiels (biologiques, chimiques, physiques) à chaque étape de la production." },
                { num: 2, title: "Déterminer les points critiques", desc: "Identifier les étapes où un contrôle est essentiel pour prévenir ou éliminer un danger." },
                { num: 3, title: "Établir les limites critiques", desc: "Définir les seuils à ne pas dépasser (températures, durées, pH, etc.)." },
                { num: 4, title: "Mettre en place un système de surveillance", desc: "Établir des procédures pour vérifier que les limites critiques sont respectées." },
                { num: 5, title: "Définir les actions correctives", desc: "Prévoir les mesures à prendre lorsqu'un point critique n'est pas maîtrisé." },
                { num: 6, title: "Vérifier l'efficacité du système", desc: "Effectuer des contrôles réguliers pour s'assurer que le système fonctionne." },
                { num: 7, title: "Documenter et archiver", desc: "Tenir à jour tous les documents et enregistrements relatifs à l'HACCP." }
              ].map((principe) => (
                <div key={principe.num} className="flex gap-4 bg-card border border-border rounded-xl p-5">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {principe.num}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{principe.title}</h4>
                    <p className="text-sm text-muted-foreground m-0">{principe.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Démarches à mettre en place */}
            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6 flex items-center gap-3">
              <Thermometer className="w-6 h-6 text-secondary" />
              Toutes les démarches à mettre en place
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              La mise en conformité HACCP nécessite la mise en place de nombreuses procédures. 
              Voici la liste exhaustive de ce que vous devez implémenter dans votre établissement :
            </p>

            {/* Réception des marchandises */}
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              📦 Réception des marchandises
            </h3>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
              <ul className="space-y-3 m-0">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Contrôle à réception</strong> : vérifier la température, l'état des emballages, les DLC/DDM, la conformité avec le bon de livraison.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Enregistrement des contrôles</strong> : documenter chaque réception avec date, heure, température, fournisseur.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Procédure de refus</strong> : définir les critères de refus et la marche à suivre.
                  </span>
                </li>
              </ul>
            </div>

            {/* Stockage */}
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              🧊 Stockage et conservation
            </h3>
            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6 mb-6">
              <ul className="space-y-3 m-0">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Relevés de température</strong> : contrôler et enregistrer quotidiennement les températures de toutes les enceintes froides (chambres froides, réfrigérateurs, congélateurs).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Organisation du stockage</strong> : respecter le principe FIFO (First In, First Out), séparer les produits crus et cuits.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Étiquetage des produits</strong> : date d'ouverture, DLC secondaire, identification claire.
                  </span>
                </li>
              </ul>
            </div>

            {/* Production */}
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              👨‍🍳 Production et préparation
            </h3>
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <ul className="space-y-3 m-0">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Maîtrise des températures de cuisson</strong> : vérifier que les températures à cœur sont atteintes (+63°C minimum pour les viandes).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Refroidissement rapide</strong> : passer de +63°C à +10°C en moins de 2 heures.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Contrôle des huiles de friture</strong> : tests réguliers et enregistrement des changements d'huile.
                  </span>
                </li>
              </ul>
            </div>

            {/* Nettoyage */}
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              🧹 Nettoyage et désinfection
            </h3>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
              <ul className="space-y-3 m-0">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Plan de nettoyage</strong> : définir quoi nettoyer, quand, comment, avec quels produits, par qui.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Fiches de suivi</strong> : enregistrer quotidiennement les opérations de nettoyage effectuées.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Fiches techniques produits</strong> : conserver les FDS des produits de nettoyage utilisés.
                  </span>
                </li>
              </ul>
            </div>

            {/* Traçabilité */}
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              📋 Traçabilité
            </h3>
            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6 mb-6">
              <ul className="space-y-3 m-0">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Archivage des bons de livraison</strong> : conserver tous les documents pendant 5 ans minimum.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Suivi des lots</strong> : pouvoir retracer l'origine de chaque produit servi.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Gestion des allergènes</strong> : documentation précise des allergènes présents dans chaque plat.
                  </span>
                </li>
              </ul>
            </div>

            {/* Autres obligations */}
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
              📝 Autres obligations
            </h3>
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <ul className="space-y-3 m-0">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Formation du personnel</strong> : tous les employés doivent être formés à l'hygiène alimentaire.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Plan de lutte contre les nuisibles</strong> : contrat avec un prestataire et suivi des interventions.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Analyses microbiologiques</strong> : prélèvements réguliers pour vérifier la maîtrise sanitaire.
                  </span>
                </li>
              </ul>
            </div>

            {/* Note sur le temps */}
            <div className="bg-secondary/10 border-l-4 border-secondary rounded-r-xl p-6 my-8">
              <p className="text-muted-foreground m-0">
                <strong className="text-foreground">💡 À noter :</strong> Comme vous pouvez le constater, 
                la mise en conformité HACCP représente un travail quotidien conséquent. Entre les relevés 
                de température, les contrôles à réception, les fiches de nettoyage, l'étiquetage des produits 
                et l'archivage des documents, ce sont plusieurs heures par jour qui peuvent être consacrées 
                à ces tâches administratives. C'est pourquoi de nombreux restaurateurs cherchent des solutions 
                pour optimiser et automatiser ces processus.
              </p>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold text-primary-foreground mb-4">
                Simplifiez votre conformité HACCP
              </h3>
              <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
                LockHACCP digitalise l'ensemble de vos procédures HACCP. Relevés de température automatisés, 
                contrôles guidés, étiquetage simplifié, archivage automatique... 
                Gagnez du temps chaque jour tout en restant parfaitement conforme.
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Découvrir LockHACCP
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogMethodeHACCP;
