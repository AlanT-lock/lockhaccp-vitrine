import { useState } from "react";
import { useMaintenant } from "@/hooks/useMaintenant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Phone, User, Users, MapPin, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { validateEmail, validatePhone, validateRequired } from "@/lib/validation";
import { identify, trackEvent } from "@/lib/analytics";
import { signalerConversion } from "@/lib/conversions";
import { Seo } from "@/components/Seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo-jsonld";
import { SectionEtapes } from "@/components/SectionsContenu";
import { RelatedLinks } from "@/components/RelatedLinks";
import { TOUTES_FONCTIONNALITES } from "@/lib/fonctionnalites-liens";
import { FaqSection } from "@/components/FaqSection";

const ETAPES_DEPLOIEMENT = [
  { titre: "Vous décrivez votre groupe", texte: "Nombre d'établissements, taille des équipes, contrôles déjà en place : le formulaire ci-dessus suffit." },
  { titre: "Nous vous recontactons sous 24 h", texte: "Pour comprendre votre organisation et fixer une démonstration sur Google Meet." },
  { titre: "Vous voyez l'application et le tableau de bord", texte: "L'application utilisée en cuisine, et le tableau de bord consolidé de l'application web qui regroupe tous vos sites." },
  { titre: "Mise en place accompagnée", texte: "Un interlocuteur unique vous accompagne pour le déploiement de chaque établissement et la prise en main par vos équipes." },
];
import { getActivePricing, formatPriceEUR } from "@/lib/launch";
import { mensuelEquivalent } from "@/lib/tarifs-affichage";
import { Accent, TITRE_H2 } from "@/components/design/elements";

