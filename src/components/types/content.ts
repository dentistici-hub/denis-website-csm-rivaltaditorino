export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  language: string;
  lastUpdated: string;
  contact: {
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    lat?: number;
    lng?: number;
  };
  social: Record<string, string>;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  title: string;
  description: string;
  icon?: string;
}

export interface CaseStudy {
  title: string;
  client: string;
  description: string;
  image: string;
  tags: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PhilosophyPillar {
  number: string;
  title: string;
  description: string;
}

export interface LogoItem {
  name: string;
  image: string;
}

export interface SchemaConfig {
  type: 'Organization' | 'LocalBusiness' | 'Restaurant' | 'ProfessionalService';
  additionalTypes?: string[];
  faqs?: FAQ[];
  services?: Service[];
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
  };
}
