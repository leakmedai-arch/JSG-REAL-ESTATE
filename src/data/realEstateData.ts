import { Property } from '../types/jsg';

export interface Developer {
  id: string;
  name: string;
  logo: string;
  founded: number;
  headquarters: string;
  tagline: string;
  description: string;
  projectsCount: number;
  handoverRate: string;
  featuredProjects: string[];
}

export interface OffPlanProject {
  id: string;
  title: string;
  developer: string;
  emirate: 'Dubai' | 'Abu Dhabi' | 'Sharjah' | 'Ras Al Khaimah' | 'Umm Al Quwain';
  location: string;
  startingPrice: number;
  handoverDate: string;
  paymentPlan: string;
  type: string;
  image: string;
  units: string;
  highlights: string[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  experience: string;
  licenseNumber: string;
  languages: string[];
  specialties: string[];
  phone: string;
  whatsapp: string;
  email: string;
  image: string;
  activeListings: number;
  totalDeals: number;
}

export interface DLDTransaction {
  id: string;
  type: 'sale' | 'rent';
  property: string;
  community: string;
  price: number;
  areaSqft: number;
  ratePerSqft: number;
  date: string;
  status: 'DLD Registered' | 'Ejari Verified';
}

export interface CommunityGuide {
  id: string;
  name: string;
  emirate: string;
  avgPriceSqft: number;
  rentalYield: string;
  lifestyle: string;
  tag: string;
  image: string;
  description: string;
  highlights: string[];
  schools: string[];
  metroNearby: boolean;
}

export const ALL_PROPERTIES: (Property & {
  category: 'apartment' | 'villa' | 'townhouse' | 'land' | 'commercial' | 'studio' | 'penthouse';
  furnished?: boolean;
  completionYear?: number;
  developer?: string;
})[] = [
  {
    id: 1,
    type: 'apartment',
    category: 'apartment',
    tag: 'Featured Luxury',
    title: 'The Royal Marina Residence',
    location: 'Dubai Marina, Dubai',
    price: 3850000,
    beds: 3,
    baths: 4,
    area: 2150,
    mode: 'buy',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90',
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Breathtaking full marina view luxury residence with floor-to-ceiling panoramic glass, private yacht dock access, marble finishes, and Italian kitchen cabinetry.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Full Marina View', 'Private Berthing Access', 'Smart Home System', 'Infinity Pool', '2 Valet Spaces'],
    furnished: true,
    developer: 'Select Group'
  },
  {
    id: 2,
    type: 'villa',
    category: 'villa',
    tag: 'Signature Collection',
    title: 'Palm Jumeirah Waterfrond Villa',
    location: 'Frond G, Palm Jumeirah, Dubai',
    price: 28500000,
    beds: 6,
    baths: 7,
    area: 8400,
    mode: 'buy',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=90',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Direct beachfront mansion with private white sandy beach, heated infinity pool facing the Dubai Marina skyline, bespoke European furnishings, and cinema room.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Private Beach Access', 'Heated Infinity Pool', 'Skyline View', 'Private Elevator', 'Private Cinema', 'Maid & Driver Quarters'],
    furnished: true,
    developer: 'Nakheel'
  },
  {
    id: 3,
    type: 'apartment',
    category: 'penthouse',
    tag: 'Trophy Asset',
    title: 'Downtown Burj Crown Penthouse',
    location: 'Downtown Dubai, Dubai',
    price: 16500000,
    beds: 4,
    baths: 5,
    area: 5200,
    mode: 'buy',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=90',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Duplex sky penthouse towering directly over Burj Khalifa and the Dubai Fountains. Features a private cantilevered terrace, temperature-controlled wine cellar, and private lift.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Burj Khalifa View', 'Duplex Terrace', 'Private Jacuzzi', 'Concierge & Butler', 'Designer Kitchen'],
    furnished: true,
    developer: 'Emaar Properties'
  },
  {
    id: 4,
    type: 'villa',
    category: 'villa',
    tag: 'Exclusive Golf Estate',
    title: 'Fairway Vista Mansion',
    location: 'Dubai Hills Estate, Dubai',
    price: 14200000,
    beds: 5,
    baths: 6,
    area: 6800,
    mode: 'buy',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Overlooking the 18-hole championship golf course with uninterrupted fairway vistas. Features minimalist architectural lines, sunken lounge, and expansive landscaped gardens.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Championship Golf Course View', 'Lush Private Garden', 'Double-Height Ceilings', 'Chef Kitchen', 'Gated Community'],
    furnished: false,
    developer: 'Emaar Properties'
  },
  {
    id: 5,
    type: 'townhouse',
    category: 'townhouse',
    tag: 'Family Living',
    title: 'Maple Parkside Townhouse',
    location: 'Dubai Hills Estate, Dubai',
    price: 4300000,
    beds: 4,
    baths: 4,
    area: 2850,
    mode: 'buy',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90',
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Contemporary park-facing end-unit townhouse in high demand with open-plan layout, private rooftop terrace, shaded pergolas, and proximity to King’s College Hospital.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Park Facing', 'End Unit', 'Rooftop Terrace', 'Private Garden', 'Community Clubhouse'],
    furnished: false,
    developer: 'Emaar Properties'
  },
  {
    id: 6,
    type: 'apartment',
    category: 'apartment',
    tag: 'High Yield',
    title: 'Canal Heights Executive Suite',
    location: 'Business Bay, Dubai',
    price: 175000,
    beds: 2,
    baths: 2,
    area: 1350,
    mode: 'rent',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=90',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Ultra-modern Dubai Canal front residence offering floor-to-ceiling views of the waterway, rapid access to DIFC, and complete 5-star hotel style amenities.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Dubai Canal View', 'Fully Furnished', 'Infinity Lap Pool', 'Direct Promenade Access'],
    furnished: true,
    developer: 'DAMAC'
  },
  {
    id: 7,
    type: 'apartment',
    category: 'studio',
    tag: 'Executive Rental',
    title: 'Opus Modern Studio Suite',
    location: 'Business Bay, Dubai',
    price: 110000,
    beds: 0,
    baths: 1,
    area: 680,
    mode: 'rent',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=90',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Zaha Hadid designed iconic residence with bespoke fluid furniture, mood lighting, smart app controls, and private valet service. Ideal for international executives.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Zaha Hadid Design', 'Fully Serviced', 'High ROI Location', 'Spa Access'],
    furnished: true,
    developer: 'Omniyat'
  },
  {
    id: 8,
    type: 'villa',
    category: 'villa',
    tag: 'Luxury Lease',
    title: 'Sanctuary Luxury Villa',
    location: 'District One, MBR City, Dubai',
    price: 650000,
    beds: 5,
    baths: 6,
    area: 7100,
    mode: 'rent',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=90',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Steps away from the world-famous Crystal Lagoon. Modern Mediterranean architecture, private pool, outdoor BBQ pavilion, and floor-to-ceiling glass.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['Crystal Lagoon Access', 'Private Swimming Pool', 'Smart Automation', 'Landscaped Grounds'],
    furnished: true,
    developer: 'Meydan Sobha'
  },
  {
    id: 9,
    type: 'commercial',
    category: 'commercial',
    tag: 'Grade A Commercial',
    title: 'ICD Brookfield Place Office Floor',
    location: 'DIFC, Dubai',
    price: 12500000,
    beds: 0,
    baths: 4,
    area: 5800,
    mode: 'buy',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=90',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'LEED Platinum certified ultra-prime commercial headquarters in DIFC financial center. Features panoramic glass, private boardroom suites, and high-speed fiber infrastructure.',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    features: ['DIFC Financial Freezone', 'LEED Platinum', 'Dedicated Executive Lifts', '14 Reserved Car Bays'],
    furnished: true,
    developer: 'Brookfield'
  },
  {
    id: 10,
    type: 'land',
    category: 'land',
    tag: 'Rare Island Plot',
    title: 'Jumeirah Bay Island Villa Plot',
    location: 'Jumeirah Bay Island, Dubai',
    price: 42000000,
    beds: 0,
    baths: 0,
    area: 16500,
    mode: 'buy',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=90',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=90'
    ],
    description: 'Seahorse-shaped private island hosting the Bulgari Resort. Exclusive residential plot with permit for custom 4-story luxury mansion and private mega-yacht berth.',
    features: ['Bulgari Island Address', 'Private Beachfront & Berth', 'G+2+Rooftop Approval', 'Ultra High Privacy'],
    developer: 'Meraas'
  }
];

