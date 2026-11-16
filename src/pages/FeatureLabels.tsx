import { Calendar, Edit, Hash, Printer, QrCode, Tag, Wifi } from "lucide-react";
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
  { icone: Edit, titre: "Création rapide", texte: "Créez vos étiquettes en quelques clics avec des modèles personnalisables." },
  { icone: Printer, titre: "Impression directe", texte: "Envoyez vos étiquettes directement vers votre étiqueteuse, sans ordinateur." },
  { icone: Calendar, titre: "DLC automatique", texte: "Calculez automatiquement les DLC/DDM selon vos règles de conservation." },
  { icone: QrCode, titre: "N° de lot et allergènes", texte: "L'étiquette porte le nom du produit, la date, la DLC, l'heure, un numéro de lot et les allergènes." },
  { icone: Tag, titre: "Multi-formats", texte: "Trois formats d'étiquettes : 29 × 62 mm, 38 × 90 mm et 50 × 80 mm." },
  { icone: Wifi, titre: "Étiqueteuses compatibles", texte: "Compatible avec les étiqueteuses Brother, Zebra et Epson en réseau." },
];

// Étiquette imprimée pour la production de la vidéo (sauce béarnaise, DLC et lot proposés par l'application).
// Les allergènes de la béarnaise : œufs et lait (beurre).
const INFOS_ETIQUETTE = [
  { libelle: "Produit", valeur: "Sauce béarnaise" },
  { libelle: "Production", valeur: "16/11/2026 · 11 h 36" },
  { libelle: "DLC", valeur: "18/11/2026" },
  { libelle: "Lot", valeur: "113616112026" },
  { libelle: "Allergènes", valeur: "Œufs, lait" },
];

function ApercuEtiquette() {
  return (
    <div className="mx-auto max-w-sm">
      <CarteIllustration className="relative -rotate-2 border-dashed border-border !p-0 transition-transform duration-500 hover:rotate-0">
        <div className="flex items-center justify-between border-b border-dashed border-border px-6 py-4">
          <span className="font-heading font-extrabold text-foreground">LockHACCP</span>
          <QrCode className="h-8 w-8 text-foreground" />
        </div>
        <dl className="space-y-2.5 px-6 py-5">
          {INFOS_ETIQUETTE.map((i) => (
            <div key={i.libelle} className="flex justify-between gap-4 text-sm">
              <dt className="text-muted-foreground">{i.libelle}</dt>
              <dd className={`text-right font-semibold ${i.libelle === "DLC" ? "text-secondary-texte" : "text-foreground"}`}>{i.valeur}</dd>
            </div>
          ))}
        </dl>
      </CarteIllustration>
      <p className="mt-5 text-center text-sm text-muted-foreground">Exemple d'étiquette imprimée</p>
    </div>
  );
}

function BandeauEtiqueteuses() {
  return (
    <section className="pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-border/80 bg-white/80 px-6 py-8 text-center sm:px-10 lg:flex-row lg:text-left">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground">Compatible avec les étiqueteuses Brother, Zebra et Epson</h3>
            <p className="mt-1 text-muted-foreground">Impression directe depuis l'application, sur une étiqueteuse en réseau.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["Brother", "Zebra", "Epson"].map((marque) => (
              <span key={marque} className="rounded-2xl border border-border bg-white px-6 py-3 font-heading text-lg font-extrabold text-foreground/80">
                {marque}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const FeatureLabels = () => (
  <PageFonctionnalite
    id="etiquettes"
    seo={{
      title: "Étiquettes DLC : logiciel et application pour imprimer",
      description:
        "Imprimez des étiquettes DLC conformes depuis votre téléphone : date limite calculée, n° de lot, allergènes. Étiqueteuses Brother, Zebra et Epson.",
    }}
    icone={Tag}
    etiquette="Création d'étiquettes"
    titre={
      <>
        <Accent>Étiquettes DLC</Accent> conformes, imprimées depuis votre téléphone
      </>
    }
    intro="Le logiciel calcule la date limite de chaque préparation, ajoute le numéro de lot et les allergènes, et envoie l'étiquette directement vers votre étiqueteuse DLC, sans ordinateur."
    visuel={
      <TelephoneHero
        video={VIDEOS_APP.etiquettes}
        puces={[
          { icone: Calendar, titre: "Sauce béarnaise × 3", detail: "DLC secondaire calculée" },
          { icone: Hash, titre: "Numéro de lot", detail: "Proposé automatiquement" },
        ]}
      />
    }
    atouts={{
      titre: "Des étiquettes professionnelles en quelques clics",
      intro: "Tout ce qu'il vous faut pour étiqueter vos productions conformément aux normes.",
      items: ATOUTS,
    }}
    cta={{
      titre: "Simplifiez l'étiquetage de vos productions",
      texte: "Essayez LockHACCP et créez vos premières étiquettes en quelques minutes.",
      capture: {
        src: VIDEOS_APP.etiquettes.cle,
        alt: "Écran de production : sauce béarnaise, DLC secondaire calculée et numéro de lot proposé",
      },
    }}
  >
    <SectionDuo
      inverse
      surtitre="Automatique"
      titre={
        <>
          Étiquettes conformes <span className="text-secondary-texte">automatiquement</span>
        </>
      }
      texte="Renseignez le produit, LockHACCP calcule automatiquement la DLC selon vos règles et génère une étiquette complète avec toutes les mentions obligatoires."
      points={[
        "Calcul automatique des DLC/DDM",
        "Mentions obligatoires intégrées",
        "Gestion des allergènes",
        "Numéro de lot automatique",
        "Impression en un clic",
      ]}
      visuel={<ApercuEtiquette />}
    />
    <BandeauEtiqueteuses />
  </PageFonctionnalite>
);

export default FeatureLabels;
