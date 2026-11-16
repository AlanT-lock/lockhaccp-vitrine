import { AlertTriangle, Droplets, FileText, Gauge, History, TrendingDown } from "lucide-react";
import {
  Accent,
  CarteIllustration,
  PageFonctionnalite,
  SectionDuo,
  type Atout,
} from "@/components/fonctionnalite/PageFonctionnalite";
import { VIDEOS_APP } from "@/lib/videos-app";

const ATOUTS: Atout[] = [
  { icone: Gauge, titre: "Enregistrement des tests", texte: "Enregistrez les résultats de vos tests polaires avec seuils de conformité personnalisables." },
  { icone: History, titre: "Suivi de l'historique", texte: "Consultez l'évolution de la qualité de chaque bain d'huile dans le temps." },
  { icone: AlertTriangle, titre: "Alertes de changement", texte: "Recevez des alertes lorsque l'huile approche du seuil de remplacement." },
  { icone: FileText, titre: "Changements tracés", texte: "Chaque changement d'huile est enregistré avec la date et la personne qui l'a fait." },
  { icone: TrendingDown, titre: "Prêt pour le contrôle", texte: "L'historique des tests et des changements se montre en quelques secondes à l'inspecteur." },
  { icone: Droplets, titre: "Multi-friteuses", texte: "Gérez plusieurs friteuses avec identification claire de chaque équipement." },
];

const REPERES = [
  { valeur: "25 %", titre: "Seuil réglementaire", texte: "Taux de composés polaires maximum autorisé" },
  { valeur: "Quotidien", titre: "Fréquence recommandée", texte: "Test à effectuer chaque jour d'utilisation" },
  { valeur: "Daté", titre: "Enregistrement", texte: "Chaque test et chaque changement, avec son auteur" },
];

const ECHELLE_MAX = 30;

/** Jauge d'un test : taux mesuré sur une échelle de 0 à 30 %, seuil réglementaire à 25 %. */
function Jauge({ taux }: { taux: number }) {
  const surveillance = taux >= 20;
  return (
    <div>
      <div className="relative h-3 rounded-full bg-muted">
        <div
          className={`barre-remplit h-full rounded-full ${surveillance ? "bg-secondary" : "bg-emerald-500"}`}
          style={{ width: `${(taux / ECHELLE_MAX) * 100}%` }}
        />
        <span aria-hidden="true" className="absolute -top-1.5 h-6 w-0.5 rounded bg-red-500" style={{ left: `${(25 / ECHELLE_MAX) * 100}%` }} />
      </div>
      <div className="relative mt-1.5 h-4 text-[0.7rem] text-muted-foreground">
        <span className="absolute left-0">0 %</span>
        <span className="absolute -translate-x-1/2 whitespace-nowrap text-red-600" style={{ left: `${(25 / ECHELLE_MAX) * 100}%` }}>
          seuil 25 %
        </span>
      </div>
    </div>
  );
}

// Visuel du hero : le dernier test enregistré (exemple).
function CarteTest() {
  return (
    <div className="relative mx-auto max-w-sm">
      <CarteIllustration className="flotte-doux">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-light text-secondary-texte">
            <Droplets className="h-6 w-6" />
          </span>
          <div>
            <p className="font-heading text-lg font-bold text-foreground">Friteuse n° 1</p>
            <p className="text-sm text-muted-foreground">Test du jour · 11 h 05</p>
          </div>
        </div>
        <div className="mt-7 flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Composés polaires</p>
            <p className="font-heading text-6xl font-extrabold tracking-tight text-foreground">18 %</p>
          </div>
          <span className="mb-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">Conforme</span>
        </div>
        <div className="mt-6">
          <Jauge taux={18} />
        </div>
      </CarteIllustration>
    </div>
  );
}

// Les friteuses de l'établissement (exemple).
function CarteFriteuses() {
  const friteuses = [
    { nom: "Friteuse n° 1", taux: 18, statut: "Conforme", classe: "bg-emerald-50 text-emerald-700" },
    { nom: "Friteuse n° 2", taux: 22, statut: "Surveillance", classe: "bg-secondary-light text-secondary-texte" },
  ];
  return (
    <CarteIllustration className="mx-auto max-w-md">
      <p className="font-heading text-lg font-bold text-foreground">Dernier test enregistré</p>
      <ul className="mt-6 space-y-6">
        {friteuses.map((f) => (
          <li key={f.nom}>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-foreground">{f.nom}</span>
              <span className="flex items-center gap-2">
                <span className="font-heading text-xl font-extrabold text-foreground">{f.taux} %</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${f.classe}`}>{f.statut}</span>
              </span>
            </div>
            <Jauge taux={f.taux} />
          </li>
        ))}
      </ul>
    </CarteIllustration>
  );
}

function BandeReperes() {
  return (
    <section className="pb-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {REPERES.map((r) => (
            <div key={r.titre} className="rounded-3xl bg-secondary p-7 text-white">
              <p className="font-heading text-4xl font-extrabold tracking-tight">{r.valeur}</p>
              <p className="mt-3 font-semibold">{r.titre}</p>
              <p className="mt-1 text-sm text-white/85">{r.texte}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FeatureOil = () => (
  <PageFonctionnalite
    id="huiles"
    seo={{
      title: "Contrôle huile de friture HACCP",
      description: "Suivez la qualité de votre huile de friture : tests, alertes, historique. Respectez les seuils réglementaires HACCP sans effort.",
    }}
    icone={Droplets}
    etiquette="Contrôle huiles de friture"
    titre={
      <>
        <Accent>Contrôle des huiles de friture</Accent> : maîtrisez leur qualité
      </>
    }
    intro="Testez, enregistrez et suivez la conformité de vos huiles de friture. Restez en règle avec la réglementation, sans fiche papier."
    visuel={<CarteTest />}
    atouts={{
      titre: "Un suivi complet de vos huiles de friture",
      intro: "De l'enregistrement du test à la génération du rapport, tout est simplifié.",
      items: ATOUTS,
    }}
    cta={{
      titre: "Simplifiez le contrôle de vos huiles",
      texte: "Essayez LockHACCP gratuitement et digitalisez vos contrôles d'huile de friture.",
      capture: { src: VIDEOS_APP.tour.cle, alt: "Écran des températures : réfrigérateur de cuisine à 3 °C, conforme" },
    }}
  >
    <BandeReperes />
    <SectionDuo
      surtitre="Pourquoi"
      titre={
        <>
          Pourquoi contrôler vos <span className="text-secondary-texte">huiles de friture</span> ?
        </>
      }
      texte="Au-delà de l'obligation réglementaire, le contrôle régulier des huiles de friture garantit la qualité de vos produits et la santé de vos clients."
      points={[
        "Conformité à la réglementation HACCP",
        "Prévention des risques pour la santé",
        "Amélioration du goût des produits frits",
        "Traçabilité complète pour les contrôles",
      ]}
      visuel={<CarteFriteuses />}
    />
  </PageFonctionnalite>
);

export default FeatureOil;
