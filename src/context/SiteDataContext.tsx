import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { Property } from '../types/jsg';
import { ALL_PROPERTIES } from '../data/realEstateData';
import defaultJsgData from '../jsgData.json';

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
  customCss?: string;
  customHeadCode?: string;
  version: number;
  updatedAt?: string;
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

export interface FounderData {
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
  founder: FounderData;
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
  updatedAt?: string;
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

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  navPlacement: 'header' | 'footer' | 'none';
  isPublished: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
  blocks: PageBlock[];
}

export interface AISettingsState {
  enabled: boolean;
  assistantName: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
  enableVoice: boolean;
}

export type SyncState = 'synced' | 'saving' | 'saved' | 'offline' | 'sync-required' | 'conflict';

interface SiteDataContextType {
  settings: SiteSettings;
  sections: SectionsConfig;
  properties: Property[];
  pages: CustomPage[];
  aiSettings: AISettingsState;
  syncState: SyncState;
  contentVersion: number;
  lastUpdatedAt: string;
  refreshData: () => Promise<void>;
  submitLead: (lead: any) => Promise<boolean>;
  submitAppointment: (appointment: any) => Promise<boolean>;
  updateLogo: (logoDataUrl: string, filename?: string) => Promise<boolean>;
  resetLogo: () => Promise<boolean>;
  communityImages: Record<string, string>;
  updateCommunityImage: (name: string, imageUrl: string) => Promise<boolean>;
  resetCommunityImage: (name: string) => Promise<boolean>;
  getCommunityImage: (name: string, defaultUrl: string) => string;
  updatePropertyImage: (id: number | string, imageUrl: string) => Promise<boolean>;
  resetPropertyImage: (id: number | string) => Promise<boolean>;
  updatePropertyImages: (id: number | string, images: string[], primaryImage?: string) => Promise<boolean>;
  deletePropertyImage: (id: number | string, imageToDelete: string) => Promise<boolean>;
  getPropertyImages: (property: Property) => string[];
  updateFounderCardPhoto: (cardId: string, newUrl: string) => Promise<boolean>;
  resetFounderCardPhoto: (cardId: string) => Promise<boolean>;
  updateShowcaseSlides: (slides: ShowcaseSlide[]) => Promise<boolean>;
  updateHeroSliderPhoto: (slideId: number | string, newUrl: string) => Promise<boolean>;
  resetHeroSliderPhoto: (slideId: number | string) => Promise<boolean>;
  updateConstructionVideoUrl: (url: string) => Promise<boolean>;
  resetConstructionVideoUrl: () => Promise<boolean>;
  updateSectionsData: (newSections: Partial<SectionsConfig>) => Promise<boolean>;
  updateSettingsData: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  isAdmin: boolean;
  adminUser: any | null;
  loginAsAdmin: (token: string, user?: any) => void;
  logoutAdmin: () => void;
}

const defaultSettings: SiteSettings = {
  siteName: (defaultJsgData as any).brand?.name || 'JSG Real Estate',
  tagline: (defaultJsgData as any).brand?.tagline || 'Dubai Luxury Properties & Trophy Residences',
  logoUrl: '/assets/jsg-logo.png',
  faviconUrl: '/logo.png',
  reraLicense: '19284',
  contact: {
    company: (defaultJsgData as any).contact?.company || 'JSG Real Estate LLC',
    location: (defaultJsgData as any).contact?.location || 'Suite 2401, Boulevard Plaza Tower 1, Downtown Dubai, UAE',
    phone: (defaultJsgData as any).contact?.phone || '+971 4 320 2030',
    email: (defaultJsgData as any).contact?.email || 'info@jsgrealestate.ae',
    whatsapp: (defaultJsgData as any).contact?.whatsapp || '+971 50 123 4567'
  },
  socialLinks: {
    instagram: 'https://instagram.com/jsgrealestate',
    linkedin: 'https://linkedin.com/company/jsgrealestate',
    facebook: 'https://facebook.com/jsgrealestate',
    youtube: 'https://youtube.com/@jsgrealestate',
    x: 'https://x.com/jsgrealestate'
  },
  footer: {
    description: (defaultJsgData as any).footer?.description || 'JSG Real Estate is an elite boutique brokerage in Dubai specializing in prime off-plan portfolios, private waterfront villas, and bespoke property acquisitions.',
    copyright: '© 2026 JSG Real Estate LLC. All Rights Reserved.',
    disclaimer: 'All listings subject to RERA regulation and DLD registered escrow procedures. Prices are quoted in AED.'
  },
  seo: {
    defaultTitle: 'JSG Real Estate Dubai | Luxury Properties, Villas & Off-Plan',
    defaultDescription: 'Discover exclusive luxury properties for sale and rent in Dubai with JSG Real Estate.',
    keywords: 'Dubai luxury real estate, Palm Jumeirah villas, Downtown Dubai penthouses',
    ogImage: '/assets/jsg-logo.png'
  },
  version: 1
};

