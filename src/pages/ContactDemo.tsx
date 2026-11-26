import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle, Calendar, Gift, Users, Headphones, Clock, Check, Thermometer, Package, Tag, SprayCan, FileSearch, Building2, Video, Smartphone } from "lucide-react";
import { Accent, Surtitre, TITRE_H2 } from "@/components/design/elements";
import { APP_URL } from "@/lib/links";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contactDemoSchema } from "@/lib/validation";
import { identify, trackEvent } from "@/lib/analytics";
import { signalerConversion } from "@/lib/conversions";
import { Seo } from "@/components/Seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo-jsonld";
import { SectionEtapes } from "@/components/SectionsContenu";
import { RelatedLinks } from "@/components/RelatedLinks";
import { TOUTES_FONCTIONNALITES } from "@/lib/fonctionnalites-liens";
import { FaqSection } from "@/components/FaqSection";

const ETAPES_DEMO = [
  { titre: "Vous remplissez le formulaire", texte: "Quelques informations sur votre établissement et, si vous le souhaitez, ce que vous voulez voir en priorité." },
  { titre: "Nous vous recontactons sous 24 h", texte: "Par e-mail ou par téléphone, pour fixer un créneau qui vous convient." },
  { titre: "Vous recevez un lien Google Meet", texte: "Rien à installer : la démonstration se suit depuis un ordinateur, une tablette ou un téléphone." },
  { titre: "30 minutes sur votre cas", texte: "Relevés de température, réceptions, nettoyage, traçabilité : nous montrons ce qui vous concerne et répondons à vos questions." },
  { titre: "Vous testez pendant 14 jours", texte: "Si l'application vous convient, vous l'essayez gratuitement pendant 14 jours, sans carte bancaire et sans engagement." },
];

// Ce qui est montré pendant la démo : les écrans réels de l'application (voir les vidéos du site).
const AU_PROGRAMME = [
  { icone: Thermometer, titre: "Les relevés de température", texte: "Le relevé en quelques secondes, la limite de 4 °C affichée et la mesure corrective demandée en cas d'écart." },
  { icone: Package, titre: "La réception des marchandises", texte: "La photo du bon de livraison lue automatiquement, puis la température des produits frais." },
  { icone: Tag, titre: "La production et les étiquettes DLC", texte: "La DLC secondaire calculée, le numéro de lot proposé, l'impression sur votre étiqueteuse." },
  { icone: SprayCan, titre: "Le plan de nettoyage", texte: "Les tâches du jour par zone, cochées et signées par la personne qui les fait." },
  { icone: FileSearch, titre: "Le jour du contrôle", texte: "L'historique de chaque contrôle, classé par date, à montrer à l'inspecteur de la DDPP." },
  { icone: Building2, titre: "Plusieurs établissements", texte: "Si vous en avez plusieurs : le tableau de bord qui regroupe tous vos sites." },
];

// Ce qui rend la démo plus utile (conseils, pas des prérequis).
const A_PREPARER = [
  "La liste de vos frigos, chambres froides et congélateurs",
  "Vos zones de nettoyage (cuisine, plonge, réserve, salle…)",
  "Votre étiqueteuse, si vous en avez une (Brother, Zebra ou Epson)",
  "Les remarques de votre dernier contrôle sanitaire, s'il y en a eu un",
  "Le nombre d'établissements et de personnes qui utiliseront l'application",
];

const FAQ_DEMO = [
  { question: "La démonstration est-elle payante ?", answer: "Non, elle est gratuite et ne vous engage à rien." },
  { question: "Combien de temps dure la démonstration ?", answer: "Environ 30 minutes, en visio sur Google Meet, centrées sur votre établissement et vos questions." },
  { question: "Démo ou essai direct : que choisir ?", answer: "La démo convient si vous voulez être guidé et poser vos questions sur le contrôle sanitaire. L'essai direct de 14 jours convient si vous préférez découvrir l'application seul, à votre rythme. Les deux sont gratuits et sans engagement." },
  { question: "Faut-il installer quelque chose pour la démo ?", answer: "Non. Vous recevez un lien Google Meet, qui s'ouvre depuis un navigateur ou l'application Meet." },
  { question: "Puis-je essayer LockHACCP sans démonstration ?", answer: "Oui. L'essai gratuit de 14 jours est accessible directement, sans carte bancaire et sans engagement." },
  { question: "L'application fonctionne-t-elle sans connexion internet ?", answer: "Oui. L'application fonctionne hors connexion, même dans une chambre froide ou une réserve où le réseau passe mal." },
  { question: "Où sont hébergées mes données ?", answer: "En Europe, chez Supabase, dans le respect du RGPD." },
];

