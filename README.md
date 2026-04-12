# Taraca - Redesign Foundation

Premium artist website foundation for an immersive, motion-rich, editorial experience.

## Current Status

This repository is intentionally prepared for a section-by-section rebuild.

- Home currently renders only Hero to keep scope controlled.
- Future sections are scaffolded, not fully implemented.
- Integrations are wired through server-side adapter boundaries with mock providers.
- Domain/content contracts exist so UI stays decoupled from external APIs.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lenis smooth scrolling

## Structure

```text
app/
  api/
    newsletter/route.ts
    shopify/route.ts
    tour/route.ts
  layout.tsx
  page.tsx

components/
  sections/
    hero/
    manifesto/
    tracklist/
    tour/
    merch/
    biography/
    footer/
  primitives/
    motion/
    media/
    layout/
  providers/

content/
  sections.ts

lib/
  domain/
  integrations/
```

## Architectural Rules

1. Section UI components do not call third-party APIs directly.
2. All external services are wrapped in `lib/integrations/*` adapters.
3. API routes in `app/api/*` expose normalized domain data to UI.
4. Shared shapes live in `lib/domain/types.ts`.
5. New sections are implemented one at a time after design lock.

## Planned Section Sequence

1. Hero / Intro
2. Manifesto
3. Tracklist
4. Tour (Bandsintown-backed adapter)
5. Merch (Shopify-backed adapter)
6. Biography
7. Footer / Newsletter

## Development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Integration Notes

- Current adapters are mock implementations by design.
- Replace adapter internals (not UI contracts) when connecting real APIs.
- Suggested environment variables for later phases:
  - `BANDSINTOWN_APP_ID`
  - `SHOPIFY_STORE_DOMAIN`
  - `SHOPIFY_STOREFRONT_TOKEN`
  - `NEWSLETTER_API_KEY`
