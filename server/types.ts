export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  reraLicense: string;
  contact: {
    company: string;
    location: string;
    phone: string;
    email: string;
    whatsapp: string;
  };
  socialLinks: {
    instagram: string;
    linkedin: string;
    facebook: string;
    youtube: string;
    x: string;
  };
  footer: {
    description: string;
    copyright: string;
    disclaimer: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string;
    ogImage: string;
  };
  customCss: string;
  customHeadCode: string;
  version: number;
  updatedAt: string;
}

export interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  location: string;
  priceAed: number;
  beds?: number;
  baths?: number;
  areaSqft?: number;
  image: string;
  link: string;
  active: boolean;
  order: number;
}

export interface InfiniteCard {
  id: string;
  title: string;
  image: string;
  defaultImage: string;
  price: string;
  area: string;
}

export interface ShowcaseSlide {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
  tag?: string;
  isCustom?: boolean;
}

export interface FounderSectionData {
  name: string;
  title: string;
  subtitle: string;
  experienceYears: number;
  dealsVolume: string;
  typewriterPhrases: string[];
  executiveStatement: string;
  detailedBio: string;
  portraitImage: string;
  credentials: string[];
}

export interface SectionsConfig {
  founder: FounderSectionData;
  heroSlides: HeroSlide[];
  heroSliderPhotos?: Record<string | number, string>;
  constructionVideoUrl?: string;
  showcaseSlides?: ShowcaseSlide[];
  infiniteCardsRow1?: InfiniteCard[];
  infiniteCardsRow2?: InfiniteCard[];
  hero3dSettings?: {
    enabled: boolean;
    autoRotate: boolean;
    rotationSpeed: number;
    fov: number;
  };
  quickCardsVisible: boolean;
  liveBannerVisible: boolean;
  featuredPropertiesVisible: boolean;
  developersStripVisible: boolean;
  communitiesStripVisible: boolean;
  version: number;
  updatedAt: string;
}

export interface PageBlock {
  id: string;
  type: 'hero' | 'text' | 'features' | 'cta' | 'gallery' | 'html';
  title?: string;
  content?: string;
  images?: string[];
  buttonText?: string;
  buttonLink?: string;
}

export interface PageDoc {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  navPlacement: 'header' | 'footer' | 'none';
  isPublished: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  blocks: PageBlock[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface ManagedProperty {
  id: number | string;
  type: 'apartment' | 'villa' | 'penthouse' | 'townhouse' | 'commercial' | 'land' | 'studio';
  category: string;
  tag: string;
  title: string;
  location: string;
  community: string;
  building?: string;
  developer?: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  plotSize?: number;
  parking?: number;
  mode: 'buy' | 'rent';
  status: 'active' | 'sold' | 'rented' | 'off-plan' | 'draft';
  image: string;
  galleryImages: string[];
  description: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  features: string[];
  furnished: boolean;
  completionYear?: number;
  referenceNumber?: string;
  assignedAgent?: string;
  isFeatured: boolean;
  isDldVerified: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Viewing' | 'Negotiation' | 'Converted' | 'Lost';
export type LeadPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface LeadDoc {
  id: string;
  name: string;
  phone: string;
  email: string;
  interestedProperty?: string;
  propertyId?: string | number;
  requirement?: string;
  budget?: string;
  source: 'Contact Form' | 'Property Enquiry' | 'Valuation' | 'WhatsApp' | 'AI Assistant' | 'Viewing Request' | 'Mortgage Calculator';
  status: LeadStatus;
  priority: LeadPriority;
  assignedAgent?: string;
  notes: Array<{ text: string; author: string; timestamp: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentDoc {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  purpose: 'Property Viewing' | 'VIP Consultation' | 'Mortgage Advisory' | 'Listing Consultation' | 'Call Back';
  preferredDate: string;
  preferredTime: string;
  propertyTitle?: string;
  propertyId?: string | number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  assignedAgent?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'super_admin' | 'property_manager' | 'lead_agent' | 'content_editor';
  name: string;
  is2faEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: string;
  lastLogin?: string;
  failedLoginAttempts: number;
  lockedUntil?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  category: 'Logos' | 'Banners' | 'Properties' | 'Founder' | 'Documents' | 'Other';
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  ip: string;
  timestamp: string;
}

export interface RevisionSnapshot {
  id: string;
  timestamp: string;
  label: string;
  version: number;
  author: string;
  snapshot: {
    settings: SiteSettings;
    sections: SectionsConfig;
    propertiesCount: number;
    pagesCount: number;
  };
}

export interface AISettings {
  enabled: boolean;
  assistantName: string;
  welcomeMessage: string;
  systemPrompt: string;
  tone: 'Luxury & Professional' | 'Friendly & Warm' | 'Concise & Direct';
  suggestedQuestions: string[];
  enableVoice: boolean;
  voicePitch: number;
  voiceRate: number;
  leadCaptureEnabled: boolean;
  version: number;
  updatedAt: string;
}
