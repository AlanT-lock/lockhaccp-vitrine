import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle, Mail, Phone, MessageCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { contactInfoSchema } from "@/lib/validation";
import { identify, trackEvent } from "@/lib/analytics";
import { Seo } from "@/components/Seo";

const ContactInfo = () => {
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    contactName: "",
    email: "",
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

      setIsSubmitted(true);
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
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
    <div className="min-h-screen bg-background">
      <Seo title="Contact - LockHACCP" description="Contactez l'équipe LockHACCP pour toute question. Réponse sous 24h. Téléphone, email, formulaire en ligne." path="/contact" />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Contactez-<span className="text-primary">nous</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Une question sur LockHACCP ? Notre équipe est là pour vous répondre.
            </p>
            <Link to="/demander-demo">
              <Button variant="hero" size="xl">
                Vous souhaitez une démo ? Cliquez ici
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                  Nos coordonnées
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Email</p>
                      <a href="mailto:contact@lockhaccp.fr" className="text-muted-foreground hover:text-primary transition-colors">
                        contact@lockhaccp.fr
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Téléphone</p>
                      <a href="tel:0646640023" className="text-muted-foreground hover:text-primary transition-colors">
                        06.46.64.00.23
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              {/* CTA Demo */}
              <div className="bg-primary rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-primary-foreground">
                      Envie d'une démo ?
                    </h3>
                  </div>
                </div>
                <p className="text-primary-foreground/80 mb-6">
                  Découvrez LockHACCP en action avec une démonstration personnalisée gratuite.
                </p>
                <Link to="/demander-demo">
                  <Button variant="accent" size="lg" className="w-full">
                    Demander une démo gratuite
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Form */}
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
                    Message envoyé !
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                    Posez-nous votre question
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
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
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Votre message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Comment pouvons-nous vous aider ?"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        maxLength={2000}
                        required
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
                      {isSubmitting ? "Envoi en cours..." : "Envoyer mon message"}
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

export default ContactInfo;
