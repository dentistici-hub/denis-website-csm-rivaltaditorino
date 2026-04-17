# CSM Rivalta di Torino — Motion Plan

## 1. Signature move — detailed spec

**Primitive:** `ScrollPinSection`

**Placement:** Hero section (section 1 of 6 in `section_order`)

**Config:**
```
distance: 120vh
start: 'top top'
scrub: 0.8
anticipatePin: 1
```

**Children behaviour** (driven by `var(--progress)` 0→1):
- Welder photo (`/images/hero.jpg`) — scale from 1.0 to 1.06; brightness filter from 1.0 to 0.55 (photo darkens as headline asserts itself)
- Display headline "CINQUANT'ANNI DI FERRO E ACCIAIO" — `transform: translateY(calc((1 - var(--progress)) * -20vh))` — arrives from slightly above and settles; opacity 0.0 → 1.0 mapped via progress
- Subtitle "Carpenteria metallica a Rivalta di Torino" — fades in after headline lands (progress ≥ 0.35)
- "Chiama ora" CTA — translates up by 10vh over the pin distance (progress 0.5 → 1.0)
- "50 ANNI" numeral stat — stays static, rendered as an anchor mark

**Reduced-motion fallback:** pin is disabled by the primitive; renders final state — photo + headline + subtitle + CTA all visible immediately.

**Why this config:** 120vh of scroll gives roughly 2 viewports of "hero time" — enough to feel the darkening + headline scale-in without scroll-jacking the user. Photo scale caps at 1.06 (not 1.15) because welder sparks should stay crisp, not stretch.

## 2. Section-by-section motion

### hero (ScrollPinSection — signature)
See section 1 above. Only pinned section on the page.

### trust
Variant: `TrustHeritage`
Motion: none. Numbers stat uses existing `data-anim-counter="50"` with `data-anim-duration="2.4"` (counter reaches 50 in 2.4s on viewport entry — already in `components/animations/animations.ts`).
Why: credibility-critical section. No scroll-jacking, one counter for pay-off.
Reduced-motion: counter renders final value immediately.

### services (NumberedChapter x3 wrapping ServicesAccordion)
Motion: three `NumberedChapter` components (01 / 02 / 03) as the structural scaffold, `sticky` on desktop only, `align="left"`. Inside each, `ServicesAccordion` items are placed.
- 01 — Fabbricazione (cancelli, ringhiere, ferro inox, carpenteria leggera)
- 02 — Installazione (strutture metalliche, coperture/pensiline, montaggi meccanici, infissi carcerari)
- 03 — Manutenzione (saldatura, riparazioni)
Why: editorial rhythm matches concept's "shop-drawing" register. Sticky numeral anchors the eye as the 8 detailed services unfold.
Reduced-motion: sticky removed (primitive handles); services render in flow.

### portfolio (PortfolioMasonry)
Motion: each portfolio tile wrapped in `ClipMaskReveal` direction="up", duration 1.0, once. Staggered via the component's natural load order — NOT via additional GSAP stagger.
Why: 11 real job photos need cinematic reveal without theatrics. Up-wipe reads as "workshop door opens on the job".
Reduced-motion: photos render without wipe.

### content (atmospheric band + content-about)
Motion: between `services` and `content-about`, insert a full-bleed `KenBurnsImage` band using `hero-alt.jpg` (the second atmospheric welder shot). Direction `drift`, duration 28s, aspectRatio `21 / 9`. No overlay text on this band.
Below the band, `content-about` renders text-only (no motion).
Why: gives the user a breath between the services accordion (dense reading) and the about copy (more reading). The drift is subtle at 28s — atmospheric, not distracting.
Reduced-motion: still image, no drift.

### contact (ContactSplit)
Motion: none.
Why: conversion-critical. Phone and address must be instantly legible. No animation.

### Navigation
Variant: `nav-phone`
Motion: none beyond a hover-state color flip on nav links (built into the component).
Why: click-to-call primary, no pomp.

### Footer (FooterMinimal)
Motion: none.

## 3. Interaction language

| Pattern | Where | Config |
| :--- | :--- | :--- |
| Counter | TrustHeritage 50+ years stat | `data-anim-counter="50"`, duration 2.4s |
| CTA hover | "Chiama ora" primary button (hero + contact) | existing button hover styles (background fill + invert text) |
| Link underline animation | nav links | hover underline draw, left-to-right, 200ms |
| Image hover | portfolio tiles | slight scale (1.02) on hover, desktop only |

**No MagneticButton.** Concept rejects it — brand isn't precious.
**No TextScramble.** Rejected — digital-native posture wrong for trade.
**No custom cursor.** Default is fine for a workshop.

## 4. Rejections (motion-specific)

- No `ScrollScenePan` — manifest has no wide SVG asset for it.
- No `HorizontalScrollTrack` — single signature scroll rule.
- No `DragGallery` — concept says documentary photos deserve quiet presentation.
- No `ShaderCanvas` — tech-demo register, wrong for trade workshop.
- No `Marquee` — no trust-logo row content exists.
- No `ColorFloodScroll` — one palette, one discipline.
- No `LottiePlayer`, `CutoutImage` — no assets.
- No page transitions — Astro default navigation is smooth enough for a 6-section brochure site.
- No preloader — site is static Astro, fast load, preloader would feel performative.

## 5. Reduced-motion summary

Users with `prefers-reduced-motion: reduce` see all content rendered statically: hero photo with headline + subtitle + CTA visible immediately (no pin, no scale), counters land on final value, ClipMaskReveal tiles appear without wipe, KenBurnsImage band is a still. Typography + palette + layout grammar still carry the concept — the site reads as editorial trade portfolio even without motion. Anton + forge-orange do the heavy lifting.

## 6. Build order

1. **Hero + ScrollPinSection signature** — verify the centerpiece works first. If the pin-progress children don't feel right, we catch it before building everything else.
2. **Navigation + Footer** — the frame.
3. **Trust + Services** — the credibility section + the bulk of service content.
4. **Portfolio + Content atmospheric band** — the visual payoff.
5. **Contact** — the conversion.

---

_Plan anchored by concept.md signature move + available assets (hero.jpg + hero-alt.jpg + 11 portfolio photos + 8 service photos). All primitives named exist in `components/motion-primitives/`. Asset gate passed: no LottieFlash / ScrollScenePan / HeroVideo slots invoked._
