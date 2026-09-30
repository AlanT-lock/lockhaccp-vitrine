// Page /pms : générateur gratuit de Plan de Maîtrise Sanitaire, une étape par écran.
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChampQuestion } from "@/components/pms/ChampQuestion";
import { ChoixZones } from "@/components/pms/ChoixZones";
import { SurfacesZone } from "@/components/pms/SurfacesZone";
import { PageFin } from "@/components/pms/PageFin";
import { Recapitulatif } from "@/components/pms/Recapitulatif";
import { trackEvent } from "@/lib/analytics";
import { ErreurPms, genererPms } from "@/lib/pms/api";
import { METIERS } from "@/lib/pms/genere/metiers";
import {
  ETAPES, ecranDesErreurs, ecransEtape, effacerBrouillon, erreursEcran, lireBrouillon, nettoyerReponses, premierEcranEnErreur,
  questionsDeLEcran, repartirErreursServeur, reponsesInitiales, sauverBrouillon,
} from "@/lib/pms/questionnaire";
import type { ElementListe, MetierId, Reponses, ValeurReponse } from "@/lib/pms/genere/types";
import { cn } from "@/lib/utils";

const DERNIERE = ETAPES.length;

const Pms = () => {
  const [reponses, setReponses] = useState<Reponses>({} as Reponses);
  const [etape, setEtape] = useState(1);
  // Écran dans l'étape : l'étape 5 (nettoyage) en compte un par zone.
  const [ecran, setEcran] = useState(0);
  const [brouillon, setBrouillon] = useState<ReturnType<typeof lireBrouillon>>(null);
  const [montrerErreurs, setMontrerErreurs] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);
  const [erreursServeur, setErreursServeur] = useState<Record<string, string>>({});
  const [lien, setLien] = useState<string | null>(null);
  const [siteWeb, setSiteWeb] = useState("");

  useEffect(() => {
    setBrouillon(lireBrouillon());
  }, []);

  useEffect(() => {
    if (reponses.metier && lien === null) sauverBrouillon(reponses, etape);
  }, [reponses, etape, lien]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [etape, ecran]);

  const ecrans = useMemo(() => ecransEtape(etape, reponses), [etape, reponses]);
  const ecranCourant = ecrans[Math.min(ecran, ecrans.length - 1)];
  const questions = useMemo(() => questionsDeLEcran(etape, reponses), [etape, reponses]);
  const zones = (Array.isArray(reponses["nettoyage.zones"]) ? reponses["nettoyage.zones"] : []) as ElementListe[];
  const erreurs = useMemo(() => {
    // Les erreurs renvoyées par le serveur s'ajoutent à celles de l'écran
    // jusqu'à ce que le visiteur modifie la réponse concernée.
    const affichees = (id: string) =>
      ecranCourant.type === "questions" ? questions.some((q) => q.id === id) : id === "nettoyage.zones";
    const duServeur = Object.fromEntries(Object.entries(erreursServeur).filter(([id]) => affichees(id)));
    return { ...duServeur, ...erreursEcran(etape, ecranCourant, reponses) };
  }, [etape, ecranCourant, reponses, questions, erreursServeur]);

  const allerA = (e: number, indexEcran = 0) => {
    setEtape(e);
    setEcran(indexEcran);
  };

  const choisirMetier = (m: MetierId) => {
    if (m !== reponses.metier) setReponses(reponsesInitiales(m));
    trackEvent("pms_metier_choisi", { metier: m });
    setMontrerErreurs(false);
    allerA(2);
  };

  const repondre = (id: string, v: ValeurReponse | undefined) => {
    setErreursServeur((e) => {
      if (!(id in e)) return e;
      const { [id]: _corrigee, ...reste } = e;
      return reste;
    });
    setReponses((r) => {
      const suivant = { ...r } as Reponses;
      if (v === undefined) delete suivant[id];
      else suivant[id] = v;
      return nettoyerReponses(suivant);
    });
  };

  const suivant = () => {
    if (Object.keys(erreurs).length > 0) {
      setMontrerErreurs(true);
      return;
    }
    setMontrerErreurs(false);
    setErreurEnvoi(null);
    if (ecran < ecrans.length - 1) setEcran(ecran + 1);
    else allerA(Math.min(DERNIERE, etape + 1));
  };

  const retour = () => {
    setMontrerErreurs(false);
    if (ecran > 0) {
      setEcran(ecran - 1);
      return;
    }
    const precedente = Math.max(1, etape - 1);
    allerA(precedente, ecransEtape(precedente, reponses).length - 1);
  };

  const generer = async () => {
    // Contrôle de tout le questionnaire : un brouillon repris ou un retour en
    // arrière a pu laisser une étape antérieure incomplète.
    const incomplet = premierEcranEnErreur(reponses);
    if (incomplet !== null) {
      allerA(incomplet.etape, incomplet.ecran);
      setMontrerErreurs(true);
      return;
    }
    setEnvoi(true);
    setErreurEnvoi(null);
    try {
      const r = await genererPms(reponses, siteWeb);
      trackEvent("pms_genere", { metier: reponses.metier });
      effacerBrouillon();
      setLien(r.lien);
    } catch (e) {
      const aCorriger = e instanceof ErreurPms && e.statut === 400 ? repartirErreursServeur(e.erreurs) : null;
      if (aCorriger?.etape) {
        setErreursServeur(aCorriger.erreurs);
        allerA(aCorriger.etape, ecranDesErreurs(aCorriger.etape, Object.keys(aCorriger.erreurs), reponses));
        setMontrerErreurs(true);
        setErreurEnvoi("Certaines réponses doivent être corrigées : elles sont signalées ci-dessous.");
        return;
      }
      setErreurEnvoi(e instanceof ErreurPms ? e.message : "Une erreur est survenue. Réessayez dans quelques minutes.");
    } finally {
      setEnvoi(false);
    }
  };

  const infoEtape = ETAPES[etape - 1];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="PMS gratuit personnalisé pour votre établissement — LockHACCP"
        description="Générez gratuitement votre Plan de Maîtrise Sanitaire : tableau HACCP, plan de nettoyage, fiches de traçabilité et affichages obligatoires adaptés à votre métier, en 10 minutes."
        path="/pms"
      />
      <Navbar />
      <main className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {lien !== null ? (
            <PageFin lien={lien} email={String(reponses["coordonnees.email"] ?? "")} />
          ) : (
            <>
              {etape === 1 && (
                <div className="text-center mb-8">
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Votre PMS gratuit, adapté à votre établissement</h1>
                  <p className="text-muted-foreground">
                    Tableau HACCP, plan de nettoyage, fiches de traçabilité et affichages obligatoires, prêts à imprimer.
                    Environ 10 minutes.
                    Réalisé avec l'expertise de SF FORMATION, organisme de formation à l'hygiène alimentaire.
                  </p>
                </div>
              )}

              {etape === 1 && brouillon && (
                <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <span className="text-sm">Vous aviez commencé votre PMS. Reprendre où vous en étiez ?</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="hero" onClick={() => { setReponses(brouillon.reponses); allerA(Math.max(2, brouillon.etape)); setBrouillon(null); }}>Reprendre</Button>
                    <Button size="sm" variant="outline" onClick={() => { effacerBrouillon(); setBrouillon(null); }}>Recommencer</Button>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">{infoEtape.titre}</span>
                  <span>Étape {etape} sur {DERNIERE}</span>
                </div>
                <Progress value={(etape / DERNIERE) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{infoEtape.sousTitre}</p>
              </div>

              {etape === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {METIERS.map((m) => (
                    <button key={m.id} type="button" onClick={() => choisirMetier(m.id)}
                      className={cn(
                        "text-left rounded-xl border p-4 transition-colors min-h-[88px]",
                        reponses.metier === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/60",
                      )}>
                      <span className="block font-semibold text-foreground">{m.libelle}</span>
                      <span className="block text-xs text-muted-foreground mt-1">{m.description}</span>
                    </button>
                  ))}
                </div>
              )}

              {etape === 7 && <Recapitulatif reponses={reponses} allerA={(e) => allerA(e)} />}

              {ecranCourant.type === "zones" && (
                <ChoixZones metier={reponses.metier} zones={zones}
                  erreur={montrerErreurs ? erreurs["nettoyage.zones"] : undefined}
                  onChange={(z) => repondre("nettoyage.zones", z)} />
              )}

              {ecranCourant.type === "zone" && zones[ecranCourant.index] && (
                <SurfacesZone key={ecranCourant.index} metier={reponses.metier} zone={zones[ecranCourant.index]}
                  numero={ecranCourant.index + 1} total={zones.length}
                  erreur={montrerErreurs ? erreurs["nettoyage.zones"] : undefined}
                  onChange={(z) => repondre("nettoyage.zones", zones.map((x, i) => (i === ecranCourant.index ? z : x)))} />
              )}

              {etape !== 1 && etape !== 7 && ecranCourant.type === "questions" && (
                <div className="space-y-4">
                  {questions.map((q) => (
                    <ChampQuestion key={q.id} question={q} valeur={reponses[q.id]}
                      erreur={montrerErreurs ? erreurs[q.id] : undefined}
                      onChange={(v) => repondre(q.id, v)} />
                  ))}
                  {etape === DERNIERE && (
                    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
                      <label>Site web<input tabIndex={-1} autoComplete="off" value={siteWeb} onChange={(e) => setSiteWeb(e.target.value)} /></label>
                    </div>
                  )}
                </div>
              )}

              {montrerErreurs && Object.keys(erreurs).length > 0 && (
                <p className="mt-4 text-sm text-destructive">Complétez les champs signalés pour continuer.</p>
              )}
              {erreurEnvoi && <p className="mt-4 text-sm text-destructive">{erreurEnvoi}</p>}

              {etape > 1 && (
                <div className="mt-8 flex justify-between gap-3">
                  <Button variant="outline" onClick={retour} disabled={envoi} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Retour
                  </Button>
                  {etape < DERNIERE ? (
                    <Button variant="hero" onClick={suivant} className="gap-2">Suivant <ArrowRight className="h-4 w-4" /></Button>
                  ) : (
                    <Button variant="hero" onClick={generer} disabled={envoi} className="gap-2">
                      {envoi ? <><Loader2 className="h-4 w-4 animate-spin" /> Génération de votre PMS…</> : "Générer mon PMS"}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pms;
