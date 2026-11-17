// CORS des fonctions du générateur de PMS : même règle que la fonction
// create-checkout du site vitrine.
const ORIGINES = ["https://lockhaccp.fr", "https://www.lockhaccp.fr", "https://lockhaccp.com", "https://www.lockhaccp.com"];

export function enTetesCors(origine: string | null): Record<string, string> {
  const autorisee = !!origine && (
    ORIGINES.includes(origine) ||
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origine) ||
    /^http:\/\/localhost:\d+$/.test(origine)
  );
  return {
    "Access-Control-Allow-Origin": autorisee ? origine! : ORIGINES[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}
