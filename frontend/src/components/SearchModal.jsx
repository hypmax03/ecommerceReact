import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Xmark, ArrowUpRight } from 'iconoir-react';
import { toggleSearch } from '../redux/cartSlice';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';

const curatedTags = [
  'Mulberry Silk',
  'Cashmere Overcoat',
  'Neapolitan Wool Suit',
  'French Flax Linen',
  'Velvet Mini',
  'Organza Gown',
];

const SearchModal = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { isSearchOpen } = useSelector((state) => state.cart || { isSearchOpen: false });
  const { products } = useSelector((state) => state.product || { products: [] });

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.gender?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q)
    );
  }, [query, products]);

  const handleClose = () => {
    dispatch(toggleSearch(false));
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#191817]/60 backdrop-blur-sm z-50"
          />

          {/* Search Box Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-16 sm:top-24 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-auto sm:w-full sm:max-w-2xl bg-[#FAF7F2] text-[#191817] p-6 sm:p-8 border border-[#2C2A29]/20 shadow-2xl z-50 max-h-[80vh] flex flex-col"
          >
            {/* Washi Tape Header */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none">
              <Tape rotate="1deg" variant="kraft" text="SEARCH JOURNAL" width="w-32" />
            </div>

            {/* Modal Header & Close */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2C2A29]/15">
              <div className="flex items-center gap-2">
                <Search width={20} height={20} className="text-[#191817]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#7A756F]">
                  SEARCH THE COLLECTION INDEX
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center border border-[#2C2A29]/20 hover:bg-[#191817] hover:text-[#FAF7F2] transition-colors"
                aria-label="Close search"
              >
                <Xmark width={16} height={16} />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="mt-6 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a garment, fabric (e.g. silk, wool), or category..."
                autoFocus
                className="w-full bg-[#FDFCF9] border border-[#2C2A29]/20 px-4 py-3.5 font-serif text-lg text-[#191817] placeholder:text-[#A8A39D] placeholder:font-sans placeholder:text-sm focus:outline-none focus:border-[#191817] shadow-inner"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[#7A756F] hover:text-[#191817]"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Quick Tag Recommendations */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-handwriting text-sm text-[#A66551]">
                quick queries:
              </span>
              {curatedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="font-mono text-[10px] uppercase tracking-wider bg-[#EFE8DC] hover:bg-[#E3D5B8] text-[#4A443A] px-2 py-1 border border-[#D1C9BC] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Results Output */}
            <div className="mt-6 flex-1 overflow-y-auto space-y-3 pr-1">
              {query.trim() === '' ? (
                <div className="py-8 text-center text-[#7A756F]">
                  <HandwrittenNote
                    text="“start typing to search through our archive of 24 pieces”"
                    color="text-[#7A756F]"
                  />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-8 text-center text-[#7A756F]">
                  <p className="font-serif text-lg">No matching garments found.</p>
                  <HandwrittenNote
                    text="try searching for silk, wool, linen, or men/women"
                    color="text-[#A66551]"
                    className="text-base mt-1"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map((p) => (
                    <Link
                      key={p._id || p.id}
                      to={`/product/${p._id || p.id}`}
                      onClick={handleClose}
                      className="p-2.5 bg-[#FDFCF9] border border-[#2C2A29]/15 hover:border-[#191817] shadow-sm flex items-center gap-3 group transition-colors"
                    >
                      <div className="w-14 h-16 bg-[#ECE8DF] overflow-hidden flex-shrink-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[8px] uppercase tracking-widest text-[#7A756F]">
                          {p.category}
                        </p>
                        <h4 className="font-serif text-sm font-normal text-[#191817] truncate group-hover:text-[#A66551]">
                          {p.name}
                        </h4>
                        <span className="font-mono text-xs font-bold text-[#191817]">
                          ₹{p.price?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <ArrowUpRight width={14} height={14} className="text-[#7A756F] group-hover:text-[#191817]" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
