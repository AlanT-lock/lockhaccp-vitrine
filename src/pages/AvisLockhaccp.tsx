// Page « LockHACCP est-il fiable ? » : la réponse du site aux questions sur la marque
// (avis, éditeur, ancienneté, données, engagement). Uniquement des faits vérifiables,
// limites comprises : pas de nombre d'utilisateurs ni de témoignage sans source.
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Seo } from "@/components/Seo";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { RelatedLinks } from "@/components/RelatedLinks";
import { Accent, Surtitre } from "@/components/design/elements";
import { useMaintenant } from "@/hooks/useMaintenant";
import { faqJsonLd, organizationJsonLd } from "@/lib/seo-jsonld";
import { formatPriceEUR, getActivePricing, type PricingGrid } from "@/lib/launch";
import { mensuelEquivalent } from "@/lib/tarifs-affichage";
import { LIEN_APP_STORE, LIEN_GOOGLE_PLAY } from "@/lib/app-store";
import { dateLongue } from "@/lib/blog";
import { AUTEUR } from "@/lib/auteur";
import { AVIS_APP_STORE, MAJ_PAGE_AVIS, SORTIE_APP_STORE } from "@/lib/fiabilite";

const LIEN = "font-semibold text-primary underline-offset-2 hover:underline";
const TITRE = "font-heading text-[clamp(1.6rem,2.8vw,2.1rem)] font-extrabold tracking-[-0.02em] text-foreground";
const TEXTE = "text-lg leading-relaxed text-foreground/85";

const noteAppStore = `${AVIS_APP_STORE.note} sur 5 (${AVIS_APP_STORE.nombre} notes)`;
const releveAppStore = dateLongue(AVIS_APP_STORE.releve);
const sortie = dateLongue(SORTIE_APP_STORE);

function prixLibelle(p: PricingGrid): string {
  return `${formatPriceEUR(mensuelEquivalent(p.mainYearly))} par mois et par établissement en paiement annuel (${formatPriceEUR(p.mainYearly)} par an), ou ${formatPriceEUR(p.mainMonthly)} au mois`;
}

function faqAvis(p: PricingGrid): FaqItem[] {
  return [
    {
      question: "LockHACCP est-il fiable ?",
      answer:
        `LockHACCP est une application française d'hygiène alimentaire éditée par Alan Touati, formateur en hygiène alimentaire, entreprise individuelle immatriculée à Cannes (SIRET 898 193 214 00019). Elle est disponible sur l'App Store depuis le ${sortie} et sur Google Play. L'essai dure 14 jours sans carte bancaire et l'abonnement est sans engagement. C'est une application récente : les avis publics sont encore peu nombreux.`,
    },
    {
      question: "Qui édite LockHACCP ?",
      answer:
        "Alan Touati, formateur en hygiène alimentaire chez SF FORMATION, organisme certifié Qualiopi. LockHACCP est une entreprise individuelle installée à Cannes, SIRET 898 193 214 00019. Les coordonnées complètes figurent dans les mentions légales du site.",
    },
    {
      question: "Depuis quand LockHACCP existe-t-il ?",
      answer: `L'application est disponible sur l'App Store depuis le ${sortie}. Elle est mise à jour régulièrement.`,
    },
    {
      question: "Où lire des avis sur LockHACCP ?",
      answer:
        `Sur l'App Store et sur Google Play, où chaque avis est déposé par un utilisateur de l'application. Au ${releveAppStore}, l'App Store affiche une note de ${noteAppStore}. Le site ne publie pas de témoignages : les avis se lisent là où nous ne pouvons pas les modifier.`,
    },
    {
      question: "LockHACCP est-il gratuit ?",
      answer:
        `Le générateur de Plan de Maîtrise Sanitaire est gratuit, sans abonnement. L'application se teste gratuitement pendant 14 jours, sans carte bancaire, puis coûte ${prixLibelle(p)}, toutes fonctions incluses.`,
    },
    {
      question: "Puis-je arrêter quand je veux ?",
      answer:
        "Oui. L'abonnement est sans engagement et se résilie depuis l'application, sans préavis. Vos enregistrements s'exportent en PDF ou en Excel.",
    },
    {
      question: "Où sont hébergées mes données ?",
      answer:
        "Dans l'Union européenne, chez Supabase. Le paiement passe par Stripe : LockHACCP n'a pas accès aux données de votre carte bancaire.",
    },
    {
      question: "LockHACCP est-il agréé par la DDPP ?",
      answer:
        "La DDPP n'agrée pas de logiciel. La réglementation demande de garder la trace de vos contrôles, sans imposer de support : une fiche papier ou une application sont acceptées. LockHACCP enregistre chaque contrôle avec sa date, son heure et la personne qui l'a fait, et l'historique se présente à l'inspecteur sur l'écran ou en PDF.",
    },
  ];
}

