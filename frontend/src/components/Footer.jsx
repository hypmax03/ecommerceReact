import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Check } from 'iconoir-react';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
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
    <footer className="bg-[#191817] text-[#FAF7F2] pt-24 pb-16 px-6 sm:px-8 lg:px-12 relative overflow-hidden border-t border-[#2C2A29]">
      {/* Tape pinned to top edge */}
      <div className="absolute top-0 left-12 -translate-y-1/2 z-10 pointer-events-none">
        <Tape rotate="-2deg" variant="dark" text="JOURNAL ENDPAPER" width="w-36" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Large Handwritten / Editorial Final Statement */}
        <div className="pb-16 border-b border-white/15 relative">
          <div className="flex items-center gap-2 mb-3 text-white/50">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
              EPILOGUE • ISSUE NO. 26
            </span>
            <span className="font-handwriting text-base text-[#E3D5B8]">
              (closing reflections)
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-[#FAF7F2] leading-[0.95]">
            SEE YOU ON <br />
            <span className="italic font-light opacity-90 pl-3 sm:pl-6 text-[#E3D5B8]">
              THE NEXT PAGE.
            </span>
          </h2>

          <div className="mt-6">
            <HandwrittenNote
              text="“wear what lasts, repair what frays, cherish what moves you”"
              rotate="-0.8deg"
              color="text-white/70"
            />
          </div>
        </div>

        {/* 4 Column Scrapbook Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 py-16 border-b border-white/15">
          {/* Col 1: Newsletter / Atelier Dispatch */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 block">
              SUBSCRIBE TO ATELIER LETTERS
            </span>
            <p className="font-sans text-xs text-white/70 font-light leading-relaxed max-w-sm">
              Receive handwritten dispatches on upcoming textile arrivals, private sample sales, and bespoke garment journals.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 max-w-sm">
              {isSubscribed ? (
                <div className="p-3 bg-white/10 border border-white/20 flex items-center gap-2 text-xs font-mono text-[#E3D5B8]">
                  <Check width={14} height={14} />
                  <span>THANK YOU. YOU ARE SUBSCRIBED TO THE JOURNAL.</span>
                </div>
              ) : (
                <div className="flex border border-white/25 focus-within:border-white transition-colors bg-white/5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter client email address..."
                    className="flex-1 bg-transparent px-3.5 py-3 text-xs text-[#FAF7F2] placeholder:text-white/40 focus:outline-none font-sans"
                  />
                  <button
                    type="submit"
                    className="px-5 bg-white text-[#191817] hover:bg-[#E3D5B8] font-mono text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center gap-1"
                  >
                    <span>JOIN</span>
                    <ArrowUpRight width={12} height={12} />
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 block mb-4">
              COLLECTIONS
            </span>
            <ul className="space-y-2.5 font-serif text-base text-white/80">
              <li>
                <Link to="/products?gender=Women" className="hover:text-[#E3D5B8] transition-colors">
                  Women’s Atelier
                </Link>
              </li>
              <li>
                <Link to="/products?gender=Men" className="hover:text-[#E3D5B8] transition-colors">
                  Men’s Sartorial
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#E3D5B8] transition-colors">
                  All 24 Garments
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#E3D5B8] transition-colors">
                  Moodboard Archives
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Atelier Info */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 block mb-4">
              ATELIER JOURNAL
            </span>
            <ul className="space-y-2.5 font-serif text-base text-white/80">
              <li>
                <Link to="/about" className="hover:text-[#E3D5B8] transition-colors">
                  Craft Manifesto
                </Link>
              </li>
              <li>
                <Link to="/archive" className="hover:text-[#E3D5B8] transition-colors">
                  Polaroid Archive
                </Link>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E3D5B8] transition-colors inline-flex items-center gap-1"
                >
                  <span>Instagram</span>
                  <ArrowUpRight width={11} height={11} />
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#E3D5B8] transition-colors">
                  Contact &amp; Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Client Services */}
          <div className="lg:col-span-3 space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 block mb-4">
              CLIENT SERVICES
            </span>
            <ul className="space-y-2.5 font-mono text-xs text-white/70">
              <li>Complimentary Courier above ₹8,000</li>
              <li>14-Day Physical Returns &amp; Swaps</li>
              <li>Bespoke Tailoring Appointments</li>
              <li className="text-[#E3D5B8] pt-1">
                studio@ateliervéricourt.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Imprint & Stamp */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span>© 2026 ATELIER VÉRICOURT</span>
            <span>•</span>
            <span className="font-handwriting text-sm text-[#E3D5B8]">
              printed on physical paper
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase">
            <Link to="/about" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Atelier</Link>
            <Link to="/about" className="hover:text-white transition-colors">Provenance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
