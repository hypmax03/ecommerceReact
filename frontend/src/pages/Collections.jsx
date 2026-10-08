import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'iconoir-react';
import Tape from '../components/Tape';
import Polaroid from '../components/Polaroid';
import HandwrittenNote from '../components/HandwrittenNote';
import { CAMPAIGN_LOOKS } from '../data/fashionProducts';

const Collections = () => {
  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="border-b border-[#2C2A29]/15 pb-8 mb-12 relative">
          <div className="absolute -top-3 right-8 pointer-events-none hidden sm:block">
            <Tape rotate="-2deg" variant="kraft" text="CHAPTER ARCHIVES" width="w-40" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7A756F]">
              JOURNAL VOLUME IV • CAMPAIGN DOSSIERS
            </span>
            <span className="font-handwriting text-base text-[#A66551]">
              (editorial pinboard)
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#191817]">
            COLLECTIONS &amp; CAMPAIGNS
          </h1>
          <p className="font-sans text-sm text-[#5C5751] font-light mt-2 max-w-xl">
            A visual documentation of seasonal chapters, location lookbooks, and textile studies curated by our creative directors.
          </p>
        </div>

        {/* Moodboard Campaign Stories Grid */}
        <div className="space-y-20">
          {CAMPAIGN_LOOKS.map((campaign, idx) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FDFCF9] p-6 sm:p-10 border border-[#2C2A29]/15 shadow-sm relative"
            >
              {/* Top Tape Accent */}
              <div className="absolute -top-3.5 left-10 pointer-events-none">
                <Tape
                  rotate={idx % 2 === 0 ? '-3deg' : '2deg'}
                  variant={idx % 2 === 0 ? 'kraft' : 'dark'}
                  text={`CHAPTER 0${idx + 1}`}
                  width="w-28"
                />
              </div>

              {/* Photo Area */}
              <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="aspect-[16/11] bg-[#ECE8DF] overflow-hidden border border-[#2C2A29]/10 relative group">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover object-center filter contrast-[1.02] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#191817] text-[#FAF7F2] font-mono text-[8px] uppercase tracking-widest px-2 py-0.5">
                    {campaign.tag}
                  </div>
                </div>
              </div>

              {/* Narrative Story */}
              <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#7A756F]">
                  LOOKBOOK NO. 0{idx + 1}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#191817] font-normal leading-tight">
                  {campaign.title}
                </h2>
                <p className="font-sans text-sm text-[#5C5751] font-light leading-relaxed">
                  {campaign.subtitle}
                </p>

                <div className="pt-2">
                  <HandwrittenNote
                    text={
                      idx === 0
                        ? '“monochrome layering for sudden rain”'
                        : idx === 1
                        ? '“hand-stitched lapels by master Marco”'
                        : idx === 2
                        ? '“washed French flax, unlined & breezy”'
                        : '“fluid pure silk for nightfall”'
                    }
                    color="text-[#A66551]"
                    rotate={idx % 2 === 0 ? '-1deg' : '1deg'}
                  />
                </div>

                <div className="pt-4">
                  <Link
                    to={campaign.link}
                    className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] font-mono text-xs uppercase tracking-widest px-6 py-3 transition-colors shadow-sm"
                  >
                    <span>EXPLORE CHAPTER GARMENTS</span>
                    <ArrowUpRight width={14} height={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Collections;
