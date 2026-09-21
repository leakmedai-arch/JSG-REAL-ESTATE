export interface Property {
  id: number;
  type: string;
  tag: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  mode: 'buy' | 'rent' | 'new';
  image: string;
  images?: string[]; // Multiple photos from different angles (exterior, interior, sea view, terrace, master suite, etc.)
  description?: string;
  videoUrl?: string; // Live stream or walkthrough video URL
  features?: string[];
}

export interface Area {
  name: string;
  subtitle: string;
  image: string;
}

export interface Building {
  name: string;
  subtitle: string;
  image: string;
}

export interface JSGSiteData {
  site: {
    name: string;
    tagline: string;
    logo: string;
    topLocation: string;
    phone: string;
    email: string;
    language: string;
    canonical: string;
  };
  header: {
    nav: string[];
    call: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primary: string;
    secondary: string;
    slides: string[];
  };
  stats: {
    number: number;
    label: string;
  }[];
  areas: Area[];
  buildings: Building[];
  why: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
    cards: {
      title: string;
      text: string;
    }[];
  };
  services: {
    title: string;
    description: string;
  }[];
  sell: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    company: string;
    companyDescription: string;
    phone: string;
    email: string;
    location: string;
    button: string;
  };
  footer: {
    description: string;
    copyright: string;
    location: string;
  };
  properties: Property[];
}
