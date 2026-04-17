# CSM Rivalta di Torino — Type System

## 1. Font pair

**Display:**
- Family: Anton
- Source: `@fontsource/anton` `^5.0.0`
- Weights used: 400 (this is Anton's only weight — a design constraint of the family)
- Why: concept.md voice is "brutalist grotesk — condensed, industrial, earned". Anton is the single tightest-drawn condensed sans in the free library. It reads as shop-drawing stencil at display sizes and as construction signage at smaller sizes. Pairs cleanly with Inter because it has no decorative strokes to fight.

**Body:**
- Family: Inter (variable)
- Source: `@fontsource-variable/inter` `^5.0.0`
- Weights used: 400 (body), 500 (nav links, eyebrows, ingredient captions), 600 (CTA labels, emphasis)
- Why: maximally legible at all sizes, variable weight lets us express hierarchy without pulling a third family in. Inter is neutral enough to disappear behind Anton's personality.

**No third face.** Stats numerals use Inter with `font-variant-numeric: tabular-nums` — no mono family imported.

## 2. Size scale (fluid clamp)

Ratio: **1.414 (augmented fourth)** — gives wide space between display and body that suits the concept's one-extreme rule.

```css
--text-display: clamp(4.5rem, 12vw, 10rem);    /* hero "CINQUANT'ANNI DI FERRO E ACCIAIO" — the extreme */
--text-h1:      clamp(2.5rem, 5vw, 3.75rem);   /* section titles */
--text-h2:      clamp(1.75rem, 3vw, 2.5rem);   /* subheads, service category titles */
--text-h3:      clamp(1.25rem, 1.75vw, 1.5rem);/* accordion item titles, portfolio captions */
--text-lg:      clamp(1.1rem, 1.2vw, 1.25rem); /* lead paragraph / about intro */
--text-body:    clamp(1rem, 1.05vw, 1.125rem); /* body copy */
--text-sm:      clamp(0.875rem, 0.9vw, 0.95rem);/* metadata, stat labels */
--text-xs:      0.7rem;                        /* fine print (P.IVA, copyright) — the other extreme, fixed */
```

The extremes: display caps at 10rem (160px) on wide desktop; xs is fixed 0.7rem (11.2px) with letter-spacing for fine print. Both present on the page.

## 3. Weight law

```
Anton 400 (the only Anton weight):
  - Display headline ("CINQUANT'ANNI DI FERRO E ACCIAIO")
  - Section titles (h1)
  - Numbered chapter numerals ("01", "02", "03")
  - Service category titles (h2)

Inter 400 (body base):
  - All body paragraphs, descriptions, address, footer notes

Inter 500:
  - Nav links
  - Eyebrows (where used — sparingly per concept)
  - Portfolio caption meta (client name / year)
  - Accordion item titles (h3 — Inter, not Anton, to create hierarchy break)

Inter 600:
  - CTA labels ("Chiama ora", "Scopri", "Invia")
  - Inline emphasis (rare)
  - Stat numerals ("50", "8", "11") — Inter 600 tabular-nums, NOT Anton

Italic:
  - Never. Concept doesn't call for it; Anton has no italic; Inter italic reads inconsistent against Anton's upright character.
```

Hierarchy break: Anton at h1+h2 but Inter at h3 is deliberate — it creates a visible "display / content" divide that matches the shop-drawing-vs-measurements register.

## 4. Letter-spacing & leading

```css
Display (≥4.5rem):      letter-spacing: 0;        line-height: 0.9    /* Anton is already condensed; zero spacing keeps the stencil weight */
H1 (2.5-3.75rem):       letter-spacing: 0;        line-height: 1.0
H2 (1.75-2.5rem):       letter-spacing: 0;        line-height: 1.15
H3 (Inter 500):         letter-spacing: -0.01em;  line-height: 1.25
Lead / body:            letter-spacing: 0;        line-height: 1.6
Small / nav:            letter-spacing: 0.02em;   line-height: 1.3
Eyebrow (Inter 500):    letter-spacing: 0.18em;   line-height: 1.2   text-transform: uppercase
Fine print (xs):        letter-spacing: 0.08em;   line-height: 1.4
Numerals (tabular):     letter-spacing: -0.02em   line-height: 1.0   font-variant-numeric: tabular-nums
```

Display `line-height: 0.9` is aggressive but correct for Anton — the face is drawn tall-narrow, so 0.95+ leading leaves too much air between lines.

## 5. Case rules

**Uppercase:**
- Display headline ("CINQUANT'ANNI DI FERRO E ACCIAIO") — matches the shop-drawing register
- Eyebrows and kicker labels (e.g. "DAL 1965", "INFRASTRUTTURE")
- CTA labels ≤ 3 words — **exception**: "Chiama ora" stays lowercase sentence-case because all-caps phone CTAs feel shouty; the call to action matters more than the visual hierarchy

**Sentence case:**
- Section titles (h1/h2)
- Subtitles, body, accordion titles, nav links, long CTAs
- Address, footer, contact details

**Title Case:**
- Never.

## 6. Copy length guardrails (Builder enforces via grep)

```
Hero display headline:    ≤ 6 words    ("CINQUANT'ANNI DI FERRO E ACCIAIO" is 5 — ✓)
Hero subtitle:            ≤ 14 words
Section titles (h1/h2):   ≤ 8 words
Accordion item title:     ≤ 6 words
Accordion item body:      ≤ 80 words per item
Section intro paragraph:  ≤ 30 words
CTA label:                ≤ 3 words (Chiama ora = 2 ✓)
Eyebrow:                  ≤ 4 words (DAL 1965 = 2 ✓)
Portfolio caption:        ≤ 12 words + year stamp
Footer line:              ≤ 10 words
```

Builder should grep rendered HTML for any heading or CTA that exceeds these limits and flag before Phase 9.

## 7. Forbidden fonts (for this concept)

- **Fraunces, EB Garamond, Cormorant** — serif display is wrong register (concept is "shop drawing", not editorial magazine).
- **Playfair Display** — 2015 luxury-shop slop indicator.
- **Montserrat, Poppins** — the WordPress-theme defaults that brand every generic construction site.
- **Bricolage Grotesque** — considered, rejected: too retro-bold and rounded; this brand is squared and industrial.
- **Fraunces italic, any script face** — wrong register.
- **Inter for display** — fine for body, forbidden as display.

---

## Note to the Builder

1. Install `@fontsource/anton@^5.0.0` + `@fontsource-variable/inter@^5.0.0` in the client's `package.json` dependencies.
2. Import in `src/layouts/BaseLayout.astro`:
   ```ts
   import '@fontsource/anton/400.css';
   import '@fontsource-variable/inter';
   ```
3. Write tokens in `src/styles/tokens.css`:
   ```css
   --font-display: 'Anton', sans-serif;
   --font-body: 'Inter Variable', 'Inter', sans-serif;
   ```
   Plus the `--text-*` scale from section 2.
4. Preload strategy: preload `anton-400.woff2` + `inter-variable-latin.woff2` only — do not preload all weights.
5. Apply weight law in component CSS per section 3. Heading utility classes suggested:
   ```css
   .display { font-family: var(--font-display); font-size: var(--text-display); line-height: 0.9; text-transform: uppercase; }
   .h1 { font-family: var(--font-display); font-size: var(--text-h1); line-height: 1.0; }
   .h3 { font-family: var(--font-body); font-weight: 500; font-size: var(--text-h3); line-height: 1.25; }
   .body { font-family: var(--font-body); font-weight: 400; line-height: 1.6; }
   .stat { font-family: var(--font-body); font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
   .eyebrow { font-family: var(--font-body); font-weight: 500; text-transform: uppercase; letter-spacing: 0.18em; font-size: var(--text-sm); }
   ```
6. Run the copy-length grep gate against every rendered HTML page before Phase 9.
