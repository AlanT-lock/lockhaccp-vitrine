import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, ClipboardCheck, Droplets, FileSearch, FileText, Package, Sparkles, Tag, Thermometer } from "lucide-react";
import releveTemperature from "@/assets/pms/releve-temperature-petit.webp";
import planNettoyage from "@/assets/pms/plan-nettoyage-petit.webp";
import tableauCcp from "@/assets/pms/tableau-ccp-petit.webp";

// Grille « bento » des modules : deux grandes cartes illustrées pour les usages quotidiens,
// les autres plus compactes, et une large carte orange pour le PMS gratuit.

function VisuelTemperatures() {
  const lignes = [
    { nom: "Frigo cuisine", valeur: "3,2 °C" },
    { nom: "Chambre froide", valeur: "2,8 °C" },
    { nom: "Congélateur", valeur: "−19 °C" },
  ];
  return (
    <div aria-hidden="true" className="w-56 space-y-2 rounded-2xl bg-white p-3 shadow-[0_18px_40px_-20px_hsl(211_100%_20%/0.4)] ring-1 ring-border">
      {lignes.map((l) => (
        <div key={l.nom} className="flex items-center justify-between rounded-lg bg-[hsl(220_33%_97%)] px-3 py-2 text-xs">
          <span className="font-semibold text-foreground">{l.nom}</span>
          <span className="flex items-center gap-1.5 font-bold text-primary">
            {l.valeur}
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
              <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

function VisuelEtiquette() {
  return (
    <div aria-hidden="true" className="w-52 rotate-3 rounded-xl border border-dashed border-slate-300 bg-white p-3 font-mono text-[0.68rem] leading-relaxed text-foreground shadow-[0_18px_40px_-20px_hsl(211_100%_20%/0.4)]">
      <p className="mb-1 font-sans text-sm font-extrabold">SAUCE BÉARNAISE</p>
      <p>Fabriqué le 16/11 · 10:42</p>
      <p className="font-bold">DLC : 18/11</p>
      <p>Lot : L-1611-03</p>
      <p>Allergènes : œufs, lait</p>
    </div>
  );
}

interface Module {
  icone: typeof Thermometer;
  titre: string;
  texte: string;
  lien: string;
  visuel?: ReactNode;
}

const GRANDS: Module[] = [
  {
    icone: Thermometer,
    titre: "Relevé de températures",
    texte: "Frigos et congélateurs relevés en quelques secondes, consigne affichée, rappel chaque matin et action corrective en cas d'écart.",
    lien: "/fonctionnalites/temperatures",
    visuel: <VisuelTemperatures />,
  },
  {
    icone: Tag,
    titre: "Étiquettes DLC",
    texte: "DLC calculée, numéro de lot et allergènes, impression directe vers votre étiqueteuse Brother, Zebra ou Epson.",
    lien: "/fonctionnalites/etiquettes",
    visuel: <VisuelEtiquette />,
  },
];

const PETITS: Module[] = [
  { icone: Package, titre: "Contrôle des réceptions", texte: "Température, DLC et emballages de chaque livraison.", lien: "/fonctionnalites/receptions" },
  { icone: FileSearch, titre: "Traçabilité produits", texte: "L'origine de chaque produit, retrouvée en un instant.", lien: "/fonctionnalites/tracabilite" },
  { icone: Sparkles, titre: "Plan de nettoyage", texte: "Tâches par zone, validées et signées.", lien: "/fonctionnalites/nettoyage" },
  { icone: Droplets, titre: "Huiles de friture", texte: "Tests et changements d'huile enregistrés.", lien: "/fonctionnalites/huiles" },
  { icone: ClipboardCheck, titre: "Check-lists", texte: "Ouverture, fermeture, service : à votre mesure.", lien: "/fonctionnalites/checklist" },
];

const CARTE =
  "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-[hsl(220_33%_98%)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_24px_50px_-24px_hsl(211_100%_20%/0.35)]";

export function GrilleModules() {
  return (
    <section id="fonctionnalites" className="bg-white pb-24 pt-20 lg:pb-32 lg:pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="font-heading text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground lg:col-span-7">
            Tout ce dont vous avez besoin pour votre <span className="text-primary">conformité HACCP</span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-5">
            Une suite complète pour tenir tous vos contrôles sanitaires au quotidien, avec l'
            <Link to="/application-pms" className="font-semibold text-primary underline underline-offset-4">
              application HACCP et PMS
            </Link>{" "}
            de LockHACCP, sur téléphone, tablette ou ordinateur.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GRANDS.map(({ icone: Icone, titre, texte, lien, visuel }) => (
            <Link key={titre} to={lien} className={`${CARTE} sm:col-span-2 lg:min-h-[17rem]`}>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                <Icone className="h-7 w-7" />
              </span>
              <div className="mt-auto pt-8 xl:max-w-[55%]">
                <h3 className="font-heading text-2xl font-bold text-foreground">{titre}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{texte}</p>
              </div>
              <div className="pointer-events-none absolute -bottom-3 right-6 hidden transition-transform duration-500 group-hover:-translate-y-2 xl:block">
                {visuel}
              </div>
              <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-primary/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}

          {PETITS.map(({ icone: Icone, titre, texte, lien }) => (
            <Link key={titre} to={lien} className={`${CARTE} min-h-[12rem]`}>
              <span className="mb-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <Icone className="h-5 w-5" />
              </span>
              <h3 className="mt-8 font-heading text-lg font-bold text-foreground">{titre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{texte}</p>
              <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-primary/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}

          <Link
            to="/plan-de-maitrise-sanitaire"
            className="group relative flex min-h-[14rem] flex-col overflow-hidden rounded-3xl bg-secondary p-6 text-white transition-transform duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
              <FileText className="h-5 w-5" />
            </span>
            <div className="mt-auto max-w-md pt-8">
              <h3 className="font-heading text-2xl font-bold sm:text-3xl">Votre PMS gratuit</h3>
              <p className="mt-2 leading-relaxed text-white/90">
                Le Plan de Maîtrise Sanitaire de votre établissement en 10 minutes : il paramètre l'application pour vous.
              </p>
            </div>
            {/* Les vrais documents du dossier, en éventail */}
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 right-8 hidden h-52 w-80 md:block">
              <img src={tableauCcp} alt="" loading="lazy" decoding="async" width={600} height={424}
                className="absolute bottom-6 right-28 w-48 -rotate-6 rounded-md shadow-xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:-rotate-[8deg]" />
              <img src={releveTemperature} alt="" loading="lazy" decoding="async" width={400} height={566}
                className="absolute bottom-0 right-12 w-32 rotate-3 rounded-md shadow-xl transition-transform duration-500 group-hover:-translate-y-3" />
              <img src={planNettoyage} alt="" loading="lazy" decoding="async" width={400} height={566}
                className="absolute -bottom-4 right-0 w-28 rotate-12 rounded-md shadow-xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[14deg]" />
            </div>
            <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-white/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
