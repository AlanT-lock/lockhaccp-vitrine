import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Mentions légales - LockHACCP" description="Mentions légales du site lockhaccp.fr et de la société LockHACCP." path="/mentions-legales" />
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-12">
            Mentions légales
          </h1>

          <div className="prose prose-lg max-w-none space-y-12">
            <section className="bg-card p-6 rounded-2xl border border-border">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Éditeur du site</h2>
              <ul className="text-muted-foreground list-none space-y-2">
                <li><strong className="text-foreground">Nom commercial :</strong> LockHACCP</li>
                <li><strong className="text-foreground">Statut juridique :</strong> Entreprise individuelle – Auto entrepreneur</li>
                <li><strong className="text-foreground">SIRET :</strong> 898 193 214 00019</li>
                <li><strong className="text-foreground">Responsable de la publication :</strong> Alan TOUATI</li>
                <li><strong className="text-foreground">Adresse :</strong> 20 anc. Chemin des Vallergues, 06400, Cannes</li>
                <li><strong className="text-foreground">Téléphone :</strong> 06 46 64 00 23</li>
                <li><strong className="text-foreground">Email :</strong> <a href="mailto:contact@lockhaccp.fr" className="text-primary hover:underline">contact@lockhaccp.fr</a></li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-2xl border border-border">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Hébergeur du site</h2>
              <ul className="text-muted-foreground list-none space-y-2">
                <li><strong className="text-foreground">Hostinger International Ltd</strong></li>
                <li><strong className="text-foreground">Adresse :</strong> 61 Lordou Vironos Street, 6023 Larnaca, Chypre</li>
                <li><strong className="text-foreground">Site :</strong> <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.hostinger.fr</a></li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-2xl border border-border">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Hébergeur de l'application</h2>
              <ul className="text-muted-foreground list-none space-y-2">
                <li><strong className="text-foreground">FlutterFlow Inc.</strong></li>
                <li><strong className="text-foreground">Adresse :</strong> 340 S Lemon Ave #4104, Walnut, CA 91789, États-Unis</li>
                <li><strong className="text-foreground">Site :</strong> <a href="https://www.flutterflow.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.flutterflow.io</a></li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalNotice;