const defaultSections: SectionsConfig = {
  founder: {
    name: (defaultJsgData as any).founder?.name || 'JASMEET SINGH GULATI',
    title: (defaultJsgData as any).founder?.title || 'Founder & Chief Executive Officer',
    subtitle: (defaultJsgData as any).founder?.subtitle || '15+ Years Driving Institutional & Ultra-Luxury UAE Real Estate Acquisitions',
    experienceYears: (defaultJsgData as any).founder?.experienceYears || 15,
    dealsVolume: (defaultJsgData as any).founder?.dealsVolume || 'AED 4.8B+',
    typewriterPhrases: (defaultJsgData as any).founder?.typewriterPhrases || [
      'Institutional Asset Advisory & Private Off-Market Acquisitions',
      'Dubai Trophy Penthouses & Waterfront Signature Mansions',
      'High-Yield Portfolios Delivering Consistent 8–11% ROI'
    ],
    executiveStatement: (defaultJsgData as any).founder?.executiveStatement || 'At JSG Real Estate, our philosophy transcends conventional transactions. We curate generational assets for visionary individuals.',
    detailedBio: (defaultJsgData as any).founder?.detailedBio || 'Jasmeet Singh Gulati founded JSG Real Estate with an uncompromising focus on discretion, analytical precision, and fiduciary integrity.',
    portraitImage: (defaultJsgData as any).founder?.portraitImage || '/assets/founder.jpg',
    credentials: ['RERA Certified Real Estate Broker', 'DLD Gold Tier Agency Principal', '15+ Years UAE Market Leadership']
  },
  heroSlides: [
    {
      id: 'slide-1',
      tag: 'Trophy Residence',
      title: 'Palm Jumeirah Waterfrond Villa',
      subtitle: 'Direct beach access, infinity pool overlooking Dubai Marina skyline, and bespoke Italian furnishings.',
      location: 'Frond G, Palm Jumeirah',
      priceAed: 28500000,
      beds: 6,
      baths: 7,
      areaSqft: 8400,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=90',
      link: '/buy',
      active: true,
      order: 1
    },
    {
      id: 'slide-2',
      tag: 'Downtown Skyline',
      title: 'The Royal Marina Residence',
      subtitle: 'Floor-to-ceiling glass panorama, private yacht dock access, and marble craftsmanship throughout.',
      location: 'Dubai Marina',
      priceAed: 3850000,
      beds: 3,
      baths: 4,
      areaSqft: 2150,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=90',
      link: '/buy',
      active: true,
      order: 2
    }
  ],
  quickCardsVisible: true,
  liveBannerVisible: true,
  featuredPropertiesVisible: true,
  developersStripVisible: true,
  communitiesStripVisible: true,
  version: 1
};