export const DEVELOPERS: Developer[] = [
  {
    id: 'emaar',
    name: 'Emaar Properties',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Emaar_Properties_logo.svg/512px-Emaar_Properties_logo.svg.png',
    founded: 1997,
    headquarters: 'Downtown Dubai, UAE',
    tagline: 'The Master Developer of Burj Khalifa & Downtown Dubai',
    description: 'Emaar Properties is the global master architect behind Dubai’s most legendary monuments including the Burj Khalifa, The Dubai Mall, Dubai Opera, and master communities like Dubai Hills Estate and Emaar Beachfront.',
    projectsCount: 145,
    handoverRate: '98.5%',
    featuredProjects: ['Burj Crown', 'Dubai Hills Estate', 'Creek Waters', 'Emaar Beachfront', 'The Oasis']
  },
  {
    id: 'damac',
    name: 'DAMAC Properties',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Damac_Properties_logo.svg/512px-Damac_Properties_logo.svg.png',
    founded: 2002,
    headquarters: 'DIFC, Dubai, UAE',
    tagline: 'Luxury Living Through World-Class Haute Brand Alliances',
    description: 'Pioneers in high-fashion branded luxury living collaborating with Cavalli, de GRISOGONO, and Fendi Casa. World famous for Mediterranean-themed crystal water communities including DAMAC Lagoons and DAMAC Hills.',
    projectsCount: 98,
    handoverRate: '94.2%',
    featuredProjects: ['DAMAC Lagoons', 'Cavalli Tower', 'Safa One & Two', 'DAMAC Hills 2', 'Canal Heights']
  },
  {
    id: 'danube',
    name: 'Danube Properties',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Danube_Properties_Logo.svg/512px-Danube_Properties_Logo.svg.png',
    founded: 1993,
    headquarters: 'Dubai, UAE',
    tagline: 'Pioneers of the 1% Monthly Payment Plan',
    description: 'One of the fastest-growing private developers in the UAE, famous for fully-furnished luxury residences, 40+ resort-style lifestyle amenities, and the revolutionary 1% monthly payment plan without interest.',
    projectsCount: 38,
    handoverRate: '99.4%',
    featuredProjects: ['Oceanz by Danube', 'Diamondz at JLT', 'Sportz by Danube', 'Bayz 101', 'Viewz by Aston Martin']
  },
  {
    id: 'sobha',
    name: 'Sobha Realty',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sobha_Realty_Logo.svg/512px-Sobha_Realty_Logo.svg.png',
    founded: 1976,
    headquarters: 'Sobha Hartland, Dubai, UAE',
    tagline: 'The Art of the Detail · 100% Backward Integration',
    description: 'Renowned worldwide for unmatched craftsmanship, architectural perfection, and zero-defect handovers through its self-contained in-house engineering and manufacturing ecosystem.',
    projectsCount: 52,
    handoverRate: '99.2%',
    featuredProjects: ['Sobha Hartland II', 'Sobha SeaHaven', 'Verde at JLT', 'Sobha Reserve', 'Sobha Siniya Island']
  },
  {
    id: 'aldar',
    name: 'Aldar Properties',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Aldar_Properties_logo.svg/512px-Aldar_Properties_logo.svg.png',
    founded: 2004,
    headquarters: 'Al Raha Beach, Abu Dhabi, UAE',
    tagline: 'Abu Dhabi’s Sovereign Master Developer & UAE Innovator',
    description: 'The master builder behind Saadiyat Cultural District, Yas Island, and world-class prime addresses in Abu Dhabi, Dubai, and Ras Al Khaimah in partnership with Nobu, Louvre, and Mandarin Oriental.',
    projectsCount: 65,
    handoverRate: '98.1%',
    featuredProjects: ['Louvre Residences', 'Nobu Residences Saadiyat', 'Haven by Aldar (Dubai)', 'Nikki Beach RAK']
  },
  {
    id: 'azizi',
    name: 'Azizi Developments',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Azizi_Developments_Logo.svg/512px-Azizi_Developments_Logo.svg.png',
    founded: 2007,
    headquarters: 'Conrad Hotel, SZR, Dubai, UAE',
    tagline: 'Modern Residences in Prime Growth Corridors',
    description: 'A major private developer delivering French-Mediterranean waterfront communities, crystal lagoon master destinations (Azizi Venice), and the upcoming Burj Azizi, the world’s second tallest tower.',
    projectsCount: 82,
    handoverRate: '93.5%',
    featuredProjects: ['Riviera Meydan', 'Azizi Venice', 'Burj Azizi', 'Mina Palm Jumeirah', 'Azizi Milan']
  }
];