const ContactEntreprise = () => {
  const maintenant = useMaintenant();
  const pricing = getActivePricing(maintenant);
  // L'équivalent mensuel du paiement annuel est mis en avant ; le prix au mois vient ensuite.
  const principalAnnuel = formatPriceEUR(mensuelEquivalent(pricing.mainYearly));
  const supplementaireAnnuel = formatPriceEUR(mensuelEquivalent(pricing.extraYearly));
  const faq = [
    {
      question: "Comment suivre tous mes établissements au même endroit ?",
      answer: "L'application web propose un tableau de bord consolidé : vous y voyez les contrôles de chaque site, et ce qui manque.",
    },
    {
      question: "Combien coûte un établissement supplémentaire ?",
      answer: `${supplementaireAnnuel}/mois en paiement annuel (${formatPriceEUR(pricing.extraYearly)} par an), ou ${formatPriceEUR(pricing.extraMonthly)} au mois, après le premier établissement à ${principalAnnuel}/mois en annuel. Toutes les fonctionnalités sont incluses pour chaque site.`,
    },
    {
      question: "Y a-t-il un engagement ?",
      answer: "Non. Les abonnements sont sans engagement et se résilient depuis l'application, sans préavis.",
    },
    {
      question: "Peut-on tester avant de déployer dans tout le groupe ?",
      answer: "Oui, avec 1 mois d'essai gratuit, sans carte bancaire : vous pouvez commencer par un seul établissement.",
    },
    {
      question: "LockHACCP se connecte-t-il à nos autres logiciels ?",
      answer: "Non, LockHACCP ne propose pas d'intégration avec d'autres logiciels (caisse, commandes, ERP). Les données de traçabilité s'exportent en PDF.",
    },
  ];
  const [formData, setFormData] = useState({
    contactName: "",
    email: "",
    phone: "",
    companyName: "",
    companySize: "",
    numberOfEstablishments: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!validateRequired(formData.contactName)) {
      newErrors.contactName = "Le nom est requis";
    }
    if (!validateRequired(formData.email)) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Format de téléphone invalide";
    }
    if (!validateRequired(formData.companyName)) {
      newErrors.companyName = "Le nom de l'entreprise est requis";
    }
    if (!validateRequired(formData.numberOfEstablishments)) {
      newErrors.numberOfEstablishments = "Le nombre d'établissements est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }

    setLoading(true);

    try {
      // Client chargé à l'envoi seulement : la page s'affiche sans ses ~50 Ko.
      const { supabase } = await import("@/integrations/supabase/client");
      const { error: dbError } = await supabase.from("contact_requests").insert({
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone || null,
        company_name: formData.companyName,
        company_size: formData.companySize || null,
        message: `[ENTREPRISE - ${formData.numberOfEstablishments} établissements] ${formData.message}`,
      });

      if (dbError) throw dbError;

      // Send email notification (best-effort: don't fail the form if email is down)
      try {
        await supabase.functions.invoke("send-contact-notification", {
          body: {
            type: "demo",
            contactName: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            companyName: formData.companyName,
            companySize: formData.companySize,
            message: `Nombre d'établissements: ${formData.numberOfEstablishments}\n\n${formData.message}`,
          },
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }

      identify(formData.email);
      trackEvent("form_submit", {
        form: "entreprise",
        company_size: formData.companySize || null,
        number_of_establishments: formData.numberOfEstablishments || null,
      });
      signalerConversion("conversion_contact", { formulaire: "entreprise" });

      toast.success("Votre demande a bien été envoyée ! Notre équipe commerciale vous contactera rapidement.");
      setFormData({
        contactName: "",
        email: "",
        phone: "",
        companyName: "",
        companySize: "",
        numberOfEstablishments: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Seo title="Logiciel HACCP multi-établissements" description={`LockHACCP pour plusieurs restaurants : ${principalAnnuel}/mois en annuel pour le premier établissement, ${supplementaireAnnuel}/mois par établissement en plus, tableau de bord consolidé.`} path="/contact-entreprise" jsonLd={[breadcrumbJsonLd([{name:"Accueil",path:"/"},{name:"Multi-établissements",path:"/contact-entreprise"}]), faqJsonLd(faq)]} />
      <Navbar />

      <main>
        {/* En-tête : le tarif à gauche, le formulaire à droite */}
        <section className="pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-36">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5 lg:sticky lg:top-32">
                <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                  <Building2 className="h-4 w-4" />
                  Solution Multi-établissements
                </p>
                <h1 className="font-heading text-[clamp(2.1rem,3.9vw,3.1rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-foreground">
                  <Accent>Logiciel HACCP multi-établissements</Accent> : un tarif simple
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Vous gérez plusieurs établissements ? En paiement annuel, LockHACCP est à {principalAnnuel}/mois pour le
                  premier, puis {supplementaireAnnuel}/mois pour chaque établissement supplémentaire, avec un
                  tableau de bord consolidé sur l'ensemble de vos sites. Notre équipe vous accompagne dans la mise en place.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-3xl border border-border/80 bg-white/90 p-5">
                    <p className="text-sm text-muted-foreground">Premier établissement</p>
                    <p className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-foreground">
                      {principalAnnuel}
                      <span className="text-sm font-normal text-muted-foreground">/mois</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">en annuel, ou {formatPriceEUR(pricing.mainMonthly)} au mois</p>
                  </div>
                  <div className="relative overflow-hidden rounded-3xl bg-primary p-5 text-white">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/30 blur-2xl" />
                    <p className="relative text-sm text-white/75">Chaque établissement supplémentaire</p>
                    <p className="relative mt-1 font-heading text-3xl font-extrabold tracking-tight">
                      {supplementaireAnnuel}
                      <span className="text-sm font-normal text-white/70">/mois</span>
                    </p>
                    <p className="relative mt-1 text-xs text-white/70">en annuel, ou {formatPriceEUR(pricing.extraMonthly)} au mois</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_40px_80px_-45px_hsl(211_100%_20%/0.5)] sm:p-10">
                  <h2 className="mb-8 font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                    Parlez-nous de votre groupe de restaurants
                  </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Nom du contact *
                    </Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Jean Dupont"
                      className={`h-12 rounded-xl ${errors.contactName ? "border-destructive" : ""}`}
                    />
                    {errors.contactName && (
                      <p className="text-sm text-destructive">{errors.contactName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Email professionnel *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@entreprise.fr"
                      className={`h-12 rounded-xl ${errors.email ? "border-destructive" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                      className={`h-12 rounded-xl ${errors.phone ? "border-destructive" : ""}`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      Nom de l'entreprise *
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Groupe Restauration SAS"
                      className={`h-12 rounded-xl ${errors.companyName ? "border-destructive" : ""}`}
                    />
                    {errors.companyName && (
                      <p className="text-sm text-destructive">{errors.companyName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfEstablishments" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      Nombre d'établissements *
                    </Label>
                    <Input
                      id="numberOfEstablishments"
                      value={formData.numberOfEstablishments}
                      onChange={(e) => setFormData({ ...formData, numberOfEstablishments: e.target.value })}
                      placeholder="Ex: 5, 10-20, 50+"
                      className={`h-12 rounded-xl ${errors.numberOfEstablishments ? "border-destructive" : ""}`}
                    />
                    {errors.numberOfEstablishments && (
                      <p className="text-sm text-destructive">{errors.numberOfEstablishments}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companySize" className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      Nombre total d'employés
                    </Label>
                    <Input
                      id="companySize"
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      placeholder="Ex: 50, 100-200"
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Décrivez votre projet</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Parlez-nous de vos besoins spécifiques, de vos établissements, des fonctionnalités qui vous intéressent..."
                    rows={5}
                    className="rounded-xl"
                  />
                </div>

                <Button type="submit" variant="hero" size="xl" className="group w-full" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Envoyer ma demande"}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Notre équipe commerciale vous répondra sous 24h ouvrées.
                </p>
              </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pourquoi LockHACCP pour plusieurs établissements */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`${TITRE_H2} mb-12 max-w-3xl`}>Pourquoi choisir LockHACCP pour plusieurs établissements ?</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  icone: Building2,
                  titre: "Gestion centralisée",
                  texte: "Pilotez tous vos établissements depuis une seule interface avec des tableaux de bord consolidés.",
                },
                {
                  icone: Users,
                  titre: "Accompagnement dédié",
                  texte: "Un interlocuteur unique pour le déploiement, la formation et le support de vos équipes.",
                },
                {
                  icone: MapPin,
                  titre: "Un tarif clair",
                  texte: `En paiement annuel, ${principalAnnuel}/mois pour le premier établissement, puis ${supplementaireAnnuel}/mois pour chaque établissement supplémentaire. Pas de négociation, pas de surprise.`,
                },
              ].map(({ icone: Icone, titre, texte }) => (
                <div
                  key={titre}
                  className="group rounded-3xl border border-border/80 bg-white/85 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_24px_50px_-24px_hsl(211_100%_20%/0.35)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icone className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-heading text-lg font-bold text-foreground">{titre}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      <SectionEtapes titre="Comment se passe la mise en place ?" etapes={ETAPES_DEPLOIEMENT} />

      <RelatedLinks title="Les fonctionnalités incluses dans chaque établissement" items={TOUTES_FONCTIONNALITES} />

      <FaqSection items={faq} title="Questions fréquentes des groupes de restaurants" />
      </main>

      <Footer />
    </div>
  );
};

export default ContactEntreprise;
