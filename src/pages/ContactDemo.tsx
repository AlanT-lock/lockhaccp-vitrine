import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle, Calendar, Users, Headphones, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contactDemoSchema } from "@/lib/validation";
import { identify, trackEvent } from "@/lib/analytics";
import { Seo } from "@/components/Seo";

const ContactDemo = () => {
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation();
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

      setIsSubmitted(true);
      toast({
        title: "Demande de démo envoyée !",
        description: "Notre équipe vous contactera dans les plus brefs délais.",
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
      title: "Essai gratuit de 3 mois",
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
    <div className="min-h-screen bg-background">
      <Seo title="Demander une démo gratuite - LockHACCP" description="Réservez une démonstration personnalisée du logiciel HACCP LockHACCP. 30 minutes pour découvrir comment digitaliser vos contrôles." path="/demander-demo" />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <span className="text-sm font-semibold text-secondary">🎁 Essai gratuit de 3 mois inclus</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Demandez votre <span className="text-primary">démo gratuite</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Découvrez comment LockHACCP peut simplifier votre conformité HACCP. 
              Notre équipe vous accompagne dans la mise en place de votre solution.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-4 bg-card rounded-xl p-4 border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div
              ref={formRef}
              className={`transition-all duration-700 ${
                formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {isSubmitted ? (
                <div className="bg-card rounded-2xl p-12 border border-border shadow-card text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                    Demande de démo envoyée !
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Merci pour votre intérêt pour LockHACCP. Notre équipe vous contactera 
                    dans les prochaines 24h pour organiser votre démonstration gratuite.
                  </p>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Envoyer une autre demande
                  </Button>
                </div>
              ) : (
                <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">
                    Planifiez votre démonstration
                  </h2>
                  <p className="text-muted-foreground text-center mb-8">
                    Remplissez le formulaire et nous vous recontacterons rapidement.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                        <Input
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

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email professionnel *</Label>
                        <Input
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
                        <SelectTrigger>
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
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Envoi en cours..." : "Demander ma démo gratuite"}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactDemo;
