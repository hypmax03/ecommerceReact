import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plus } from 'iconoir-react';
import Tape from '../components/Tape';
import HandwrittenNote from '../components/HandwrittenNote';
import ProductCard from '../components/ProductCard';
import { getProduct } from '../redux/productSlice';
import { DRESS_COLLECTION_PRODUCTS } from '../data/fashionProducts';

const Collections = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product || { products: [] });
  const { user } = useSelector((state) => state.user || { user: null });
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');

  const [activeGender, setActiveGender] = useState('All'); // 'All' | 'Women' | 'Men'

  useEffect(() => {
    dispatch(getProduct({ status: 'approved' }));
  }, [dispatch]);

  // Seamlessly prioritize live approved backend products, falling back to curated dress collection
  const displayProducts = products && products.length > 0 ? products : DRESS_COLLECTION_PRODUCTS;

  // Filter products by gender tab
  const filteredProducts = displayProducts.filter((p) => {
    if (activeGender !== 'All' && p.gender !== activeGender) return false;
    return true;
  });

  // Group filtered products into defined Chapters
  const chapters = [
    {
      id: 'summer-dresses',
      title: 'CHAPTER 01 • SUMMER DRESSES & COTTAGECORE',
      subtitle: 'Pure cotton-linen weaves, floral sprig embroidery, and broderie anglaise scallops.',
      category: 'Summer Dresses',
      gender: 'Women',
      tapeVariant: 'kraft',
      rotate: '-1deg',
    },
    {
      id: 'cocktail-evening',
      title: 'CHAPTER 02 • EVENING GOWNS & COCKTAIL ROMANCE',
      subtitle: 'Structured boned velvet bodices, cascading tiered ruffles, and botanical noir silk.',
      categories: ['Evening Gowns', 'Cocktail Dresses'],
      gender: 'Women',
      tapeVariant: 'dark',
      rotate: '1.5deg',
    },
    {
      id: 'sartorial-suits',
      title: 'CHAPTER 03 • SARTORIAL BESPOKE SUITING',
      subtitle: 'Super 120s virgin wool, unstructured Neapolitan shoulders, and double-pleated trousers.',
      category: 'Suits & Tailoring',
      gender: 'Men',
      tapeVariant: 'kraft',
      rotate: '-2deg',
    },
    {
      id: 'quiet-luxury',
      title: 'CHAPTER 04 • QUIET LUXURY & RESORT ESSENTIALS',
      subtitle: 'Silk-cotton fine rib knits and washed French Normandy flax linen in muted earth tones.',
      categories: ['Knitwear', 'Linen & Shirts'],
      gender: 'Men',
      tapeVariant: 'dark',
      rotate: '1deg',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="border-b border-[#2C2A29]/15 pb-8 mb-10 relative">
          <div className="absolute -top-3 right-8 pointer-events-none hidden sm:block">
            <Tape rotate="-2deg" variant="kraft" text="ATELIER DOSSIER 2026" width="w-44" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7A756F]">
              CURATED COLLECTION DOSSIERS • 09 PIECES
            </span>
            <span className="font-handwriting text-base text-[#A66551]">
              (photographed &amp; documented in atelier studio)
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#191817]">
                COLLECTIONS &amp; CAMPAIGNS
              </h1>
              <p className="font-sans text-sm text-[#5C5751] font-light mt-2 max-w-2xl leading-relaxed">
                A visual documentation of authentic dress chapters, bespoke tailoring, and artisanal textile studies curated for the modern wardrobe.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 bg-[#EFE8DC] text-[#191817] hover:bg-[#E3D5B8] border border-[#D1C9BC] font-mono text-xs uppercase tracking-widest px-4 py-3 transition-colors shadow-sm"
              >
                <span>FULL CATALOG INDEX</span>
                <ArrowUpRight width={13} height={13} />
              </Link>
              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] font-mono text-xs uppercase tracking-widest px-5 py-3 transition-colors shadow-sm"
              >
                <Plus width={14} height={14} />
                <span>{isAdmin ? 'ADMIN: ADD PIECE' : 'SUBMIT PIECE'}</span>
              </Link>
            </div>
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex items-center gap-2 mt-8 flex-wrap pt-4 border-t border-dashed border-[#2C2A29]/15">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] mr-2">
              CURATION VIEW:
            </span>
            {[
              { id: 'All', label: 'All Collections (09)' },
              { id: 'Women', label: "Women's Dresses & Gowns (05)" },
              { id: 'Men', label: "Men's Sartorial & Essentials (04)" },
            ].map((tab) => {
              const isSelected = activeGender === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveGender(tab.id)}
                  className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-all ${
                    isSelected
                      ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] shadow-sm'
                      : 'bg-[#FDFCF9] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Collections Chapters */}
        <div className="space-y-16">
          {chapters.map((chapter, idx) => {
            // Filter products matching this chapter
            const chapterProducts = filteredProducts.filter((p) => {
              if (chapter.gender && p.gender !== chapter.gender && activeGender !== 'All') return false;
              if (chapter.category) return p.category === chapter.category;
              if (chapter.categories) return chapter.categories.includes(p.category);
              return true;
            });

            // If gender filter is active and chapter has no matching products, hide chapter
            if (chapterProducts.length === 0) return null;

            return (
              <motion.section
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-[#FDFCF9] p-6 sm:p-10 border border-[#2C2A29]/15 shadow-sm relative"
              >
                {/* Washi Tape Header */}
                <div className="absolute -top-3.5 left-8 pointer-events-none">
                  <Tape
                    rotate={chapter.rotate}
                    variant={chapter.tapeVariant}
                    text={chapter.title.split('•')[0].trim()}
                  />
                </div>

                {/* Chapter Banner & Narrative */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#2C2A29]/10 pt-2 gap-4">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal">
                      {chapter.title}
                    </h2>
                    <p className="font-sans text-xs text-[#5C5751] font-light mt-1 max-w-xl">
                      {chapter.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#7A756F]">
                      {chapterProducts.length} {chapterProducts.length === 1 ? 'PIECE' : 'PIECES'} CATALOGUED
                    </span>
                    <Link
                      to={`/products?${chapter.gender ? `gender=${chapter.gender}&` : ''}${
                        chapter.category ? `category=${encodeURIComponent(chapter.category)}` : ''
                      }`}
                      className="font-mono text-xs uppercase tracking-wider text-[#191817] hover:text-[#A66551] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>BROWSE CHAPTER</span>
                      <ArrowUpRight width={12} height={12} />
                    </Link>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {chapterProducts.map((product, pIdx) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                      index={pIdx}
                    />
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Curation Footer Dossier Stamp */}
        <div className="mt-16 bg-[#F5EFE6] border border-[#2C2A29]/15 p-8 sm:p-10 text-center relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none">
            <Tape rotate="0.5deg" variant="dark" text="AUTHENTIC ATELIER SELECTION" width="w-56" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal mb-2">
            Every Piece Cut, Tailored &amp; Hand-Finished
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#5C5751] max-w-lg mx-auto font-light leading-relaxed mb-6">
            Garments are individually prepared upon order docket authorization. Complimentary global delivery applied to all bespoke collection orders over ₹8,000.
          </p>

          <HandwrittenNote
            text="“quality over quantity • limited edition seasonal releases”"
            color="text-[#A66551]"
            rotate="-0.5deg"
            className="text-lg mb-6 inline-block"
          />

          <div className="flex justify-center items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-6 py-3.5 shadow-md hover:bg-[#2C2A29] transition-all"
            >
              <span>EXPLORE ALL 09 PIECES</span>
              <ArrowUpRight width={14} height={14} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Collections;