export const OFF_PLAN_PROJECTS: OffPlanProject[] = [
  {
    id: 'creek-waters',
    title: 'Creek Waters Sanctuary',
    developer: 'Emaar Properties',
    emirate: 'Dubai',
    location: 'Dubai Creek Harbour, Dubai',
    startingPrice: 2200000,
    handoverDate: 'Q4 2027',
    paymentPlan: '80/20 on Handover',
    type: 'Apartments & Penthouses',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    units: '1, 2, 3 & 4 Bedroom Residences',
    highlights: ['Waterfront Marina Walk', 'Infinity Lagoon Pool', 'Direct Metro Link', 'Unobstructed Downtown Skyline Views']
  },
  {
    id: 'damac-lagoons-morocco',
    title: 'DAMAC Lagoons — Morocco Cluster',
    developer: 'DAMAC Properties',
    emirate: 'Dubai',
    location: 'Hessa Street, Dubailand',
    startingPrice: 3100000,
    handoverDate: 'Q2 2026',
    paymentPlan: '70/30 on Completion',
    type: 'Luxury Villas & Townhouses',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    units: '4, 5 & 6 Bedroom Mediterranean Mansions',
    highlights: ['Swarovski Crystal Lagoons', 'Authentic Moroccan Spa', 'Private Floating Amphitheatre', 'Botanical Gardens']
  },
  {
    id: 'nobu-saadiyat',
    title: 'Nobu Residences Saadiyat',
    developer: 'Aldar Properties',
    emirate: 'Abu Dhabi',
    location: 'Saadiyat Cultural District, Abu Dhabi',
    startingPrice: 4800000,
    handoverDate: 'Q1 2027',
    paymentPlan: '60/40 on Completion',
    type: 'Branded Luxury Residences',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
    units: '1 to 3 Bed Apartments & Sky Villas',
    highlights: ['Walking Distance to Louvre Abu Dhabi & Guggenheim', 'Private Nobu Beach Club', 'Michelin-Starred In-Residence Dining']
  },
  {
    id: 'marjan-wynn-residences',
    title: 'Marjan Island Oceanfront Residences',
    developer: 'RAK Properties & JSG Curated',
    emirate: 'Ras Al Khaimah',
    location: 'Al Marjan Island, Ras Al Khaimah',
    startingPrice: 1950000,
    handoverDate: 'Q3 2027',
    paymentPlan: '50/50 Post-Handover 2 Years',
    type: 'Waterfront Resort Apartments',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
    units: 'Studios, 1 & 2 Bedroom Suites',
    highlights: ['Adjacent to Multi-Billion Dollar Wynn Resort & Gaming Casino', 'Projected 14% Capital Appreciation', 'Full Sea Views']
  },
  {
    id: 'oceanz-danube',
    title: 'Oceanz by Danube — Maritime City',
    developer: 'Danube Properties',
    emirate: 'Dubai',
    location: 'Dubai Maritime City, Dubai',
    startingPrice: 1350000,
    handoverDate: 'Q1 2027',
    paymentPlan: '1% Monthly Payment Plan (65/35 Post-Handover)',
    type: 'Luxury Italian-Furnished Waterfront Towers',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
    units: 'Studios, 1, 2 & 3 Bedroom Ocean Suites',
    highlights: ['Interiors & Furnishings by Tonino Lamborghini Casa', '40+ Resort Amenities & Infinity Sky Pool', 'Direct Arabian Gulf Panoramic Views', '1% Monthly Interest-Free Plan']
  },
  {
    id: 'sobha-seahaven',
    title: 'Sobha SeaHaven — Dubai Marina Sky Edition',
    developer: 'Sobha Realty',
    emirate: 'Dubai',
    location: 'Dubai Harbour, Dubai Marina',
    startingPrice: 3800000,
    handoverDate: 'Q4 2026',
    paymentPlan: '80/20 on Handover',
    type: 'Ultra-Luxury Waterfront Sky Residences',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    units: '1, 2, 3 & 4 Bedroom Sky Mansions',
    highlights: ['360-Degree Views of Palm Jumeirah & Ain Dubai', 'Private Yacht Harbour Access', 'Miele Kitchen Appliances & Smart Home Automation']
  },
  {
    id: 'aljada-sharjah',
    title: 'Naseej District Luxury Lofts',
    developer: 'Arada',
    emirate: 'Sharjah',
    location: 'Aljada, University City, Sharjah',
    startingPrice: 780000,
    handoverDate: 'Q4 2025',
    paymentPlan: '40/60 on Handover',
    type: 'Smart Urban Residences',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
    units: 'Studios, 1 & 2 Bed Lofts',
    highlights: ['Sharjah’s Downtown Destination', 'Designed by Zaha Hadid Architects', 'Zero Tax Freehold Ownership for All Nationalities']
  }
];

