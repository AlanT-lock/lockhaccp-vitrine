import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Phone, User, Users, MapPin, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateEmail, validatePhone, validateRequired } from "@/lib/validation";
import { identify, trackEvent } from "@/lib/analytics";
import { Seo } from "@/components/Seo";

const ContactEntreprise = () => {
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
    <div className="min-h-screen bg-background">
      <Seo title="Solution multi-établissements - LockHACCP" description="Contactez notre équipe commerciale pour une solution HACCP multi-restaurants : tableaux de bord consolidés, accompagnement dédié." path="/contact-entreprise" />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Solution Multi-établissements</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Solution <span className="text-primary">Entreprise</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Vous gérez plusieurs établissements ? Découvrez notre offre sur-mesure 
              avec tableaux de bord consolidés et accompagnement personnalisé.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl border border-border shadow-card p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">
                Demandez un devis personnalisé
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
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
                      className={errors.contactName ? "border-destructive" : ""}
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
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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
                      className={errors.phone ? "border-destructive" : ""}
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
                      className={errors.companyName ? "border-destructive" : ""}
                    />
                    {errors.companyName && (
                      <p className="text-sm text-destructive">{errors.companyName}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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
                      className={errors.numberOfEstablishments ? "border-destructive" : ""}
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
                  />
                </div>

                <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Demander un devis"}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Notre équipe commerciale vous répondra sous 24h ouvrées.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Enterprise */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Pourquoi choisir l'offre Entreprise ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                Gestion centralisée
              </h3>
              <p className="text-sm text-muted-foreground">
                Pilotez tous vos établissements depuis une seule interface avec des tableaux de bord consolidés.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                Accompagnement dédié
              </h3>
              <p className="text-sm text-muted-foreground">
                Un interlocuteur unique pour le déploiement, la formation et le support de vos équipes.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                Tarifs dégressifs
              </h3>
              <p className="text-sm text-muted-foreground">
                Bénéficiez de tarifs préférentiels adaptés au nombre de vos établissements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactEntreprise;
