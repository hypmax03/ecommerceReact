import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'iconoir-react';
import Tape from '../components/Tape';
import Polaroid from '../components/Polaroid';
import HandwrittenNote from '../components/HandwrittenNote';

const fullPolaroidArchive = [
  {
    id: 'p_01',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    caption: 'Deepika — Cannes, 11:42 AM',
    subCaption: 'silk cowl drape / red carpet',
    city: 'Cannes',
    year: '2026',
    rotate: '-2.5deg',
    tapeText: 'DEEPIKA',
    tapeVariant: 'kraft',
  },
  {
    id: 'p_02',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    caption: 'Ranveer — Bandra, 3:15 PM',
    subCaption: 'bespoke double-breasted suit',
    city: 'Mumbai',
    year: '2026',
    rotate: '2deg',
    tapeText: 'RANVEER',
    tapeVariant: 'dark',
  },
  {
    id: 'p_03',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    caption: 'Shah Rukh Khan — Mannat, 5:00 PM',
    subCaption: 'midnight black grosgrain tuxedo',
    city: 'Mumbai',
    year: '2026',
    rotate: '-1.5deg',
    tapeText: 'SRK',
    tapeVariant: 'cream',
  },
  {
    id: 'p_04',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    caption: 'Sobhita — Venice, 09:30 AM',
    subCaption: 'sandwashed silk slip fitting',
    city: 'Venice',
    year: '2025',
    rotate: '3deg',
    tapeText: 'SOBHITA',
    tapeVariant: 'kraft',
  },
  {
    id: 'p_05',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    caption: 'Ranbir — Delhi, 1:20 PM',
    subCaption: 'Kashmir cashmere overcoat',
    city: 'Delhi',
    year: '2026',
    rotate: '-3deg',
    tapeText: 'RANBIR',
    tapeVariant: 'dark',
  },
  {
    id: 'p_06',
    image: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=800&q=80',
    caption: 'Kiara — Jaipur, 4:45 PM',
    subCaption: 'pleated organza evening maxi',
    city: 'Jaipur',
    year: '2026',
    rotate: '1.5deg',
    tapeText: 'KIARA',
    tapeVariant: 'kraft',
  },
  {
    id: 'p_07',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    caption: 'Kareena — Pataudi, 10:15 AM',
    subCaption: 'virgin wool blazer dress',
    city: 'Delhi',
    year: '2025',
    rotate: '-2deg',
    tapeText: 'KAREENA',
    tapeVariant: 'cream',
  },
  {
    id: 'p_08',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    caption: 'Siddhant — Goa, 6:00 PM',
    subCaption: 'Normandy flax linen shirt',
    city: 'Goa',
    year: '2026',
    rotate: '2.5deg',
    tapeText: 'SIDDHANT',
    tapeVariant: 'dark',
  },
];

const Archive = () => {
  const [selectedCity, setSelectedCity] = useState('All');

  const filteredPolaroids = fullPolaroidArchive.filter((p) => {
    if (selectedCity === 'All') return true;
    return p.city === selectedCity;
  });

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-[#2C2A29]/15 pb-8 mb-10 relative">
          <div className="absolute -top-3 right-6 pointer-events-none hidden sm:block">
            <Tape rotate="2deg" variant="kraft" text="35MM FILM PRINTS" width="w-36" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7A756F]">
              DOCUMENTARY ARCHIVE • VOL. IV
            </span>
            <span className="font-handwriting text-base text-[#A66551]">
              (uncropped, unedited snapshots)
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#191817]">
            POLAROID &amp; FILM ARCHIVES
          </h1>
          <p className="font-sans text-sm text-[#5C5751] font-light mt-2 max-w-xl">
            Raw photographs taken during atelier fittings, textile mill journeys, and bespoke client appointments across Europe.
          </p>
        </div>

        {/* City Filter Strip */}
        <div className="flex items-center gap-2 mb-12 flex-wrap bg-[#F5EFE6] p-3 border border-[#2C2A29]/15">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] mr-2">
            LOCATION STAMP:
          </span>
          {['All', 'Mumbai', 'Cannes', 'Venice', 'Delhi', 'Jaipur', 'Goa'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`font-mono text-xs uppercase tracking-wider px-3 py-1 border transition-colors ${
                selectedCity === city
                  ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] font-bold shadow-sm'
                  : 'bg-[#FAF7F2] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
              }`}
            >
              {city === 'All' ? 'ALL LOCATIONS' : city}
            </button>
          ))}
        </div>

        {/* Polaroids Scattered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-center">
          {filteredPolaroids.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex justify-center"
            >
              <Polaroid
                image={item.image}
                caption={item.caption}
                subCaption={item.subCaption}
                rotate={item.rotate}
                tapeText={item.tapeText}
                tapeVariant={item.tapeVariant}
                aspect="aspect-[4/5]"
                className="w-full max-w-[270px]"
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center border-t border-[#2C2A29]/15 pt-8">
          <HandwrittenNote
            text="“original negative prints are conserved in acid-free envelopes in our Milan archive”"
            rotate="-0.5deg"
            color="text-[#7A756F]"
          />
        </div>
      </div>
    </main>
  );
};

export default Archive;