export const JSG_AGENTS: Agent[] = [
  {
    id: 'tariq-mansoor',
    name: 'Tariq Mansoor',
    role: 'Senior Private Client Advisor · Prime Dubai',
    experience: '12 Years in Dubai Real Estate',
    licenseNumber: 'BRN-48192',
    languages: ['English', 'Arabic', 'French'],
    specialties: ['Palm Jumeirah Ultra-Prime', 'Emirates Hills Mansions', 'Family Offices'],
    phone: '+971 4 320 2030',
    whatsapp: '97143202030',
    email: 'tariq.m@jsgrealestate.ae',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=85',
    activeListings: 18,
    totalDeals: 165
  },
  {
    id: 'sophia-al-hashemi',
    name: 'Sophia Al Hashemi',
    role: 'Managing Director · Off-Plan Investments',
    experience: '10 Years in UAE Real Estate',
    licenseNumber: 'BRN-39201',
    languages: ['English', 'Arabic', 'Russian'],
    specialties: ['Emaar & Sobha Portfolios', 'Golden Visa Advisory', 'High Yield Portfolios'],
    phone: '+971 4 320 2030',
    whatsapp: '97143202030',
    email: 'sophia@jsgrealestate.ae',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85',
    activeListings: 24,
    totalDeals: 210
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Head of Waterfront & Marina Residences',
    experience: '8 Years in International Real Estate',
    licenseNumber: 'BRN-52918',
    languages: ['English', 'German'],
    specialties: ['Dubai Marina Penthouses', 'JBR & Bluewaters', 'Yacht Berthing Estates'],
    phone: '+971 4 320 2030',
    whatsapp: '97143202030',
    email: 'marcus@jsgrealestate.ae',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=85',
    activeListings: 14,
    totalDeals: 120
  }
];

