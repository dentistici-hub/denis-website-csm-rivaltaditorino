import type { APIRoute } from 'astro';
import { site, allServices, caseStudies } from '../data/content';

export const GET: APIRoute = () => {
  const serviceList = allServices
    .map((s) => `- ${s.title}: ${s.description}`)
    .join('\n');

  const projectList = caseStudies
    .map((p) => `- ${p.title} (${p.client}): ${p.description} [${p.tags.join(', ')}]`)
    .join('\n');

  const content = `# ${site.name}

> ${site.tagline}

${site.description}

## Servizi

${serviceList}

## Lavori selezionati

${projectList}

## Contatti

- Telefono: ${site.contact.phone || 'N/A'}
- Email: ${site.contact.email}
- Indirizzo: ${site.contact.address || ''}, ${site.contact.city || ''}, ${site.contact.country || ''}
- Sito: ${site.url}

## Pagine

- [Home](${site.url}): Panoramica azienda, servizi, lavori, contatti
- [Privacy](${site.url}privacy): Informativa sulla privacy
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
