# Taraca Redesign Reusability Audit

This audit classifies the current codebase for the section-by-section redesign baseline.

## Components Classification

| Current file | Decision | Owner in new structure | Notes |
| --- | --- | --- | --- |
| `components/features/Hero.tsx` | Keep + refactor | `components/sections/hero` + `components/primitives/motion` | Strong motion baseline, should be split into section orchestration + reusable motion/media primitives. |
| `components/features/VideoGallery.tsx` | Keep + refactor | `components/sections/manifesto` or `components/sections/tracklist` | Useful animation patterns, but currently mixed with hardcoded content and route-specific assumptions. |
| `components/features/ScrollScaleSection.tsx` | Refactor heavily | `components/sections/tour` | Should become presentation-only section fed by normalized tour data; remove placeholder links. |
| `components/features/AudioPlayerBar.tsx` | Keep + refactor | `components/primitives/media` | Reusable audio UX foundation; needs domain-driven track source and accessibility hardening. |
| `components/features/AnimatedLogo.tsx` | Keep | `components/primitives/media` | Reusable branded media primitive. |
| `components/features/DrexlerTextSection.tsx` | Keep + refactor | `components/sections/biography` | Conceptually aligned with editorial biography tone, needs content decoupling. |
| `components/layout/Navbar.tsx` | Keep + refactor | `components/primitives/layout` | Good shell component; should be made section-aware and data-driven. |
| `components/providers/LenisProvider.tsx` | Keep | `components/providers` | Valid app-wide provider for motion experience. |
| `components/features/SongList.tsx` | Remove prototype | Replaced by `components/sections/tracklist` | Current mock tracklist and route model are placeholder quality. |
| `components/features/ScrollSection.tsx` | Remove prototype | Replaced by targeted primitives in `components/primitives/motion` | Generic wrapper is too broad and tied to prototype concept page behavior. |
| `components/layout/PersistentPlayer.tsx` | Remove prototype | N/A | Unused visual mock; no real playback state integration. |

## Routes Classification

| Current route | Decision | Rationale |
| --- | --- | --- |
| `app/page.tsx` | Keep + recompose | Continue as root entry while transitioning sections incrementally. |
| `app/songs/page.tsx` | Remove prototype | Placeholder route not aligned with final information architecture. |
| `app/concept/[slug]/page.tsx` | Remove prototype | Placeholder lorem/story page with no production data model. |
| `app/layout.tsx` | Keep + improve | Correct location for global metadata/providers; will be extended for SEO and analytics later. |

## Dependency Classification

| Package | Decision | Notes |
| --- | --- | --- |
| `next`, `react`, `react-dom`, `typescript` | Keep | Core platform for current and future architecture. |
| `framer-motion` | Keep | Needed for premium motion language. |
| `lenis` | Keep | Smooth scrolling baseline already integrated. |
| `lucide-react` | Keep | Useful for lightweight iconography. |
| `clsx`, `tailwind-merge` | Keep and adopt | Installed but underused; should be used in component composition utility helpers. |
| `simplex-noise` | Remove (if still unused after first section) | Currently not used in implemented sections. |

## Immediate Baseline Actions

1. Introduce section-first directory structure and typed content/domain contracts.
2. Remove prototype-only routes/components that could cause architectural drift.
3. Add server-side integration adapter stubs (`tour`, `shopify`, `newsletter`) with normalized shapes.
4. Keep homepage implementation intentionally narrow while sections are rebuilt one by one.
