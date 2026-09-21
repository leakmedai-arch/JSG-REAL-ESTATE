import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import { Building2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { pages, settings } = useSiteData();

  const page = pages.find(p => p.slug.toLowerCase() === (slug || '').toLowerCase());

  useEffect(() => {
    if (page) {
      document.title = `${page.metaTitle || page.title} | ${settings.siteName}`;
    }
  }, [page, settings.siteName]);

  if (!page) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Building2 className="w-16 h-16 text-[#b58b4a] mb-4 stroke-1" />
        <h1 className="text-3xl font-extrabold text-[#17362f]">Page Not Found</h1>
        <p className="text-slate-500 mt-2 max-w-md">
          The requested luxury page or portfolio guide is unavailable or undergoing review.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 rounded-xl bg-[#17362f] text-[#d9bf8c] font-bold text-sm hover:bg-[#122b25] transition-colors"
        >
          Return to Premier Showcase
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#17211f]">
      {/* Page Hero Header */}
      <section className="bg-gradient-to-b from-[#17362f] via-[#1a3d35] to-[#122923] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#b58b4a]/20">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b58b4a]/20 text-[#d9bf8c] text-xs font-semibold uppercase tracking-widest border border-[#b58b4a]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official JSG Institutional Advisory
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#fbfaf7]">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {page.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Page Blocks Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {page.blocks && page.blocks.map((block) => (
          <div key={block.id} className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
            {block.title && (
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17362f] mb-6 tracking-tight">
                {block.title}
              </h2>
            )}

            {block.content && (
              <div className="prose max-w-none text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap text-base">
                {block.content}
              </div>
            )}

            {block.images && block.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {block.images.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`${block.title || 'Page visual'} ${i + 1}`}
                    className="w-full h-64 object-cover rounded-2xl border border-slate-200"
                  />
                ))}
              </div>
            )}

            {block.buttonText && block.buttonLink && (
              <div className="mt-8">
                <a
                  href={block.buttonLink}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#b58b4a] to-[#d9bf8c] text-[#142621] font-bold text-sm shadow-md hover:scale-[1.02] transition-transform"
                >
                  <span>{block.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        ))}

        {/* Global Page Footer CTA */}
        <div className="rounded-3xl bg-[#17362f] text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#fae7b5]">
              Consult with JSG Private Wealth Office
            </h3>
            <p className="text-sm text-slate-300">
              For discrete inquiries regarding trophy assets, off-market allocations, or Golden Visa applications, speak directly with our senior partners.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${settings.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20JSG%20Real%20Estate,%20I%20am%20inquiring%20about%20${encodeURIComponent(page.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>WhatsApp Private Desk</span>
              </a>
              <a
                href={`tel:${settings.contact.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#fae7b5] font-bold text-sm border border-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <span>Call {settings.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
