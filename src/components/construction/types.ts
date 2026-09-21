export interface MilestoneInfo {
  id: string;
  number: string;
  title: string;
  shortLabel: string;
  category: string;
  subtitle: string;
  technicalSpecs: {
    label: string;
    value: string;
  }[];
  inspectorQuote: string;
  targetProgress: number; // 0.0 to 1.0
}

export const CONSTRUCTION_MILESTONES: MilestoneInfo[] = [
  {
    id: 'land',
    number: '01',
    title: 'EMPTY LAND & SITE SURVEY',
    shortLabel: 'LAND',
    category: 'CIVIL & GEOTECHNICAL',
    subtitle: 'Precision site levelling, geotechnical soil stabilization, and high-accuracy GNSS boundary coordinates.',
    technicalSpecs: [
      { label: 'Plot Area', value: '16,250 SQFT' },
      { label: 'Survey Accuracy', value: '±1.5 mm GNSS' },
      { label: 'Soil Bearing Cap.', value: '280 kN/m²' },
      { label: 'Site Clearance', value: '100% Certified' }
    ],
    inspectorQuote: 'Topography verified with millimeter-accurate Leica total station; baseline soil strata approved for luxury villa loads.',
    targetProgress: 0.04
  },
  {
    id: 'foundation',
    number: '02',
    title: 'EXCAVATION & FOUNDATION',
    shortLabel: 'FOUNDATION',
    category: 'SUBSTRUCTURE WORKS',
    subtitle: 'Deep tiered excavation pit, dual-layer steel rebar cages, and monolithic sulfate-resistant concrete raft foundation.',
    technicalSpecs: [
      { label: 'Pit Depth', value: '-4.80 M' },
      { label: 'Earth Displaced', value: '4,650 M³' },
      { label: 'Rebar Diameter', value: '32mm High-Tensile' },
      { label: 'Concrete Grade', value: 'C45/55 Durability' }
    ],
    inspectorQuote: 'Heavy hydraulic excavators and ironworkers coordinate seamless monolithic raft pour with dual waterproofing membrane.',
    targetProgress: 0.16
  },
  {
    id: 'structure',
    number: '03',
    title: 'STEEL FRAMEWORK & SLABS',
    shortLabel: 'STRUCTURE',
    category: 'SUPERSTRUCTURE',
    subtitle: 'ASTM A992 structural steel flanged columns, moment connections, and post-tensioned cantilevered concrete floor slabs.',
    technicalSpecs: [
      { label: 'Steel Framework', value: '380 Metric Tonnes' },
      { label: 'Cantilever Overhang', value: '5.20 M Floating' },
      { label: 'Slab Thickness', value: '280 mm Solid' },
      { label: 'Floor-to-Ceiling', value: '3.90 M Clear' }
    ],
    inspectorQuote: 'Tower crane hoists prefabricated I-beams; ultrasonic tests verify 100% torque compliance across all primary moment joints.',
    targetProgress: 0.30
  },
  {
    id: 'walls',
    number: '04',
    title: 'BRICK & BLOCK MASONRY',
    shortLabel: 'WALLS',
    category: 'BUILDING ENVELOPE',
    subtitle: 'Autoclaved aerated concrete (AAC) thermal masonry blocks forming interior room partitions and exterior thermal envelope.',
    technicalSpecs: [
      { label: 'Block Density', value: '550 kg/m³ AAC' },
      { label: 'Thermal U-Value', value: '0.22 W/m²K' },
      { label: 'Acoustic Rating', value: '56 dB Isolation' },
      { label: 'Fire Endurance', value: '4-Hour Rated UL' }
    ],
    inspectorQuote: 'Precision staggered running bond blockwork defines grand living salons, ensuite corridors, and thermal perimeter insulation.',
    targetProgress: 0.44
  },
  {
    id: 'services',
    number: '05',
    title: 'MEP SERVICES & ANATOMY',
    shortLabel: 'SERVICES',
    category: 'BUILDING SYSTEMS',
    subtitle: 'Galvanized HVAC ductwork, dual PEX domestic water lines, EMT electrical conduits, cable trays, and internal plumbing stacks.',
    technicalSpecs: [
      { label: 'HVAC Ductwork', value: 'Galvanized VRF System' },
      { label: 'Plumbing Circuit', value: 'Dual PEX-A Isolated' },
      { label: 'Smart Home Bus', value: 'KNX / DALI Protocol' },
      { label: 'Drainage Acoustic', value: 'Silent PVC Stacks' }
    ],
    inspectorQuote: 'Architectural cutaway highlights integrated building anatomy concealed behind acoustic ceiling drops and service shafts.',
    targetProgress: 0.58
  },
  {
    id: 'facade',
    number: '06',
    title: 'FACADE, GLAZING & CLADDING',
    shortLabel: 'FACADE',
    category: 'EXTERIOR ARCHITECTURE',
    subtitle: 'Floor-to-ceiling Low-E glass curtain walls, slim champagne bronze mullions, seamless glass balustrades, and honed Roman travertine.',
    technicalSpecs: [
      { label: 'Glazing Spec', value: 'Triple Silver Low-E' },
      { label: 'UV Rejection', value: '99.5% Solar Barrier' },
      { label: 'Stone Cladding', value: 'Honed Roman Travertine' },
      { label: 'Profile Finish', value: 'Anodized Bronze' }
    ],
    inspectorQuote: 'High-performance solar thermal facade minimizes heat ingress while framing panoramic vistas with crystalline transparency.',
    targetProgress: 0.72
  },
  {
    id: 'interior',
    number: '07',
    title: 'INTERIOR FIT-OUT & FURNITURE',
    shortLabel: 'INTERIOR',
    category: 'LUXURY LIVING SPACES',
    subtitle: 'Book-matched Calacatta Gold marble flooring, architectural cove lighting, Italian kitchen island, and bespoke curated designer salon.',
    technicalSpecs: [
      { label: 'Marble Slab', value: 'Calacatta Gold 240x120' },
      { label: 'Kitchen Island', value: 'Waterfall Marble Craft' },
      { label: 'Living Salon', value: 'Bespoke Bouclé Suites' },
      { label: 'Ceiling Detail', value: 'Warm 3000K Cove LED' }
    ],
    inspectorQuote: 'Camera glides into the grand interior salon, witnessing the transformation from architectural raw space to turnkey luxury living.',
    targetProgress: 0.86
  },
  {
    id: 'complete',
    number: '08',
    title: 'COMPLETED SIGNATURE RESIDENCE',
    shortLabel: 'COMPLETE',
    category: 'ARCHITECTURAL MASTERPIECE',
    subtitle: 'The fully realized luxury sanctuary: illuminated private infinity pool, sculpted date palms, motor court, and evening ambiance.',
    technicalSpecs: [
      { label: 'Total Built-Up', value: '12,800 SQFT' },
      { label: 'Private Pool', value: 'Negative-Edge Infinity' },
      { label: 'Landscaping', value: 'Royal Palms & Lawns' },
      { label: 'Handover Status', value: '100% Turnkey Ready' }
    ],
    inspectorQuote: 'A generational estate where cutting-edge engineering harmony culminates in the epitome of Dubai luxury living.',
    targetProgress: 0.98
  }
];
