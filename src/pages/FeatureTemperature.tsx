import { AlertTriangle, BarChart3, Bell, Check, Clock, Shield, Smartphone, Thermometer, Snowflake } from "lucide-react";
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
  { icone: Bell, titre: "Rappel chaque matin", texte: "Une notification vous rappelle les relevés du jour, selon vos jours d'ouverture et vos services." },
  {
    icone: Thermometer,
    titre: "Une consigne par équipement",
    texte: "Chaque frigo, chambre froide ou congélateur a sa consigne : l'application indique tout de suite si le relevé est conforme.",
  },
  { icone: Shield, titre: "Action corrective notée", texte: "En cas d'écart, vous indiquez ce qui a été fait. C'est exactement ce que l'inspecteur veut voir." },
  { icone: BarChart3, titre: "Historique complet", texte: "Retrouvez tous les relevés de chaque équipement, avec la date, l'heure et la personne qui l'a saisi." },
  { icone: Clock, titre: "Rapport hebdomadaire", texte: "Chaque semaine, un récapitulatif par e-mail des contrôles faits et de ceux qui manquent." },
  { icone: Smartphone, titre: "Sur téléphone et tablette", texte: "Le relevé se fait en quelques secondes devant l'équipement, sans fiche papier à remplir." },
];

// Ce que montre la vidéo « temperatures » : chambre froide à 7,4 °C, mesures correctives choisies.
function CarteEcart() {
  return (
    <CarteIllustration className="mx-auto max-w-md">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Snowflake className="h-6 w-6" />
        </span>
        <div>
          <p className="font-heading text-lg font-bold text-foreground">Chambre froide</p>
          <p className="text-sm text-muted-foreground">Relevé du matin</p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl bg-red-50 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-red-700/80">Température relevée</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
            <AlertTriangle className="h-3.5 w-3.5" /> Hors limite
          </span>
        </div>
        <p className="mt-2 font-heading text-5xl font-extrabold tracking-tight text-red-700">7,4 °C</p>
        <p className="mt-1 text-sm text-red-700/70">Limite : 4 °C au plus</p>
      </div>
      <p className="mt-6 text-sm font-semibold text-foreground">Mesure corrective</p>
      <ul className="mt-3 space-y-2">
        {["Produits transférés dans une autre enceinte froide", "Technicien frigoriste appelé"].map((t) => (
          <li key={t} className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-white p-3 text-sm text-foreground">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </span>
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-center text-xs text-muted-foreground">Relevé enregistré avec la date, l'heure et son auteur</p>
    </CarteIllustration>
  );
}

const FeatureTemperature = () => (
  <PageFonctionnalite
    id="temperatures"
    seo={{
      title: "Relevé de température HACCP sur téléphone",
      description:
        "Relevé de température HACCP de vos frigos et congélateurs sur téléphone : rappel chaque matin, consigne par équipement, actions correctives, historique.",
    }}
    icone={Thermometer}
    etiquette="Relevé de températures"
    titre={
      <>
        <Accent>Relevé de température HACCP</Accent> en quelques secondes
      </>
    }
    intro="Fini les fiches papier : chaque relevé de vos réfrigérateurs et congélateurs se fait sur téléphone, avec la consigne affichée et un rappel chaque matin."
    visuel={
      <TelephoneHero
        video={VIDEOS_APP.temperatures}
        puces={[
          { icone: Thermometer, titre: "Chambre froide · 7,4 °C", detail: "Mesure corrective demandée" },
          { icone: Shield, titre: "Écart tracé", detail: "Date, heure et auteur" },
        ]}
      />
    }
    atouts={{
      titre: "Tout ce dont vous avez besoin pour le suivi des températures",
      intro: "Pensé pour la cuisine : rapide à saisir, simple à montrer lors d'un contrôle.",
      items: ATOUTS,
    }}
    contenuSupplementaire={
      <LienContextuel to="/fonctionnalites/huiles" ancre="Contrôle huile de friture HACCP">
        Les friteuses aussi se surveillent à intervalles réguliers, avec un seuil à ne pas dépasser :
      </LienContextuel>
    }
    cta={{
      titre: "Prêt à digitaliser vos relevés de température ?",
      texte: "Commencez gratuitement et découvrez comment LockHACCP peut simplifier votre quotidien.",
      capture: { src: VIDEOS_APP.tour.cle, alt: "Écran des températures : réfrigérateur de cuisine à 3 °C, conforme" },
    }}
  >
    <SectionDuo
      surtitre="Au quotidien"
      titre={
        <>
          Un relevé en <span className="text-secondary-texte">quelques secondes</span>, devant l'équipement
        </>
      }
      texte="Vous saisissez la température lue, l'application la compare à la consigne de l'équipement et, en cas d'écart, vous demande ce qui a été fait. Tout est daté et signé, prêt à être montré à l'inspecteur."
      points={[
        "Plus de fiche papier oubliée",
        "Consigne affichée à chaque relevé",
        "Écart signalé tout de suite",
        "Action corrective tracée",
        "Historique prêt pour le contrôle",
        "Accès pour chaque membre de l'équipe",
      ]}
      visuel={<CarteEcart />}
    />
  </PageFonctionnalite>
);

export default FeatureTemperature;
