/**
 * animations.ts — Website builder animation preset system.
 *
 * Single entry point for the 11 implemented presets. Starters/clients import
 * this file once and call `initAnimations()`. The module is framework-agnostic:
 * plain DOM + IntersectionObserver + rAF. No external deps.
 *
 * Presets are declared via `data-anim="<name>"` on any element. Scroll-based
 * presets are handled by one shared IntersectionObserver. Non-scroll presets
 * (counter, parallax, cursor-reactive, rotating-text) have their own
 * initializers that query-select their own roots.
 *
 * Respects `prefers-reduced-motion`: when set, elements are revealed instantly
 * (no transforms, no tweens) and rotating-text / counter / parallax /
 * cursor-reactive are disabled entirely.
 *
 * Pair with `animations.css` for the CSS-driven presets
 * (`clip-reveal`, `fade-up`, `stagger`, `hover-inversion`, `group-hover`,
 * `bounce-in`, `rotating-text` CSS transitions).
 */

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type ScrollPreset =
  | 'fade-up'
  | 'clip-reveal'
  | 'stagger'
  | 'bounce-in'
  | 'draw-svg';

export interface InitAnimationsOptions {
  /** Root scroll container. Defaults to `document`. */
  root?: Element | null;
  /** IO rootMargin. Defaults to `'0px 0px -10% 0px'` (fire slightly before fully in view). */
  rootMargin?: string;
  /** IO threshold. Defaults to `0.05`. */
  threshold?: number;
  /** When true, also re-run non-scroll initializers. Useful after client-side navigation. */
  reinit?: boolean;
}

