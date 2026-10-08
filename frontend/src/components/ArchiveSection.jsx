import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'iconoir-react';
import Polaroid from './Polaroid';
import HandwrittenNote from './HandwrittenNote';

const polaroidArchive = [
  {
    id: 'arch_01',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80',
    caption: 'Deepika — Cannes, 11:42 AM',
    subCaption: 'silk cowl drape / red carpet',
    rotate: '-3deg',
    tapeText: 'DEEPIKA',
    tapeVariant: 'kraft',
    link: '/products?gender=Women',
  },
  {
    id: 'arch_02',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80',
    caption: 'Ranveer — Bandra, 3:15 PM',
    subCaption: 'bespoke double-breasted fit',
    rotate: '2.5deg',
    tapeText: 'RANVEER',
    tapeVariant: 'dark',
    link: '/products?gender=Men',
  },
  {
    id: 'arch_03',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    caption: 'Sobhita — Venice, 09:30 AM',
    subCaption: 'sandwashed silk slip fitting',
    rotate: '-1.5deg',
    tapeText: 'SOBHITA',
    tapeVariant: 'cream',
    link: '/products?gender=Women',
  },
  {
    id: 'arch_04',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80',
    caption: 'Shah Rukh Khan — Mannat, 5:00 PM',
    subCaption: 'midnight black grosgrain tuxedo',
    rotate: '3.5deg',
    tapeText: 'SRK',
    tapeVariant: 'kraft',
    link: '/products?gender=Men',
  },
];

const ArchiveSection = () => {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-[#F5EFE6] border-b border-[#2C2A29]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-[#2C2A29]/15">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                SECTION 04 • POLAROID ALBUM
              </span>
              <span className="font-handwriting text-base text-[#A66551]">
                (raw studio snapshots)
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191817]">
              FROM THE ARCHIVE
            </h2>
          </div>

          <Link
            to="/archive"
            className="font-handwriting text-xl text-[#191817] hover:text-[#A66551] transition-colors mt-3 sm:mt-0 inline-flex items-center gap-1 hand-drawn-underline"
          >
            <span>browse all 48 polaroids</span>
            <ArrowUpRight width={14} height={14} />
          </Link>
        </div>

        {/* Polaroids Scattered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-center">
          {polaroidArchive.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 35, rotate: item.rotate }}
              whileInView={{ opacity: 1, y: 0, rotate: item.rotate }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.7,
                delay: idx * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex justify-center"
            >
              <Link to={item.link} className="block w-full max-w-[270px]">
                <Polaroid
                  image={item.image}
                  caption={item.caption}
                  subCaption={item.subCaption}
                  rotate={item.rotate}
                  tapeText={item.tapeText}
                  tapeVariant={item.tapeVariant}
                  aspect="aspect-[4/5]"
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom Handwritten Footnote */}
        <div className="mt-14 text-center">
          <HandwrittenNote
            text="“every photograph is taken on 35mm film during physical garment fittings”"
            rotate="-0.5deg"
            color="text-[#7A756F]"
          />
        </div>
      </div>
    </section>
  );
};

export default ArchiveSection;
