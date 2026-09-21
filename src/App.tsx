import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer, defaultViewport } from './lib/animations';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Radio, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  ExternalLink,
  Wrench,
  CheckCircle2,
  Video
} from 'lucide-react';

import { SmartHeader } from './components/SmartHeader';
import { JSGLogo } from './components/JSGLogo';
import { PropertyModal } from './components/PropertyModal';
import { HomePage } from './pages/HomePage';
import { BuyPage } from './pages/BuyPage';
import { RentPage } from './pages/RentPage';
import { SellPage } from './pages/SellPage';
import { NewProjectsPage } from './pages/NewProjectsPage';
import { MortgageCalculatorPage } from './pages/MortgageCalculatorPage';
import { RentVsBuyPage } from './pages/RentVsBuyPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { MarketReportsPage } from './pages/MarketReportsPage';
import { GuidesPage } from './pages/GuidesPage';
import { AreasPage } from './pages/AreasPage';
import { AgentsPage } from './pages/AgentsPage';
import { LiveShowcasePage } from './pages/LiveShowcasePage';
import { DiagnosticsPanel } from './components/DiagnosticsPanel';
import { WebsiteClonerSpec } from './components/WebsiteClonerSpec';
import { Property } from './types/jsg';
import jsgRawData from './jsgData.json';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { DynamicPage } from './pages/DynamicPage';
import { AIConciergeWidget } from './components/AIConciergeWidget';
import { CurtainPreloader } from './components/CurtainPreloader';
import { FloatingCursor } from './components/FloatingCursor';
import { AdminControlCenter } from './pages/admin/AdminControlCenter';

const data = jsgRawData as any;

