import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowUpRight, Check, Mail, ArrowUp, Pin, Camera, Heart } from 'iconoir-react';

const Footer = () => {
  const { products } = useSelector((state) => state.product || { products: [] });
  const { user } = useSelector((state) => state.user || { user: null });
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');
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
        <div className="absolute inset-0 w-full h-full bg-[#181412]">
          {products?.[0] && (products[0].images?.[0] || products[0].image) && (
            <img
              src={products[0].images?.[0] || products[0].image}
              alt={products[0].name || "Atelier Campaign"}
              className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.04] transition-transform duration-1000 group-hover:scale-[1.02]"
            />
          )}
          {/* Subtle cinematic gradient overlays for high contrast typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/50 pointer-events-none" />
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
                {isAdmin && (
                  <li>
                    <Link to="/admin" className="hover:text-white transition-colors">
                      Curator Admin Desk
                    </Link>
                  </li>
                )}
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

          {/* =========================================================================
              3. CURATOR'S NOTE & PINTEREST OPEN-SOURCE ATTRIBUTION DISCLAIMER
              ========================================================================= */}
          <section className="pt-10 pb-6" aria-labelledby="creator-attribution-heading">
            <div className="bg-[#181615] border border-white/10 p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl">
              {/* Header Bar: Badge, Title & Back to Top */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-[#E3D5B8]/30 bg-[#E3D5B8]/10 flex items-center justify-center text-[#E3D5B8] flex-shrink-0">
                    <Pin width={16} height={16} />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#E3D5B8] font-bold block">
                      CURATOR'S NOTE &amp; VISUAL ATTRIBUTION
                    </span>
                    <h3 id="creator-attribution-heading" className="font-serif text-xl sm:text-2xl text-white font-normal mt-0.5">
                      Open-Source Moodboard &amp; Pinterest Curation
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 bg-white/5 border border-white/15 text-white/70 hidden sm:inline-block">
                    NON-COMMERCIAL ARCHIVE
                  </span>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 bg-white/10 hover:bg-white text-white hover:text-[#191817] border border-white/20 transition-all cursor-pointer"
                    title="Return to top of page"
                  >
                    <span>TOP</span>
                    <ArrowUp width={12} height={12} />
                  </button>
                </div>
              </div>

              {/* Three-Column Subtle Explanatory Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 pb-6 text-white/70">
                {/* Column 1: Sourcing & Intent */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-white text-xs font-mono tracking-wider uppercase font-semibold">
                    <Camera width={14} height={14} className="text-[#E3D5B8]" />
                    <span>PINTEREST &amp; PUBLIC DISCOVERY</span>
                  </div>
                  <p className="font-sans text-[11px] leading-relaxed text-white/60 font-light">
                    The photography, garment visuals, and moodboard clippings featured across this project are collected from Pinterest and public open-source archives. This website is a personal design and portfolio exploration created out of love for timeless fashion and visual storytelling, with absolutely no intent to harm, exploit, or infringe.
                  </p>
                </div>

                {/* Column 2: Respect for Original Artists */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-white text-xs font-mono tracking-wider uppercase font-semibold">
                    <Heart width={14} height={14} className="text-[#E3D5B8]" />
                    <span>HONORING CREATORS &amp; BRANDS</span>
                  </div>
                  <p className="font-sans text-[11px] leading-relaxed text-white/60 font-light">
                    We do not own or claim copyright over these photographs. All artistic credit, trademarks, and intellectual rights belong solely to the talented photographers, fashion houses, stylists, and models who created them. We celebrate their craft and showcase them purely for aesthetic admiration and non-commercial demonstration.
                  </p>
                </div>

                {/* Column 3: Friendly Take-Down & Inquiries */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-white text-xs font-mono tracking-wider uppercase font-semibold">
                    <Mail width={14} height={14} className="text-[#E3D5B8]" />
                    <span>ATTRIBUTION &amp; TAKEDOWN</span>
                  </div>
                  <p className="font-sans text-[11px] leading-relaxed text-white/60 font-light">
                    If you are the copyright holder or creator of any image displayed on this site and would like your work credited differently, or prefer it to be removed, please send a gentle note to our contact desk. We will honor your request and take it down immediately with gratitude.
                  </p>
                  <div className="pt-1">
                    <a
                      href="mailto:concierge@elora.com?subject=Image%20Attribution%20or%20Removal%20Request"
                      className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#E3D5B8] uppercase tracking-wider hover:underline"
                    >
                      <span>→ REQUEST REMOVAL OR ATTRIBUTION</span>
                      <ArrowUpRight width={11} height={11} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Subtle Note Bar */}
              <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-white/40">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>CURATED WITH RESPECT &amp; APPRECIATION</span>
                </div>
                <span className="font-handwriting text-sm text-[#E3D5B8]/80 text-center">
                  “curated with admiration, never with intent to infringe”
                </span>
                <span className="uppercase tracking-widest text-white/50">
                  OPEN-SOURCE SCRAPBOOK ARCHIVE
                </span>
              </div>
            </div>
          </section>

          {/* Bottom Micro Legal Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span>© {new Date().getFullYear()} ELORA</span>
              <span>•</span>
              <span className="font-serif italic text-white/60 text-xs">
                A non-commercial visual lookbook &amp; aesthetic tribute
              </span>
            </div>

            <div className="flex items-center gap-6 text-[10px] tracking-wider uppercase">
              <Link to="/about" className="hover:text-white transition-colors">Manifesto</Link>
              <Link to="/about" className="hover:text-white transition-colors">Fair Use Notice</Link>
              <Link to="/products" className="hover:text-white transition-colors">Moodboard</Link>
              <Link to="/admin" className="hover:text-white transition-colors">Admin Desk</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
