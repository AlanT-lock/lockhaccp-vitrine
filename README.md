# LockHACCP — Site vitrine

Site vitrine du logiciel HACCP LockHACCP destiné aux restaurateurs.

## Stack

- **React 18** + **Vite** + **TypeScript** (SPA)
- **Tailwind CSS** + **shadcn/ui** + **Radix UI**
- **react-router-dom** pour le routing
- **Supabase** (auth, base de données contact, edge functions Stripe + Resend)
- **TanStack Query** pour les requêtes
- **react-helmet-async** pour le SEO par page

## Démarrer en local

```bash
npm install
cp .env.example .env  # remplir les valeurs
npm run dev
```

Le site démarre sur `http://localhost:8080`.

## Variables d'environnement

Voir `.env.example`. Toutes les variables sont préfixées `VITE_` et donc exposées au bundle client (clés publiques uniquement).

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production dans `dist/`
- `npm run preview` — prévisualiser le build
- `npm run lint` — ESLint

## Déploiement

Le site est déployé sur **Vercel**. La configuration (rewrites SPA, headers de sécurité, cache) est dans `vercel.json`.

Les variables d'env sont à configurer dans le dashboard Vercel pour chaque environnement (Production, Preview, Development).

## Backend

- **Base & auth** : Supabase projet principal LockHACCP (`ndoxvlikhmmixvhuqczs`)
- **Edge functions** :
  - `create-checkout` : création d'une session Stripe Checkout pour les abonnements
  - `send-contact-notification` : notification + confirmation email via Resend
- Les secrets serveur (`STRIPE_SECRET_KEY`, `RESEND_API_KEY`) sont configurés dans Supabase, pas dans Vercel.

## Analytics

Tracking anonyme RGPD-friendly envoyé vers une edge function Supabase dédiée (projet admin séparé). Voir `src/lib/analytics.ts`.
