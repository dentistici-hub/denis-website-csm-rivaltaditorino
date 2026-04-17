import type {
  SiteConfig,
  NavLink,
  Service,
  CaseStudy,
  FAQ,
  SchemaConfig,
} from '@components/types/content';

/**
 * CSM SNC di Bertacco F. & C. — real client data.
 *
 * Every field below traces to analysis.json (scraped) or brief.json (enriched).
 * No inventions. Low-confidence fields are flagged with HTML comments in
 * index.astro where they appear.
 */

export const site: SiteConfig = {
  name: 'C.S.M. SNC di Bertacco F. & C.',
  tagline: 'Professionisti nella lavorazione dei metalli',
  description:
    "C.S.M. SNC di Bertacco F. & C. è una carpenteria metallica attiva da oltre 50 anni a Rivalta di Torino, specializzata nella lavorazione del ferro e dell'acciaio inox. Produciamo cancelli, ringhiere, strutture metalliche, pensiline, inferriate di sicurezza e infissi di tipo carcerario per privati, aziende ed enti pubblici.",
  url: 'https://denistcaci.github.io/denis-website-csm-rivaltaditorino/',
  language: 'it',
  lastUpdated: '2026-04-17',
  contact: {
    email: 'csm.bertacco@libero.it',
    phone: '+39 011 9002640',
    address: 'Via Orbassano 48',
    city: 'Rivalta di Torino',
    country: 'IT',
  },
  social: {},
};

export const nav: NavLink[] = [
  { label: 'Officina', href: '#about' },
  { label: 'Servizi', href: '#services' },
  { label: 'Lavori', href: '#portfolio' },
  { label: 'Contatti', href: '#contact' },
];

/**
 * Services grouped per motion-plan.md into 3 chapters:
 *   01 Fabbricazione — forge-side work (what leaves the bench)
 *   02 Installazione — work delivered on site and on projects
 *   03 Manutenzione — repair + weld-only work
 *
 * Descriptions copied verbatim from analysis.json real_content.services.
 */

export const servicesFabbricazione: Service[] = [
  {
    title: 'Cancelli e ringhiere',
    description:
      "Produzione su misura di cancelli, recinzioni, parapetti per balconi, scale e inferriate di sicurezza civili. Dal ferro battuto classico al disegno contemporaneo, con accessori in ferro e finiture in acciaio inox lavorate in officina.",
  },
  {
    title: 'Carpenteria leggera e medio-pesante',
    description:
      "Fabbricazione su misura di carpenteria leggera e medio-pesante in ferro e acciaio inox, dalle strutture per ampliamenti residenziali agli impianti per lo sfruttamento industriale.",
  },
  {
    title: 'Lavorazione ferro e acciaio inox',
    description:
      "Lavorazione di accessori in ferro, profilati metallici e finiture in acciaio inox con attrezzature moderne per la profilatura e la piegatura. Ogni pezzo viene dimensionato sul lavoro e finito a mano.",
  },
  {
    title: 'Strutture metalliche su misura',
    description:
      "Strutture metalliche civili e industriali: soppalchi, scale di servizio, strutture di supporto impianti. Ogni commessa parte dal rilievo in cantiere e dal disegno tecnico.",
  },
];

export const servicesInstallazione: Service[] = [
  {
    title: 'Infissi di tipo carcerario',
    description:
      "Inferriate antitaglio certificate, finestre per celle, porte monoblocco, spioncini, porte per bagni, cancelli barricata automatizzati o manuali, box agenti, divisori colloqui, posti di guardia, vetrate protettive, muri di cinta e recinzioni esterne per istituti penitenziari.",
  },
  {
    title: 'Coperture, tettoie e pensiline',
    description:
      "Coperture metalliche, tettoie e pensiline su misura per uso residenziale, commerciale e industriale. Strutture in acciaio resistenti alle sollecitazioni meccaniche e agli agenti atmosferici.",
  },
  {
    title: 'Montaggio componenti meccanici',
    description:
      "Progettazione, realizzazione e montaggio di componenti meccanici e impianti. Lavoriamo in coordinamento con committente e direzione lavori, dal pre-assemblaggio in officina fino alla posa.",
  },
];

export const servicesManutenzione: Service[] = [
  {
    title: 'Saldatura metalli e fabbro',
    description:
      "Saldatura e fabbricazione su misura, dai più comuni lavori di fabbro ai montaggi meccanici di impianti. Interventi di manutenzione, riparazione e adeguamento su strutture esistenti.",
  },
];

export const allServices: Service[] = [
  ...servicesFabbricazione,
  ...servicesInstallazione,
  ...servicesManutenzione,
];

