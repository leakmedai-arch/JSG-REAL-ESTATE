import React from 'react';
import { ArrowUpRight, Key, Home, Coins, Building2 } from 'lucide-react';

interface ServiceItem {
  id: string;
  number: string;
  title: 'Buy' | 'Rent' | 'Sell' | 'New Projects';
  path: string;
  description: string;
  icon: React.ElementType;
  features: string[];
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'buy',
    number: '01',
    title: 'Buy',
    path: '/buy',
    description: 'Bespoke acquisition advisory for prime penthouses, private island villas, and institutional residential portfolios across Dubai.',
    icon: Home,
    features: ['Off-Market Trophy Portfolios', 'Private Waterfront Estates', 'Due Diligence & Title Deed Registry']
  },
  {
    id: 'rent',
    number: '02',
    title: 'Rent',
    path: '/rent',
    description: 'Ultra-luxury long-term tenancies and serviced branded residences in Downtown Dubai, Palm Jumeirah, and Dubai Marina.',
    icon: Key,
    features: ['Furnished Sky Residences', 'Ejari Verification Guarantee', 'Concierge Tenancy Support']
  },
  {
    id: 'sell',
    number: '03',
    title: 'Sell',
    path: '/sell',
    description: 'Targeted global marketing to qualified ultra-high-net-worth buyers with verified DLD valuation analytics and maximum yield realization.',
    icon: Coins,
    features: ['Global HNW Investor Outreach', 'Official DLD Realized Valuations', 'Bespoke Architectural Media Production']
  },
  {
    id: 'new-projects',
    number: '04',
    title: 'New Projects',
    path: '/new-projects',
    description: 'Direct first-phase developer allocations from Emaar, Nakheel, and Sobha with flexible 80/20 post-handover payment schedules.',
    icon: Building2,
    features: ['Direct Tier-1 Developer Access', 'High Projected Net Yields (8.5%+)', 'UAE Golden Visa Eligibility (AED 2M+)']
  }
];

interface ServicesSectionProps {
  onNavigate: (path: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigate }) => {
  return (
    <section 
      id="services" 
      aria-label="Our Real Estate Services" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
        {/* Pre-Heading: <span> */}
        <span 
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '2.5px',
            fontWeight: 600,
            fontSize: '13px',
            color: '#c5a059',
            textTransform: 'uppercase',
            display: 'inline-block'
          }}
        >
          OUR SERVICES
        </span>

        {/* Main Heading: <h2> */}
        <h2 
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: 'clamp(36px, 4vw, 52px)',
            color: '#1b2e23',
            lineHeight: 1.15,
            fontStyle: 'italic'
          }}
          className="tracking-tight"
        >
          <span className="not-italic font-semibold">One property partner.</span>
        </h2>

        <p 
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#5a655e'
          }}
          className="max-w-xl mx-auto"
        >
          Holistic brokerage solutions curated for discerning buyers, sellers, tenants, and institutional investors.
        </p>
      </div>

      {/* Cards: Slow Infinite Scroll Track */}
      <div className="relative w-full overflow-hidden py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        {/* Soft edge fade masks for seamless entering/exiting effect */}
        <div className="pointer-events-none absolute left-0 inset-y-0 w-12 sm:w-20 bg-gradient-to-r from-[#fbf9f4] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-12 sm:w-20 bg-gradient-to-l from-[#fbf9f4] to-transparent z-10" />

        <div className="animate-marquee-slow flex gap-5 sm:gap-6 py-2">
          {/* Duplicate list 3 times to ensure uninterrupted continuous infinite loop */}
          {[...SERVICES_DATA, ...SERVICES_DATA, ...SERVICES_DATA].map((service, index) => {
            const IconComp = service.icon;
            return (
              <div
                key={`${service.id}-${index}`}
                onClick={() => onNavigate(service.path)}
                data-cursor="Explore"
                className="group relative w-[290px] sm:w-[320px] md:w-[340px] shrink-0 rounded-2xl p-6 sm:p-7 bg-[#fdfbf7] border border-[#e8dfd3] shadow-[0_4px_20px_rgba(27,46,35,0.06)] hover:shadow-[0_20px_40px_rgba(27,46,35,0.14)] hover:border-[#c5a059]/80 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 cursor-pointer flex flex-col justify-between overflow-hidden select-none"
              >
                {/* Glass subtle highlight glow on top border */}
                <div className="absolute top-0 inset-x-6 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
                
                {/* Card Top: 3D Gold Number (01, 02, 03, 04) & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    {/* 3D Gold Number */}
                    <span className="card-number">
                      {service.number}
                    </span>

                    <div className="w-10 h-10 rounded-xl bg-[#1b2e23]/5 border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] group-hover:bg-[#1b2e23] group-hover:text-white transition-all duration-300">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card Subheading: <h3> */}
                  <h3 
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      fontSize: '22px',
                      color: '#1b2e23'
                    }}
                    className="mb-2.5 group-hover:text-[#8c6d33] transition-colors"
                  >
                    {service.title}
                  </h3>

                  {/* Card Description */}
                  <p 
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: '#5a655e'
                    }}
                    className="mb-5"
                  >
                    {service.description}
                  </p>
                </div>

                {/* Card Bottom: Features pill & Arrow */}
                <div className="pt-4 border-t border-[#e8dfd3]/80 space-y-3">
                  <ul className="space-y-1.5 text-xs text-[#5a655e]">
                    {service.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-1.5 text-[12px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#1b2e23] group-hover:text-[#c5a059] transition-colors">
                    <span className="tracking-wide uppercase text-[11px]">Explore {service.title}</span>
                    <div className="w-7 h-7 rounded-full bg-white border border-[#e8dfd3] flex items-center justify-center group-hover:translate-x-1 group-hover:bg-[#1b2e23] group-hover:text-white transition-all shadow-xs">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
