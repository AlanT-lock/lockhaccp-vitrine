// External app URL (Flutter app where signup/login/billing happens).
// Override via VITE_APP_URL if you need a staging environment.
export const APP_URL =
  (import.meta.env.VITE_APP_URL as string | undefined) ?? "https://app.lockhaccp.fr";
