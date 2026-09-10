import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://lockhaccp.fr",
  "https://www.lockhaccp.fr",
  "https://lockhaccp.com",
  "https://www.lockhaccp.com",
];

const getCorsHeaders = (origin: string | null) => {
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin)
    || /^https:\/\/.*\.vercel\.app$/.test(origin)
    || origin === "http://localhost:8080"
    || origin === "http://localhost:5173"
  );

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
};

// Offre unique depuis le 2026-09-10. Les identifiants doivent être
// strictement les mêmes que ceux de lib/stripe_prices.dart côté app.
const PRICE_IDS = {
  mensuel: "REMPLACER_PAR_BASE_MENSUEL",
  annuel: "REMPLACER_PAR_BASE_ANNUEL",
} as const;

type BillingCycle = keyof typeof PRICE_IDS;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Configuration error");
    logStep("Stripe key verified");

    const body = await req.json();
    const { billingCycle: requestedBillingCycle, email } = body;
    const billingCycle = requestedBillingCycle || "mensuel";

    // Validate billingCycle
    if (!(billingCycle in PRICE_IDS)) {
      logStep("Invalid billing cycle", { billingCycle });
      return new Response(
        JSON.stringify({ error: "Invalid billing cycle selected" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Validate email format
    if (email && (typeof email !== "string" || email.length > 255 || !EMAIL_REGEX.test(email))) {
      logStep("Invalid email format");
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const priceId = PRICE_IDS[billingCycle as BillingCycle];
    logStep("Price ID resolved", { priceId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer exists
    let customerId: string | undefined;
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found");
      }
    }

    const requestOrigin = origin || "https://lockhaccp.com";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${requestOrigin}/contact?success=true`,
      cancel_url: `${requestOrigin}/tarifs?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      subscription_data: {
        trial_period_days: 30,
      },
    });

    logStep("Checkout session created");

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("ERROR occurred");
    return new Response(JSON.stringify({ error: "An error occurred. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