// ScrollToTop on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { settings, tables } = useSiteData();

  const footerRow = tables?.jsg_footer?.[0] || {};
  const headerRow = tables?.jsg_header?.[0] || {};

  const footerData = {
    description: footerRow.about || settings?.footer?.description || data.footer.description,
    copyright: footerRow.copyright_text || settings?.footer?.copyright || data.footer.copyright
  };

  const contactData = {
    company: headerRow.company_name || settings?.contact?.company || data.contact.company,
    location: footerRow.address || settings?.contact?.location || data.contact.location,
    phone: footerRow.phone || settings?.contact?.phone || data.contact.phone,
    email: footerRow.email || settings?.contact?.email || data.contact.email,
    whatsapp: settings?.contact?.whatsapp || data.contact?.whatsapp
  };
  const reraNum = settings?.reraLicense || '19284';

  return (
    <div className="min-h-screen bg-[#fbf9f4] text-[#1c1917] font-sans selection:bg-[#b58b4a] selection:text-white flex flex-col">
      <ScrollToTop />

      {/* Dev.UN-Style Architectural Curtain Reveal & Magnetic Floating Follow Cursor */}
      <CurtainPreloader />
      <FloatingCursor />

      {/* 1. Global 3D Smart Sticky Header */}
      <SmartHeader
        currentPath={location.pathname}
        onNavigate={(path) => navigate(path)}
      />

      {/* 2. Main Page Routing Outlet */}
      <main className="flex-1">
        <Routes>
          {/* Home */}
          <Route 
            path="/" 
            element={
              <HomePage 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />

          {/* Buy Routes */}
          <Route 
            path="/buy" 
            element={
              <BuyPage 
                initialCategory="all" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/buy/apartments" 
            element={
              <BuyPage 
                initialCategory="apartments" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/buy/villas" 
            element={
              <BuyPage 
                initialCategory="villas" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/buy/townhouses" 
            element={
              <BuyPage 
                initialCategory="townhouses" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/buy/land" 
            element={
              <BuyPage 
                initialCategory="land" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/buy/commercial" 
            element={
              <BuyPage 
                initialCategory="commercial" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/buy/mortgage-calculator" 
            element={<MortgageCalculatorPage onNavigate={navigate} />} 
          />
          <Route 
            path="/buy/sold-prices" 
            element={<TransactionsPage initialType="sale" onNavigate={navigate} />} 
          />
          <Route 
            path="/buy/price-map" 
            element={<AreasPage onNavigate={navigate} />} 
          />

          {/* Rent Routes */}
          <Route 
            path="/rent" 
            element={
              <RentPage 
                initialCategory="all" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/rent/apartments" 
            element={
              <RentPage 
                initialCategory="apartments" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/rent/studios" 
            element={
              <RentPage 
                initialCategory="studios" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/rent/villas" 
            element={
              <RentPage 
                initialCategory="villas" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/rent/townhouses" 
            element={
              <RentPage 
                initialCategory="townhouses" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/rent/commercial" 
            element={
              <RentPage 
                initialCategory="commercial" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/rent/monthly" 
            element={
              <RentPage 
                initialCategory="all" 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
          <Route 
            path="/rent/rent-vs-buy" 
            element={<RentVsBuyPage onNavigate={navigate} />} 
          />
          <Route 
            path="/rent/rented-prices" 
            element={<TransactionsPage initialType="rent" onNavigate={navigate} />} 
          />
          <Route 
            path="/rent/price-map" 
            element={<AreasPage onNavigate={navigate} />} 
          />

          {/* Sell Route */}
          <Route path="/sell" element={<SellPage onNavigate={navigate} />} />

          {/* Off-Plan / New Projects */}
          <Route 
            path="/new-projects" 
            element={<NewProjectsPage initialEmirate="All" onNavigate={navigate} />} 
          />
          <Route 
            path="/new-projects/dubai" 
            element={<NewProjectsPage initialEmirate="Dubai" onNavigate={navigate} />} 
          />
          <Route 
            path="/new-projects/abu-dhabi" 
            element={<NewProjectsPage initialEmirate="Abu Dhabi" onNavigate={navigate} />} 
          />
          <Route 
            path="/new-projects/sharjah" 
            element={<NewProjectsPage initialEmirate="Sharjah" onNavigate={navigate} />} 
          />
          <Route 
            path="/new-projects/rak" 
            element={<NewProjectsPage initialEmirate="Ras Al Khaimah" onNavigate={navigate} />} 
          />
          <Route 
            path="/new-projects/developers" 
            element={<NewProjectsPage initialView="developers" onNavigate={navigate} />} 
          />

          {/* Tools & Calculators */}
          <Route path="/tools" element={<MarketReportsPage onNavigate={navigate} />} />
          <Route path="/tools/mortgage-calculator" element={<MortgageCalculatorPage onNavigate={navigate} />} />
          <Route path="/tools/rent-vs-buy" element={<RentVsBuyPage onNavigate={navigate} />} />
          <Route path="/tools/market-reports" element={<MarketReportsPage onNavigate={navigate} />} />
          <Route path="/tools/sale-transactions" element={<TransactionsPage initialType="sale" onNavigate={navigate} />} />
          <Route path="/tools/rental-transactions" element={<TransactionsPage initialType="rent" onNavigate={navigate} />} />

          {/* Guides & Insights */}
          <Route path="/insights" element={<GuidesPage initialTab="buyers" onNavigate={navigate} />} />
          <Route path="/insights/buyers-guide" element={<GuidesPage initialTab="buyers" onNavigate={navigate} />} />
          <Route path="/insights/renters-guide" element={<GuidesPage initialTab="renters" onNavigate={navigate} />} />
          <Route path="/insights/investors-guide" element={<GuidesPage initialTab="investors" onNavigate={navigate} />} />
          <Route path="/insights/area-insights" element={<GuidesPage initialTab="areas" onNavigate={navigate} />} />

          {/* Neighborhood Areas */}
          <Route path="/areas" element={<AreasPage onNavigate={navigate} />} />
          <Route path="/areas/dubai" element={<AreasPage initialArea="downtown-dubai" onNavigate={navigate} />} />
          <Route path="/areas/abu-dhabi" element={<AreasPage initialArea="palm-jumeirah" onNavigate={navigate} />} />
          <Route path="/areas/sharjah" element={<AreasPage initialArea="dubai-hills" onNavigate={navigate} />} />
          <Route path="/areas/ajman" element={<AreasPage initialArea="dubai-marina" onNavigate={navigate} />} />
          <Route path="/areas/ras-al-khaimah" element={<AreasPage initialArea="business-bay" onNavigate={navigate} />} />

          {/* Agents */}
          <Route path="/find-agent" element={<AgentsPage onNavigate={navigate} />} />
          <Route path="/agents" element={<AgentsPage onNavigate={navigate} />} />

          {/* Live Walkthrough Showcase */}
          <Route 
            path="/live-showcase" 
            element={
              <LiveShowcasePage 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />

          {/* Technical Diagnostics */}
          <Route 
            path="/diagnostics" 
            element={
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                <div className="p-6 rounded-2xl bg-[#17362f] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Why Your Live Stream Failed</h2>
                    <p className="text-xs text-[#d9bf8c] mt-1">
                      Technical audit for <strong>control.jsgrealestate.ae</strong> and live stream players
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/live-showcase')}
                    className="px-5 py-2.5 bg-[#b58b4a] hover:bg-[#d9bf8c] text-[#142621] rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    Test Working Stream
                  </button>
                </div>
                <DiagnosticsPanel />
              </div>
            } 
          />

          {/* Rebuilder & Customizer Spec */}
          <Route 
            path="/rebuilder" 
            element={
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                <WebsiteClonerSpec
                  onApplySiteUrl={(url) => {
                    navigate('/live-showcase');
                  }}
                />
              </div>
            } 
          />

          {/* Dynamic Admin CMS Pages */}
          <Route path="/p/:slug" element={<DynamicPage />} />

          {/* Fallback to Home */}
          <Route 
            path="*" 
            element={
              <HomePage 
                onNavigate={navigate} 
                onSelectProperty={(p) => setSelectedProperty(p)} 
              />
            } 
          />
        </Routes>
      </main>

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onNavigate={(path) => {
            setSelectedProperty(null);
            navigate(path);
          }}
        />
      )}

      {/* AI Concierge Floating Voice & Chat Assistant */}
      <AIConciergeWidget />

      {/* Global Luxury Footer - Slim, Clean, Responsive Deep Emerald, Rich Espresso & Royal Gold */}
      <motion.footer 
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeUp}
        className="bg-[#0c241d] text-[#fbfaf7] border-t border-[#b58b4a]/30 mt-12 sm:mt-16 pt-8 sm:pt-10 pb-6 sm:pb-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pb-6 sm:pb-8 border-b border-[#b58b4a]/25">
            {/* Column 1: Brand & Licensing */}
            <div className="space-y-2.5">
              <JSGLogo size="md" theme="dark" showText={true} />
              <p className="text-xs text-[#e2d9cd] leading-relaxed max-w-sm">
                {footerData.description}
              </p>
              <div className="pt-1 text-xs text-[#d9bf8c] font-semibold flex items-center gap-1.5 flex-wrap">
                <ShieldCheck className="w-4 h-4 text-[#34d399] shrink-0" />
                <span>RERA License: {reraNum} · DLD Verified</span>
              </div>
            </div>

            {/* Column 2: Prime Communities */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#d9bf8c] uppercase tracking-wider text-[11px]">Prime Communities</h4>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[#e2d9cd] sm:block sm:space-y-1.5">
                {['Downtown Dubai', 'Palm Jumeirah', 'Dubai Hills Estate', 'Dubai Marina', 'Business Bay', 'Jumeirah Bay Island'].map((name, i) => (
                  <li 
                    key={i} 
                    onClick={() => navigate('/buy')}
                    className="hover:text-[#d9bf8c] cursor-pointer transition-colors truncate"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Corporate Headquarters */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-[#d9bf8c] uppercase tracking-wider text-[11px] mb-2">Corporate Headquarters</h4>
              <p className="text-[#fbfaf7] font-bold">{contactData.company || data.contact.company}</p>
              <p className="text-[#e2d9cd] leading-snug">{contactData.location || data.contact.location}</p>
              <p className="text-[#e2d9cd]">
                Direct Phone:{' '}
                <a href={`tel:${(contactData.phone || data.contact.phone).replace(/[^0-9+]/g, '')}`} className="hover:text-[#d9bf8c] transition-colors">
                  {contactData.phone || data.contact.phone}
                </a>
              </p>
              <p className="text-[#e2d9cd] break-all">
                Email:{' '}
                <a href={`mailto:${contactData.email || data.contact.email}`} className="hover:text-[#d9bf8c] transition-colors">
                  {contactData.email || data.contact.email}
                </a>
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${(contactData.whatsapp || '97143202030').replace(/[^0-9]/g, '')}?text=Hello%20JSG%20Real%20Estate`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15803d] hover:bg-[#16a34a] text-white text-xs font-bold transition-colors shadow"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Column 4: Live Agent Palace Call */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-[#d9bf8c] uppercase tracking-wider text-[11px]">Live Agent Palace Call</h4>
              <p className="text-[#e2d9cd] leading-relaxed">
                Connect with our licensed on-site agent for an instant 4K video inspection and live palace tour.
              </p>
              <button
                type="button"
                onClick={() => navigate('/live-showcase')}
                className="w-full py-2.5 bg-gradient-to-r from-[#b58b4a] via-[#c5a059] to-[#d9bf8c] hover:brightness-110 text-[#0d221c] font-black rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#b58b4a]/50"
              >
                <Video className="w-3.5 h-3.5 text-[#0d221c]" />
                <span>Live Agent Call</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#c4b9a8] gap-3 pt-1">
            <p className="text-center sm:text-left">{footerData.copyright}</p>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <span>{contactData.location || data.footer.location}</span>
              <span>•</span>
              <a 
                href="https://control.jsgrealestate.ae/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#fbfaf7] flex items-center gap-1 transition-colors"
              >
                <span>Original Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteDataProvider>
        <Routes>
          <Route path="/admin" element={<AdminControlCenter />} />
          <Route path="/admin/*" element={<AdminControlCenter />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </SiteDataProvider>
    </BrowserRouter>
  );
}
