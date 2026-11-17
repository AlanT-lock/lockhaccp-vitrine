// External app URL (Next.js app where signup/login/billing happens).
// Override via VITE_APP_URL if you need a staging environment.
export const APP_URL =
  (import.meta.env.VITE_APP_URL as string | undefined) ?? "https://app.lockhaccp.fr";

// Account creation page: target of every "start / try for free" button.
// APP_URL alone lands on the login page; keep it for "Connexion" links.
export const SIGNUP_URL = `${APP_URL}/signup`;
