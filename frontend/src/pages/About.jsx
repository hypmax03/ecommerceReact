import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'iconoir-react';
import Tape from '../components/Tape';
import Polaroid from '../components/Polaroid';
import HandwrittenNote from '../components/HandwrittenNote';
import { EDITORIAL_STORIES } from '../data/fashionProducts';

const About = () => {
  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-[#2C2A29]/15 pb-8 mb-12 relative">
          <div className="absolute -top-3 right-6 pointer-events-none hidden sm:block">
            <Tape rotate="-1deg" variant="kraft" text="ATELIER DOSSIER" width="w-36" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7A756F]">
              DOCUMENT NO. 00 • MANIFESTO &amp; TEXTILE ETHOS
            </span>
            <span className="font-handwriting text-base text-[#A66551]">
              (handwritten principles)
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-normal text-[#191817]">
            THE ATELIER MANIFESTO
          </h1>
          <p className="font-sans text-sm text-[#5C5751] font-light mt-2 max-w-xl">
            A quiet rejection of fast trends in pursuit of single-origin textiles, bespoke craftsmanship, and garments that develop character over a lifetime.
          </p>
        </div>

        {/* 3 Physical Story Cards (Provenance, Craftsmanship, Endurance) */}
        <div className="space-y-16">
          {EDITORIAL_STORIES.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FDFCF9] p-6 sm:p-10 border border-[#2C2A29]/15 shadow-sm relative"
            >
              {/* Washi Tape */}
              <div className="absolute -top-3.5 left-8 pointer-events-none">
                <Tape
                  rotate={idx % 2 === 0 ? '-2deg' : '2deg'}
                  variant={idx % 2 === 0 ? 'kraft' : 'dark'}
                  text={story.step}
                  width="w-36"
                />
              </div>

              {/* Photo Area */}
              <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="aspect-[4/5] bg-[#ECE8DF] overflow-hidden border border-[#2C2A29]/10">
                  <img
                    src={story.image}
                    alt={story.author}
                    className="w-full h-full object-cover object-center filter contrast-[1.02]"
                  />
                </div>
              </div>

              {/* Story Narrative */}
              <div className={`lg:col-span-7 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#7A756F]">
                  CHAPTER {story.step}
                </span>

                <blockquote className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal leading-snug">
                  “{story.quote}”
                </blockquote>

                <div className="pt-2">
                  <p className="font-mono text-xs font-bold text-[#191817]">
                    {story.author}
                  </p>
                  <p className="font-sans text-xs text-[#7A756F]">
                    {story.role}
                  </p>
                </div>

                <div className="pt-3">
                  <HandwrittenNote
                    text={
                      idx === 0
                        ? 'draped for Deepika Padukone at Cannes'
                        : idx === 1
                        ? 'tailored for Ranveer Singh in our Bandra room'
                        : 'crafted for Shah Rukh Khan’s gala appearances'
                    }
                    color="text-[#A66551]"
                    rotate="-1deg"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ethical Fabric Provenance Table */}
        <div className="mt-20 bg-[#F5EFE6] p-8 sm:p-12 border border-[#2C2A29]/15">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#2C2A29]/15">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                HERITAGE WEAVING &amp; ATELIER REGISTRY
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal">
                Where Our Textiles &amp; Silhouettes Are Born
              </h3>
            </div>
            <span className="font-handwriting text-base text-[#A66551] hidden sm:inline">
              100% single-origin provenance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-[#2C2A29]">
            <div className="p-4 bg-[#FDFCF9] border border-[#2C2A29]/10">
              <span className="text-[#A66551] font-bold block mb-1">01 / BANDRA ATELIER, MUMBAI</span>
              <p className="font-sans text-xs text-[#5C5751]">
                Private bespoke fitting suites for cinema actors, red carpet draping, and hand-finished pick lapels.
              </p>
            </div>
            <div className="p-4 bg-[#FDFCF9] border border-[#2C2A29]/10">
              <span className="text-[#A66551] font-bold block mb-1">02 / VARANASI &amp; COMO SILK</span>
              <p className="font-sans text-xs text-[#5C5751]">
                Mulberry silk 28 momme crepe de chine woven with generational heritage looms.
              </p>
            </div>
            <div className="p-4 bg-[#FDFCF9] border border-[#2C2A29]/10">
              <span className="text-[#A66551] font-bold block mb-1">03 / KASHMIR &amp; BIELLA WOOL</span>
              <p className="font-sans text-xs text-[#5C5751]">
                Pure pashmina cashmere and Super 130s Loro Piana extra-fine virgin wool.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
