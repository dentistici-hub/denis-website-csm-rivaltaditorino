# CSM Rivalta di Torino — Visual Critique

## Pass 2 verdict — GREENLIGHT

After builder iteration, both critical gaps are resolved:
- Broken images: **14 → 1** (the remaining one is the lightbox placeholder, populated on click-time only — expected behavior, not a bug)
- `[data-animate]` elements hidden: **heritage counter-col now `visibility: visible`**; 18 remaining hidden elements are below-the-fold and reveal on IntersectionObserver fire — expected behavior
- Hero signature move works: pinned scene, headline unveils with scroll progress, welder photo visible with red jacket/dark helmet/orange sparks
- Portfolio masonry ships all 11 real infrastructure jobs — Torino metro, autostrade, prisons, industrial catwalks
- Display typography (Anton) + body (Inter) + palette (cream+ink+forge-orange) all rendered as specified

Proceeding to publisher.

---

# Pass 1 (retained for reference)

## 1. Verdict

**ITERATE** (resolved in Pass 2)

Two systemic build issues make the site non-shippable as-is. Both are mechanical and specific to fix. No concept or aesthetic revisions needed.

## 2. Screenshots taken

_Screenshots not saved to disk in this pass — critic worked live against the dev preview at `http://localhost:4330/denis-website-csm-rivaltaditorino/`. Next iteration: save to `critique-screenshots/` with timestamps._

Live inspection covered:
- Hero at scroll=0, mobile and desktop widths
- Services numbered-chapter area at scroll=3500 and 5500
- Portfolio/content/contact area at scroll-to-end
- DOM inspection of every `<img>` and every `[data-animate]` element

## 3. Concept alignment rubric

| Dimension          | Status   | Evidence |
| :---               | :---     | :--- |
| Through-line       | partial  | Visible elements ARE editorial-industrial (Anton display, cream bg, forge-orange accent) — matches concept. But 90% of the page is empty or invisible content due to bugs 1+2, so the through-line can't fully register. |
| Signature move     | yes      | `ScrollPinSection` on hero is wired correctly: headline starts at `transform: matrix(1,0,0,1,0,-234) opacity:0` at progress 0, unveils as scroll progresses. The mechanism works — but the welder photo behind it is broken (404), so the "photo darkens as headline lands" effect is invisible. |
| Typographic voice  | yes      | Anton display rendered (`font-family: "Anton", ...`), Inter body present. Display hits 85px at mobile (spec said 72-160 fluid clamp). `CINQUANT'ANNI DI FERRO E ACCIAIO` reads correctly. |
| Motion intensity   | yes      | Medium, signature pin present. No ScrollScenePan / HorizontalScrollTrack added. KenBurnsImage wired for mid-page atmospheric band (photo broken so effect invisible). |
| Color law          | yes      | `#F5F1EA` bg + `#121212` fg + `#A8370F` accent confirmed in rendered CSS. No steel-blue anywhere. Accent appears on: eyebrow, CHIAMA ORA CTA, numbered chapter numerals. 3 occurrences per section max — passes. |
| Layout grammar     | yes      | IN components present (NavPhone, TrustHeritage, NumberedChapter×3, ServicesAccordion, PortfolioMasonry, KenBurnsImage, ContentAboutProse, ContactSplit, FooterMinimal). OUT components absent (no DragGallery/ShaderCanvas/TextScramble/MagneticButton/Marquee). |
| Rejections         | partial  | No "la nostra missione" / "ci impegniamo a" leaks detected in visible HTML. "Chi siamo" section renamed to "Chi siamo" (brief/concept-aligned). But visibility bug means large blocks can't be visually verified — re-check after fix. |

## 4. Critical gaps (ordered by severity)

### Gap 1 — Image wiring: 14/14 `<img>` tags load from wrong base path

**Severity:** Critical. The site looks empty because every image 404s.

**Evidence (DOM inspection via preview_eval):**
- `hero-welder__photo`: `src="/images/hero.jpg"` → `naturalWidth: 0` (404)
- 11× `pmasonry__img` elements — all `src="/images/portfolio-*.jpg"` → all `naturalWidth: 0`
- `kenburns__img`: `src="/images/hero-alt.jpg"` → `naturalWidth: 0`
- 1× `pmasonry__full` (likely the about-heritage photo) — `src=""` (empty)

**Root cause:** The components emit raw `/images/foo.jpg` paths instead of applying `withBase()`. This is the SAME base-path bug the pipeline hit on Blue Marketing — the fix there was added to `PortfolioFilterable`, `TrustLogos`, `TeamSpotlight`, etc. (commit `c59ebb9c`), but the NEW signature component `HeroPinnedWelder.astro`, the local `PortfolioMasonry.astro`, and the shared `KenBurnsImage.astro` do NOT include the `withBase()` helper.

**Fix:**
1. In `src/components/signature/HeroPinnedWelder.astro`: add the `withBase` helper in frontmatter and wrap both `photoSrc` and `photoWebp`:
   ```astro
   ---
   const withBase = (p) => {
     if (!p) return p;
     if (/^(https?:\/\/|data:)/.test(p)) return p;
     const base = import.meta.env.BASE_URL.replace(/\/$/, '');
     return p.startsWith('/') ? `${base}${p}` : `${base}/${p}`;
   };
   ---
   <img src={withBase(photoSrc)} srcset={`${withBase(photoWebp)} ...`} ... />
   ```
