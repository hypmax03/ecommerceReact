import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'iconoir-react';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';

const HorizontalCollection = () => {
  const scrollRef = useRef(null);
  const { products } = useSelector((state) => state.product || { products: [] });

  // If there are no products added yet, do not render static mock images
  if (!products || products.length === 0) {
    return null;
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const rotations = ['-1deg', '1.5deg', '-2deg', '1deg', '-1.5deg', '0.8deg'];

  return (
    <section className="py-24 sm:py-32 bg-[#FAF7F2] border-b border-[#2C2A29]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#2C2A29]/15 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                LIVE LOOKBOOK • HORIZONTAL INDEX
              </span>
              <span className="font-handwriting text-base text-[#A66551]">
                (curated garment plates)
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191817]">
              LOOKBOOK REPERTOIRE
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
        className="flex gap-8 overflow-x-auto no-scrollbar px-6 sm:px-8 lg:px-12 pt-6 pb-8 scroll-smooth"
      >
        {products.slice(0, 10).map((item, index) => {
          const lookNumber = `LOOK ${String(index + 1).padStart(2, '0')}`;
          const rotate = rotations[index % rotations.length];
          const tapeVariant = index % 3 === 0 ? 'kraft' : index % 3 === 1 ? 'dark' : 'cream';
          const imgUrl = item.images?.[0] || item.image;

          return (
            <motion.div
              key={item._id || item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              style={{ transform: `rotate(${rotate})` }}
              className="flex-shrink-0 w-[310px] sm:w-[380px] bg-[#FDFCF9] p-5 pt-6 border border-[#2C2A29]/15 shadow-[0_12px_35px_rgba(0,0,0,0.06)] relative group hover:rotate-0 transition-transform duration-300"
            >
              {/* Washi Tape at Header */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <Tape
                  rotate="1deg"
                  variant={tapeVariant}
                  text={lookNumber}
                  width="w-24"
                />
              </div>

              {/* Look Header Info */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-dashed border-[#2C2A29]/10 pt-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#191817]">
                  PAGE 0{index + 1}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F]">
                  {item.category || 'READY-TO-WEAR'}
                </span>
              </div>

              {/* Image Container */}
              <Link
                to={`/product/${item._id || item.id}`}
                className="block aspect-[4/5] overflow-hidden bg-[#ECE8DF] relative"
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-center filter contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#7A756F]">
                    [Atelier Plate]
                  </div>
                )}
              </Link>

              {/* Look Narrative Details */}
              <div className="mt-4 space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl text-[#191817] font-normal leading-tight truncate">
                  {item.name}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F]">
                  {item.gender === 'Women' ? 'Women’s Atelier' : item.gender === 'Men' ? 'Men’s Sartorial' : 'Unisex'} • ₹{item.price?.toLocaleString('en-IN')}
                </p>

                {/* Handwritten Note Snippet */}
                <div className="pt-2">
                  <HandwrittenNote
                    text={item.material ? `“crafted in ${item.material}”` : '“artisan bespoke tailoring”'}
                    color="text-[#A66551]"
                    rotate="-1deg"
                    className="text-base truncate block"
                  />
                </div>

                {/* Fabric Specs */}
                <div className="pt-3 border-t border-dashed border-[#2C2A29]/10 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-[#7A756F] truncate max-w-[200px]">
                    {item.material || 'Noble Fiber'}
                  </span>
                  <Link
                    to={`/product/${item._id || item.id}`}
                    className="font-mono text-[10px] uppercase font-bold text-[#191817] hover:text-[#A66551] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>VIEW PIECE</span>
                    <ArrowUpRight width={11} height={11} />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default HorizontalCollection;
