import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowDown } from 'iconoir-react';
import Tape from './Tape';
import Polaroid from './Polaroid';
import HandwrittenNote from './HandwrittenNote';

const HeroScrapbook = () => {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax layers
  const mainImageY = useTransform(scrollYProgress, [0, 1], ['0%', shouldReduceMotion ? '0%' : '8%']);
  const polaroidY = useTransform(scrollYProgress, [0, 1], ['0%', shouldReduceMotion ? '0%' : '-15%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', shouldReduceMotion ? '0%' : '5%']);
  const noteY = useTransform(scrollYProgress, [0, 1], ['0%', shouldReduceMotion ? '0%' : '-8%']);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-screen w-full pt-28 sm:pt-36 pb-20 px-6 sm:px-8 lg:px-12 bg-[#FAF7F2] overflow-hidden flex flex-col justify-center"
    >
      {/* Background Scrap Paper Accents */}
      <div className="absolute top-12 left-8 font-mono text-[9px] uppercase tracking-[0.3em] text-[#A8A39D] pointer-events-none select-none">
        FIG. 01 — SPRING / SUMMER MOODBOARD
      </div>
      <div className="absolute top-14 right-12 font-handwriting text-base sm:text-lg text-[#A66551] pointer-events-none select-none rotate-2 hidden md:block">
        (cut from issue no. 26)
      </div>

      <div className="max-w-7xl mx-auto w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Handwritten Notes */}
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 z-20 flex flex-col justify-center"
          >
            {/* Top Monospace Label with Down Arrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#7A756F] bg-[#EFE8DC] px-2.5 py-1 border border-[#D1C9BC]">
                MUSE ARCHIVE • DEEPIKA &amp; RANVEER
              </span>
              <span className="font-mono text-xs text-[#7A756F]">↓</span>
            </div>

            {/* Large Cut-out Editorial Serif Heading */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal text-[#191817] leading-[0.95] tracking-tight mb-4">
              THE THINGS <br />
              <span className="italic font-light opacity-90 pl-2 sm:pl-4">THEY WEAR.</span>
            </h1>

            {/* Handwritten note below heading */}
            <motion.div
              style={{ y: noteY }}
              className="mb-8 pl-3 border-l-2 border-[#A66551]/50"
            >
              <HandwrittenNote
                text="celebrity red carpet archives &amp; Bandra fitting notes →"
                rotate="-1deg"
                color="text-[#A66551]"
              />
              <p className="font-sans text-sm text-[#5C5751] mt-2 max-w-md font-light leading-relaxed">
                A tactile scrapbook documenting bespoke suits tailored for Ranveer Singh, Cannes red carpet silks worn by Deepika Padukone, and ceremonial black tie cuts for Shah Rukh Khan.
              </p>
            </motion.div>

            {/* Action Buttons & Scrapbook Tag */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <Link
                to="/products"
                className="group relative inline-flex items-center gap-3 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-[0.2em] px-7 py-3.5 shadow-[0_4px_16px_rgba(25,24,23,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#2C2A29]"
              >
                <span>EXPLORE CELEBRITY ARCHIVE</span>
                <ArrowUpRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                to="/collections"
                className="font-handwriting text-xl text-[#191817] hover:text-[#A66551] transition-colors relative hand-drawn-underline"
              >
                flip through moodboard →
              </Link>
            </div>

            {/* Mini Handwritten Snippet */}
            <div className="mt-10 flex items-center gap-3 text-[#7A756F] font-mono text-[10px] tracking-wider uppercase">
              <span>● CANNES RED CARPET</span>
              <span>● BESPOKE TAILORING</span>
              <span>● BANDRA ATELIER</span>
            </div>
          </motion.div>

          {/* Right Column: Overlapping Scrapbook Collage */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-8 sm:pt-0">
            <div className="relative w-full max-w-lg">

              {/* Main Editorial Photo with Tape Pin */}
              <motion.div
                style={{ y: mainImageY }}
                initial={{ opacity: 0, rotate: -3, scale: 0.95 }}
                animate={{ opacity: 1, rotate: -1.5, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-[88%] sm:w-[82%] bg-[#FDFCF9] p-3.5 sm:p-4 shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-[#2C2A29]/10"
              >
                {/* Washi tape at top-left corner */}
                <div className="absolute -top-3.5 -left-4 z-30">
                  <Tape rotate="-15deg" variant="kraft" text="DEEPIKA / CANNES" />
                </div>
                {/* Washi tape at bottom-right corner */}
                <div className="absolute -bottom-3 -right-3 z-30">
                  <Tape rotate="12deg" variant="dark" text="ED. 2026" width="w-20" />
                </div>

                {/* Primary Image Container */}
                <div className="aspect-[4/5] overflow-hidden bg-[#ECE8DF]">
                  <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85"
                    alt="Deepika Padukone red carpet silk gown"
                    className="w-full h-full object-cover object-center filter contrast-[1.02] hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Photo Caption Note */}
                <div className="mt-2.5 flex items-center justify-between text-[#7A756F]">
                  <span className="font-mono text-[9px] uppercase tracking-widest">
                    PHOTO 01 — DEEPIKA SILK COWL
                  </span>
                  <span className="font-handwriting text-sm text-[#A66551]">
                    Cannes Red Carpet
                  </span>
                </div>
              </motion.div>

              {/* Overlapping Polaroid (Ranveer Singh Bespoke Suit) */}
              <motion.div
                style={{ y: polaroidY }}
                initial={{ opacity: 0, rotate: 6, x: 20 }}
                animate={{ opacity: 1, rotate: 4.5, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-10 sm:-bottom-12 -right-2 sm:-right-4 z-20 w-44 sm:w-56"
              >
                <Polaroid
                  image="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80"
                  caption="Ranveer — Mumbai, 4:18 PM"
                  subCaption="Super 130s double-breasted"
                  rotate="4.5deg"
                  tapeText="RANVEER"
                  tapeVariant="cream"
                />
              </motion.div>

              {/* Floating Handwritten Annotation Pin */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -top-6 -right-2 sm:right-6 z-30 bg-[#F5EFE6] px-3 py-1.5 border border-[#D1C9BC] shadow-md -rotate-6 hidden sm:block"
              >
                <span className="font-handwriting text-base text-[#2C2A29] leading-none">
                  “cut for King Khan &amp; Deepika”
                </span>
              </motion.div>

              {/* Subtle Hand-drawn sketch circle / detail */}
              <div className="absolute -bottom-14 left-4 z-0 pointer-events-none opacity-40 select-none">
                <span className="font-handwriting text-3xl text-[#7A756F]">
                  (Bandra Fitting Docket 01)
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroScrapbook;