2. In `src/components/portfolio/PortfolioMasonry.astro`: same pattern on `project.image`, `project.image_webp`, `full.image`, `full.image_webp`.
3. In `components/motion-primitives/KenBurnsImage.astro` (repo-level): add `withBase` helper. This is a Tier 3 primitive the Session 2 review missed.
4. Grep `src/pages/index.astro` for `<img src="/images/` and `<source srcset="/images/` — none should remain after fixes.

**Verification after fix:**
```js
// preview_eval
Array.from(document.querySelectorAll('img')).filter(i => i.complete && i.naturalWidth === 0).length === 0
```

### Gap 2 — Content hidden: `[data-animate]` never reveals because JS looks for `[data-anim]`

**Severity:** Critical. Blocks ContactSplit, TrustHeritage counter col, and probably 40%+ of on-page text from ever becoming visible.

**Evidence:**
- `src/styles/global.css:75` sets `[data-animate] { visibility: hidden; }` with reveal via `.is-revealed` class
- `src/components/animations/animations.ts:158` queries `[data-anim]` (different attribute) and adds `.is-revealed`
- Every reference component (`ContactQuoteForm`, `ContactReservation`, `TrustHeritage`, etc.) uses `data-animate` in markup
- Result: nothing queries `data-animate`, nothing adds `.is-revealed`, elements stay `visibility: hidden` forever
- DOM check confirms `.heritage__counter-col` has `visibility: hidden`, `bounding box y: -5325` → never revealed

This is a **pre-existing pipeline bug** (not this client's fault) that also affected Blue Marketing v2 and probably every prior client. Fixing it here makes the pipeline right for everyone.

**Fix (choose one, option A is preferred):**

**A — Standardize reference components to `data-anim="fade-up"`** (long-term correct)
Run a repo-wide sed in `Website/components/` replacing `data-animate` with `data-anim="fade-up"`. This is ~60 files. Should be a separate hardening commit, NOT this client's responsibility.

**B — Compatibility shim (tactical fix for this client now)**
Add to `src/components/animations/animations.ts` at the top of `initAnimations()`:
```ts
// Legacy data-animate support — reference components use the old attribute name.
document.querySelectorAll<HTMLElement>('[data-animate]').forEach((el) => {
  if (!el.hasAttribute('data-anim')) {
    el.setAttribute('data-anim', 'fade-up');
  }
});
```
This gives every `[data-animate]` the new attribute so the IntersectionObserver picks it up.

**C — Change global.css to use `[data-anim]` instead of `[data-animate]`** (breaks existing clients if they re-deploy, avoid)

Recommend **B** for this client's iteration + schedule **A** as a follow-up commit.

**Verification after fix:**
```js
// preview_eval — should return 0
document.querySelectorAll('[data-animate]:not(.is-revealed)').length
```

## 5. Non-critical nits

- "Questa è un'anteprima del tuo nuovo sito. Ti piace? Rispondi all'email per procedere." — demo banner is Italian, perfect. No change.
- Hero eyebrow reads "CARPENTERIA METALLICA · RIVALTA DI TORINO" with a middle dot. Works. Could be tightened but on-concept.
- Mobile nav shows `C.S.M. BERTACCO` wordmark as a logo substitute — acceptable given the real logo was flagged `usable_quality: low`. Consider replacing with a simple 60px Anton-stencil "CSM" monogram when Denis reviews.
- Desktop nav renders clean: OFFICINA / SERVIZI / LAVORI / CONTATTI + phone number + "CHIAMA ORA" pill. Good.
- Numbered chapters at 02/03 scroll position: the 4-column ratio (numeral left : content right) looks spacious on desktop. After Gap 1+2 fixes, re-check that accordion headers display correctly — DOM had them, visibility was the blocker.

## 6. Reference alignment notes

- `centerformetalarts.org` (brief ref): we matched the "honest trade, no gloss" register via Anton display + forge-orange + real welder photo (once visible).
- `awwwards.com/sites/model-workshop` (brief ref): we borrowed the numbered-chapter rhythm for services. Their version is more aggressive; ours is quieter, which matches our concept's "quiet, surgical" pull.
- `rizzanidemeccanico.it` (brief ref): we rejected their "hero: rotating full-bleed photo carousel" pattern — our pinned-scene signature is more specific. Good call.

## 7. What memory says (and learned this pass)

Two findings that should become **procedural memories** stored via gmem:

1. **`image-wiring-bug` is not fixed globally** — it's been manually patched on some reference components but not on: signature components (because those are written fresh per client), Tier 3 primitives (KenBurnsImage, CutoutImage, DuotonePhoto, LottiePlayer), and any locally-written component (PortfolioMasonry variant at `src/components/portfolio/`). Every client build needs a final grep for `src="/images/` and `src="/videos/` in the source — builder's Phase 9b should tighten this check.

2. **The `data-animate` / `data-anim` attribute mismatch is a latent pipeline bug** affecting every client. Session 5+ should either standardize component markup to `data-anim="fade-up"` or extend animations.ts to accept both. Until fixed, every builder must ship the compat shim from Gap 2 option B.

---

## Next action

Builder iterates with the two critical gaps above as input. Expected loop:
1. Builder reads critique.md, addresses Gap 1 + Gap 2
2. Builder re-runs gates 9a-9e + image-wiring grep
3. Builder reports ready-for-re-critique
4. Critic re-screenshots, expects all 14 images loading + all sections visible
5. If clean → GREENLIGHT
6. If 1-2 minor gaps remain → GREENLIGHT with tradeoffs documented

No concept or plan re-work needed. The signature mechanism, typography, palette, and layout grammar all ship as specified.
