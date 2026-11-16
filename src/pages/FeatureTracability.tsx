import { Camera, CheckCircle, FileSearch, FileText, History, QrCode, ScanLine, Search, Shield } from "lucide-react";
import { LienContextuel } from "@/components/LienContextuel";
import {
  Accent,
  CarteIllustration,
  PageFonctionnalite,
  SectionDuo,
  TelephoneHero,
  type Atout,
} from "@/components/fonctionnalite/PageFonctionnalite";
import { VIDEOS_APP } from "@/lib/videos-app";

const ATOUTS: Atout[] = [
  { icone: QrCode, titre: "Photo des étiquettes", texte: "Photographiez les étiquettes des produits reçus directement depuis l'application : elles restent attachées à la réception." },
  { icone: History, titre: "Historique des réceptions", texte: "Retrouvez chaque livraison avec sa date, son fournisseur, la température relevée et les photos." },
  { icone: Search, titre: "Classement par date", texte: "Les enregistrements sont rangés jour par jour : retrouver une livraison précise ne prend que quelques instants." },
  { icone: FileText, titre: "Export de données", texte: "Exportez vos données de traçabilité en PDF pour les contrôles sanitaires." },
  { icone: Shield, titre: "Rappel produit", texte: "En cas de rappel, retrouvez quand vous avez reçu le produit et de quel fournisseur, photo de l'étiquette à l'appui." },
  { icone: FileSearch, titre: "Qui a fait quoi", texte: "Chaque membre de l'équipe se connecte avec son code : chaque enregistrement indique qui l'a fait, et quand." },
];

const RAISONS = [
  {
    titre: "Répondez aux contrôles en quelques minutes",
    texte: "Lors d'un contrôle sanitaire, montrez vos réceptions et vos photos d'étiquettes sans chercher dans des classeurs.",
  },
  {
    titre: "Gérez les rappels produits efficacement",
    texte: "En cas d'alerte sanitaire, retrouvez rapidement les livraisons concernées et prenez les mesures appropriées.",
  },
  {
    titre: "Renforcez la confiance de vos clients",
    texte: "Montrez que vous savez d'où viennent vos produits et que vous les contrôlez à chaque livraison.",
  },
];

// Fiche d'une réception retrouvée dans l'historique (exemple).
function FicheReception() {
  const lignes = [
    { libelle: "Produit", valeur: "Saumon frais" },
    { libelle: "Fournisseur", valeur: "Océan Frais" },
    { libelle: "Origine", valeur: "Norvège" },
    { libelle: "DLC", valeur: "18/11/2026" },
  ];
  return (
    <CarteIllustration className="mx-auto max-w-md">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1.5 text-sm font-semibold text-primary">
          <QrCode className="h-4 w-4" /> Réception du 12/11/2026
        </span>
        <span className="text-xs text-muted-foreground">08 h 32</span>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-3">
        {lignes.map((l) => (
          <div key={l.libelle} className="rounded-2xl bg-[hsl(220_33%_97%)] p-4">
            <dt className="text-xs text-muted-foreground">{l.libelle}</dt>
            <dd className="mt-1 font-semibold text-foreground">{l.valeur}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-5 space-y-2 text-sm">
        <li className="flex items-center justify-between rounded-xl border border-border/80 bg-white px-4 py-3">
          <span className="text-muted-foreground">Température à réception</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
            2,1 °C <CheckCircle className="h-4 w-4" />
          </span>
        </li>
        <li className="flex items-center justify-between rounded-xl border border-border/80 bg-white px-4 py-3">
          <span className="text-muted-foreground">Photo de l'étiquette</span>
          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
            <Camera className="h-4 w-4 text-primary" /> Jointe
          </span>
        </li>
      </ul>
    </CarteIllustration>
  );
}

const FeatureTracability = () => (
  <PageFonctionnalite
    id="tracabilite"
    seo={{
      title: "Traçabilité alimentaire HACCP sur téléphone",
      description:
        "Traçabilité alimentaire HACCP : suivi des lots, DLC, fournisseurs. Restez conforme à la DDPP en cas de contrôle ou de rappel produit.",
    }}
    icone={FileSearch}
    etiquette="Traçabilité produits"
    titre={
      <>
        <Accent>Traçabilité alimentaire HACCP</Accent>, complète et instantanée
      </>
    }
    intro="Suivez l'origine et le parcours de tous vos produits. De la réception à l'assiette, maîtrisez votre chaîne d'approvisionnement."
    visuel={
      <TelephoneHero
        video={VIDEOS_APP.reception}
        puces={[
          { icone: ScanLine, titre: "Boucherie Martin", detail: "Bon de livraison photographié" },
          { icone: FileText, titre: "5 produits", detail: "Reconnus et enregistrés" },
        ]}
      />
    }
    atouts={{
      titre: "Outils de traçabilité puissants",
      intro: "Tout ce qu'il vous faut pour assurer une traçabilité irréprochable de vos produits.",
      items: ATOUTS,
    }}
    contenuSupplementaire={
      <LienContextuel to="/fonctionnalites/huiles" ancre="Contrôle huile de friture HACCP">
        Pour garder aussi l'historique des changements d'huile de vos friteuses, voir le
      </LienContextuel>
    }
    cta={{
      titre: "Maîtrisez votre traçabilité dès aujourd'hui",
      texte: "Rejoignez les professionnels qui font confiance à LockHACCP pour leur traçabilité.",
      capture: { src: VIDEOS_APP.reception.cle, alt: "Réception de marchandise : bon de livraison lu, 5 produits, fournisseur Boucherie Martin proposé" },
    }}
  >
    <SectionDuo
      surtitre="Pourquoi"
      titre={
        <>
          Pourquoi la traçabilité est <span className="text-secondary-texte">essentielle</span> ?
        </>
      }
      texte={
        <ul className="space-y-6">
          {RAISONS.map((r) => (
            <li key={r.titre} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light">
                <CheckCircle className="h-5 w-5 text-primary" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">{r.titre}</h3>
                <p className="mt-1 text-base">{r.texte}</p>
              </div>
            </li>
          ))}
        </ul>
      }
      visuel={<FicheReception />}
    />
  </PageFonctionnalite>
);

export default FeatureTracability;