export const caseStudies: CaseStudy[] = [
  {
    title: 'Ascensori vetro-acciaio, Metropolitana di Torino',
    client: 'GTT',
    description: "Struttura portante in acciaio inox e vetro per stazioni della metropolitana di Torino, con profili a vista e finiture in acciaio spazzolato.",
    image: '/images/portfolio-metro-torino.jpg',
    tags: ['Infrastruttura', 'Acciaio inox', 'Trasporti'],
  },
  {
    title: 'Pensilina autostradale a traliccio',
    client: 'Rete autostradale',
    description: "Montaggio di pensilina autostradale in acciaio con autocarro gru, lavorazioni in quota e assemblaggio in opera.",
    image: '/images/portfolio-pensilina-autostradale.jpg',
    tags: ['Infrastruttura', 'Acciaio', 'Opere in quota'],
  },
  {
    title: 'Casello Telepass',
    client: 'Gestore autostradale',
    description: "Copertura in acciaio per casello autostradale Telepass, completa di semafori, corsie dedicate e segnaletica integrata.",
    image: '/images/portfolio-casello-telepass.jpg',
    tags: ['Infrastruttura', 'Coperture'],
  },
  {
    title: 'Casello autostradale',
    client: 'Gestore autostradale',
    description: "Pensilina in acciaio per casello autostradale con barriere new jersey e segnaletica, progettata per sollecitazioni meccaniche e agenti atmosferici.",
    image: '/images/portfolio-casello-autostradale.jpg',
    tags: ['Infrastruttura', 'Coperture'],
  },
  {
    title: 'Porte monoblocco e cancelli barricata',
    client: 'Istituto penitenziario',
    description: "Porte monoblocco e cancelli barricata per carcere con inferriate antitaglio in acciaio certificato.",
    image: '/images/portfolio-porte-carcere.jpg',
    tags: ['Infissi carcerari', 'Sicurezza'],
  },
  {
    title: 'Corridoio e inferriate antitaglio',
    client: 'Istituto penitenziario',
    description: "Corridoio di istituto penitenziario con porte blindate e inferriate antitaglio certificate installate da C.S.M.",
    image: '/images/portfolio-corridoio-carcere.jpg',
    tags: ['Infissi carcerari', 'Sicurezza'],
  },
  {
    title: 'Box agenti e posto di guardia',
    client: 'Istituto penitenziario',
    description: "Box agenti di polizia penitenziaria con vetrate protettive e porte blindate, dotato di divisori per colloqui.",
    image: '/images/portfolio-box-agenti.jpg',
    tags: ['Infissi carcerari', 'Vetrate protettive'],
  },
  {
    title: 'Camminamento industriale sopraelevato',
    client: 'Impianto industriale',
    description: "Camminamento industriale sopraelevato in acciaio e vetro con parapetti, vista sulle Alpi torinesi.",
    image: '/images/portfolio-camminamento-industriale.jpg',
    tags: ['Industriale', 'Acciaio'],
  },
  {
    title: 'Struttura metallica industriale',
    client: 'Capannone industriale',
    description: "Struttura metallica industriale in fase di assemblaggio su plinti di cemento armato: saldatura in officina, posa in opera a cura dello stesso team.",
    image: '/images/portfolio-struttura-industriale.jpg',
    tags: ['Industriale', 'Carpenteria'],
  },
  {
    title: 'Supporti di galleria metropolitana',
    client: 'GTT',
    description: "Staffe e supporti metallici per galleria metropolitana, fornitura e installazione su pareti in cemento armato.",
    image: '/images/portfolio-metro-tunnel.jpg',
    tags: ['Infrastruttura', 'Supporti'],
  },
  {
    title: 'Facciata commerciale in acciaio',
    client: 'Edificio commerciale',
    description: "Facciata di edificio commerciale con elemento verticale in acciaio rosso e pannellature metalliche, coperture su misura.",
    image: '/images/portfolio-facciata-commerciale.jpg',
    tags: ['Commerciale', 'Facciate'],
  },
];

export const faqs: FAQ[] = [
  {
    question: 'Quale carpenteria metallica a Rivalta di Torino produce cancelli e ringhiere su misura?',
    answer:
      "C.S.M. SNC di Bertacco F. & C., in Via Orbassano 48 a Rivalta di Torino, è una carpenteria metallica attiva da oltre 50 anni e specializzata nella lavorazione del ferro e dell'acciaio inox. L'officina realizza cancelli, ringhiere, parapetti per balconi, scale, pensiline e strutture metalliche interamente su misura, lavorando sia per privati che per aziende ed enti pubblici della provincia di Torino. Per un preventivo è possibile chiamare il +39 011 9002640.",
  },
  {
    question: 'Chi produce infissi e inferriate di tipo carcerario in Piemonte?',
    answer:
      "C.S.M. SNC di Bertacco a Rivalta di Torino è specializzata nella produzione di infissi di tipo carcerario: inferriate antitaglio certificate, finestre per celle, porte monoblocco, spioncini, cancelli barricata manuali o automatizzati, box agenti, divisori per colloqui, posti di guardia, vetrate protettive, muri di cinta e recinzioni esterne. L'esperienza sessantennale nel settore della carpenteria metallica e il rispetto degli standard di sicurezza più severi rendono l'officina un fornitore di riferimento per enti pubblici e strutture penitenziarie.",
  },
  {
    question: 'Dove trovo una carpenteria metallica storica vicino a Torino per lavori di saldatura e fabbro?',
    answer:
      "C.S.M. SNC di Bertacco opera dal cuore della prima cintura torinese, a Rivalta di Torino, da oltre cinquant'anni. L'officina esegue saldatura, fabbricazione su misura, carpenteria leggera e medio-pesante in ferro e acciaio inox, oltre al montaggio di componenti meccanici e impianti. Serve privati, aziende e enti pubblici nel Torinese con attrezzature moderne per profilatura e lavorazione dell'acciaio. La sede è in Via Orbassano 48, 10040 Rivalta di Torino (TO).",
  },
  {
    question: 'Chi realizza pensiline, coperture metalliche e strutture in acciaio nel Torinese?',
    answer:
      "C.S.M. SNC di Bertacco a Rivalta di Torino realizza pensiline, tettoie e coperture metalliche su misura per uso residenziale, commerciale e industriale, oltre a strutture in acciaio per cantieri. Ogni lavoro è progettato per sopportare sollecitazioni meccaniche e l'esposizione agli agenti atmosferici grazie a trattamenti e procedure specifiche. L'officina dispone di attrezzature moderne per la profilatura dei metalli e la lavorazione dell'acciaio inox. Contatto diretto: +39 011 9002640 o csm.bertacco@libero.it.",
  },
];

export const schema: SchemaConfig = {
  type: 'LocalBusiness',
  faqs,
  services: allServices,
};
