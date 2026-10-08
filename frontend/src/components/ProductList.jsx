import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Filter, ArrowUpRight, Refresh } from 'iconoir-react';
import ProductCard from './ProductCard';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';
import { ALL_CATEGORIES, GENDERS } from '../data/fashionProducts';
import { getProduct } from '../redux/productSlice';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product || { products: [] });

  const genderParam = searchParams.get('gender') || 'All';
  const categoryParam = searchParams.get('category') || 'All';
  const sortParam = searchParams.get('sort') || 'featured';

  const [selectedGender, setSelectedGender] = useState(genderParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    setSelectedGender(searchParams.get('gender') || 'All');
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  const updateFilters = (gender, category, sort) => {
    const params = {};
    if (gender && gender !== 'All') params.gender = gender;
    if (category && category !== 'All') params.category = category;
    if (sort && sort !== 'featured') params.sort = sort;
    setSearchParams(params);
  };

  const allCategories = useMemo(() => {
    const defaultCats = ALL_CATEGORIES.filter((c) => c !== 'All');
    const productCats = products.map((p) => p.category).filter(Boolean);
    return Array.from(new Set([...defaultCats, ...productCats]));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedGender !== 'All') {
      result = result.filter((p) => p.gender === selectedGender);
    }

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [products, selectedGender, selectedCategory, sortBy]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="border-b border-[#2C2A29]/15 pb-8 mb-10 relative">
          <div className="absolute -top-3 right-6 pointer-events-none hidden sm:block">
            <Tape rotate="2deg" variant="kraft" text="GARMENT ARCHIVE" width="w-36" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7A756F]">
              INDEX NO. 01 • PERMANENT &amp; LIMITED EDITIONS
            </span>
            <span className="font-handwriting text-base text-[#A66551]">
              (all 24 pieces documented)
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#191817]">
                THE GARMENT CATALOG
              </h1>
              <p className="font-sans text-sm text-[#5C5751] font-light mt-2 max-w-xl">
                Bespoke tailoring, Mulberry silk evening pieces, and luxury Italian knitwear cut to order.
              </p>
            </div>

            <Link
              to="/add"
              className="inline-flex items-center gap-2 bg-[#EFE8DC] hover:bg-[#E3D5B8] text-[#191817] font-mono text-xs uppercase tracking-widest px-4 py-2.5 border border-[#D1C9BC] transition-colors"
            >
              <span>+ ADD NEW DESIGN</span>
              <ArrowUpRight width={12} height={12} />
            </Link>
          </div>
        </div>

        {/* Filter Bar & Controls */}
        <div className="bg-[#F5EFE6] p-4 border border-[#2C2A29]/15 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Gender Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] mr-1 hidden sm:inline">
              ATELIER:
            </span>
            {GENDERS.map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => {
                  setSelectedGender(gender);
                  setSelectedCategory('All');
                  updateFilters(gender, 'All', sortBy);
                }}
                className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors ${
                  selectedGender === gender
                    ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] font-bold shadow-sm'
                    : 'bg-[#FAF7F2] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
                }`}
              >
                {gender === 'All' ? 'ALL ATELIERS' : gender === 'Women' ? 'WOMEN’S' : 'MEN’S'}
              </button>
            ))}
          </div>

          {/* Category Dropdown & Sort */}
          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                updateFilters(selectedGender, e.target.value, sortBy);
              }}
              className="bg-[#FAF7F2] border border-[#2C2A29]/20 px-3 py-1.5 font-mono text-xs text-[#191817] focus:outline-none uppercase tracking-wider"
            >
              <option value="All">ALL CATEGORIES</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateFilters(selectedGender, selectedCategory, e.target.value);
              }}
              className="bg-[#FAF7F2] border border-[#2C2A29]/20 px-3 py-1.5 font-mono text-xs text-[#191817] focus:outline-none uppercase tracking-wider"
            >
              <option value="featured">SORT: FEATURED</option>
              <option value="newest">SORT: NEW ARRIVALS</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
            </select>
          </div>
        </div>

        {/* Count Summary */}
        <div className="flex items-center justify-between text-xs font-mono text-[#7A756F] mb-6">
          <span>
            DOCUMENTED: {filteredProducts.length} {filteredProducts.length === 1 ? 'PIECE' : 'PIECES'}
          </span>
          {(selectedGender !== 'All' || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSelectedGender('All');
                setSelectedCategory('All');
                setSortBy('featured');
                setSearchParams({});
              }}
              className="text-[#A66551] hover:underline font-bold"
            >
              RESET ALL FILTERS ✕
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center bg-[#FDFCF9] border border-dashed border-[#2C2A29]/20 p-8">
            <h3 className="font-serif text-2xl text-[#191817]">No pieces matched your curation.</h3>
            <HandwrittenNote
              text="“try selecting ‘All Ateliers’ or resetting your category filter”"
              color="text-[#7A756F]"
              className="mt-2"
            />
            <button
              type="button"
              onClick={() => {
                setSelectedGender('All');
                setSelectedCategory('All');
                setSearchParams({});
              }}
              className="mt-6 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-6 py-3"
            >
              SHOW ALL 24 PIECES
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product._id || product.id || idx}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (idx % 8) * 0.06 }}
              >
                <ProductCard product={product} index={idx} priority={idx < 4} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductList;
