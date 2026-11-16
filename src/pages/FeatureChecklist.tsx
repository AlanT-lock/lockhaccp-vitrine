import { BarChart3, Bell, Check, ClipboardCheck, FileText, Settings, Users } from "lucide-react";
import {
  Accent,
  CarteIllustration,
  PageFonctionnalite,
  SectionDuo,
  type Atout,
} from "@/components/fonctionnalite/PageFonctionnalite";
import { VIDEOS_APP } from "@/lib/videos-app";

const ATOUTS: Atout[] = [
  { icone: Settings, titre: "100% personnalisable", texte: "Créez des checklists adaptées aux spécificités de votre établissement et de vos points de contrôle." },
  { icone: Users, titre: "Attribution par rôle", texte: "Assignez les checklists aux membres de l'équipe selon leurs responsabilités." },
  { icone: Bell, titre: "Rappels intelligents", texte: "Recevez des notifications aux heures définies pour ne jamais oublier un contrôle." },
  { icone: BarChart3, titre: "Suivi de conformité", texte: "Visualisez le taux de complétion et identifiez les points d'amélioration." },
  { icone: FileText, titre: "Rapports automatiques", texte: "Générez des rapports de synthèse pour vos contrôles internes et externes." },
  { icone: ClipboardCheck, titre: "Validation rapide", texte: "Complétez vos checklists en quelques clics depuis n'importe quel appareil." },
];

interface ListeExemple {
  titre: string;
  items: { nom: string; fait: boolean }[];
}

const OUVERTURE: ListeExemple = {
  titre: "Ouverture",
  items: [
    { nom: "Vérifier les températures des chambres froides", fait: true },
    { nom: "Contrôler les dates des produits", fait: true },
    { nom: "Vérifier la propreté des surfaces", fait: true },
    { nom: "Contrôler le fonctionnement des équipements", fait: false },
  ],
};

const FERMETURE: ListeExemple = {
  titre: "Fermeture",
  items: [
    { nom: "Nettoyer les plans de travail", fait: false },
    { nom: "Ranger les produits entamés", fait: false },
    { nom: "Vider les poubelles", fait: false },
    { nom: "Vérifier les températures de conservation", fait: false },
  ],
};

function CarteListe({ liste, className = "" }: { liste: ListeExemple; className?: string }) {
  const faits = liste.items.filter((i) => i.fait).length;
  return (
    <CarteIllustration className={className}>
      <div className="flex items-center justify-between">
        <p className="font-heading text-lg font-bold text-foreground">{liste.titre}</p>
        <span className="rounded-full bg-primary-light px-3 py-1 text-sm font-bold tabular-nums text-primary">
          {faits}/{liste.items.length}
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {liste.items.map((item) => (
          <li key={item.nom} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 ${
                item.fait ? "border-primary bg-primary" : "border-border bg-white"
              }`}
            >
              {item.fait && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
            </span>
            <span className={item.fait ? "text-muted-foreground line-through decoration-muted-foreground/40" : "text-foreground"}>{item.nom}</span>
          </li>
        ))}
      </ul>
    </CarteIllustration>
  );
}

const FeatureChecklist = () => (
  <PageFonctionnalite
    id="checklist"
    seo={{
      title: "Check-list HACCP ouverture et fermeture",
      description: "Créez vos check-lists HACCP sur mesure : ouverture, fermeture, service. Rappels, validation, historique consultable.",
    }}
    icone={ClipboardCheck}
    etiquette="Checklist personnalisée"
    titre={
      <>
        <Accent>Checklists HACCP</Accent> adaptées à votre établissement
      </>
    }
    intro="Créez des checklists sur mesure pour tous vos points de contrôle. Ouverture, fermeture, service... ne laissez rien au hasard."
    visuel={<CarteListe liste={OUVERTURE} className="flotte-doux mx-auto max-w-md" />}
    atouts={{
      titre: "Des checklists pensées pour votre quotidien",
      intro: "Flexibles, intuitives et toujours accessibles pour vos équipes.",
      items: ATOUTS,
    }}
    cta={{
      titre: "Créez vos checklists personnalisées",
      texte: "Commencez gratuitement et adaptez LockHACCP à vos besoins spécifiques.",
      capture: {
        src: VIDEOS_APP.historique.cle,
        alt: "Nettoyage du jour : 15 surfaces sur 15 nettoyées, zones Cuisine, Plonge et Sanitaires terminées",
      },
    }}
  >
    <SectionDuo
      surtitre="Sur mesure"
      titre={
        <>
          Adaptez les contrôles à <span className="text-secondary-texte">votre réalité</span>
        </>
      }
      texte="Chaque restaurant est unique. LockHACCP vous permet de créer des checklists qui correspondent exactement à vos besoins et aux exigences de votre plan HACCP."
      points={[
        "Checklists d'ouverture et de fermeture",
        "Contrôles spécifiques par poste de travail",
        "Vérifications lors des changements d'équipe",
        "Audits internes personnalisés",
        "Points de contrôle critiques (CCP)",
      ]}
      visuel={<CarteListe liste={FERMETURE} className="mx-auto max-w-md" />}
    />
  </PageFonctionnalite>
);

export default FeatureChecklist;
