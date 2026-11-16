import { AlertTriangle, Calendar, Camera, CheckCircle, FileText, Package, ScanLine, Thermometer } from "lucide-react";
import { LienContextuel } from "@/components/LienContextuel";
import { Accent, PageFonctionnalite, Surtitre, TITRE_H2, TelephoneHero, type Atout } from "@/components/fonctionnalite/PageFonctionnalite";
import { VIDEOS_APP } from "@/lib/videos-app";

const ATOUTS: Atout[] = [
  { icone: Thermometer, titre: "Contrôle température", texte: "Vérifiez la température des produits à réception avec seuils personnalisables par type de marchandise." },
  { icone: Calendar, titre: "Vérification DLC/DDM", texte: "Contrôlez les dates limites de consommation et recevez des alertes pour les produits proches de l'échéance." },
  { icone: Camera, titre: "Photos justificatives", texte: "Prenez des photos en cas d'anomalie pour documenter les non-conformités et les retours fournisseurs." },
  { icone: FileText, titre: "Traçabilité fournisseur", texte: "Enregistrez les numéros de lot, l'origine des produits et les informations du bon de livraison." },
  { icone: AlertTriangle, titre: "Gestion des refus", texte: "Documentez les refus de marchandises avec motif et photo pour vos échanges avec les fournisseurs." },
  { icone: CheckCircle, titre: "Validation rapide", texte: "Validez une réception conforme en quelques clics avec un formulaire optimisé pour la rapidité." },
];

const ETAPES = [
  { titre: "Réception de la livraison", texte: "Le livreur arrive, vous ouvrez LockHACCP sur votre smartphone ou tablette pour démarrer le contrôle." },
  { titre: "Contrôle des produits", texte: "Vérifiez température, DLC, état des emballages et conformité visuelle pour chaque catégorie de produits." },
  { titre: "Validation ou refus", texte: "Validez la réception si tout est conforme, ou documentez les anomalies avec photos et commentaires." },
  { titre: "Archivage automatique", texte: "Le contrôle est automatiquement enregistré et accessible pour les contrôles sanitaires." },
];

function SectionProcessus() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <Surtitre>Pas à pas</Surtitre>
          <h2 className={TITRE_H2}>
            Un processus simple en <span className="text-secondary-texte">4 étapes</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">De la réception à l'archivage, tout est pensé pour vous faire gagner du temps.</p>
        </div>
        <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {/* Fil qui relie les étapes sur grand écran */}
          <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 lg:block" />
          {ETAPES.map((e, i) => (
            <li key={e.titre} className="relative rounded-3xl border border-border/80 bg-white/80 p-7 text-center lg:border-0 lg:bg-transparent lg:p-0">
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-heading text-lg font-extrabold text-white shadow-[0_14px_30px_-12px_hsl(211_100%_26%/0.6)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-heading text-lg font-bold text-foreground">{e.titre}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground lg:px-2">{e.texte}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FeatureReception = () => (
  <PageFonctionnalite
    id="receptions"
    seo={{
      title: "Contrôle à réception HACCP : conforme et rapide",
      description:
        "Contrôle des marchandises HACCP en quelques clics : températures, photos de non-conformité, traçabilité fournisseurs automatique.",
    }}
    icone={Package}
    etiquette="Contrôle des réceptions"
    titre={
      <>
        <Accent>Contrôle à réception</Accent> des marchandises, en toute simplicité
      </>
    }
    intro="Ne laissez plus rien passer. Vérifiez la conformité de vos livraisons et conservez une traçabilité complète de toutes vos réceptions."
    visuel={
      <TelephoneHero
        video={VIDEOS_APP.reception}
        puces={[
          { icone: ScanLine, titre: "Bon de livraison lu", detail: "Fournisseur et produits reconnus" },
          { icone: Thermometer, titre: "Produits frais", detail: "Température saisie" },
        ]}
      />
    }
    atouts={{
      titre: "Un contrôle complet à chaque livraison",
      intro: "Tous les points de contrôle HACCP réunis dans une interface simple et intuitive.",
      items: ATOUTS,
    }}
    contenuSupplementaire={
      <LienContextuel to="/fonctionnalites/huiles" ancre="Contrôle huile de friture HACCP">
        Les bidons d'huile de friture livrés se tracent comme le reste, et l'huile en cuve se contrôle ensuite :
      </LienContextuel>
    }
    cta={{
      titre: "Simplifiez vos contrôles de réception",
      texte: "Essayez LockHACCP gratuitement et découvrez une nouvelle façon de gérer vos réceptions.",
      capture: { src: VIDEOS_APP.reception.cle, alt: "Réception de marchandise : bon de livraison lu, 5 produits, fournisseur Boucherie Martin proposé" },
    }}
  >
    <SectionProcessus />
  </PageFonctionnalite>
);

export default FeatureReception;