function Bloc({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_40px_80px_-50px_hsl(211_100%_20%/0.45)] sm:p-10">
      <h2 className={TITRE}>{titre}</h2>
      <div className={`mt-5 space-y-4 ${TEXTE}`}>{children}</div>
    </section>
  );
}

const AvisLockhaccp = () => {
  const prix = getActivePricing(useMaintenant());
  const faq = faqAvis(prix);

  const fiche: { libelle: string; valeur: ReactNode }[] = [
    { libelle: "Éditeur", valeur: "Alan Touati, entreprise individuelle" },
    { libelle: "SIRET", valeur: "898 193 214 00019" },
    { libelle: "Adresse", valeur: "20 anc. Chemin des Vallergues, 06400 Cannes" },
    { libelle: "Contact", valeur: "contact@lockhaccp.fr · 06 46 64 00 23" },
    { libelle: "Sur l'App Store depuis", valeur: sortie },
    { libelle: "Plateformes", valeur: "iPhone, iPad, Android, navigateur web" },
    { libelle: "Prix", valeur: `${prixLibelle(prix)}, toutes fonctions incluses` },
    { libelle: "Essai gratuit", valeur: "14 jours, sans carte bancaire" },
    { libelle: "Engagement", valeur: "Aucun. Résiliation depuis l'application, sans préavis" },
    { libelle: "Données", valeur: "Hébergées dans l'Union européenne" },
  ];

  return (
    <div className="min-h-screen">
      <Seo
        title="LockHACCP est-il fiable ? Avis, éditeur et garanties"
        description="Qui édite LockHACCP, depuis quand, où lire les avis, où sont vos données et ce que vous engagez en l'essayant : les faits vérifiables, limites comprises."
        path="/avis-lockhaccp"
        jsonLd={[faqJsonLd(faq), organizationJsonLd]}
      />
      <Navbar />

      <main id="main-content">
        <div className="container mx-auto max-w-4xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
          <header>
            <Surtitre>Avis et fiabilité</Surtitre>
            <h1 className="font-heading text-[clamp(2.3rem,5.2vw,3.9rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-foreground">
              LockHACCP est-il <Accent>fiable</Accent> ?
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-foreground/85 sm:text-xl">
              LockHACCP est une application française d'hygiène alimentaire pour les cuisines professionnelles, éditée par{" "}
              <Link to={AUTEUR.url} className={LIEN}>Alan Touati</Link>, formateur en hygiène alimentaire. Elle est disponible
              sur l'App Store depuis le {sortie} et sur Google Play. L'essai dure 14 jours sans carte bancaire, et
              l'abonnement est sans engagement. C'est une application récente : les avis publics sont encore peu nombreux,
              et cette page vous dit où les lire.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Page mise à jour le <time dateTime={MAJ_PAGE_AVIS}>{dateLongue(MAJ_PAGE_AVIS)}</time>.
            </p>
          </header>

          <div className="mt-12 space-y-6">
            <Bloc titre="Les faits vérifiables">
              <p>
                Tout ce qui suit peut être contrôlé : dans les{" "}
                <Link to="/mentions-legales" className={LIEN}>mentions légales</Link>, sur la fiche de l'application dans
                les stores, ou sur la page <Link to="/tarifs" className={LIEN}>tarifs</Link>.
              </p>
              <dl className="divide-y divide-border rounded-2xl border border-border/80 bg-[hsl(220_33%_98%)] text-base">
                {fiche.map((ligne) => (
                  <div key={ligne.libelle} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[14rem_1fr] sm:gap-4">
                    <dt className="font-semibold text-foreground">{ligne.libelle}</dt>
                    <dd className="text-foreground/85">{ligne.valeur}</dd>
                  </div>
                ))}
              </dl>
            </Bloc>

            <Bloc titre="Qui est derrière LockHACCP">
              <p>
                LockHACCP n'est pas édité par une société anonyme. C'est le travail d'une personne identifiée :{" "}
                <Link to={AUTEUR.url} className={LIEN}>Alan Touati</Link>, formateur en hygiène alimentaire chez SF
                FORMATION, un organisme certifié Qualiopi et autorisé par la préfecture à dispenser la formation de
                14 heures obligatoire en restauration commerciale.
              </p>
              <p>
                L'application reprend ce qu'il enseigne en formation : quelles températures relever, quoi noter, quoi
                faire en cas d'écart. Il a aussi conçu le contenu du{" "}
                <Link to="/plan-de-maitrise-sanitaire" className={LIEN}>Plan de Maîtrise Sanitaire gratuit</Link> que le
                site génère, et il signe les articles des <Link to="/blog" className={LIEN}>ressources</Link>, avec un
                lien vers le texte officiel à chaque règle citée.
              </p>
            </Bloc>

            <Bloc titre="Les avis sur LockHACCP">
              <p>
                Les avis se lisent sur les stores, là où chacun est déposé par un utilisateur de l'application et où nous
                ne pouvons ni les choisir ni les modifier :
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <a href={LIEN_APP_STORE} target="_blank" rel="noopener noreferrer" className={LIEN}>LockHACCP sur l'App Store</a>
                  {" "}: note de {noteAppStore} au {releveAppStore}.
                </li>
                <li>
                  <a href={LIEN_GOOGLE_PLAY} target="_blank" rel="noopener noreferrer" className={LIEN}>LockHACCP sur Google Play</a>.
                </li>
              </ul>
              <p>
                C'est peu, et nous le disons : l'application est récente. Ce site ne publie pas de témoignages. Si vous
                voulez vous faire votre propre avis, l'essai gratuit de 14 jours est fait pour cela.
              </p>
            </Bloc>

            <Bloc titre="Ce que vous engagez en l'essayant">
              <p>
                Rien. L'essai dure 14 jours et ne demande pas de carte bancaire : sans action de votre part, rien n'est
                prélevé. Si vous vous abonnez, c'est sans engagement, et la résiliation se fait depuis l'application, sans
                préavis.
              </p>
              <p>
                Le prix est public : {prixLibelle(prix)}, toutes fonctions incluses. Le détail est
                sur la page <Link to="/tarifs" className={LIEN}>tarifs</Link>.
              </p>
            </Bloc>

            <Bloc titre="Vos données">
              <p>
                Vos enregistrements sont hébergés dans l'Union européenne, chez Supabase. Le paiement est géré par Stripe :
                LockHACCP n'a pas accès aux données de votre carte bancaire. Vos enregistrements s'exportent en PDF ou en
                Excel, pour les présenter lors d'un contrôle ou les conserver.
              </p>
              <p>
                Vos droits (accès, rectification, suppression, portabilité) et les durées de conservation sont détaillés
                dans la <Link to="/politique-confidentialite" className={LIEN}>politique de confidentialité</Link>.
              </p>
            </Bloc>

            <Bloc titre="Une application est-elle acceptée lors d'un contrôle sanitaire ?">
              <p>
                Oui. La DDPP n'agrée pas de logiciel. Le règlement
                européen 852/2004 demande de garder la trace de vos contrôles, sans imposer de support : une fiche papier
                ou une application sont acceptées.
              </p>
              <p>
                LockHACCP enregistre chaque contrôle avec sa date, son heure et la personne qui l'a fait. Le jour du
                contrôle, l'historique se présente sur l'écran ou en PDF. Ce que l'inspecteur regarde est décrit dans{" "}
                <Link to="/blog/controle-sanitaire-restaurant-inspecteur-ddpp" className={LIEN}>
                  Contrôle sanitaire en restaurant : ce que regarde vraiment l'inspecteur
                </Link>.
              </p>
            </Bloc>

            <Bloc titre="Les limites à connaître">
              <ul className="list-disc space-y-2 pl-6">
                <li>L'application est récente, et les avis publics sont encore peu nombreux.</li>
                <li>
                  LockHACCP est édité par un indépendant, pas par une grande entreprise. Vous échangez directement avec
                  la personne qui conçoit l'application.
                </li>
                <li>
                  Personne ne vient installer de matériel dans votre cuisine : tout se met en place à distance, et le
                  paramétrage est offert.
                </li>
                <li>L'application ne se connecte ni à votre caisse ni à votre logiciel de commande.</li>
              </ul>
              <p>
                Pour situer LockHACCP face aux autres solutions, avec leurs prix relevés sur leurs sites, lisez le{" "}
                <Link to="/blog/meilleur-logiciel-haccp-comparatif" className={LIEN}>comparatif des logiciels HACCP</Link>.
              </p>
            </Bloc>
          </div>
        </div>

        <FaqSection items={faq} title="Vos questions sur LockHACCP" />
        <CTASection
          titre="Faites-vous votre propre avis"
          texte="Essayez LockHACCP pendant 14 jours, sans carte bancaire et sans engagement."
        />
        <RelatedLinks
          items={[
            { to: "/tarifs", label: "Tarifs", description: "Un prix public, toutes fonctions incluses." },
            { to: "/application-pms", label: "L'application HACCP", description: "Ce qu'elle fait, écran par écran." },
            { to: "/blog/meilleur-logiciel-haccp-comparatif", label: "Comparatif des logiciels HACCP", description: "Huit applications et leurs prix." },
            { to: AUTEUR.url, label: "Alan Touati", description: "Formateur en hygiène alimentaire, créateur de LockHACCP." },
            { to: "/contact", label: "Contact", description: "Une réponse sous 24 h." },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
};

export default AvisLockhaccp;