/* ------------------------------------------------------------------ */
/* Utilities                                                          */
/* ------------------------------------------------------------------ */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function parseNumberAttr(el: HTMLElement, key: string, fallback: number): number {
  const raw = el.dataset[key];
  if (raw === undefined || raw === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function setCustomProps(
  el: HTMLElement,
  values: Record<string, string | number | undefined>,
): void {
  for (const [k, v] of Object.entries(values)) {
    if (v === undefined) continue;
    el.style.setProperty(k, typeof v === 'number' ? `${v}s` : v);
  }
}

/**
 * Reveal an element immediately — used when `prefers-reduced-motion` is set or
 * as a fallback for browsers that don't support IntersectionObserver.
 */
function revealInstant(el: HTMLElement): void {
  el.classList.add('is-revealed');
  el.style.removeProperty('visibility');
  el.style.opacity = '1';
  el.style.transform = 'none';
  el.style.clipPath = 'none';
}

/* ------------------------------------------------------------------ */
/* Scroll-triggered presets (single IntersectionObserver)             */
/* ------------------------------------------------------------------ */

interface PresetHandler {
  /** Called once, right before the element is observed. */
  prepare?(el: HTMLElement): void;
  /** Called when the element enters the viewport. */
  enter(el: HTMLElement): void;
}

const scrollPresets: Record<ScrollPreset, PresetHandler> = {
  'fade-up': {
    prepare(el) {
      el.style.visibility = '';
    },
    enter(el) {
      el.classList.add('is-revealed');
    },
  },

  'clip-reveal': {
    prepare(el) {
      el.style.visibility = '';
    },
    enter(el) {
      el.classList.add('is-revealed');
    },
  },

  stagger: {
    prepare(el) {
      // Assign --index to each direct child for the CSS transition-delay math.
      const children = Array.from(el.children) as HTMLElement[];
      children.forEach((child, i) => {
        child.style.setProperty('--anim-index', String(i));
      });
    },
    enter(el) {
      el.classList.add('is-revealed');
    },
  },

  'bounce-in': {
    prepare(el) {
      el.style.visibility = '';
    },
    enter(el) {
      el.classList.add('is-revealed');
    },
  },

  'draw-svg': {
    prepare(el) {
      // Set stroke-dasharray = pathLength for each path and seed dashoffset.
      const paths = el.querySelectorAll('path, line, polyline, circle, rect, ellipse');
      paths.forEach((p) => {
        const geom = p as SVGGeometryElement;
        if (typeof geom.getTotalLength !== 'function') return;
        const len = geom.getTotalLength();
        if (!Number.isFinite(len) || len === 0) return;
        geom.style.setProperty('--anim-draw-length', String(len));
        geom.style.strokeDasharray = String(len);
        geom.style.strokeDashoffset = String(len);
      });
    },
    enter(el) {
      el.classList.add('is-revealed');
    },
  },
};

function initScrollPresets(options: Required<Pick<InitAnimationsOptions, 'rootMargin' | 'threshold'>>): void {
  const reduced = prefersReducedMotion();
  const elements = document.querySelectorAll<HTMLElement>('[data-anim]');

  if (reduced || typeof IntersectionObserver === 'undefined') {
    elements.forEach((el) => {
      const name = el.dataset.anim as ScrollPreset | undefined;
      if (name && scrollPresets[name]?.prepare) {
        scrollPresets[name].prepare!(el);
      }
      revealInstant(el);
    });
    return;
  }

  // Prepare all elements before observing — seeds indices, SVG lengths, etc.
  elements.forEach((el) => {
    const name = el.dataset.anim as ScrollPreset | undefined;
    if (!name || !scrollPresets[name]) return;

    const duration = parseNumberAttr(el, 'animDuration', NaN);
    const delay = parseNumberAttr(el, 'animDelay', NaN);
    setCustomProps(el, {
      '--anim-duration': Number.isFinite(duration) ? duration : undefined,
      '--anim-delay': Number.isFinite(delay) ? delay : undefined,
    });

    scrollPresets[name].prepare?.(el);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const name = el.dataset.anim as ScrollPreset | undefined;
        if (name && scrollPresets[name]) {
          scrollPresets[name].enter(el);
        }
        observer.unobserve(el);
      }
    },
    {
      root: null,
      rootMargin: options.rootMargin,
      threshold: options.threshold,
    },
  );

  elements.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------ */
/* Counter                                                            */
/* ------------------------------------------------------------------ */

/**
 * Number ticker. Marks elements with `data-anim-counter="<target>"`.
 * Optional:
 *   - `data-anim-duration="1.8"` (seconds, default 2)
 *   - `data-anim-counter-locale="it-IT"` (for number formatting)
 *   - `data-anim-counter-decimals="0"` (number of decimals)
 *   - `data-anim-counter-suffix="+"` (appended after the formatted number)
 *   - `data-anim-counter-prefix="€"` (prepended before the formatted number)
 */
export function initCounters(): void {
  const reduced = prefersReducedMotion();
  const elements = document.querySelectorAll<HTMLElement>('[data-anim-counter]');
  if (elements.length === 0) return;

  const format = (el: HTMLElement, value: number): string => {
    const decimals = parseNumberAttr(el, 'animCounterDecimals', 0);
    const locale = el.dataset.animCounterLocale || undefined;
    const prefix = el.dataset.animCounterPrefix || '';
    const suffix = el.dataset.animCounterSuffix || '';
    const shown = value.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${prefix}${shown}${suffix}`;
  };

  if (reduced || typeof IntersectionObserver === 'undefined') {
    elements.forEach((el) => {
      const target = parseNumberAttr(el, 'animCounter', 0);
      el.textContent = format(el, target);
    });
    return;
  }

  const animate = (el: HTMLElement): void => {
    const target = parseNumberAttr(el, 'animCounter', 0);
    const duration = parseNumberAttr(el, 'animDuration', 2) * 1000;
    const start = performance.now();

    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = format(el, value);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = format(el, target);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animate(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.4 },
  );

  elements.forEach((el) => {
    el.textContent = format(el, 0);
    observer.observe(el);
  });
}

/* ------------------------------------------------------------------ */
/* Parallax (rAF-batched, single scroll listener)                     */
/* ------------------------------------------------------------------ */

/**
 * Translate elements vertically proportional to scroll. Speed factor via
 * `data-anim-parallax="0.3"` (positive = slower than scroll, negative =
 * opposite direction).
 */
export function initParallax(): void {
  if (prefersReducedMotion()) return;
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>('[data-anim-parallax]'),
  );
  if (elements.length === 0) return;

  // Cache speeds + mid-points per element. Recomputed on resize.
  interface Layer {
    el: HTMLElement;
    speed: number;
    mid: number;
  }

  let layers: Layer[] = [];
  let ticking = false;

  const measure = (): void => {
    layers = elements.map((el) => {
      const rect = el.getBoundingClientRect();
      const mid = rect.top + window.scrollY + rect.height / 2;
      const speed = parseNumberAttr(el, 'animParallax', 0.3);
      return { el, speed, mid };
    });
  };

  const update = (): void => {
    const viewportMid = window.scrollY + window.innerHeight / 2;
    for (const layer of layers) {
      const delta = viewportMid - layer.mid;
      const y = delta * layer.speed;
      layer.el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }
    ticking = false;
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    measure();
    update();
  });
}

/* ------------------------------------------------------------------ */
/* Cursor-reactive tilt                                               */
/* ------------------------------------------------------------------ */

/**
 * Subtle transform based on cursor position within an element's bounding box.
 * Opts:
 *   - `data-anim-cursor="tilt"` (default) — rotateX/rotateY with perspective
 *   - `data-anim-cursor="shift"` — translateX/translateY only
 *   - `data-anim-cursor-strength="1"` — multiplier (default 1)
 *
 * One mousemove listener per element, rAF-batched per element.
 */
export function initCursorReactive(): void {
  if (prefersReducedMotion()) return;
  const elements = document.querySelectorAll<HTMLElement>('[data-anim-cursor]');
  if (elements.length === 0) return;

  // Skip on touch-only devices (no hover).
  if (window.matchMedia('(hover: none)').matches) return;

  elements.forEach((el) => {
    const mode = (el.dataset.animCursor || 'tilt') as 'tilt' | 'shift';
    const strength = parseNumberAttr(el, 'animCursorStrength', 1);
    let frame = 0;
    let pendingX = 0;
    let pendingY = 0;

    const apply = (): void => {
      frame = 0;
      if (mode === 'shift') {
        const tx = pendingX * 20 * strength;
        const ty = pendingY * 20 * strength;
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      } else {
        const rx = -pendingY * 8 * strength;
        const ry = pendingX * 8 * strength;
        el.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }
    };

    el.addEventListener('mousemove', (event) => {
      const rect = el.getBoundingClientRect();
      // Normalize to -0.5..0.5
      pendingX = (event.clientX - rect.left) / rect.width - 0.5;
      pendingY = (event.clientY - rect.top) / rect.height - 0.5;
      if (frame !== 0) return;
      frame = requestAnimationFrame(apply);
    });

    el.addEventListener('mouseleave', () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      frame = 0;
      el.style.transform = '';
    });
  });
}

/* ------------------------------------------------------------------ */
/* Rotating text                                                      */
/* ------------------------------------------------------------------ */

/**
 * Cycles through a list of words in a single inline slot.
 *
 * Markup:
 *   <span data-anim-rotating-text="Parola1|Parola2|Parola3"
 *         data-anim-rotating-interval="2.4">Parola1</span>
 *
 * The separator is `|`. Initial word should match the first entry to avoid a
 * visible flash. Interval defaults to 2.4s.
 */
export function initRotatingText(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-anim-rotating-text]');
  if (elements.length === 0) return;
  const reduced = prefersReducedMotion();

  elements.forEach((el) => {
    const raw = el.dataset.animRotatingText || '';
    const words = raw.split('|').map((w) => w.trim()).filter(Boolean);
    if (words.length <= 1) return;

    const interval = parseNumberAttr(el, 'animRotatingInterval', 2.4) * 1000;
    let index = 0;

    // If reduced-motion, just show the first word statically.
    if (reduced) {
      el.textContent = words[0] ?? '';
      return;
    }

    // Ensure CSS hook is present so animations.css transitions apply.
    el.classList.add('anim--rotating-text');
    el.textContent = words[0] ?? '';

    window.setInterval(() => {
      index = (index + 1) % words.length;
      el.classList.add('is-rotating-out');
      window.setTimeout(() => {
        el.textContent = words[index] ?? '';
        el.classList.remove('is-rotating-out');
      }, 240);
    }, interval);
  });
}

/* ------------------------------------------------------------------ */
/* Public entry point                                                 */
/* ------------------------------------------------------------------ */

let initialized = false;

/**
 * Initialize the animation system. Idempotent by default — call it once from
 * the starter's entry script. Pass `{ reinit: true }` after client-side
 * navigation (Astro view transitions) to re-bind new DOM nodes.
 */
export function initAnimations(options: InitAnimationsOptions = {}): void {
  if (typeof window === 'undefined') return;
  if (initialized && !options.reinit) return;
  initialized = true;

  const rootMargin = options.rootMargin ?? '0px 0px -10% 0px';
  const threshold = options.threshold ?? 0.05;

  const run = (): void => {
    // Legacy data-animate support — reference components use the old attribute name.
    document.querySelectorAll<HTMLElement>('[data-animate]').forEach((el) => {
      if (!el.hasAttribute('data-anim')) {
        el.setAttribute('data-anim', 'fade-up');
      }
    });

    initScrollPresets({ rootMargin, threshold });
    initCounters();
    initParallax();
    initCursorReactive();
    initRotatingText();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}