export const DLD_TRANSACTIONS: DLDTransaction[] = [
  {
    id: 'TX-98214',
    type: 'sale',
    property: 'Marina Gate Tower 1 · 3 Bed',
    community: 'Dubai Marina',
    price: 4200000,
    areaSqft: 2150,
    ratePerSqft: 1953,
    date: '11 Sep 2026',
    status: 'DLD Registered'
  },
  {
    id: 'TX-98213',
    type: 'sale',
    property: 'Burj Crown Residence · 2 Bed',
    community: 'Downtown Dubai',
    price: 3150000,
    areaSqft: 1250,
    ratePerSqft: 2520,
    date: '10 Sep 2026',
    status: 'DLD Registered'
  },
  {
    id: 'TX-98212',
    type: 'sale',
    property: 'Palm Jumeirah Signature Villa',
    community: 'Palm Jumeirah',
    price: 34500000,
    areaSqft: 7800,
    ratePerSqft: 4423,
    date: '09 Sep 2026',
    status: 'DLD Registered'
  },
  {
    id: 'TX-98211',
    type: 'rent',
    property: 'Fairway Vistas Villa · 5 Bed',
    community: 'Dubai Hills Estate',
    price: 680000,
    areaSqft: 6800,
    ratePerSqft: 100,
    date: '08 Sep 2026',
    status: 'Ejari Verified'
  },
  {
    id: 'TX-98210',
    type: 'rent',
    property: 'Canal Heights Executive Suite',
    community: 'Business Bay',
    price: 165000,
    areaSqft: 1350,
    ratePerSqft: 122,
    date: '07 Sep 2026',
    status: 'Ejari Verified'
  }
];

