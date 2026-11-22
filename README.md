# Fare Finder Pro

Build a SaaS landing page + authenticated app shell for Flight Price Notifier
(機票降價通知), a product that watches popular flight routes from Taipei and
emails the user when the cheapest fare drops to or below their target price —
targeted at budget-driven travelers who don't care exactly when they fly,
they just want a ticket under their budget.

The site must include:

A public landing page (/) with:

Hero section: product name "Flight Price Notifier" prominently displayed,
value prop 「設定航線與目標價，機票降價就通知你」(English subtitle: "Set a
route and a target price — we email you when the fare drops."), and a
primary CTA button labeled "Sign in / 登入" in the top-right header.

Three feature cards below the hero, each with an icon, a Chinese title, an
English subtitle, and a one-line Chinese description:

Card 1: ✈️ icon — "盯緊熱門航線" / "Always-on route watching" —
"持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。"

Card 2: 🔔 icon — "達標自動通知" / "Target-price email alerts" —
"低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。"

Card 3: 🚫 icon — "隨時取消" / "Cancel anytime" —
"月訂閱制，不想用隨時停，沒有綁約。"

A simple footer with "© 2026 Flight Price Notifier".

An authenticated area with a /auth page (Supabase email/password auth):

Heading "Welcome back．登入", subtitle "Sign in to manage your fare alerts.",
Email field (placeholder "you@example.com") and Password field, a primary
button "Sign in / 登入", and a toggle link "No account yet? Create one" to
switch to sign-up mode.

After signing in, redirect to a placeholder dashboard page.

Style requirements:

Modern, professional dark theme (purple/violet accent on a near-black
background)

Use Inter or a similar sans-serif font

Mobile responsive

Tasteful subtle animations (fade-in on scroll is fine; don't overdo it)

Out of scope for this v1: route-subscription form, target-price input, fare
display, payment, custom database tables (do NOT create a subscriptions or
profiles table — only use Supabase's default auth.users). Those come in
later milestones. Stick to landing page + auth + placeholder dashboard.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1e402b62-83d1-4de0-81d0-0c578ef4f90b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

This is a plain **Vite + React single-page app** (no SSR) using React Router
for client-side routing. You need [Bun](https://bun.sh) (or Node.js + npm).

```sh
bun install
bun run dev        # http://localhost:8080
bun run build      # static output in dist/
bun run preview    # serve dist/ locally
```

### Routes

| Path | Page |
| --- | --- |
| `/` | Landing page |
| `/sign-in` | Sign in (Supabase email/password) |
| `/sign-up` | Create account |
| `/app` | Dashboard — signed-in users only, otherwise redirects to `/sign-in` |

Old URLs `/auth` and `/dashboard` redirect to `/sign-in` and `/app`.
Routes are defined in `src/router.tsx`; pages live in `src/pages/`.

### Environment variables

Auth runs on our own Supabase project (`kounudhhosybfouiktff`). Vite inlines
these at build time from `.env` (local) or the Vercel project settings:

- `VITE_SUPABASE_URL` — `https://kounudhhosybfouiktff.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` — the project's `sb_publishable_…` key
  (browser-safe, RLS-gated; replaces the legacy "anon" key)

The only Supabase client is `src/integrations/supabase/client.ts`.

## Deploying to Vercel

Import the repo in Vercel; `vercel.json` already sets the Vite framework,
`bun run build`, the `dist` output directory, and a SPA fallback rewrite so
deep links like `/app` load `index.html` and resolve client-side. Add the two
`VITE_*` variables above under Project → Settings → Environment Variables
(Production, Preview and Development), and add your Vercel domain to Supabase
→ Authentication → URL Configuration (Site URL / Redirect URLs).
