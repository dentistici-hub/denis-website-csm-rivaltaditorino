// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const localModules = resolve(__dirname, 'node_modules');

// Resolve motion libs imported by the local components from THIS client's
// node_modules. Node's resolver won't walk sideways.
const motionLibs = [
  'gsap',
  'gsap/ScrollTrigger',
  'gsap/SplitText',
  'gsap/Flip',
  'gsap/DrawSVGPlugin',
  'lenis',
  'lottie-web',
];
const motionAliases = motionLibs.map((name) => ({
  find: name,
  replacement: name.startsWith('gsap/')
    ? resolve(localModules, name + '.js')
    : resolve(localModules, name),
}));

export default defineConfig({
  site: 'https://dentistici-hub.github.io',
  base: '/denis-website-csm-rivaltaditorino',
  integrations: [sitemap()],
  i18n: { defaultLocale: 'it', locales: ['it'] },
  vite: { resolve: { alias: motionAliases } },
});
