# Phase 5: Visual Redesign — "Marble & Gold"

## Context

Phases 1-4 built and shipped a fully working app (lesson content, Claude-graded writing practice, server-side progress, Google auth, public deployment) with purely functional, unstyled-beyond-Tailwind-defaults UI: plain zinc/white cards, default Geist type, no visual identity. The app teaches classical rhetoric — ethos, pathos, logos, and devices like anaphora, antithesis, and chiasmus — but nothing in its presentation reflects that subject matter.

Phase 5 is a visual and structural redesign: modernize the interface while giving it the deliberate "flair of the Classics" — Roman marble-and-gold as the aesthetic anchor, with restrained decorative motifs and typography drawn from that world, applied through a token-based system rather than ad-hoc per-file styling.

This phase touches presentation only. No new features, routes, data model changes, or behavioral changes are in scope — every page keeps its current information architecture and content, restyled and selectively realigned.

## Decisions

- **Aesthetic: Roman "Marble & Gold."** Warm marble neutrals (not stark white/grey), a single gold accent used deliberately (not as wallpaper), and verdict-tier colors remapped to classical pigments (oxblood, ochre, lapis, Tyrian purple) instead of generic Tailwind red/amber/blue/emerald.
- **Scope: visual refresh AND layout restructuring, applied equally across every page** — dashboard, lesson detail, writing/evaluation flow, and header all get substantial rework, not just the dashboard.
- **Decorative motifs: subtle, hand-authored inline SVGs** — a small, fixed set (laurel sprig, meander/Greek-key rule, column glyph), used as functional accents (dividers, badges, marks), never as illustration or background texture.
- **Dark theme is a deliberately designed second palette** ("carved stone at night"), not an auto-inverted light theme.
- **Implementation approach: design tokens + small reusable primitives.** New CSS custom properties in `globals.css` (extending the existing `@theme inline` pattern) for color/type tokens, plus a small `src/components/ui/` primitives layer (`Panel`, `Button`, `GoldRule`) that replaces hand-typed Tailwind class combinations currently duplicated across `LessonCard`, `WritingPromptForm`, `EvaluationResult`, and `AuthHeader`.
- **Structural realignment only where it reinforces the theme**, not a general reflow: the two changes below are the only positional changes in this phase. Everything else keeps its current position in the page and is restyled in place.
  - `EvaluationResult`'s strengths/weaknesses become a two-column antithesis layout (side by side on desktop, stacked on mobile) — a deliberate callback to the antithesis/chiasmus lesson, not just a visual choice.
  - `CLASSICAL_EXAMPLE` lesson sections move from inline paragraph blocks to an inset "marginal gloss" position, visually set apart from surrounding explanatory text.
- **No new routes, no new dependencies beyond two Google Fonts** (`Cinzel`, `Cormorant Garamond`, both loaded via the existing `next/font/google` pattern already used for Geist).

## 1. Design Tokens (Color & Typography)

Extends `src/app/globals.css`'s existing `@theme inline` block. All values are new CSS custom properties; nothing existing is removed until step-by-step replacement in later tasks.

**Light palette ("Marble & Gold"):**

| Token | Value | Use |
|---|---|---|
| `--color-background` | `#F8F5EF` | page background (warm marble, not pure white) |
| `--color-surface` | `#FDFBF7` | card/panel background |
| `--color-foreground` | `#2A2622` | primary text (warm near-black) |
| `--color-muted` | `#6B6255` | secondary text |
| `--color-border` | `#D8D0C4` | hairline borders (marble vein) |
| `--color-gold` | `#A67C27` | primary accent (rules, active states, wordmark) |
| `--color-gold-hover` | `#8B6914` | accent hover/pressed state |

**Dark palette ("carved stone at night"):**

| Token | Value | Use |
|---|---|---|
| `--color-background` | `#171512` | page background |
| `--color-surface` | `#211E1A` | card/panel background |
| `--color-foreground` | `#EDE6D9` | primary text |
| `--color-muted` | `#A79E8E` | secondary text |
| `--color-border` | `#3A352E` | hairline borders |
| `--color-gold` | `#D4AF37` | primary accent, brightened for dark contrast |
| `--color-gold-hover` | `#E8C558` | accent hover/pressed state |

