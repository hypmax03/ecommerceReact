import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'iconoir-react';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';

const journalLooks = [
  {
    id: 'look_01',
    lookNumber: 'LOOK 01',
    title: 'DEEPIKA — CANNES SILK ARCHIVE',
    subtitle: 'Red Carpet Bias Cut Silk & Cowl Drape',
    notes: '“draped bias cut silk tailored for Cannes red carpet”',
    fabric: '100% Mulberry Silk (28 Momme)',
    location: 'Cannes / Mumbai • 09:14 AM',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85',
    link: '/products?gender=Women',
    tapeVariant: 'kraft',
    rotate: '-1deg',
  },
  {
    id: 'look_02',
    lookNumber: 'LOOK 02',
    title: 'RANVEER — BESPOKE SARTORIAL',
    subtitle: 'Unstructured Natural Shoulder Wool Suit',
    notes: '“spalla camicia tailoring, soft horn buttons for Ranveer”',
    fabric: 'Super 130s Extra-Fine Loro Piana Wool',
    location: 'Bandra Bespoke Room • 02:40 PM',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=85',
    link: '/products?gender=Men',
    tapeVariant: 'dark',
    rotate: '1.5deg',
  },
  {
    id: 'look_03',
    lookNumber: 'LOOK 03',
    title: 'SRK — BLACK TIE NOCTURNE',
    subtitle: 'Midnight Silk Grosgrain Shawl Tuxedo',
    notes: '“kingly proportions cut for Shah Rukh Khan”',
    fabric: 'Super 150s Wool with Pure Silk Grosgrain',
    location: 'Mannat Studio • 11:30 AM',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85',
    link: '/products?gender=Men',
    tapeVariant: 'cream',
    rotate: '-2deg',
  },
  {
    id: 'look_04',
    lookNumber: 'LOOK 04',
    title: 'SOBHITA — VENICE SILK & VELVET',
    subtitle: 'Sculpted Column Evening & Asymmetrical Drape',
    notes: '“sandwashed silk slip fitting for Venice premiere”',
    fabric: 'Silk-Blend Velvet & Pure Crepe Silk',
    location: 'Venice • 08:20 PM',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
    link: '/products?gender=Women',
    tapeVariant: 'kraft',
    rotate: '1deg',
  },
  {
    id: 'look_05',
    lookNumber: 'LOOK 05',
    title: 'RANBIR — KENSINGTON CASHMERE',
    subtitle: 'Heirloom Camel Overcoat & Flannel',
    notes: '“designed for understated Mumbai winter elegance”',
    fabric: '90% Mongolian Cashmere, 10% Virgin Wool',
    location: 'Bandra / London • 04:10 PM',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=85',
    link: '/products?gender=Men',
    tapeVariant: 'dark',
    rotate: '-1.5deg',
  },
];

const HorizontalCollection = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-[#FAF7F2] border-b border-[#2C2A29]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#2C2A29]/15 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                SECTION 05 • JOURNAL LOOKBOOK
              </span>
              <span className="font-handwriting text-base text-[#A66551]">
                (horizontal page turn)
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191817]">
              LOOKBOOK PAGES 01–05
            </h2>
          </div>

          {/* Navigation Scroll Arrows */}
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-10 h-10 bg-[#F5EFE6] border border-[#2C2A29]/20 flex items-center justify-center text-[#191817] hover:bg-[#191817] hover:text-[#FAF7F2] transition-colors"
              aria-label="Previous journal look"
            >
              <ArrowLeft width={16} height={16} />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-10 h-10 bg-[#F5EFE6] border border-[#2C2A29]/20 flex items-center justify-center text-[#191817] hover:bg-[#191817] hover:text-[#FAF7F2] transition-colors"
              aria-label="Next journal look"
            >
              <ArrowRight width={16} height={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto no-scrollbar px-6 sm:px-8 lg:px-12 pb-8 scroll-smooth"
      >
        {journalLooks.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            style={{ transform: `rotate(${item.rotate})` }}
            className="flex-shrink-0 w-[310px] sm:w-[380px] bg-[#FDFCF9] p-5 border border-[#2C2A29]/15 shadow-[0_12px_35px_rgba(0,0,0,0.06)] relative group hover:rotate-0 transition-transform duration-300"
          >
            {/* Washi Tape at Header */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
              <Tape
                rotate="1deg"
                variant={item.tapeVariant}
                text={item.lookNumber}
                width="w-24"
              />
            </div>

            {/* Look Header Info */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-dashed border-[#2C2A29]/10 pt-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#191817]">
                PAGE 0{index + 1}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F]">
                {item.location}
              </span>
            </div>

            {/* Image Container */}
            <Link to={item.link} className="block aspect-[4/5] overflow-hidden bg-[#ECE8DF] relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center filter contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </Link>

            {/* Look Narrative Details */}
            <div className="mt-4 space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl text-[#191817] font-normal leading-tight">
                {item.title}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F]">
                {item.subtitle}
              </p>

              {/* Handwritten Note Snippet */}
              <div className="pt-2">
                <HandwrittenNote
                  text={item.notes}
                  color="text-[#A66551]"
                  rotate="-1deg"
                  className="text-base"
                />
              </div>

              {/* Fabric Specs */}
              <div className="pt-3 border-t border-dashed border-[#2C2A29]/10 flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#7A756F] truncate max-w-[200px]">
                  {item.fabric}
                </span>
                <Link
                  to={item.link}
                  className="font-mono text-[10px] uppercase font-bold text-[#191817] hover:text-[#A66551] inline-flex items-center gap-1 transition-colors"
                >
                  <span>SHOP</span>
                  <ArrowUpRight width={11} height={11} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalCollection;
