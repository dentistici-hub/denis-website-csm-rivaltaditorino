# CSM Rivalta di Torino — Concept

## 1. Through-line

Fifty years of ironwork behind Italy's infrastructure — metro, autostrade, prisons — told like a shop drawing, not a brochure.

## 2. Signature move

The hero is a `ScrollPinSection` — the welder photo holds full-bleed while you scroll, and the display headline **CINQUANT'ANNI DI FERRO E ACCIAIO** scales and darkens over it via `--progress`; no second scroll pattern anywhere else on the page.

## 3. Typographic voice

Brutalist grotesk — condensed, industrial, earned. Display face carries the weight of the heritage; body stays utilitarian and legible. No serifs (not editorial); no luxury display (this is a workshop).

## 4. Motion language

**Intensity:** medium

**Signature Tier 1 move:** `ScrollPinSection` on hero — the only pinned scroll on the page. Supporting motion stays incidental: `ClipMaskReveal` on portfolio images, `KenBurnsImage` (direction `drift`, duration 28s) on the atmospheric welder-alt hero-band between services and portfolio. No horizontal tracks, no scene pans, no shaders.

## 5. Color law

```
bg:      #F5F1EA   (aged shop-drawing paper)
fg:      #121212   (ink)
accent:  #A8370F   (hot-metal forge orange, WCAG AA on cream — 5.79)
```

Three colors exactly. Accent appears **sparingly**: primary CTA, one service-accordion active-state, the "50 ANNI" numeral stat, the forge-spark flourish on hero. Never more than 3 accent occurrences per section. Steel-blue `#2C3E4A` from brief is **rejected** — two accents fight for attention and the concept wants one forge-heat note.

Grain: **off**. The welder photography already has its own film grain; adding an overlay would read as Instagram filter on a trade site.

## 6. Layout grammar

**IN:**
- `ScrollPinSection` (hero, signature)
- `HeroSplit` variant nested inside ScrollPinSection — welder photo right, headline+CTA left
- `TrustHeritage` (50+ anni, P.IVA, location anchors)
- `ServicesAccordion` (8 services, infissi carcerari expands deepest)
- `NumberedChapter` applied to the 3-step services overview NOT as signature but as structural rhythm (01 Fabbricazione / 02 Installazione / 03 Manutenzione)
- `ClipMaskReveal` on portfolio images, direction `up`, once
- `PortfolioMasonry` (11 real jobs, varying aspect ratios)
- `KenBurnsImage` on mid-page atmosphere band
- `ContentAbout` (text-only, extended history)
- `ContactSplit` with click-to-call
- `FooterMinimal`
- Phone-first nav (`nav-phone` variant — click-to-call is the conversion)

**OUT:**
- `ScrollScenePan` — no wide SVG asset exists
- `HorizontalScrollTrack` — conflicts with signature move
- `DragGallery` — documentary photos deserve quiet presentation, not cursor-grab
- `ShaderCanvas` — tech-demo reading for a trade workshop
- `MagneticButton` — precious; this brand isn't
- `TextScramble` — digital-native posture wrong for ironwork
- `Marquee` — no trust-logo row (they've never published client logos)
- `ColorFloodScroll` — one palette, one discipline
- `DuotonePhoto` — the real welder photo needs its real colors (red jacket, blue helmet, orange sparks)
- `LottiePlayer`, `CutoutImage` — no assets for them
- Team section, testimonials — no content

## 7. Rejections

- **Any tech-startup styling.** No gradient meshes, no glowing halos, no violet accents.
- **Stock "handsome contractor" photography.** Their welders, their sparks, their photography. All of it.
- **"La nostra missione" / "Ci impegniamo a".** The site refuses corporate-speak because CSM doesn't talk like that.
- **Two accent colors.** Brief offered steel-blue; concept picks forge orange and sticks.
- **Centered hero with two CTAs side by side.** Hero has one CTA (`Chiama ora`) — phone is the only conversion path.
- **Small hero type.** The display headline is the whole hero on desktop. Sub-90vh hero is rejected.

---

_Concept anchored by: 50+ year family SNC, 8 specialized services including infissi carcerari, 11 real infrastructure photos (Torino metro, A4 Telepass, tunnel works, prison corridors), palette and typography from brief.json gate-checked WCAG AA. Written knowing the asset-gatherer delivered 96% client-original imagery — no fallback photography needed._