**Verdict-tier colors** (replace `EvaluationResult`'s `VERDICT_STYLES` red/amber/blue/emerald mapping):

| Verdict tier | Light | Dark |
|---|---|---|
| `poor` / `needs_significant_work` (oxblood) | `#6B2737` | `#A23B4E` |
| `developing` (ochre) | `#B8860B` | `#D4A017` |
| `proficient` / `solid` (lapis) | `#2A5CAA` | `#4A7FC1` |
| `excellent` (Tyrian purple) | `#66023C` | `#8B2C6B` |

Tyrian purple for `excellent` is a deliberate historical callback — the dye was reserved for Roman emperors — used here for the one verdict tier that represents genuinely exceptional work.

**Typography** — three-tier pairing, loaded via `next/font/google` in `src/app/layout.tsx` alongside the existing `Geist`/`Geist_Mono` imports:

- **Display** (`Cinzel`): the "Rhetoripendium" wordmark and the dashboard hero heading only. All-caps-capable Roman inscriptional letterforms.
- **Headings** (`Cormorant Garamond`): lesson titles, section headings (`h2`/`h3`), verdict badges' labels. A classical serif with enough warmth to avoid feeling like a stock heading font.
- **Body** (`Geist Sans`, unchanged): all paragraph text, form inputs, buttons — kept exactly as-is, since body legibility shouldn't be sacrificed for theme.

## 2. Decorative Motifs & Primitives

**Motifs** — new directory `src/components/motifs/`, each a small hand-authored `currentColor`-based inline SVG so it inherits the surrounding text/accent color and needs no separate theming:

- `LaurelSprig.tsx` — a single laurel branch. Used next to completed-lesson indicators (replacing/augmenting `ProgressBadge`'s current text-only state) and next to an `excellent` overall verdict in `EvaluationResult`.
- `MeanderRule.tsx` — a horizontal Greek key (meander) pattern rendered as a repeating SVG strip. Used as a section divider: between the dashboard's intro paragraph and the lesson grid, and between `EvaluationResult`'s per-criterion breakdown and its strengths/weaknesses/summary block.
- `ColumnGlyph.tsx` — a simple Doric column silhouette. Used once, next to the "Rhetoripendium" wordmark in the header.

**Primitives** — new directory `src/components/ui/`:

- `Panel.tsx` — replaces the `rounded-xl border border-zinc-200 bg-white p-5 shadow-sm ... dark:border-zinc-800 dark:bg-zinc-900` pattern currently hand-typed in `LessonCard`, `WritingPromptForm`, and `EvaluationResult`, using the new `--color-surface`/`--color-border` tokens.
- `GoldRule.tsx` — a thin solid gold horizontal (or, for the antithesis layout, vertical) rule using `--color-gold`, for places a full `MeanderRule` would be too busy.
- `Button.tsx` — replaces the two independently-styled buttons in `WritingPromptForm` (`bg-zinc-900 ... dark:bg-zinc-100`) and `AuthHeader` (`bg-zinc-900` / `border-zinc-300`) with one primary (gold-filled) and one secondary (outlined) variant.

## 3. Page-by-Page Layout

- **Header** (`AuthHeader` + `layout.tsx`): `ColumnGlyph` + "Rhetoripendium" wordmark in Cinzel on the left, auth controls (restyled with `Button`) on the right, sitting above a `GoldRule` in place of the current plain zinc border-bottom. Slightly taller for breathing room.
- **Dashboard** (`page.tsx`): hero heading in Cinzel, intro paragraph unchanged in position, a `MeanderRule` beneath it separating hero from the lesson grid. Lesson cards (`LessonCard`) become `Panel`s; a `LaurelSprig` marks completed lessons.
- **Lesson detail** (`lessons/[slug]/page.tsx` + `LessonContent`): section headings in Cormorant Garamond. `CLASSICAL_EXAMPLE` sections move to an inset "marginal gloss" position (a `Panel` with a small quotation-mark treatment), visually distinct from surrounding `EXPLANATION`/`EXAMPLE`/`SUMMARY` sections, which stay in their current linear flow. `GoldRule` between sections.
- **Writing/evaluation flow** (`WritingPromptForm` + `EvaluationResult`): textarea and submit button restyled via `Panel`/`Button` (parchment-on-ink feel for the textarea). Verdict badges recolored per Section 1. `MeanderRule` separates the per-criterion breakdown from the strengths/weaknesses block below it. Strengths/weaknesses become a two-column antithesis layout (`GoldRule` as the vertical divider on desktop; stacked with a horizontal `GoldRule` on mobile). `LaurelSprig` accents an `excellent` overall verdict.

## File Structure

```
src/
├── app/
│   ├── globals.css          # modified: new color tokens (light + dark), font variables
│   └── layout.tsx           # modified: Cinzel + Cormorant Garamond font imports
├── components/
│   ├── motifs/
│   │   ├── LaurelSprig.tsx      # new
│   │   ├── MeanderRule.tsx      # new
│   │   └── ColumnGlyph.tsx      # new
│   ├── ui/
│   │   ├── Panel.tsx             # new
│   │   ├── GoldRule.tsx          # new
│   │   └── Button.tsx            # new
│   ├── LessonCard.tsx        # modified: use Panel, LaurelSprig
│   ├── LessonList.tsx        # unchanged
│   ├── LessonContent.tsx     # modified: Cormorant headings, inset CLASSICAL_EXAMPLE treatment
│   ├── ProgressBadge.tsx     # modified: LaurelSprig integration
│   ├── WritingPromptForm.tsx # modified: use Panel, Button
│   ├── EvaluationResult.tsx  # modified: verdict recolor, MeanderRule, antithesis two-column layout, LaurelSprig
│   └── AuthHeader.tsx        # modified: use Button, ColumnGlyph, wordmark
└── app/page.tsx              # modified: Cinzel hero, MeanderRule divider
```

## Out of Scope

- Any new feature, route, or data-model change — this phase is presentation-only.
- Custom illustration, photography, or background texture — motifs are restricted to the three small SVGs listed above.
- Accessibility audit beyond maintaining reasonable contrast on the new palettes (no dedicated WCAG contrast-ratio testing pass planned).
- Animation/transition work — not requested; static restyle only.
- Any restructuring beyond the two explicitly named realignments (antithesis two-column layout, inset classical-example gloss) — every other page keeps its current element order and position.
- Mobile-specific redesign beyond ensuring the two realigned layouts collapse sensibly (existing responsive breakpoints/patterns are reused, not redesigned).
