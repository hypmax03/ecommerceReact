import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'iconoir-react';
import HeroScrapbook from '../components/HeroScrapbook';
import CollectionMoodboard from '../components/CollectionMoodboard';
import EditorialSection from '../components/EditorialSection';
import ArchiveSection from '../components/ArchiveSection';
import HorizontalCollection from '../components/HorizontalCollection';
import ProductCard from '../components/ProductCard';
import Tape from '../components/Tape';
import HandwrittenNote from '../components/HandwrittenNote';

const Home = () => {
  const { products } = useSelector((state) => state.product || { products: [] });
  const [selectedGenderTab, setSelectedGenderTab] = useState('All');

  const filteredProducts = products.filter((p) => {
    if (selectedGenderTab === 'All') return true;
    return p.gender === selectedGenderTab;
  }).slice(0, 8);

  return (
    <main className="w-full bg-[#FAF7F2]">
      {/* 1. Scrapbook Hero Section */}
      <HeroScrapbook />

      {/* 2. Collection Moodboard (Overlapping Photos, Polaroids, Detail Shots) */}
      <CollectionMoodboard />

      {/* 3. Broken-Grid Editorial Section ("WHAT WE KEEP.") */}
      <EditorialSection />

      {/* 4. "FROM THE ARCHIVE" Polaroid Section */}
      <ArchiveSection />

      {/* 5. Horizontal Scrapbook Scroll (LOOK 01 - 05) */}
      <HorizontalCollection />

      {/* 6. Featured Catalog Pinboard */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-[#FAF7F2] border-b border-[#2C2A29]/10 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header with Gender Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#2C2A29]/15">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                  CURATED CATALOG • SECTION 06
                </span>
                <span className="font-handwriting text-base text-[#A66551]">
                  (selected for everyday wearing)
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191817]">
                FEATURED ATELIER PIECES
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mt-4 md:mt-0 flex-wrap">
              {['All', 'Women', 'Men'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedGenderTab(tab)}
                  className={`font-mono text-xs uppercase tracking-widest px-3.5 py-1.5 border transition-all ${
                    selectedGenderTab === tab
                      ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] font-bold shadow-sm'
                      : 'bg-[#FDFCF9] text-[#7A756F] border-[#2C2A29]/20 hover:border-[#191817] hover:text-[#191817]'
                  }`}
                >
                  {tab === 'All' ? 'ALL PIECES (24)' : tab === 'Women' ? 'WOMEN’S ATELIER' : 'MEN’S SARTORIAL'}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid with Scrapbook cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product._id || product.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: (idx % 4) * 0.1 }}
              >
                <ProductCard product={product} index={idx} priority={idx < 4} />
              </motion.div>
            ))}
          </div>

          {/* Bottom Catalog Action Link */}
          <div className="mt-16 text-center">
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-[0.2em] px-8 py-4 shadow-lg hover:bg-[#2C2A29] transition-transform hover:-translate-y-0.5"
            >
              <span>VIEW ENTIRE 24-PIECE ARCHIVE</span>
              <ArrowUpRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <div className="mt-3">
              <HandwrittenNote
                text="“new fabric editions are added to the journal every month”"
                color="text-[#7A756F]"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Scrapbook Studio Invitation Box */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto bg-[#FDFCF9] p-8 sm:p-12 border border-[#2C2A29]/15 shadow-[0_12px_40px_rgba(0,0,0,0.06)] relative text-center">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none">
            <Tape rotate="1deg" variant="kraft" text="ATELIER VISIT" width="w-36" />
          </div>

          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7A756F] block mb-2">
            PRIVATE APPOINTMENTS • MILAN &amp; PARIS
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#191817] font-normal mb-4">
            Experience the Fabrics in Person
          </h3>
          <p className="font-sans text-sm text-[#5C5751] font-light max-w-lg mx-auto leading-relaxed mb-6">
            We welcome clients to our private showroom atelier to inspect physical swatch rolls, discuss custom measurements with our master tailors, and enjoy an espresso.
          </p>

          <Link
            to="/about"
            className="font-mono text-xs uppercase tracking-widest text-[#191817] font-bold border-b border-[#191817] pb-1 hover:text-[#A66551] hover:border-[#A66551] transition-colors"
          >
            REQUEST A PRIVATE ATELIER APPOINTMENT →
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;