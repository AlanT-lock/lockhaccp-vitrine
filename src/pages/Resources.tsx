import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";

const blogPosts = [
  {
    id: "affichage-obligatoire-restaurant",
    title: "Affichage obligatoire en restaurant",
    excerpt: "Découvrez tout ce que vous devez savoir sur les affichages obligatoires dans votre établissement de restauration : réglementation, avantages et mise en conformité.",
    date: "13 décembre 2024",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    category: "Réglementation"
  },
  {
    id: "methode-haccp",
    title: "La méthode HACCP",
    excerpt: "Guide complet sur la méthode HACCP : toutes les démarches à mettre en place pour garantir la sécurité alimentaire dans votre restaurant.",
    date: "12 décembre 2024",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    category: "HACCP"
  }
];

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Ressources HACCP - LockHACCP" description="Guides, modèles et articles pour comprendre et appliquer la méthode HACCP en restauration." path="/ressources" />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ressources & Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Guides pratiques, conseils et actualités pour maîtriser la sécurité alimentaire 
            et la conformité HACCP dans votre établissement.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to={`/ressources/${post.id}`}
                className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    Lire l'article
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