const defaultAISettings: AISettingsState = {
  enabled: true,
  assistantName: 'JSGpt',
  welcomeMessage: 'Assalamu Alaikum, hope your day is blessed and prosperous—I am JSGpt, your intelligent property companion, how may I guide your vision today?',
  suggestedQuestions: [
    'What are the best high-yield off-plan projects in Dubai?',
    'Explain the 10-Year UAE Golden Visa property requirements.',
    'Book a private viewing for Palm Jumeirah Waterfront Villa.',
    'Calculate mortgage EMI for an AED 3.85M apartment.'
  ],
  enableVoice: true
};

const CENTRAL_CACHE_KEY = 'jsg_central_published_cache_v1';

// Helper to get initial cached content safely as secondary fallback
function getInitialCache() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CENTRAL_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data) return parsed.data;
    }
  } catch (_) {}
  return null;
}

const SiteDataContext = createContext<SiteDataContextType | null>(null);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const cached = getInitialCache();

  const [settings, setSettings] = useState<SiteSettings>(cached?.settings || defaultSettings);
  const [sections, setSections] = useState<SectionsConfig>(cached?.sections || defaultSections);
  const [properties, setProperties] = useState<Property[]>(() => {
    if (cached?.properties && Array.isArray(cached.properties) && cached.properties.length > 0) {
      return cached.properties;
    }
    return (ALL_PROPERTIES as Property[]).map(p => ({
      ...p,
      images: p.images || [p.image]
    }));
  });
  const [pages, setPages] = useState<CustomPage[]>(cached?.pages || []);
  const [communityImages, setCommunityImages] = useState<Record<string, string>>(cached?.communityImages || {});
  const [aiSettings, setAiSettings] = useState<AISettingsState>(cached?.aiSettings || defaultAISettings);
  const [contentVersion, setContentVersion] = useState<number>(cached?.version || 1);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>(cached?.updatedAt || new Date().toISOString());
  const [syncState, setSyncState] = useState<SyncState>('synced');

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('jsg_admin_token');
    }
    return false;
  });

  const [adminUser, setAdminUser] = useState<any | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const u = localStorage.getItem('jsg_admin_user');
        return u ? JSON.parse(u) : null;
      } catch (_) {}
    }
    return null;
  });

  const isFetchingRef = useRef(false);

  // Authoritative data refresh from central server
  const refreshData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await fetch(`/api/content?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
        if (data.sections) setSections(data.sections);
        if (data.properties && Array.isArray(data.properties)) {
          setProperties(data.properties.map((p: any) => ({
            ...p,
            images: p.images || p.galleryImages || [p.image]
          })));
        }
        if (data.pages && Array.isArray(data.pages)) setPages(data.pages);
        if (data.aiSettings) setAiSettings(data.aiSettings);
        if (data.communityImages) setCommunityImages(data.communityImages);
        if (data.version) setContentVersion(data.version);
        if (data.updatedAt) setLastUpdatedAt(data.updatedAt);

        // Update secondary local fallback cache
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(CENTRAL_CACHE_KEY, JSON.stringify({
              version: data.version,
              updatedAt: data.updatedAt,
              timestamp: Date.now(),
              data
            }));

            // Clean up legacy device-specific keys that cause divergence
            const legacyKeys = [
              'jsg_custom_logo',
              'jsg_custom_property_images',
              'jsg_custom_community_images',
              'jsg_custom_property_gallery',
              'jsg_infinite_scroll_cards_v2',
              'jsg_showcase_slides_v4'
            ];
            legacyKeys.forEach(k => localStorage.removeItem(k));
          } catch (_) {}
        }

        setSyncState('synced');
      }
    } catch (err) {
      console.warn('[SiteData] Server sync unreachable, operating in offline mode:', err);
      setSyncState('offline');
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Mount effect: Fetch immediately
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Real-Time Server-Sent Events (SSE) Listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/sync/events');

        eventSource.onopen = () => {
          setSyncState('synced');
        };

        eventSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            if (parsed && (parsed.type || parsed.version)) {
              // Real-time broadcast received from another device/tab -> refresh data
              refreshData();
            }
          } catch (_) {}
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Exponential backoff reconnect
          reconnectTimeout = setTimeout(connectSSE, 4000);
        };
      } catch (_) {
        reconnectTimeout = setTimeout(connectSSE, 5000);
      }
    };

    connectSSE();

    // Secondary Heartbeat & Tab Focus Auto-Sync
    // Guarantees mobile devices or returning tabs always get latest server version
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        fetch(`/api/sync/status?t=${Date.now()}`)
          .then(r => r.json())
          .then(status => {
            if (status.version && status.version > contentVersion) {
              refreshData();
            }
          })
          .catch(() => {});
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    const heartbeatInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetch(`/api/sync/status?t=${Date.now()}`)
          .then(r => r.json())
          .then(status => {
            if (status.version && status.version > contentVersion) {
              refreshData();
            }
          })
          .catch(() => {});
      }
    }, 12000);

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(heartbeatInterval);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [refreshData, contentVersion]);

  // Authentication State Listeners
  useEffect(() => {
    const handleAuthChange = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jsg_admin_token') : null;
      setIsAdmin(!!token);
      if (token) {
        try {
          const u = localStorage.getItem('jsg_admin_user');
          setAdminUser(u ? JSON.parse(u) : { name: 'Super Administrator', email: 'admin@jsgrealestate.ae', role: 'super_admin' });
        } catch (_) {}
      } else {
        setAdminUser(null);
      }
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('jsg-admin-auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('jsg-admin-auth-changed', handleAuthChange);
    };
  }, []);

  // Public Leads & Appointments Submissions
  const submitLead = async (lead: any): Promise<boolean> => {
    try {
      setSyncState('saving');
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
      if (res.ok) {
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  };

  const submitAppointment = async (apt: any): Promise<boolean> => {
    try {
      setSyncState('saving');
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apt)
      });
      if (res.ok) {
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  };

  // Authoritative Logo Management (Persisted to Central DB & Broadcast)
  const updateLogo = async (logoDataUrl: string, filename: string = 'custom-logo.png'): Promise<boolean> => {
    try {
      setSyncState('saving');
      const res = await fetch('/api/upload-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          base64Data: logoDataUrl,
          mimeType: logoDataUrl.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/png'
        })
      });

      if (res.ok) {
        const data = await res.json();
        const finalLogo = data.logoUrl || logoDataUrl;
        setSettings(prev => ({ ...prev, logoUrl: finalLogo }));
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        await refreshData();
        return true;
      } else {
        setSyncState('offline');
        return false;
      }
    } catch (err) {
      console.error('Error updating central logo:', err);
      setSyncState('offline');
      return false;
    }
  };

  const resetLogo = async (): Promise<boolean> => {
    try {
      setSyncState('saving');
      const defaultLogo = '/assets/jsg-logo.png';
      const token = typeof window !== 'undefined' ? localStorage.getItem('jsg_admin_token') : null;
      
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ logoUrl: defaultLogo })
      });

      if (res.ok) {
        setSettings(prev => ({ ...prev, logoUrl: defaultLogo }));
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        await refreshData();
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  };

  // Authoritative Community Cover Photos
  const updateCommunityImage = useCallback(async (name: string, imageUrl: string): Promise<boolean> => {
    try {
      setSyncState('saving');
      // Optimistic update
      setCommunityImages(prev => ({ ...prev, [name]: imageUrl }));

      const res = await fetch('/api/community-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, imageUrl })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.communityImages) setCommunityImages(data.communityImages);
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      } else {
        setSyncState('offline');
        return false;
      }
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  }, []);

  const resetCommunityImage = useCallback(async (name: string): Promise<boolean> => {
    try {
      setSyncState('saving');
      const res = await fetch(`/api/community-images/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        const data = await res.json();
        if (data.communityImages) setCommunityImages(data.communityImages);
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      } else {
        setSyncState('offline');
        return false;
      }
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  }, []);

  const getCommunityImage = useCallback((name: string, defaultUrl: string) => {
    return communityImages[name] || defaultUrl;
  }, [communityImages]);

  // Authoritative Multi-Angle Property Gallery Handlers
  const getPropertyImages = useCallback((property: Property): string[] => {
    if (property.images && property.images.length > 0) {
      return property.images;
    }
    return [property.image];
  }, []);

  const updatePropertyImages = useCallback(async (id: number | string, images: string[], primaryImage?: string): Promise<boolean> => {
    const primary = primaryImage || images[0];
    try {
      setSyncState('saving');
      // Optimistic update
      setProperties(prev => prev.map(p => {
        if (String(p.id) === String(id)) {
          return {
            ...p,
            image: primary || p.image,
            images: images
          };
        }
        return p;
      }));

      const res = await fetch(`/api/properties/${id}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images, primaryImage: primary })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      } else {
        setSyncState('offline');
        return false;
      }
    } catch (err) {
      console.error('Error updating property gallery:', err);
      setSyncState('offline');
      return false;
    }
  }, []);

  const updatePropertyImage = useCallback(async (id: number | string, imageUrl: string): Promise<boolean> => {
    const prop = properties.find(p => String(p.id) === String(id));
    const currentImages = prop?.images && prop.images.length > 0 ? prop.images : (prop ? [prop.image] : [imageUrl]);
    const updatedImages = [imageUrl, ...currentImages.filter(img => img !== imageUrl)];
    return updatePropertyImages(id, updatedImages, imageUrl);
  }, [properties, updatePropertyImages]);

  const resetPropertyImage = useCallback(async (id: number | string): Promise<boolean> => {
    const original = (ALL_PROPERTIES as Property[]).find(p => String(p.id) === String(id));
    if (original) {
      const origImages = original.images || [original.image];
      return updatePropertyImages(id, origImages, original.image);
    }
    return false;
  }, [updatePropertyImages]);

  const deletePropertyImage = useCallback(async (id: number | string, imageToDelete: string): Promise<boolean> => {
    const prop = properties.find(p => String(p.id) === String(id));
    if (!prop) return false;
    const currentImages = prop.images && prop.images.length > 0 ? prop.images : [prop.image];
    const filtered = currentImages.filter(img => img !== imageToDelete);
    const newPrimary = filtered[0] || prop.image;
    return updatePropertyImages(id, filtered.length > 0 ? filtered : [prop.image], newPrimary);
  }, [properties, updatePropertyImages]);

  // Founder Section Infinite Scroll Cards & Slides Management
  const updateFounderCardPhoto = useCallback(async (cardId: string, newUrl: string): Promise<boolean> => {
    try {
      setSyncState('saving');
      const res = await fetch('/api/sections/founder-card', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, newUrl })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sections) setSections(data.sections);
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  }, []);

  const resetFounderCardPhoto = useCallback(async (cardId: string): Promise<boolean> => {
    try {
      setSyncState('saving');
      const res = await fetch('/api/sections/founder-card/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sections) setSections(data.sections);
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  }, []);

  const updateShowcaseSlides = useCallback(async (slides: ShowcaseSlide[]): Promise<boolean> => {
    try {
      setSyncState('saving');
      const res = await fetch('/api/sections/showcase-slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sections) setSections(data.sections);
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  }, []);

  const updateHeroSliderPhoto = useCallback(async (slideId: number | string, newUrl: string): Promise<boolean> => {
    try {
      setSyncState('saving');
      // Immediate optimistic update
      setSections(prev => ({
        ...prev,
        heroSliderPhotos: {
          ...(prev.heroSliderPhotos || {}),
          [String(slideId)]: newUrl
        }
      }));

      const res = await fetch('/api/sections/hero-slider-photo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slideId, newUrl })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sections) setSections(data.sections);
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  }, []);

  const resetHeroSliderPhoto = useCallback(async (slideId: number | string): Promise<boolean> => {
    try {
      setSyncState('saving');
      // Immediate optimistic reset
      setSections(prev => {
        const copy = { ...(prev.heroSliderPhotos || {}) };
        delete copy[String(slideId)];
        delete copy[Number(slideId)];
        return { ...prev, heroSliderPhotos: copy };
      });

      const res = await fetch('/api/sections/hero-slider-photo/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slideId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sections) setSections(data.sections);
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  }, []);

  const updateConstructionVideoUrl = useCallback(async (videoUrl: string): Promise<boolean> => {
    try {
      setSyncState('saving');
      setSections(prev => ({
        ...prev,
        constructionVideoUrl: videoUrl
      }));

      const res = await fetch('/api/sections/construction-video', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sections) setSections(data.sections);
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  }, []);

  const resetConstructionVideoUrl = useCallback(async (): Promise<boolean> => {
    try {
      setSyncState('saving');
      setSections(prev => ({
        ...prev,
        constructionVideoUrl: '/construction.mp4'
      }));

      const res = await fetch('/api/sections/construction-video/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sections) setSections(data.sections);
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  }, []);

  const updateSectionsData = useCallback(async (newSections: Partial<SectionsConfig>): Promise<boolean> => {
    try {
      setSyncState('saving');
      const token = typeof window !== 'undefined' ? localStorage.getItem('jsg_admin_token') : null;
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ ...newSections, expectedVersion: contentVersion })
      });

      if (res.status === 409) {
        setSyncState('conflict');
        alert('Conflict detected: This content was updated from another device. Reloading latest version.');
        await refreshData();
        return false;
      }

      if (res.ok) {
        const data = await res.json();
        if (data.sections) setSections(data.sections);
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  }, [contentVersion, refreshData]);

  const updateSettingsData = useCallback(async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      setSyncState('saving');
      const token = typeof window !== 'undefined' ? localStorage.getItem('jsg_admin_token') : null;
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ ...newSettings, expectedVersion: contentVersion })
      });

      if (res.status === 409) {
        setSyncState('conflict');
        alert('Conflict detected: Settings were updated from another device. Reloading latest version.');
        await refreshData();
        return false;
      }

      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
        if (data.version) setContentVersion(data.version);
        setSyncState('saved');
        setTimeout(() => setSyncState('synced'), 1500);
        return true;
      }
      setSyncState('offline');
      return false;
    } catch (err) {
      setSyncState('offline');
      return false;
    }
  }, [contentVersion, refreshData]);

  // Admin Auth Actions
  const loginAsAdmin = useCallback((token: string, user?: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jsg_admin_token', token);
      const safeUser = user || { name: 'Super Administrator', email: 'admin@jsgrealestate.ae', role: 'super_admin' };
      localStorage.setItem('jsg_admin_user', JSON.stringify(safeUser));
      setIsAdmin(true);
      setAdminUser(safeUser);
      window.dispatchEvent(new CustomEvent('jsg-admin-auth-changed', { detail: { isAdmin: true, user: safeUser } }));
    }
  }, []);

  const logoutAdmin = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jsg_admin_token');
      localStorage.removeItem('jsg_admin_user');
      setIsAdmin(false);
      setAdminUser(null);
      window.dispatchEvent(new CustomEvent('jsg-admin-auth-changed', { detail: { isAdmin: false } }));
    }
  }, []);

  return (
    <SiteDataContext.Provider
      value={{
        settings,
        sections,
        properties,
        pages,
        aiSettings,
        syncState,
        contentVersion,
        lastUpdatedAt,
        refreshData,
        submitLead,
        submitAppointment,
        updateLogo,
        resetLogo,
        communityImages,
        updateCommunityImage,
        resetCommunityImage,
        getCommunityImage,
        updatePropertyImage,
        resetPropertyImage,
        updatePropertyImages,
        deletePropertyImage,
        getPropertyImages,
        updateFounderCardPhoto,
        resetFounderCardPhoto,
        updateShowcaseSlides,
        updateHeroSliderPhoto,
        resetHeroSliderPhoto,
        updateConstructionVideoUrl,
        resetConstructionVideoUrl,
        updateSectionsData,
        updateSettingsData,
        isAdmin,
        adminUser,
        loginAsAdmin,
        logoutAdmin
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
}
