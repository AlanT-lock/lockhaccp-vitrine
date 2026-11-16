import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowUpRight, CheckCircle, Mail, Phone, MessageCircle, Clock } from "lucide-react";
import { Accent, TITRE_H2 } from "@/components/design/elements";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useLocation } from "react-router-dom";
import { contactInfoSchema } from "@/lib/validation";
import { identify, trackEvent } from "@/lib/analytics";
import { signalerConversion } from "@/lib/conversions";
import { Seo } from "@/components/Seo";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { MESSAGE_CONTACT_CAPTEURS, SUJET_CONTACT_CAPTEURS } from "@/lib/capteurs";

const ContactInfo = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    contactName: "",
    email: "",
    message: "",
  });

  // Arrivée depuis « Être prévenu » (capteurs connectés) : message prérempli et
  // formulaire affiché. Fait après le montage, pour ne pas changer le HTML pré-généré.
  const { search } = useLocation();
  useEffect(() => {
    if (new URLSearchParams(search).get("sujet") !== SUJET_CONTACT_CAPTEURS) return;
    setFormData((prev) => (prev.message ? prev : { ...prev, message: MESSAGE_CONTACT_CAPTEURS }));
    document.getElementById("formulaire")?.scrollIntoView({ block: "start" });
  }, [search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = contactInfoSchema.safeParse(formData);
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
        company_name: "Question générale",
        contact_name: result.data.contactName,
        email: result.data.email,
        message: `[QUESTION] ${result.data.message}`,
      });

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke("send-contact-notification", {
          body: {
            type: "info",
            contactName: result.data.contactName,
            email: result.data.email,
            message: result.data.message,
          },
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the form submission if email fails
      }

      identify(result.data.email);
      trackEvent("form_submit", { form: "info" });
      signalerConversion("conversion_contact", { formulaire: "info" });

      setIsSubmitted(true);
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondons sous 24 h.",
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

  return (
    <div className="min-h-screen">
      <Seo title="Contacter LockHACCP : devis logiciel HACCP gratuit" description="Contactez LockHACCP par email ou téléphone (06.46.64.00.23). Devis gratuit, réponse sous 24h, accompagnement personnalisé." path="/contact" jsonLd={breadcrumbJsonLd([{name:"Accueil",path:"/"},{name:"Contact",path:"/contact"}])} />
      <Navbar />

      <main>
        {/* En-tête : coordonnées à gauche, formulaire à droite */}
        <section className="pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-36">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                  <Clock className="h-4 w-4" />
                  Réponse sous 24 h
                </p>
                <h1 className="font-heading text-[clamp(2.4rem,5.6vw,4.4rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-foreground">
                  Contactez-<Accent>nous</Accent>
                </h1>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Une question sur LockHACCP ? Notre équipe est là pour vous répondre.
                </p>

                <h2 className="sr-only">Nos coordonnées</h2>
                <ul className="mt-10 space-y-3">
                  {[
                    { icone: Mail, libelle: "Email", valeur: "contact@lockhaccp.fr", href: "mailto:contact@lockhaccp.fr" },
                    { icone: Phone, libelle: "Téléphone", valeur: "06.46.64.00.23", href: "tel:0646640023" },
                    { icone: Clock, libelle: "Délai de réponse", valeur: "Sous 24 h, par e-mail ou par téléphone.", href: null },
                  ].map(({ icone: Icone, libelle, valeur, href }) => {
                    const contenu = (
                      <>
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                          <Icone className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-sm text-muted-foreground">{libelle}</span>
                          <span className="block font-heading text-lg font-bold text-foreground">{valeur}</span>
                        </span>
                      </>
                    );
                    return (
                      <li key={libelle}>
                        {href ? (
                          <a
                            href={href}
                            className="group flex items-center gap-4 rounded-2xl border border-border/80 bg-white/85 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white"
                          >
                            {contenu}
                          </a>
                        ) : (
                          <div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-white/85 p-4">{contenu}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Appel vers la démo */}
                <div className="relative mt-6 overflow-hidden rounded-3xl bg-primary p-7 text-white">
                  <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-secondary/30 blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                        <MessageCircle className="h-5 w-5" />
                      </span>
                      <h3 className="font-heading text-xl font-bold">Envie d'une démo ?</h3>
                    </div>
                    <p className="mt-4 text-white/80">Découvrez LockHACCP en action avec une démonstration personnalisée gratuite.</p>
                    <Button variant="accent" size="lg" className="group mt-6 w-full sm:w-auto" asChild>
                      <Link to="/demander-demo">
                        Demander une démo gratuite
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              <div id="formulaire" className="scroll-mt-28 lg:col-span-7">
                {isSubmitted ? (
                  <div className="rounded-[2rem] border border-white/80 bg-white/90 p-10 text-center shadow-[0_40px_80px_-45px_hsl(211_100%_20%/0.5)] sm:p-14">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="mb-4 font-heading text-2xl font-extrabold text-foreground">Message envoyé !</h2>
                    <p className="mb-6 text-muted-foreground">Merci de nous avoir contactés. Nous vous répondons sous 24 h.</p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_40px_80px_-45px_hsl(211_100%_20%/0.5)] sm:p-10">
                    <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">Posez-nous votre question</h2>
                    <p className="mb-8 mt-2 text-muted-foreground">Nous vous répondons sous 24 h.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Votre nom *</Label>
                          <Input
                            id="contactName"
                            name="contactName"
                            placeholder="Jean Dupont"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            maxLength={100}
                            required
                            className="h-12 rounded-xl"
                          />
                          {errors.contactName && <p className="text-sm text-destructive">{errors.contactName}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="jean@example.fr"
                            value={formData.email}
                            onChange={handleInputChange}
                            maxLength={255}
                            required
                            className="h-12 rounded-xl"
                          />
                          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Votre message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Comment pouvons-nous vous aider ?"
                          rows={7}
                          value={formData.message}
                          onChange={handleInputChange}
                          maxLength={2000}
                          required
                          className="rounded-xl"
                        />
                        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                      </div>

                      <Button type="submit" variant="hero" size="xl" className="group w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Envoi en cours..." : "Envoyer mon message"}
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Orientation selon la demande */}
        <section className="pb-24 pt-8 lg:pb-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className={`${TITRE_H2} lg:col-span-7`}>Pour quelle demande nous contacter ?</h2>
              <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-5">
                Certaines réponses sont déjà sur le site. Pour le reste, le formulaire ci-dessus ou un appel suffit.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {DEMANDES.map((d) => (
                <Link
                  key={d.to}
                  to={d.to}
                  className="group relative block rounded-3xl border border-border/80 bg-white/85 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_24px_50px_-24px_hsl(211_100%_20%/0.35)]"
                >
                  <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-primary/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  <h3 className="mb-2 pr-8 font-heading text-xl font-bold text-foreground group-hover:text-primary">{d.titre}</h3>
                  <p className="text-muted-foreground">{d.texte}</p>
                </Link>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Vos données de contact sont traitées comme indiqué dans notre{" "}
              <Link to="/politique-confidentialite" className="underline underline-offset-2 hover:text-primary">politique de confidentialité</Link>
              . Voir aussi les{" "}
              <Link to="/cgu" className="underline underline-offset-2 hover:text-primary">conditions générales d'utilisation</Link>
              {" "}et les{" "}
              <Link to="/mentions-legales" className="underline underline-offset-2 hover:text-primary">mentions légales</Link>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const DEMANDES = [
  { to: "/demander-demo", titre: "Voir l'application en action", texte: "Une démonstration de 30 minutes en visio, sur Google Meet, adaptée à votre établissement." },
  { to: "/tarifs", titre: "Connaître les tarifs", texte: "Un prix par établissement, toutes fonctionnalités incluses, 1 mois d'essai gratuit et sans engagement." },
  { to: "/contact-entreprise", titre: "Équiper plusieurs restaurants", texte: "Un tarif dégressif par établissement et un tableau de bord consolidé pour tous vos sites." },
  { to: "/plan-de-maitrise-sanitaire", titre: "Obtenir un Plan de Maîtrise Sanitaire", texte: "Générez gratuitement le PMS de votre établissement en répondant à un questionnaire de 10 minutes." },
];

export default ContactInfo;
