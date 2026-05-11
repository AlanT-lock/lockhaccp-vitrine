import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const ALLOWED_ORIGINS = [
  "https://lockhaccp.fr",
  "https://www.lockhaccp.fr",
  "https://lockhaccp.com",
  "https://www.lockhaccp.com",
];

function getCorsHeaders(origin: string | null) {
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin)
    || /^https:\/\/.*\.vercel\.app$/.test(origin)
    || origin === "http://localhost:8080"
    || origin === "http://localhost:5173"
  );
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

// Escape user-controlled strings before injecting into HTML email bodies.
function esc(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// For href values: only allow simple mailto:/tel:/http(s):
function safeHref(value: string, scheme: "mailto" | "tel"): string {
  const v = String(value || "").trim();
  if (!v) return "#";
  if (scheme === "mailto") {
    return /^[^\s<>"']+@[^\s<>"']+$/.test(v) ? `mailto:${esc(v)}` : "#";
  }
  return /^[+0-9 .()-]+$/.test(v) ? `tel:${esc(v)}` : "#";
}

interface ContactNotificationRequest {
  type?: "demo" | "info";
  contactName?: string;
  email?: string;
  companyName?: string;
  phone?: string;
  companySize?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const data: ContactNotificationRequest = await req.json();

    const isDemo = data.type === "demo";
    const subject = isDemo
      ? `Nouvelle demande de démo - ${data.companyName || data.contactName || ""}`
      : `Nouveau message de contact - ${data.contactName || ""}`;

    const htmlContent = isDemo
      ? `
        <h1>Nouvelle demande de démonstration</h1>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Entreprise</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${esc(data.companyName) || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Contact</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${esc(data.contactName)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="${safeHref(data.email || "", "mailto")}">${esc(data.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Téléphone</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="${safeHref(data.phone || "", "tel")}">${esc(data.phone) || "-"}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Taille entreprise</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${esc(data.companySize) || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
            <td style="padding: 10px; border: 1px solid #ddd; white-space: pre-wrap;">${esc(data.message) || "Aucun message"}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #666;">
          Envoyé depuis le formulaire de demande de démo LockHACCP
        </p>
      `
      : `
        <h1>Nouveau message de contact</h1>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Nom</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${esc(data.contactName)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="${safeHref(data.email || "", "mailto")}">${esc(data.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
            <td style="padding: 10px; border: 1px solid #ddd; white-space: pre-wrap;">${esc(data.message) || "Aucun message"}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #666;">
          Envoyé depuis le formulaire de contact LockHACCP
        </p>
      `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LockHACCP <contact@lockhaccp.fr>",
        to: ["contact@lockhaccp.fr"],
        subject,
        html: htmlContent,
      }),
    });

    const notificationResult = await emailResponse.json();

    // Email signature for the confirmation sent to the user
    const emailSignature = `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #003F83;">
        <table style="width: 100%;">
          <tr>
            <td style="vertical-align: middle; padding-right: 20px;">
              <img src="https://lockhaccp.fr/logo-color.png" alt="LockHACCP" style="width: 100px; height: auto;" />
            </td>
            <td style="vertical-align: middle;">
              <p style="margin: 0; font-weight: bold; color: #003F83; font-size: 16px;">LockHACCP</p>
              <p style="margin: 5px 0; color: #666; font-size: 14px;">Votre solution HACCP simplifiée</p>
              <p style="margin: 5px 0; font-size: 14px;">
                <a href="tel:0646640023" style="color: #003F83; text-decoration: none;">06.46.64.00.23</a>
              </p>
              <p style="margin: 5px 0; font-size: 14px;">
                <a href="mailto:contact@lockhaccp.fr" style="color: #003F83; text-decoration: none;">contact@lockhaccp.fr</a>
              </p>
              <p style="margin: 5px 0; font-size: 14px;">
                <a href="https://lockhaccp.fr" style="color: #003F83; text-decoration: none;">www.lockhaccp.fr</a>
              </p>
            </td>
          </tr>
        </table>
      </div>
    `;

    const confirmationSubject = isDemo
      ? "Votre demande de démonstration LockHACCP"
      : "Nous avons bien reçu votre message - LockHACCP";

    const confirmationHtml = isDemo
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #003F83;">Merci pour votre demande de démonstration !</h1>
          <p>Bonjour ${esc(data.contactName)},</p>
          <p>Nous avons bien reçu votre demande de démonstration pour <strong>${esc(data.companyName)}</strong>.</p>
          <p>Notre équipe vous contactera dans les plus brefs délais pour organiser une présentation personnalisée de LockHACCP.</p>
          <p>En attendant, n'hésitez pas à consulter nos ressources sur notre site.</p>
          <br/>
          <p>Cordialement,</p>
          <p><strong>L'équipe LockHACCP</strong></p>
          ${emailSignature}
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #003F83;">Nous avons bien reçu votre message !</h1>
          <p>Bonjour ${esc(data.contactName)},</p>
          <p>Merci de nous avoir contactés. Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
          <br/>
          <p>Cordialement,</p>
          <p><strong>L'équipe LockHACCP</strong></p>
          ${emailSignature}
        </div>
      `;

    let confirmationResult: unknown = null;
    if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      const confirmationResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "LockHACCP <noreply@lockhaccp.fr>",
          to: [data.email],
          subject: confirmationSubject,
          html: confirmationHtml,
        }),
      });
      confirmationResult = await confirmationResponse.json();
    }

    return new Response(
      JSON.stringify({ success: true, notificationResult, confirmationResult }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-contact-notification function:", message);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);