const ContactDemo = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    companySize: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, companySize: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
    const result = contactDemoSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les champs en erreur.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Client chargé à l'envoi seulement : la page s'affiche sans ses ~50 Ko.
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("contact_requests").insert({
        company_name: result.data.companyName,
        contact_name: result.data.contactName,
        email: result.data.email,
        phone: result.data.phone || null,
        company_size: result.data.companySize || null,
        message: `[DEMANDE DE DÉMO] ${result.data.message || "Demande de démonstration gratuite"}`,
      });

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke("send-contact-notification", {
          body: {
            type: "demo",
            contactName: result.data.contactName,
            email: result.data.email,
            companyName: result.data.companyName,
            phone: result.data.phone,
            companySize: result.data.companySize,
            message: result.data.message,
          },
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the form submission if email fails
      }

      identify(result.data.email);
      trackEvent("form_submit", {
        form: "demo",
        company_size: result.data.companySize ?? null,
      });
      signalerConversion("conversion_demo");

      setIsSubmitted(true);
      toast({
        title: "Demande de démo envoyée !",
        description: "Nous vous recontactons sous 24 h pour fixer le créneau.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Calendar,
      title: "Démonstration personnalisée",
      description: "30 minutes pour découvrir toutes les fonctionnalités adaptées à vos besoins.",
    },
    {
      icon: Users,
      title: "Essai gratuit de 14 jours",
      description: "Testez LockHACCP sans engagement avec toutes les fonctionnalités.",
    },
    {
      icon: Headphones,
      title: "Accompagnement dédié",
      description: "Un expert vous accompagne dans la prise en main de l'application.",
    },
    {
      icon: Clock,
      title: "Réponse sous 24h",
      description: "Notre équipe vous recontacte rapidement pour planifier votre démo.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Seo title="Demander une démo gratuite du logiciel HACCP" description="Réservez 30 min de démonstration personnalisée du logiciel HACCP LockHACCP. Découvrez comment digitaliser vos contrôles sanitaires dès demain." path="/demander-demo" jsonLd={[breadcrumbJsonLd([{name:"Accueil",path:"/"},{name:"Demander une démo",path:"/demander-demo"}]), faqJsonLd(FAQ_DEMO)]} />
      <Navbar />

      <main>
        {/* En-tête : ce que comprend la démo à gauche, le formulaire à droite */}
        <section className="pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-36">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5 lg:sticky lg:top-32">
                <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-white/70 px-4 py-1.5 text-sm font-semibold text-secondary-texte shadow-sm">
                  <Gift className="h-4 w-4" />
                  Essai gratuit de 14 jours inclus
                </p>
                <h1 className="font-heading text-[clamp(2.3rem,5vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-foreground">
                  Demandez votre <Accent>démo gratuite</Accent>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Découvrez comment LockHACCP peut simplifier votre conformité HACCP. Notre équipe vous accompagne dans la
                  mise en place de votre solution.
                </p>
                <h2 className="sr-only">Ce que comprend la démonstration</h2>
                <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {benefits.map((benefit) => (
                    <li key={benefit.title} className="flex items-start gap-4 rounded-2xl border border-border/80 bg-white/85 p-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <benefit.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-heading font-bold text-foreground">{benefit.title}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-7">
                {isSubmitted ? (
                  <div className="rounded-[2rem] border border-white/80 bg-white/90 p-10 text-center shadow-[0_40px_80px_-45px_hsl(211_100%_20%/0.5)] sm:p-14">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="mb-4 font-heading text-2xl font-extrabold text-foreground">Demande de démo envoyée !</h2>
                    <p className="mb-6 text-muted-foreground">
                      Merci pour votre intérêt pour LockHACCP. Notre équipe vous contactera dans les prochaines 24h pour
                      organiser votre démonstration gratuite.
                    </p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      Envoyer une autre demande
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_40px_80px_-45px_hsl(211_100%_20%/0.5)] sm:p-10">
                    <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">Planifiez votre démonstration</h2>
                    <p className="mb-8 mt-2 text-muted-foreground">Remplissez le formulaire et nous vous recontacterons rapidement.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                        <Input
                          className="h-12 rounded-xl"
                          id="companyName"
                          name="companyName"
                          placeholder="Restaurant Le Gourmet"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          maxLength={100}
                          required
                        />
                        {errors.companyName && (
                          <p className="text-sm text-destructive">{errors.companyName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Votre nom *</Label>
                        <Input
                          className="h-12 rounded-xl"
                          id="contactName"
                          name="contactName"
                          placeholder="Jean Dupont"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          maxLength={100}
                          required
                        />
                        {errors.contactName && (
                          <p className="text-sm text-destructive">{errors.contactName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email professionnel *</Label>
                        <Input
                          className="h-12 rounded-xl"
                          id="email"
                          name="email"
                          type="email"
                          placeholder="contact@restaurant.fr"
                          value={formData.email}
                          onChange={handleInputChange}
                          maxLength={255}
                          required
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input
                          className="h-12 rounded-xl"
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.phone && (
                          <p className="text-sm text-destructive">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companySize">Taille de votre établissement</Label>
                      <Select onValueChange={handleSelectChange} value={formData.companySize}>
                        <SelectTrigger id="companySize" className="h-12 rounded-xl">
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employés</SelectItem>
                          <SelectItem value="11-25">11-25 employés</SelectItem>
                          <SelectItem value="26-50">26-50 employés</SelectItem>
                          <SelectItem value="50+">Plus de 50 employés</SelectItem>
                          <SelectItem value="multi">Multi-établissements</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (optionnel)</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Décrivez vos besoins spécifiques..."
                        rows={4}
                        className="rounded-xl"
                        value={formData.message}
                        onChange={handleInputChange}
                        maxLength={2000}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="xl"
                      className="group w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Envoi en cours..." : "Demander ma démo gratuite"}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      {/* Au programme de la démo */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Surtitre>Au programme</Surtitre>
              <h2 className={TITRE_H2}>Ce que nous vous montrons pendant les 30 minutes</h2>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-5">
              La démonstration se fait sur l'application elle-même, avec les écrans que votre équipe utilisera en cuisine. Nous
              passons plus de temps sur ce qui vous concerne.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AU_PROGRAMME.map(({ icone: Icone, titre, texte }) => (
              <li key={titre} className="rounded-3xl border border-border/80 bg-white/85 p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <Icone className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-heading text-lg font-bold text-foreground">{titre}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Préparer la démo + démo ou essai direct */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-border/80 bg-white/90 p-6 sm:p-10">
              <h2 className="font-heading text-[clamp(1.6rem,2.8vw,2.1rem)] font-extrabold tracking-[-0.02em] text-foreground">
                Préparez votre démo en 2 minutes
              </h2>
              <p className="mt-3 text-muted-foreground">Rien d'obligatoire : avec ces éléments sous la main, la démo colle mieux à votre cuisine.</p>
              <ul className="mt-6 space-y-3">
                {A_PREPARER.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-foreground">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light">
                      <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-[hsl(211_100%_13%)] p-6 text-white sm:p-10">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/50 blur-3xl" />
              <div className="relative">
                <h2 className="font-heading text-[clamp(1.6rem,2.8vw,2.1rem)] font-extrabold tracking-[-0.02em]">Démo ou essai direct ?</h2>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/[0.08] p-5">
                    <Video className="h-6 w-6 text-secondary" />
                    <p className="mt-3 font-heading font-bold">La démo</p>
                    <p className="mt-1 text-sm text-white/75">30 minutes guidées en visio, sur votre cas, avec vos questions sur le contrôle sanitaire.</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.08] p-5">
                    <Smartphone className="h-6 w-6 text-secondary" />
                    <p className="mt-3 font-heading font-bold">L'essai direct</p>
                    <p className="mt-1 text-sm text-white/75">14 jours pour découvrir l'application seul, sans carte bancaire, à votre rythme.</p>
                  </div>
                </div>
                <p className="mt-6 text-sm text-white/75">Les deux sont gratuits et sans engagement.</p>
                <Button variant="accent" size="lg" asChild className="group mt-4 h-auto min-h-12 w-full whitespace-normal py-3 text-center sm:w-auto">
                  <a href={APP_URL}>
                    Essayer 14 jours gratuitement
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionEtapes titre="Comment se déroule la démonstration ?" etapes={ETAPES_DEMO} />

      <RelatedLinks title="Ce que vous pourrez voir pendant la démo" items={TOUTES_FONCTIONNALITES} />

      <FaqSection items={FAQ_DEMO} title="Questions fréquentes sur la démo" />
      </main>

      <Footer />
    </div>
  );
};

export default ContactDemo;
