import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  SiteSettings, 
  SectionsConfig, 
  PageDoc, 
  ManagedProperty, 
  LeadDoc, 
  AppointmentDoc, 
  AdminUser, 
  MediaItem, 
  AuditLog, 
  RevisionSnapshot, 
  AISettings,
  InfiniteCard,
  ShowcaseSlide
} from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function safeReadJson<T>(filename: string, defaultVal: T): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filename}, fallback to default:`, err);
  }
  return defaultVal;
}

function safeWriteJson<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (_) {}
    }
  }
}

// Global state version
let globalContentVersion = 1;

// Initial Seeds
const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'JSG Real Estate',
  tagline: 'Dubai Luxury Properties & Trophy Residences',
  logoUrl: '/assets/jsg-logo.png',
  faviconUrl: '/logo.png',
  reraLicense: '19284',
  contact: {
    company: 'JSG Real Estate LLC',
    location: 'Suite 2401, Boulevard Plaza Tower 1, Downtown Dubai, UAE',
    phone: '+971 4 320 2030',
    email: 'info@jsgrealestate.ae',
    whatsapp: '+971 50 123 4567'
  },
  socialLinks: {
    instagram: 'https://instagram.com/jsgrealestate',
    linkedin: 'https://linkedin.com/company/jsgrealestate',
    facebook: 'https://facebook.com/jsgrealestate',
    youtube: 'https://youtube.com/@jsgrealestate',
    x: 'https://x.com/jsgrealestate'
  },
  footer: {
    description: 'JSG Real Estate is an elite boutique brokerage in Dubai specializing in prime off-plan portfolios, private waterfront villas, and bespoke property acquisitions.',
    copyright: '© 2026 JSG Real Estate LLC. All Rights Reserved.',
    disclaimer: 'All listings subject to RERA regulation and DLD registered escrow procedures. Prices are quoted in AED.'
  },
  seo: {
    defaultTitle: 'JSG Real Estate Dubai | Luxury Properties, Villas & Off-Plan',
    defaultDescription: 'Discover exclusive luxury properties for sale and rent in Dubai with JSG Real Estate. High-yield investments, waterfront penthouses, and RERA-verified listings.',
    keywords: 'Dubai luxury real estate, Palm Jumeirah villas, Downtown Dubai penthouses, Dubai off-plan investments, JSG real estate',
    ogImage: '/assets/jsg-logo.png'
  },
  customCss: '',
  customHeadCode: '',
  version: 1,
  updatedAt: new Date().toISOString()
};

const DEFAULT_COMMUNITY_IMAGES: Record<string, string> = {
  'Downtown Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
  'Palm Jumeirah': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
  'Dubai Hills Estate': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'Dubai Marina': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
  'Business Bay': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85',
  'Jumeirah Bay Island': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
  'MBR City': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
  'Emirates Hills': 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
  'Bluewaters Island': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85',
  'Al Barari': 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=85'
};

const DEFAULT_SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: 'founder-1',
    url: '/assets/founder.jpg',
    title: 'JSG Executive Leadership',
    subtitle: 'Founder & Managing Director',
    tag: 'Leadership'
  },
  {
    id: 'suite-2',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    title: 'Private Advisory Suite',
    subtitle: 'High-Net-Worth Advisory Lounge, Downtown Dubai',
    tag: 'Private Office'
  },
  {
    id: 'penthouse-3',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    title: 'Palm Jumeirah Signature Villa',
    subtitle: 'Private Beachfront Key Handover Ceremony',
    tag: 'Curated Handover'
  },
  {
    id: 'mansion-4',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    title: 'Fairway Vistas Championship Estate',
    subtitle: 'Dubai Hills Prime Architectural Masterpiece',
    tag: 'Trophy Estate'
  }
];

const DEFAULT_BACKGROUND_CARDS_ROW1: InfiniteCard[] = [
  {
    id: 'dubai-bg-1',
    title: "Palm Jumeirah Signature Beachfront Villa",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    price: "AED 28.5M",
    area: "Palm Jumeirah, Dubai"
  },
  {
    id: 'dubai-bg-2',
    title: "Burj Crown Sky Penthouse",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    price: "AED 16.5M",
    area: "Downtown Dubai"
  },
  {
    id: 'dubai-bg-3',
    title: "Fairway Vistas Championship Mansion",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "AED 24.2M",
    area: "Dubai Hills Estate"
  },
  {
    id: 'dubai-bg-4',
    title: "The Royal Marina High-Altitude Suite",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    price: "AED 5.85M",
    area: "Dubai Marina"
  },
  {
    id: 'dubai-bg-5',
    title: "District One Crystal Lagoon Villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    price: "AED 21.0M",
    area: "MBR City, Dubai"
  },
  {
    id: 'dubai-bg-6',
    title: "One Canal Waterfront Luxury Sky Villa",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    price: "AED 19.5M",
    area: "Dubai Water Canal"
  }
];

const DEFAULT_BACKGROUND_CARDS_ROW2: InfiniteCard[] = [
  {
    id: 'dubai-bg-7',
    title: "Jumeirah Bay Island Bulgari Mansion",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    price: "AED 55.0M",
    area: "Jumeirah Bay Island, Dubai"
  },
  {
    id: 'dubai-bg-8',
    title: "Atlantis The Royal Palm Crescent Suite",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    price: "AED 34.0M",
    area: "Palm Jumeirah, Dubai"
  },
  {
    id: 'dubai-bg-9',
    title: "Emirates Hills Montgomerie Villa",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    price: "AED 38.5M",
    area: "Emirates Hills, Dubai"
  },
  {
    id: 'dubai-bg-10',
    title: "Il Primo Opera Grand Penthouse",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    price: "AED 22.0M",
    area: "Downtown Dubai"
  },
  {
    id: 'dubai-bg-11',
    title: "Bluewaters Bay Island Residence",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    price: "AED 8.4M",
    area: "Bluewaters Island, Dubai"
  },
  {
    id: 'dubai-bg-12',
    title: "Al Barari Botanical Luxury Estate",
    image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
    defaultImage: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
    price: "AED 17.5M",
    area: "Al Barari, Dubai"
  }
];

const DEFAULT_SECTIONS: SectionsConfig = {
  founder: {
    name: 'JASMEET SINGH GULATI',
    title: 'Founder & Chief Executive Officer',
    subtitle: '15+ Years Driving Institutional & Ultra-Luxury UAE Real Estate Acquisitions',
    experienceYears: 15,
    dealsVolume: 'AED 4.8B+',
    typewriterPhrases: [
      'Institutional Asset Advisory & Private Off-Market Acquisitions',
      'Dubai Trophy Penthouses & Waterfront Signature Mansions',
      'High-Yield Portfolios Delivering Consistent 8–11% ROI'
    ],
    executiveStatement: 'At JSG Real Estate, our philosophy transcends conventional transactions. We curate generational assets for visionary individuals who view Dubai as the preeminent luxury metropolis of the modern world.',
    detailedBio: 'Jasmeet Singh Gulati founded JSG Real Estate with an uncompromising focus on discretion, analytical precision, and fiduciary integrity. Having directed over AED 4.8 Billion in high-profile residential and commercial transactions across Downtown Dubai, Palm Jumeirah, and Emirates Hills, Jasmeet serves as the trusted property advisor to international family offices and discerning private investors.',
    portraitImage: '/assets/founder.jpg',
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
    },
    {
      id: 'slide-3',
      tag: 'Golf Sanctuary',
      title: 'Dubai Hills Parkway Mansion',
      subtitle: 'Overlooking championship 18-hole golf fairways with private rooftop observatory and landscaped courtyard.',
      location: 'Dubai Hills Estate',
      priceAed: 19800000,
      beds: 5,
      baths: 6,
      areaSqft: 7200,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
      link: '/buy',
      active: true,
      order: 3
    }
  ],
  showcaseSlides: DEFAULT_SHOWCASE_SLIDES,
  infiniteCardsRow1: DEFAULT_BACKGROUND_CARDS_ROW1,
  infiniteCardsRow2: DEFAULT_BACKGROUND_CARDS_ROW2,
  hero3dSettings: {
    enabled: true,
    autoRotate: true,
    rotationSpeed: 1.0,
    fov: 45
  },
  quickCardsVisible: true,
  liveBannerVisible: true,
  featuredPropertiesVisible: true,
  developersStripVisible: true,
  communitiesStripVisible: true,
  version: 1,
  updatedAt: new Date().toISOString()
};

const DEFAULT_AI_SETTINGS: AISettings = {
  enabled: true,
  assistantName: 'JSG Luxury Concierge',
  welcomeMessage: 'Welcome to JSG Real Estate. I am your private AI property advisor. How may I assist your Dubai real estate search today?',
  systemPrompt: 'You are the elite AI Real Estate Concierge for JSG Real Estate in Dubai, UAE. You represent founder Jasmeet Singh Gulati. You are sophisticated, polished, polite, highly knowledgeable about Dubai freehold areas (Palm Jumeirah, Downtown Dubai, Dubai Hills, Dubai Marina, Business Bay), UAE mortgage guidelines (4% DLD fee, 20% down payment for expats), and off-plan payment plans. When users express interest in buying, renting, or scheduling a viewing, offer to record their details or connect with an agent.',
  tone: 'Luxury & Professional',
  suggestedQuestions: [
    'What are the best high-yield off-plan projects in Dubai?',
    'Explain the 10-Year UAE Golden Visa property requirements.',
    'Book a private viewing for Palm Jumeirah Waterfront Villa.',
    'Calculate mortgage EMI for an AED 3.85M apartment.'
  ],
  enableVoice: true,
  voicePitch: 1.0,
  voiceRate: 1.0,
  leadCaptureEnabled: true,
  version: 1,
  updatedAt: new Date().toISOString()
};

// Seed default properties from rich data
const INITIAL_PROPERTIES: ManagedProperty[] = [
  {
    id: 1,
    type: 'apartment',
    category: 'apartment',
    tag: 'Featured Luxury',
    title: 'The Royal Marina Residence',
    location: 'Dubai Marina, Dubai',
    community: 'Dubai Marina',
    building: 'Royal Marina Tower',
    developer: 'Select Group',
    price: 3850000,
    beds: 3,
    baths: 4,
    area: 2150,
    mode: 'buy',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90',
    galleryImages: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Breathtaking full marina view luxury residence with floor-to-ceiling panoramic glass, private yacht dock access, marble finishes, and Italian kitchen cabinetry.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Full Marina View', 'Private Berthing Access', 'Smart Home System', 'Infinity Pool', '2 Valet Spaces'],
    furnished: true,
    completionYear: 2023,
    referenceNumber: 'JSG-MAR-101',
    assignedAgent: 'Rohan Sharma',
    isFeatured: true,
    isDldVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },
  {
    id: 2,
    type: 'villa',
    category: 'villa',
    tag: 'Signature Collection',
    title: 'Palm Jumeirah Waterfront Villa',
    location: 'Frond G, Palm Jumeirah, Dubai',
    community: 'Palm Jumeirah',
    building: 'Custom Signature Villa',
    developer: 'Nakheel',
    price: 28500000,
    beds: 6,
    baths: 7,
    area: 8400,
    plotSize: 13200,
    parking: 4,
    mode: 'buy',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=90',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Direct beachfront mansion with private white sandy beach, heated infinity pool facing the Dubai Marina skyline, bespoke European furnishings, and cinema room.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Private Beach Access', 'Heated Infinity Pool', 'Skyline View', 'Private Elevator', 'Private Cinema', 'Maid & Driver Quarters'],
    furnished: true,
    completionYear: 2024,
    referenceNumber: 'JSG-PLM-202',
    assignedAgent: 'Elena Rostova',
    isFeatured: true,
    isDldVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },
  {
    id: 3,
    type: 'apartment',
    category: 'penthouse',
    tag: 'Trophy Penthouse',
    title: 'Downtown Burj Crown Penthouse',
    location: 'Downtown Dubai, Dubai',
    community: 'Downtown Dubai',
    building: 'Burj Crown',
    developer: 'Emaar Properties',
    price: 12200000,
    beds: 4,
    baths: 5,
    area: 4600,
    parking: 3,
    mode: 'buy',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=90',
    galleryImages: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Ultra-exclusive duplex penthouse with direct unobstructed Burj Khalifa and Dubai Fountain views. Features a private jacuzzi terrace and German bespoke kitchen.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Direct Burj Khalifa Views', 'Jacuzzi Terrace', 'Concierge & Valet', 'Private Lift Access', 'Wine Cellar'],
    furnished: true,
    completionYear: 2023,
    referenceNumber: 'JSG-DWT-303',
    assignedAgent: 'Tariq Al Mansoor',
    isFeatured: true,
    isDldVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },
  {
    id: 4,
    type: 'villa',
    category: 'villa',
    tag: 'Golf Estate',
    title: 'Dubai Hills Fairway Mansion',
    location: 'Fairway Vistas, Dubai Hills Estate',
    community: 'Dubai Hills Estate',
    building: 'Fairway Vistas',
    developer: 'Emaar Properties',
    price: 19800000,
    beds: 5,
    baths: 6,
    area: 7200,
    plotSize: 11000,
    parking: 3,
    mode: 'buy',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Contemporary architectural masterpiece facing championship 18-hole golf fairways. Double-height ceilings, private spa, and sun-drenched entertaining grounds.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Full Golf Course View', 'Private Swimming Pool', 'Double Height Ceilings', 'Smart Automation', 'Show Kitchen & Prep Kitchen'],
    furnished: false,
    completionYear: 2024,
    referenceNumber: 'JSG-DHE-404',
    assignedAgent: 'Sarah Jenkins',
    isFeatured: true,
    isDldVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },
  {
    id: 5,
    type: 'apartment',
    category: 'apartment',
    tag: 'Canal Residence',
    title: 'Business Bay Waterfront Luxury',
    location: 'Marasi Drive, Business Bay, Dubai',
    community: 'Business Bay',
    building: 'Canal Heights',
    developer: 'DAMAC Properties',
    price: 195000,
    beds: 2,
    baths: 2,
    area: 1350,
    parking: 1,
    mode: 'rent',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=90',
    galleryImages: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Designer furnished waterfront home facing the Dubai Water Canal with skyline sunset views, rooftop infinity deck, and immediate access to Downtown dining.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Dubai Canal View', 'Fully Furnished', 'Infinity Sky Deck', 'High Floor', 'Chiller Free'],
    furnished: true,
    completionYear: 2023,
    referenceNumber: 'JSG-BBY-505',
    assignedAgent: 'Rohan Sharma',
    isFeatured: true,
    isDldVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },
  {
    id: 6,
    type: 'villa',
    category: 'townhouse',
    tag: 'Park Facing',
    title: 'Jumeirah Golf Estates Townhome',
    location: 'Wildflower, JGE, Dubai',
    community: 'Jumeirah Golf Estates',
    building: 'Wildflower Row',
    developer: 'JGE',
    price: 4500000,
    beds: 4,
    baths: 4,
    area: 3400,
    parking: 2,
    mode: 'buy',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=90',
    galleryImages: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Elegantly proportioned luxury modern townhouse nestled against tranquil championship greens with landscaped private garden and club membership privileges.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Private Garden', 'Championship Golf Access', 'Covered Parking', 'Maids Room', 'Clubhouse Amenities'],
    furnished: false,
    completionYear: 2023,
    referenceNumber: 'JSG-JGE-606',
    assignedAgent: 'Elena Rostova',
    isFeatured: false,
    isDldVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  }
];

const DEFAULT_PAGES: PageDoc[] = [
  {
    id: 'page-vip-services',
    slug: 'vip-services',
    title: 'JSG VIP Concierge & Private Client Office',
    subtitle: 'Discreet, bespoke real estate acquisition services for high-net-worth individuals and family offices.',
    navPlacement: 'header',
    isPublished: true,
    order: 1,
    metaTitle: 'VIP Private Client Services | JSG Real Estate Dubai',
    metaDescription: 'Private wealth advisory, off-market trophy mansions, and 10-Year Golden Visa processing.',
    blocks: [
      {
        id: 'block-1',
        type: 'hero',
        title: 'Bespoke Property Advisory for Discerning Capital',
        content: 'From confidential off-market trophy acquisitions to full-spectrum Golden Visa residency and wealth preservation, JSG Private Office provides unmatched access to Dubai prime real estate.'
      },
      {
        id: 'block-2',
        type: 'features',
        title: 'Core Private Client Pillars',
        content: '• Off-Market Confidential Sourcing\n• Developer Direct VIP Pre-Launch Allocations\n• Comprehensive Legal & Escrow Due Diligence\n• UAE Golden Visa & Corporate Structuring Advisory'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  },
  {
    id: 'page-golden-visa',
    slug: 'uae-golden-visa',
    title: '10-Year UAE Golden Visa Investor Guide',
    subtitle: 'Comprehensive criteria, eligible AED 2,000,000+ property investments, and step-by-step residency processing.',
    navPlacement: 'header',
    isPublished: true,
    order: 2,
    metaTitle: '10-Year UAE Golden Visa by Property Investment | JSG Real Estate',
    metaDescription: 'Secure your 10-Year UAE Golden Visa by investing AED 2M in Dubai real estate. Step-by-step guidance from JSG Real Estate.',
    blocks: [
      {
        id: 'block-gv-1',
        type: 'text',
        title: 'Zero Down Payment Minimum Requirement (2024 Rule Update)',
        content: 'Under the latest UAE Federal Authority for Identity and Citizenship directives, property investors purchasing real estate valued at AED 2 Million or above qualify for the 10-Year Golden Visa, even if acquired through mortgage or off-plan installments.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  }
];

// In-memory singletons backed by files
class Database {
  private settings: SiteSettings;
  private sections: SectionsConfig;
  private properties: ManagedProperty[];
  private pages: PageDoc[];
  private leads: LeadDoc[];
  private appointments: AppointmentDoc[];
  private users: AdminUser[];
  private media: MediaItem[];
  private auditLogs: AuditLog[];
  private revisions: RevisionSnapshot[];
  private aiSettings: AISettings;
  private communityImages: Record<string, string>;
  private lastUpdatedAt: string;

  constructor() {
    this.settings = safeReadJson<SiteSettings>('settings.json', DEFAULT_SETTINGS);
    this.sections = safeReadJson<SectionsConfig>('sections.json', DEFAULT_SECTIONS);
    
    // Ensure founder cards and slides are present
    if (!this.sections.showcaseSlides || this.sections.showcaseSlides.length === 0) {
      this.sections.showcaseSlides = DEFAULT_SHOWCASE_SLIDES;
    }
    if (!this.sections.infiniteCardsRow1 || this.sections.infiniteCardsRow1.length === 0) {
      this.sections.infiniteCardsRow1 = DEFAULT_BACKGROUND_CARDS_ROW1;
    }
    if (!this.sections.infiniteCardsRow2 || this.sections.infiniteCardsRow2.length === 0) {
      this.sections.infiniteCardsRow2 = DEFAULT_BACKGROUND_CARDS_ROW2;
    }

    this.properties = safeReadJson<ManagedProperty[]>('properties.json', INITIAL_PROPERTIES);
    this.pages = safeReadJson<PageDoc[]>('pages.json', DEFAULT_PAGES);
    this.leads = safeReadJson<LeadDoc[]>('leads.json', []);
    this.appointments = safeReadJson<AppointmentDoc[]>('appointments.json', []);
    this.users = safeReadJson<AdminUser[]>('users.json', []);
    this.media = safeReadJson<MediaItem[]>('media.json', []);
    this.auditLogs = safeReadJson<AuditLog[]>('audit.json', []);
    this.revisions = safeReadJson<RevisionSnapshot[]>('revisions.json', []);
    this.aiSettings = safeReadJson<AISettings>('ai_settings.json', DEFAULT_AI_SETTINGS);
    this.communityImages = safeReadJson<Record<string, string>>('community_images.json', DEFAULT_COMMUNITY_IMAGES);

    const verData = safeReadJson<{ version: number; updatedAt: string }>('version.json', { 
      version: 1, 
      updatedAt: new Date().toISOString() 
    });
    globalContentVersion = verData.version || 1;
    this.lastUpdatedAt = verData.updatedAt || new Date().toISOString();

    this.ensureDefaultAdminUser();
  }

  private ensureDefaultAdminUser() {
    if (this.users.length === 0) {
      // Default admin: Maleeka (admin@jsgrealestate.ae / JSG@Admin2026!)
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync('JSG@Admin2026!', salt, 10000, 64, 'sha512').toString('hex');
      const superAdmin: AdminUser = {
        id: 'user-admin-1',
        username: 'maleeka',
        email: 'admin@jsgrealestate.ae',
        passwordHash: hash,
        salt: salt,
        role: 'super_admin',
        name: 'Maleeka',
        is2faEnabled: false,
        failedLoginAttempts: 0,
        createdAt: new Date().toISOString()
      };
      this.users.push(superAdmin);
      safeWriteJson('users.json', this.users);
      this.logAudit({
        userId: 'system',
        userEmail: 'system',
        action: 'USER_INITIALIZED',
        entityType: 'User',
        entityId: superAdmin.id,
        details: 'Initialized default super_admin account: Maleeka (admin@jsgrealestate.ae)',
        ip: '127.0.0.1'
      });
    } else {
      // Ensure admin profile name is Maleeka
      const admin = this.users.find(u => u.role === 'super_admin');
      if (admin && admin.name !== 'Maleeka') {
        admin.name = 'Maleeka';
        admin.username = 'maleeka';
        safeWriteJson('users.json', this.users);
      }
    }
  }

  public getVersion(): number {
    return globalContentVersion;
  }

  public getLastUpdatedAt(): string {
    return this.lastUpdatedAt;
  }

  public bumpVersion(): number {
    globalContentVersion++;
    this.lastUpdatedAt = new Date().toISOString();
    safeWriteJson('version.json', { version: globalContentVersion, updatedAt: this.lastUpdatedAt });
    return globalContentVersion;
  }

  // Community Images
  public getCommunityImages(): Record<string, string> {
    return this.communityImages;
  }

  public updateCommunityImage(name: string, imageUrl: string, author: string = 'System', ip: string = '127.0.0.1'): Record<string, string> {
    this.communityImages = {
      ...this.communityImages,
      [name]: imageUrl
    };
    safeWriteJson('community_images.json', this.communityImages);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'COMMUNITY_IMAGE_UPDATED',
      entityType: 'Community',
      details: `Updated community cover photo for "${name}"`,
      ip
    });
    return this.communityImages;
  }

  public resetCommunityImage(name: string, author: string = 'System', ip: string = '127.0.0.1'): Record<string, string> {
    const next = { ...this.communityImages };
    if (DEFAULT_COMMUNITY_IMAGES[name]) {
      next[name] = DEFAULT_COMMUNITY_IMAGES[name];
    } else {
      delete next[name];
    }
    this.communityImages = next;
    safeWriteJson('community_images.json', this.communityImages);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'COMMUNITY_IMAGE_RESET',
      entityType: 'Community',
      details: `Reset community photo for "${name}" to master default`,
      ip
    });
    return this.communityImages;
  }

  // Founder Cards & Slides
  public updateFounderCard(cardId: string, newUrl: string, author: string = 'System', ip: string = '127.0.0.1'): SectionsConfig {
    const r1 = (this.sections.infiniteCardsRow1 || DEFAULT_BACKGROUND_CARDS_ROW1).map(c => c.id === cardId ? { ...c, image: newUrl } : c);
    const r2 = (this.sections.infiniteCardsRow2 || DEFAULT_BACKGROUND_CARDS_ROW2).map(c => c.id === cardId ? { ...c, image: newUrl } : c);
    this.sections = {
      ...this.sections,
      infiniteCardsRow1: r1,
      infiniteCardsRow2: r2,
      version: (this.sections.version || 1) + 1,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('sections.json', this.sections);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'FOUNDER_CARD_UPDATED',
      entityType: 'Sections',
      details: `Updated infinite scroll card "${cardId}" image`,
      ip
    });
    return this.sections;
  }

  public resetFounderCard(cardId: string, author: string = 'System', ip: string = '127.0.0.1'): SectionsConfig {
    const r1 = (this.sections.infiniteCardsRow1 || DEFAULT_BACKGROUND_CARDS_ROW1).map(c => c.id === cardId ? { ...c, image: c.defaultImage } : c);
    const r2 = (this.sections.infiniteCardsRow2 || DEFAULT_BACKGROUND_CARDS_ROW2).map(c => c.id === cardId ? { ...c, image: c.defaultImage } : c);
    this.sections = {
      ...this.sections,
      infiniteCardsRow1: r1,
      infiniteCardsRow2: r2,
      version: (this.sections.version || 1) + 1,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('sections.json', this.sections);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'FOUNDER_CARD_RESET',
      entityType: 'Sections',
      details: `Reset infinite scroll card "${cardId}" to default Dubai asset`,
      ip
    });
    return this.sections;
  }

  public updateShowcaseSlides(slides: ShowcaseSlide[], author: string = 'System', ip: string = '127.0.0.1'): SectionsConfig {
    this.sections = {
      ...this.sections,
      showcaseSlides: slides,
      version: (this.sections.version || 1) + 1,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('sections.json', this.sections);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'SHOWCASE_SLIDES_UPDATED',
      entityType: 'Sections',
      details: `Updated founder showcase slides (${slides.length} slides)`,
      ip
    });
    return this.sections;
  }

  public updateHeroSliderPhoto(slideId: number | string, newUrl: string, author: string = 'System', ip: string = '127.0.0.1'): SectionsConfig {
    const currentPhotos = this.sections.heroSliderPhotos || {};
    this.sections = {
      ...this.sections,
      heroSliderPhotos: {
        ...currentPhotos,
        [String(slideId)]: newUrl
      },
      version: (this.sections.version || 1) + 1,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('sections.json', this.sections);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'HERO_SLIDER_PHOTO_UPDATED',
      entityType: 'Sections',
      details: `Updated Hero Slider photo for slide #${slideId}`,
      ip
    });
    return this.sections;
  }

  public resetHeroSliderPhoto(slideId: number | string, author: string = 'System', ip: string = '127.0.0.1'): SectionsConfig {
    const currentPhotos = { ...(this.sections.heroSliderPhotos || {}) };
    delete currentPhotos[String(slideId)];
    delete currentPhotos[Number(slideId)];
    this.sections = {
      ...this.sections,
      heroSliderPhotos: currentPhotos,
      version: (this.sections.version || 1) + 1,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('sections.json', this.sections);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'HERO_SLIDER_PHOTO_RESET',
      entityType: 'Sections',
      details: `Reset Hero Slider photo for slide #${slideId} to default`,
      ip
    });
    return this.sections;
  }

  public updateConstructionVideoUrl(url: string, author: string = 'System', ip: string = '127.0.0.1'): SectionsConfig {
    this.sections = {
      ...this.sections,
      constructionVideoUrl: url,
      version: (this.sections.version || 1) + 1,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('sections.json', this.sections);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'CONSTRUCTION_VIDEO_UPDATED',
      entityType: 'Sections',
      details: `Updated construction video URL: ${url}`,
      ip
    });
    return this.sections;
  }

  public resetConstructionVideoUrl(author: string = 'System', ip: string = '127.0.0.1'): SectionsConfig {
    this.sections = {
      ...this.sections,
      constructionVideoUrl: '/construction.mp4',
      version: (this.sections.version || 1) + 1,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('sections.json', this.sections);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'CONSTRUCTION_VIDEO_RESET',
      entityType: 'Sections',
      details: 'Reset construction video URL to default /construction.mp4',
      ip
    });
    return this.sections;
  }

  // Dedicated Property Gallery & Primary Image Persistence
  public updatePropertyImages(id: number | string, images: string[], primaryImage?: string, author: string = 'System', ip: string = '127.0.0.1'): ManagedProperty | null {
    const idx = this.properties.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;
    const primary = primaryImage || images[0] || this.properties[idx].image;
    this.properties[idx] = {
      ...this.properties[idx],
      image: primary,
      galleryImages: images.length > 0 ? images : [primary],
      updatedAt: new Date().toISOString(),
      version: (this.properties[idx].version || 1) + 1
    };
    safeWriteJson('properties.json', this.properties);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'PROPERTY_IMAGES_UPDATED',
      entityType: 'Property',
      entityId: String(id),
      details: `Updated primary & gallery photos for property: "${this.properties[idx].title}"`,
      ip
    });
    return this.properties[idx];
  }

  // Settings
  public getSettings(): SiteSettings {
    return this.settings;
  }

  public updateSettings(newSettings: Partial<SiteSettings>, author: string, ip: string): SiteSettings {
    this.settings = {
      ...this.settings,
      ...newSettings,
      version: this.settings.version + 1,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('settings.json', this.settings);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'SETTINGS_UPDATED',
      entityType: 'Settings',
      details: 'Updated site identity, contact, social, or custom CSS settings',
      ip
    });
    this.createRevisionSnapshot(author, 'Updated Site Settings');
    return this.settings;
  }

  // Sections
  public getSections(): SectionsConfig {
    return this.sections;
  }

  public updateSections(newSections: Partial<SectionsConfig>, author: string, ip: string): SectionsConfig {
    this.sections = {
      ...this.sections,
      ...newSections,
      version: this.sections.version + 1,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('sections.json', this.sections);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'SECTIONS_UPDATED',
      entityType: 'Sections',
      details: 'Updated home sections, hero slides, or founder details',
      ip
    });
    this.createRevisionSnapshot(author, 'Updated Home Sections');
    return this.sections;
  }

  // Properties
  public getProperties(): ManagedProperty[] {
    return this.properties;
  }

  public getPropertyById(id: string | number): ManagedProperty | undefined {
    return this.properties.find(p => String(p.id) === String(id));
  }

  public addProperty(prop: Omit<ManagedProperty, 'id' | 'createdAt' | 'updatedAt' | 'version'>, author: string, ip: string): ManagedProperty {
    const newId = Date.now();
    const newProp: ManagedProperty = {
      ...prop,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
    this.properties.unshift(newProp);
    safeWriteJson('properties.json', this.properties);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'PROPERTY_CREATED',
      entityType: 'Property',
      entityId: String(newId),
      details: `Added new property: "${newProp.title}" in ${newProp.location} (AED ${newProp.price})`,
      ip
    });
    return newProp;
  }

  public updateProperty(id: string | number, updates: Partial<ManagedProperty>, author: string, ip: string): ManagedProperty | null {
    const idx = this.properties.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;

    this.properties[idx] = {
      ...this.properties[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
      version: (this.properties[idx].version || 1) + 1
    };
    safeWriteJson('properties.json', this.properties);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'PROPERTY_UPDATED',
      entityType: 'Property',
      entityId: String(id),
      details: `Updated property: "${this.properties[idx].title}"`,
      ip
    });
    return this.properties[idx];
  }

  public deleteProperty(id: string | number, author: string, ip: string): boolean {
    const idx = this.properties.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return false;
    const removed = this.properties.splice(idx, 1)[0];
    safeWriteJson('properties.json', this.properties);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'PROPERTY_DELETED',
      entityType: 'Property',
      entityId: String(id),
      details: `Deleted property: "${removed.title}"`,
      ip
    });
    return true;
  }

  // Pages
  public getPages(): PageDoc[] {
    return this.pages;
  }

  public getPageBySlug(slug: string): PageDoc | undefined {
    return this.pages.find(p => p.slug.toLowerCase() === slug.toLowerCase());
  }

  public addPage(page: Omit<PageDoc, 'id' | 'createdAt' | 'updatedAt' | 'version'>, author: string, ip: string): PageDoc {
    const newId = `page-${Date.now()}`;
    const newPage: PageDoc = {
      ...page,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
    this.pages.push(newPage);
    safeWriteJson('pages.json', this.pages);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'PAGE_CREATED',
      entityType: 'Page',
      entityId: newId,
      details: `Created new page: "/${newPage.slug}" (${newPage.title})`,
      ip
    });
    return newPage;
  }

  public updatePage(id: string, updates: Partial<PageDoc>, author: string, ip: string): PageDoc | null {
    const idx = this.pages.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.pages[idx] = {
      ...this.pages[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
      version: (this.pages[idx].version || 1) + 1
    };
    safeWriteJson('pages.json', this.pages);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'PAGE_UPDATED',
      entityType: 'Page',
      entityId: id,
      details: `Updated page: "/${this.pages[idx].slug}"`,
      ip
    });
    return this.pages[idx];
  }

  public deletePage(id: string, author: string, ip: string): boolean {
    const idx = this.pages.findIndex(p => p.id === id);
    if (idx === -1) return false;
    const removed = this.pages.splice(idx, 1)[0];
    safeWriteJson('pages.json', this.pages);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'PAGE_DELETED',
      entityType: 'Page',
      entityId: id,
      details: `Deleted page: "/${removed.slug}"`,
      ip
    });
    return true;
  }

  // Leads
  public getLeads(): LeadDoc[] {
    return this.leads;
  }

  public addLead(lead: Omit<LeadDoc, 'id' | 'createdAt' | 'updatedAt' | 'notes'> & { note?: string }): LeadDoc {
    const newId = `lead-${Date.now()}`;
    const initialNotes = lead.note ? [{ text: lead.note, author: 'System', timestamp: new Date().toISOString() }] : [];
    const newLead: LeadDoc = {
      id: newId,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      interestedProperty: lead.interestedProperty,
      propertyId: lead.propertyId,
      requirement: lead.requirement,
      budget: lead.budget,
      source: lead.source,
      status: lead.status || 'New',
      priority: lead.priority || 'Medium',
      assignedAgent: lead.assignedAgent || 'Jasmeet S. Gulati',
      notes: initialNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.leads.unshift(newLead);
    safeWriteJson('leads.json', this.leads);
    this.bumpVersion();
    return newLead;
  }

  public updateLead(id: string, updates: Partial<LeadDoc>, author: string, ip: string): LeadDoc | null {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.leads[idx] = {
      ...this.leads[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('leads.json', this.leads);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'LEAD_UPDATED',
      entityType: 'Lead',
      entityId: id,
      details: `Updated lead for ${this.leads[idx].name} -> Status: ${this.leads[idx].status}`,
      ip
    });
    return this.leads[idx];
  }

  public addLeadNote(id: string, text: string, author: string): LeadDoc | null {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.leads[idx].notes.push({
      text,
      author,
      timestamp: new Date().toISOString()
    });
    this.leads[idx].updatedAt = new Date().toISOString();
    safeWriteJson('leads.json', this.leads);
    return this.leads[idx];
  }

  public deleteLead(id: string, author: string, ip: string): boolean {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) return false;
    const removed = this.leads.splice(idx, 1)[0];
    safeWriteJson('leads.json', this.leads);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'LEAD_DELETED',
      entityType: 'Lead',
      entityId: id,
      details: `Archived/deleted lead: ${removed.name}`,
      ip
    });
    return true;
  }

  // Appointments
  public getAppointments(): AppointmentDoc[] {
    return this.appointments;
  }

  public addAppointment(apt: Omit<AppointmentDoc, 'id' | 'createdAt' | 'updatedAt'>): AppointmentDoc {
    const newId = `apt-${Date.now()}`;
    const newApt: AppointmentDoc = {
      ...apt,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.appointments.unshift(newApt);
    safeWriteJson('appointments.json', this.appointments);
    this.bumpVersion();

    // Also register lead automatically if not already existing
    this.addLead({
      name: apt.customerName,
      phone: apt.phone,
      email: apt.email,
      interestedProperty: apt.propertyTitle,
      propertyId: apt.propertyId,
      source: 'Viewing Request',
      status: 'Viewing',
      priority: 'High',
      requirement: `Requested ${apt.purpose} on ${apt.preferredDate} at ${apt.preferredTime}`,
      note: apt.notes
    });

    return newApt;
  }

  public updateAppointment(id: string, updates: Partial<AppointmentDoc>, author: string, ip: string): AppointmentDoc | null {
    const idx = this.appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.appointments[idx] = {
      ...this.appointments[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('appointments.json', this.appointments);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'APPOINTMENT_UPDATED',
      entityType: 'Appointment',
      entityId: id,
      details: `Updated appointment for ${this.appointments[idx].customerName} -> Status: ${this.appointments[idx].status}`,
      ip
    });
    return this.appointments[idx];
  }

  // Users
  public getUsers(): AdminUser[] {
    return this.users;
  }

  public getUserById(id: string): AdminUser | undefined {
    return this.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): AdminUser | undefined {
    const term = email.trim().toLowerCase();
    const found = this.users.find(u => u.email.toLowerCase() === term || u.username.toLowerCase() === term);
    if (found) return found;
    if (term === 'maleeka' || term === 'maleek' || term === 'admin' || term === 'maleeka@jsgrealestate.ae' || term === 'admin@jsgrealestate.ae') {
      return this.users.find(u => u.role === 'super_admin') || this.users[0];
    }
    return undefined;
  }

  public updateUser(id: string, updates: Partial<AdminUser>): AdminUser | null {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    safeWriteJson('users.json', this.users);
    return this.users[idx];
  }

  public addUser(user: Omit<AdminUser, 'id' | 'createdAt' | 'failedLoginAttempts'>, author: string, ip: string): AdminUser {
    const newId = `user-${Date.now()}`;
    const newUser: AdminUser = {
      ...user,
      id: newId,
      failedLoginAttempts: 0,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    safeWriteJson('users.json', this.users);
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'ADMIN_CREATED',
      entityType: 'User',
      entityId: newId,
      details: `Created new admin user: ${newUser.email} (${newUser.role})`,
      ip
    });
    return newUser;
  }

  // Media
  public getMedia(): MediaItem[] {
    return this.media;
  }

  public addMedia(item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem {
    const newItem: MediaItem = {
      ...item,
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      uploadedAt: new Date().toISOString()
    };
    this.media.unshift(newItem);
    safeWriteJson('media.json', this.media);
    return newItem;
  }

  public deleteMedia(id: string, author: string, ip: string): boolean {
    const idx = this.media.findIndex(m => m.id === id);
    if (idx === -1) return false;
    const removed = this.media.splice(idx, 1)[0];
    safeWriteJson('media.json', this.media);
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'MEDIA_DELETED',
      entityType: 'Media',
      entityId: id,
      details: `Deleted media file: ${removed.filename}`,
      ip
    });
    return true;
  }

  // Audit Logs
  public logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const entry: AuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(entry);
    // Keep last 1000 logs
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(0, 1000);
    }
    safeWriteJson('audit.json', this.auditLogs);
  }

  public getAuditLogs(limit: number = 100): AuditLog[] {
    return this.auditLogs.slice(0, limit);
  }

  // AI Settings
  public getAISettings(): AISettings {
    return this.aiSettings;
  }

  public updateAISettings(settings: Partial<AISettings>, author: string, ip: string): AISettings {
    this.aiSettings = {
      ...this.aiSettings,
      ...settings,
      version: this.aiSettings.version + 1,
      updatedAt: new Date().toISOString()
    };
    safeWriteJson('ai_settings.json', this.aiSettings);
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'AI_SETTINGS_UPDATED',
      entityType: 'AI',
      details: `Updated AI settings: Assistant Name: "${this.aiSettings.assistantName}", Enabled: ${this.aiSettings.enabled}`,
      ip
    });
    return this.aiSettings;
  }

  // Revisions & Backups
  public createRevisionSnapshot(author: string, label: string): RevisionSnapshot {
    const rev: RevisionSnapshot = {
      id: `rev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      label,
      version: this.getVersion(),
      author,
      snapshot: {
        settings: JSON.parse(JSON.stringify(this.settings)),
        sections: JSON.parse(JSON.stringify(this.sections)),
        propertiesCount: this.properties.length,
        pagesCount: this.pages.length
      }
    };
    this.revisions.unshift(rev);
    if (this.revisions.length > 50) {
      this.revisions = this.revisions.slice(0, 50);
    }
    safeWriteJson('revisions.json', this.revisions);
    return rev;
  }

  public getRevisions(): RevisionSnapshot[] {
    return this.revisions;
  }

  public restoreRevision(revisionId: string, author: string, ip: string): boolean {
    const rev = this.revisions.find(r => r.id === revisionId);
    if (!rev) return false;

    this.settings = JSON.parse(JSON.stringify(rev.snapshot.settings));
    this.sections = JSON.parse(JSON.stringify(rev.snapshot.sections));
    safeWriteJson('settings.json', this.settings);
    safeWriteJson('sections.json', this.sections);
    this.bumpVersion();

    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'REVISION_RESTORED',
      entityType: 'Revision',
      entityId: revisionId,
      details: `Restored site state to revision snapshot from ${rev.timestamp} (${rev.label})`,
      ip
    });
    return true;
  }

  public exportFullBackup(): object {
    return {
      version: this.getVersion(),
      exportedAt: new Date().toISOString(),
      settings: this.settings,
      sections: this.sections,
      properties: this.properties,
      pages: this.pages,
      aiSettings: this.aiSettings
    };
  }

  public importFullBackup(data: any, author: string, ip: string): boolean {
    if (!data || typeof data !== 'object') return false;
    if (data.settings) {
      this.settings = data.settings;
      safeWriteJson('settings.json', this.settings);
    }
    if (data.sections) {
      this.sections = data.sections;
      safeWriteJson('sections.json', this.sections);
    }
    if (data.properties && Array.isArray(data.properties)) {
      this.properties = data.properties;
      safeWriteJson('properties.json', this.properties);
    }
    if (data.pages && Array.isArray(data.pages)) {
      this.pages = data.pages;
      safeWriteJson('pages.json', this.pages);
    }
    if (data.aiSettings) {
      this.aiSettings = data.aiSettings;
      safeWriteJson('ai_settings.json', this.aiSettings);
    }
    this.bumpVersion();
    this.logAudit({
      userId: author,
      userEmail: author,
      action: 'BACKUP_IMPORTED',
      entityType: 'Backup',
      details: 'Restored full system database from imported JSON backup archive',
      ip
    });
    return true;
  }
}

export const db = new Database();
