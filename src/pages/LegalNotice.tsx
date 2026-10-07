import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Mentions légales et hébergeur du site" description="Mentions légales de lockhaccp.fr : éditeur, hébergeurs du site, de l'application et des données, propriété intellectuelle, données personnelles." path="/mentions-legales" />
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
                <li><strong className="text-foreground">Email :</strong> <a href="mailto:contact@lockhaccp.fr" className="text-primary underline underline-offset-2 hover:no-underline">contact@lockhaccp.fr</a></li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-2xl border border-border">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Hébergement</h2>
              <ul className="text-muted-foreground list-none space-y-4">
                <li>
                  <strong className="text-foreground">Site lockhaccp.fr et application web :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis – 
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:no-underline">vercel.com</a>
                </li>
                <li>
                  <strong className="text-foreground">Base de données :</strong> Supabase Pte. Ltd., 65 Chulia Street #38-02/03, OCBC Centre, Singapour 049513 – données hébergées dans l'Union européenne – 
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:no-underline">supabase.com</a>
                </li>
                <li>
                  <strong className="text-foreground">Nom de domaine :</strong> Hostinger International Ltd, 61 Lordou Vironos Street, 6023 Larnaca, Chypre – 
                  <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:no-underline">hostinger.fr</a>
                </li>
                <li>
                  <strong className="text-foreground">Application mobile :</strong> développée avec FlutterFlow (FlutterFlow Inc., 340 S Lemon Ave #4104, Walnut, CA 91789, États-Unis) et distribuée sur l'App Store et Google Play.
                </li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-2xl border border-border">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Propriété intellectuelle</h2>
              <p className="text-muted-foreground mb-4">
                Tous les éléments du site lockhaccp.fr et de l'application (marque, textes, logos, visuels, structure) sont la propriété exclusive de LockHACCP. Toute reproduction ou exploitation sans autorisation est interdite.
              </p>
              <p className="text-muted-foreground">
                Les marques App Store et Google Play appartiennent respectivement à Apple Inc. et à Google LLC. Les textes réglementaires cités renvoient vers leurs sources officielles (Légifrance, EUR-Lex).
              </p>
            </section>

            <section className="bg-card p-6 rounded-2xl border border-border">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Données personnelles</h2>
              <p className="text-muted-foreground mb-4">
                Le responsable du traitement des données collectées sur le site et dans l'application est Alan TOUATI, pour LockHACCP. Les données collectées, leurs finalités, leurs durées de conservation et vos droits (accès, rectification, suppression, opposition, portabilité, limitation) sont détaillés dans la 
                <a href="/politique-confidentialite" className="text-primary underline underline-offset-2 hover:no-underline">politique de confidentialité</a>.
              </p>
              <p className="text-muted-foreground">
                Pour exercer vos droits, écrivez à <a href="mailto:contact@lockhaccp.fr" className="text-primary underline underline-offset-2 hover:no-underline">contact@lockhaccp.fr</a>. Vous pouvez aussi introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:no-underline">cnil.fr</a>).
              </p>
            </section>

            <section className="bg-card p-6 rounded-2xl border border-border">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Cookies</h2>
              <p className="text-muted-foreground">
                Les cookies et traceurs utilisés sur le site sont décrits dans la section « Cookies » de la 
                <a href="/politique-confidentialite" className="text-primary underline underline-offset-2 hover:no-underline">politique de confidentialité</a>.
              </p>
            </section>

            <section className="bg-card p-6 rounded-2xl border border-border">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Conditions d'utilisation et liens</h2>
              <p className="text-muted-foreground mb-4">
                L'utilisation de l'application LockHACCP est régie par les 
                <a href="/cgu" className="text-primary underline underline-offset-2 hover:no-underline">conditions générales d'utilisation</a>.
              </p>
              <p className="text-muted-foreground">
                Les liens vers des sites tiers sont fournis à titre d'information. LockHACCP n'est pas responsable de leur contenu. Pour toute question, rendez-vous sur la page 
                <a href="/contact" className="text-primary underline underline-offset-2 hover:no-underline">Contact</a>.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalNotice;