export const COMMUNITY_GUIDES: CommunityGuide[] = [
  {
    id: 'downtown-dubai',
    name: 'Downtown Dubai',
    emirate: 'Dubai',
    avgPriceSqft: 2650,
    rentalYield: '6.8% - 7.5%',
    lifestyle: 'Cosmopolitan Luxury & Landmark Icon Living',
    tag: 'The Centre of Now',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    description: 'The crown jewel of Dubai. Home to the Burj Khalifa, Dubai Mall, and Dubai Opera. High-density luxury vertical living with unmatched prestige.',
    highlights: ['Burj Khalifa views', 'Direct indoor air-conditioned link to Dubai Mall', 'High capital appreciation', 'Global tourist destination'],
    schools: ['Hartland International School (10 mins)', 'JSS Private School', 'Dubai International Financial Centre Academy'],
    metroNearby: true
  },
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    emirate: 'Dubai',
    avgPriceSqft: 4200,
    rentalYield: '5.5% - 6.2%',
    lifestyle: 'World-Renowned Island Beachfront Luxury',
    tag: 'Eighth Wonder of the World',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7852?auto=format&fit=crop&w=1200&q=85',
    description: 'An iconic man-made archipelago offering private beachfront living, five-star resorts like Atlantis The Royal, and Michelin-starred culinary dining.',
    highlights: ['Private beachfronts', 'Atlantis The Royal & One&Only nearby', 'Helipad access', 'High privacy for ultra-high-net-worth individuals'],
    schools: ['Regent International School (12 mins)', 'GEMS Wellington International (15 mins)'],
    metroNearby: false
  },
  {
    id: 'dubai-hills-estate',
    name: 'Dubai Hills Estate',
    emirate: 'Dubai',
    avgPriceSqft: 2100,
    rentalYield: '7.1% - 8.2%',
    lifestyle: 'The Green Heart of Dubai · Family Championship Golf',
    tag: 'Premier Family Community',
    image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=85',
    description: 'Masterfully planned around an 18-hole championship golf course and expansive central park. Features Dubai Hills Mall, Kings College Hospital, and top British curriculum schools.',
    highlights: ['Championship 18-hole golf course', 'Dubai Hills Mall with indoor coaster', 'Huge central park', 'British international schools on-site'],
    schools: ['GEMS Wellington Academy', 'GEMS New Millennium School', 'King’s College Hospital on-site'],
    metroNearby: false
  },
  {
    id: 'dubai-marina',
    name: 'Dubai Marina',
    emirate: 'Dubai',
    avgPriceSqft: 1950,
    rentalYield: '7.4% - 8.6%',
    lifestyle: 'Vibrant Waterfront Living & Yachting Promenade',
    tag: 'Highest Liquidity Area',
    image: 'https://images.unsplash.com/photo-1523112075569-f39f307e7f07?auto=format&fit=crop&w=1200&q=85',
    description: 'A 3.5-kilometer canal lined with over 200 luxury residential skyscrapers, al fresco dining, Dubai Marina Mall, and direct access to JBR beaches.',
    highlights: ['7km pedestrian marina walkway', 'Direct Dubai Tram & Metro connections', 'Exceptional short-term rental yields', 'Walking distance to beach'],
    schools: ['Emirates International School Meadows', 'Dubai British School JVT'],
    metroNearby: true
  }
];
