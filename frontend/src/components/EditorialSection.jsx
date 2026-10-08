import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'iconoir-react';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';
import Polaroid from './Polaroid';

const EditorialSection = () => {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const photoParallax = useTransform(scrollYProgress, [0, 1], ['-6%', shouldReduceMotion ? '0%' : '6%']);
  const noteParallax = useTransform(scrollYProgress, [0, 1], ['10%', shouldReduceMotion ? '0%' : '-10%']);

  return (
    <section
      ref={sectionRef}
      className="py-28 sm:py-36 bg-[#FAF7F2] text-[#191817] relative overflow-hidden border-b border-[#2C2A29]/10"
    >
      {/* Background Section Page Label */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7A756F]">
          ARTICLE 03 • ATELIER ESSAY &amp; SCRAPBOOK CUTOUT
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: Broken-Grid Overlapping Large Photo */}
          <div className="lg:col-span-7 relative z-10">
            {/* Washi Tape at corner */}
            <div className="absolute -top-4 left-10 z-30">
              <Tape rotate="-8deg" variant="kraft" text="EDITORIAL NO. 03" width="w-32" />
            </div>

            {/* Main Overlapping Photo Frame */}
            <motion.div
              style={{ y: photoParallax }}
              className="bg-[#FDFCF9] p-4 sm:p-5 border border-[#2C2A29]/15 shadow-[0_20px_50px_rgba(0,0,0,0.1)] -rotate-1 relative"
            >
              <div className="aspect-[16/11] overflow-hidden bg-[#ECE8DF]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85"
                  alt="Editorial portrait fashion journal"
                  className="w-full h-full object-cover object-[center_25%] filter saturate-[0.95]"
                  loading="lazy"
                />
              </div>

              {/* Photo Bottom Caption */}
              <div className="mt-3 flex items-center justify-between text-[#7A756F] font-mono text-[9px] uppercase tracking-widest border-t border-dashed border-[#2C2A29]/10 pt-2">
                <span>LOOKBOOK / PROVENANCE</span>
                <span className="font-handwriting text-sm text-[#A66551]">natural linen drape</span>
              </div>
            </motion.div>

            {/* Overlapping Polaroid breaking out of layout */}
            <motion.div
              style={{ y: noteParallax }}
              className="absolute -bottom-10 -right-4 sm:-right-8 z-20 w-44 sm:w-52 hidden sm:block"
            >
              <Polaroid
                image="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
                caption="Tailor’s desk — 3:15 PM"
                subCaption="Super 130s wool swatch"
                rotate="5deg"
                tapeText="STUDIO CUT"
                tapeVariant="dark"
              />
            </motion.div>

            {/* Handwritten Note Pin */}
            <div className="absolute -top-8 right-8 z-20 bg-[#F5EFE6] px-3 py-1 border border-[#D1C9BC] shadow-sm rotate-3 hidden md:block">
              <span className="font-handwriting text-base text-[#2C2A29]">
                “clothes made to outlast seasons”
              </span>
            </div>
          </div>

          {/* Right: Editorial Narrative Content & Large Heading */}
          <div className="lg:col-span-5 lg:pl-6 z-20">
            {/* Cut-out Big Typography */}
            <h2 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-normal text-[#191817] leading-[0.95] tracking-tight mb-6">
              WHAT WE <br />
              <span className="italic font-light opacity-90 pl-3">KEEP.</span>
            </h2>

            {/* Handwritten scribble */}
            <div className="mb-6">
              <HandwrittenNote
                text="a personal note on thoughtful consumption →"
                rotate="-1deg"
                color="text-[#A66551]"
              />
            </div>

            {/* Journal Article Body */}
            <div className="space-y-4 font-sans text-sm sm:text-base text-[#5C5751] font-light leading-relaxed">
              <p>
                We craft garments for India's leading cultural icons and discerning clients who reject the fleeting noise of seasonal trends. Whether it is Deepika Padukone on the Cannes red carpet or Shah Rukh Khan in a bespoke black tie tuxedo, our pieces are tailored to convey quiet sovereignty.
              </p>
              <p>
                Cut exclusively from historical mills in Biella, Como, and Kashmir, every seam is finished by master tailors with natural silk thread and horn buttons that develop a patina over decades.
              </p>
            </div>

            {/* Handwritten Quote Block */}
            <div className="mt-8 p-4 bg-[#F5EFE6] border-l-2 border-[#191817] shadow-sm">
              <p className="font-serif italic text-lg text-[#191817] leading-snug">
                “True luxury is understated grace. When I walk onto a global stage, the weight of the handloom silk and bespoke drape provides complete poise.”
              </p>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#7A756F] block mt-2">
                — DEEPIKA PADUKONE / CANNES DIARY
              </span>
            </div>

            {/* Read Manifesto Link */}
            <div className="mt-8">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] font-bold text-[#191817] hover:text-[#A66551] transition-colors"
              >
                <span className="border-b border-[#191817] pb-0.5 group-hover:border-[#A66551]">
                  READ THE ATELIER MANIFESTO
                </span>
                <ArrowUpRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
