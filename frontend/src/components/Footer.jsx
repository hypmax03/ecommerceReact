import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Mail } from 'iconoir-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 5000);
    }
  };

  return (
    <footer className="w-full bg-[#1A1816] text-[#FAF7F2] overflow-hidden border-t border-[#2C2A29]/20 relative">
      {/* =========================================================================
          1. EXACT EDITORIAL EDITORIAL HERO BANNER ("new arrival")
          ========================================================================= */}
      <section className="relative w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-[21/9] xl:aspect-[2.4/1] min-h-[480px] sm:min-h-[540px] lg:min-h-[620px] bg-[#221B17] overflow-hidden group select-none">
        {/* Background Editorial Photographic Spread */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/editorial_footer_banner.jpg"
            alt="Autumn Winter New Arrival Editorial Campaign"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.04] transition-transform duration-1000 group-hover:scale-[1.02]"
          />
          {/* Subtle cinematic gradient overlays for high contrast typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </div>

        {/* TOP RIGHT: Date & Campaign Timestamp */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-10 lg:top-10 lg:right-14 z-20 text-right text-white/90">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] block text-white/70">
            DATE
          </span>
          <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] font-medium block text-white">
            NOVEMBER _ 09
          </span>
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] block text-white/80">
            2026
          </span>
        </div>

        {/* CENTER: Oval Pill (11.09) + 'new arrival' Title + Season Subtitle */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          {/* 11.09 Oval Outline Pill */}
          <div className="inline-flex items-center justify-center px-5 sm:px-6 py-1 rounded-full border border-white/85 text-white font-serif italic text-xs sm:text-sm tracking-wider mb-2 sm:mb-3 backdrop-blur-[2px] bg-white/5 drop-shadow-sm">
            11.09
          </div>

          {/* Massive Editorial 'new arrival' Title */}
          <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] font-normal lowercase tracking-tight text-white leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-[1.01]">
            new arrival
          </h2>

          {/* Subtitle Line */}
          <p className="font-sans text-[9px] sm:text-[11px] md:text-xs uppercase tracking-[0.35em] text-white/95 mt-3 sm:mt-5 font-light drop-shadow-md">
            2026 AUTUMN WINTER COLLECTION . NOVEMBER.09
          </p>

          {/* Interactive CTA button */}
          <div className="mt-6 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-[#191817] font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] px-6 py-2.5 shadow-xl hover:bg-[#FAF7F2] transition-colors"
            >
              <span>EXPLORE NEW ARRIVALS</span>
              <ArrowUpRight width={13} height={13} />
            </Link>
          </div>
        </div>

        {/* BOTTOM LEFT: 'FOR WOMEN'S CLOTHING' & Autumn Story Prose */}
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 lg:bottom-10 lg:left-14 z-20 max-w-[280px] sm:max-w-sm md:max-w-md text-white/90">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-medium block text-white mb-1.5 drop-shadow-sm">
            FOR WOMEN'S CLOTHING
          </span>
          <p className="font-sans text-[10px] sm:text-xs text-white/85 font-light leading-relaxed drop-shadow-sm">
            Autumn that year painted the countryside in vivid shades of scarlet, saffron, and russet, and the days were clear and crisp under harvest skies.
          </p>
        </div>
      </section>

      {/* =========================================================================
          2. LUXURY ATELIER INFORMATION, NEWSLETTER & NAVIGATION FOOTER
          ========================================================================= */}
      <div className="bg-[#141211] text-[#FAF7F2] pt-16 pb-12 px-6 sm:px-8 lg:px-12 border-t border-[#2C2A29]/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">
            {/* Col 1: Newsletter / Atelier Letters */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-widest text-white">
                  ELORA
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 bg-white/10 text-white/80 border border-white/20 uppercase tracking-widest">
                  EST. 2026
                </span>
              </div>
              <p className="font-sans text-xs text-white/60 font-light leading-relaxed max-w-sm">
                Receive private curated dossiers, textile provenance notes, and invitations to private showroom previews in Milan and Paris.
              </p>

              <form onSubmit={handleSubscribe} className="mt-4 max-w-sm">
                {isSubscribed ? (
                  <div className="p-3 bg-white/10 border border-white/20 flex items-center gap-2 text-xs font-mono text-[#E3D5B8]">
                    <Check width={14} height={14} />
                    <span>THANK YOU. YOU ARE SUBSCRIBED TO ATELIER LETTERS.</span>
                  </div>
                ) : (
                  <div className="flex border border-white/20 focus-within:border-white transition-colors bg-white/5">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="flex-1 bg-transparent px-3.5 py-2.5 text-xs text-[#FAF7F2] placeholder:text-white/40 focus:outline-none font-sans"
                    />
                    <button
                      type="submit"
                      className="px-5 bg-white text-[#191817] hover:bg-[#E3D5B8] font-mono text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>JOIN</span>
                      <ArrowUpRight width={12} height={12} />
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Col 2: Collections */}
            <div className="lg:col-span-2 space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 block mb-4">
                COLLECTIONS
              </span>
              <ul className="space-y-2 font-serif text-sm text-white/80">
                <li>
                  <Link to="/products" className="hover:text-white transition-colors">
                    New Arrivals '26
                  </Link>
                </li>
                <li>
                  <Link to="/products?gender=Women" className="hover:text-white transition-colors">
                    Women’s Atelier
                  </Link>
                </li>
                <li>
                  <Link to="/products?gender=Men" className="hover:text-white transition-colors">
                    Men’s Sartorial
                  </Link>
                </li>
                <li>
                  <Link to="/collections" className="hover:text-white transition-colors">
                    Campaign Dossiers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Brand & Editorial */}
            <div className="lg:col-span-2 space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 block mb-4">
                THE JOURNAL
              </span>
              <ul className="space-y-2 font-serif text-sm text-white/80">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    Craft Manifesto
                  </Link>
                </li>
                <li>
                  <Link to="/archive" className="hover:text-white transition-colors">
                    Polaroid Archive
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-white transition-colors">
                    Curator Admin Desk
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    Private Appointment
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Client Services */}
            <div className="lg:col-span-3 space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 block mb-4">
                CLIENT SERVICES
              </span>
              <ul className="space-y-2 font-mono text-xs text-white/60">
                <li>Complimentary Courier above ₹8,000</li>
                <li>14-Day Physical Returns &amp; Swaps</li>
                <li>Bespoke Tailoring Consultations</li>
                <li className="text-[#E3D5B8] pt-1">concierge@elora.com</li>
              </ul>
            </div>
          </div>

          {/* Public Exhibition, Pinterest Moodboard & Legal Disclaimer */}
          <div className="pt-8 pb-4">
            <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-none text-white/70">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#E3D5B8] font-bold">
                  PUBLIC EXHIBITION &amp; EDITORIAL IMAGERY NOTICE
                </span>
              </div>
              <p className="font-sans text-[11px] leading-relaxed text-white/60 font-light">
                ELORA is an editorial lookbook and clothing curation platform exhibited in the public domain. Garments, moodboards, and photographic references uploaded or curated by administration are collected from public discovery platforms including Pinterest and archival fashion lookbooks solely for non-commercial artistic demonstration, aesthetic curation, and visual styling. All original imagery, designs, trademarks, and copyrights remain the exclusive property of their respective creators, photographers, and fashion houses. No copyright infringement is intended. If you are an intellectual property owner and wish to request attribution or immediate removal of any media, please contact our administrator curation desk.
              </p>
            </div>
          </div>

          {/* Bottom Copyright & Legal */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span>© 2026 ELORA</span>
              <span>•</span>
              <span className="font-serif italic text-white/60 text-xs">
                Public Curated Lookbooks &amp; Garments
              </span>
            </div>

            <div className="flex items-center gap-6 text-[10px] tracking-wider uppercase">
              <Link to="/about" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/about" className="hover:text-white transition-colors">Fair Use &amp; Terms</Link>
              <Link to="/about" className="hover:text-white transition-colors">Provenance</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
