import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'iconoir-react';
import Tape from './Tape';
import Polaroid from './Polaroid';
import HandwrittenNote from './HandwrittenNote';

const moodboardItems = [
  {
    id: 'prod_w01',
    type: 'large-photo',
    title: 'The Deepika Aurelia Silk Draped Column Gown',
    price: '₹6,499',
    tag: '01 / DEEPIKA PADUKONE',
    note: '“worn at Cannes Film Festival”',
    noteArrow: 'down',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85',
    rotate: '-1.5deg',
    colSpan: 'lg:col-span-5',
    tapeText: 'DEEPIKA CANNES',
  },
  {
    id: 'prod_m01',
    type: 'polaroid',
    title: 'The Ranveer Double-Breasted Wool Suit',
    price: '₹9,999',
    tag: '02 / RANVEER SINGH',
    note: 'Ranveer’s Filmfare fitting',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=85',
    caption: 'Mumbai, 10:45 AM — Loro Piana wool',
    rotate: '3deg',
    colSpan: 'lg:col-span-4',
  },
  {
    id: 'prod_m03',
    type: 'detail-card',
    title: 'The Shah Rukh Khan Grosgrain Tuxedo',
    price: '₹11,499',
    tag: '03 / SHAH RUKH KHAN',
    note: 'King Khan black tie →',
    noteArrow: 'right',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85',
    rotate: '-2.5deg',
    colSpan: 'lg:col-span-3',
  },
  {
    id: 'prod_w02',
    type: 'polaroid',
    title: 'The Kareena Royal Blazer Dress',
    price: '₹5,999',
    tag: '04 / KAREENA KAPOOR KHAN',
    note: 'Begum of Pataudi elegance',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85',
    caption: 'Bandra Atelier — sample fit',
    rotate: '-2deg',
    colSpan: 'lg:col-span-4',
  },
  {
    id: 'prod_m02',
    type: 'large-photo',
    title: 'The Ranbir Kensington Cashmere Overcoat',
    price: '₹8,999',
    tag: '05 / RANBIR KAPOOR',
    note: '“unlined Mongolian cashmere”',
    noteArrow: 'up-right',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85',
    rotate: '1.5deg',
    colSpan: 'lg:col-span-5',
    tapeText: 'RANBIR ARCHIVE',
  },
  {
    id: 'prod_w03',
    type: 'detail-card',
    title: 'The Sobhita Nocturne Plush Velvet Mini',
    price: '₹5,299',
    tag: '06 / SOBHITA DHULIPALA',
    note: 'Venice premiere night',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=85',
    rotate: '2deg',
    colSpan: 'lg:col-span-3',
  },
];

const CollectionMoodboard = () => {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-[#F5EFE6] border-y border-[#2C2A29]/10 relative overflow-hidden">
      {/* Background Scrapbook Margin Labels */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-[#2C2A29]/15 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
              PAGE 02 • MOODBOARD PINBOARD
            </span>
            <span className="font-handwriting text-base text-[#A66551]">
              (pinned by the design team)
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191817]">
            COLLECTION MOODBOARD
          </h2>
        </div>

        <Link
          to="/products"
          className="font-handwriting text-xl text-[#191817] hover:text-[#A66551] transition-colors mt-4 md:mt-0 inline-flex items-center gap-1 hand-drawn-underline"
        >
          <span>view full garment index</span>
          <ArrowUpRight width={14} height={14} />
        </Link>
      </div>

      {/* Asymmetrical Pinboard Collage */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
        {moodboardItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`${item.colSpan} relative group`}
          >
            {/* Handwritten note attached to item */}
            {item.note && (
              <div className="mb-2 pl-2">
                <HandwrittenNote
                  text={item.note}
                  arrow={item.noteArrow || 'none'}
                  color="text-[#A66551]"
                  rotate={index % 2 === 0 ? '-2deg' : '2deg'}
                />
              </div>
            )}

            {/* Render item as Polaroid or Photo card */}
            {item.type === 'polaroid' ? (
              <Link to={`/product/${item.id}`} className="block">
                <Polaroid
                  image={item.image}
                  caption={item.title}
                  subCaption={`${item.tag} • ${item.price}`}
                  rotate={item.rotate}
                  tapeText="SAMPLE"
                />
              </Link>
            ) : (
              <Link
                to={`/product/${item.id}`}
                style={{ transform: `rotate(${item.rotate})` }}
                className="block bg-[#FDFCF9] p-3.5 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#2C2A29]/10 relative transition-transform duration-300 hover:scale-[1.02] hover:rotate-0 group"
              >
                {/* Washi Tape Accent */}
                <div className="absolute -top-3 left-6 z-20">
                  <Tape
                    rotate="-5deg"
                    variant={index % 2 === 0 ? 'kraft' : 'dark'}
                    text={item.tapeText || 'PIECE'}
                    width="w-20"
                    height="h-5"
                  />
                </div>

                <div className="aspect-[4/5] overflow-hidden bg-[#ECE8DF]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center filter contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="mt-3 flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A756F] block">
                      {item.tag}
                    </span>
                    <h3 className="font-serif text-lg text-[#191817] font-normal leading-snug group-hover:text-[#A66551] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#191817] pt-0.5">
                    {item.price}
                  </span>
                </div>
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CollectionMoodboard;
