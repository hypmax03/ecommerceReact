import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'iconoir-react';
import Tape from '../components/Tape';
import HandwrittenNote from '../components/HandwrittenNote';
import ProductCard from '../components/ProductCard';
import { getProduct } from '../redux/productSlice';

const Collections = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product || { products: [] });
  const { user } = useSelector((state) => state.user || { user: null });
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');

  useEffect(() => {
    dispatch(getProduct({ status: 'approved' }));
  }, [dispatch]);

  // Group approved products dynamically by Category
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="border-b border-[#2C2A29]/15 pb-8 mb-12 relative">
          <div className="absolute -top-3 right-8 pointer-events-none hidden sm:block">
            <Tape rotate="-2deg" variant="kraft" text="CURATED ARCHIVE" width="w-40" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7A756F]">
              ATELIER INDEX • LIVE COLLECTION DOSSIERS
            </span>
            <span className="font-handwriting text-base text-[#A66551]">
              (curated by atelier directors)
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#191817]">
                COLLECTIONS &amp; CAMPAIGNS
              </h1>
              <p className="font-sans text-sm text-[#5C5751] font-light mt-2 max-w-xl">
                A visual documentation of live approved garment chapters and textile studies.
              </p>
            </div>

            <Link
              to="/add"
              className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] font-mono text-xs uppercase tracking-widest px-5 py-3 transition-colors shadow-sm self-start md:self-auto"
            >
              <Plus width={14} height={14} />
              <span>{isAdmin ? 'ADMIN: ADD GARMENT' : 'SUBMIT GARMENT'}</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Collections / Products Display */}
        {products.length === 0 ? (
          <div className="bg-[#FDFCF9] border border-dashed border-[#2C2A29]/20 p-12 sm:p-16 text-center shadow-sm relative my-8">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none">
              <Tape rotate="1deg" variant="kraft" text="EMPTY COLLECTION REGISTRY" />
            </div>

            <h3 className="font-serif text-3xl text-[#191817] font-normal mb-3">
              No garments registered in the collection yet.
            </h3>
            <p className="font-sans text-sm text-[#5C5751] max-w-md mx-auto font-light leading-relaxed mb-6">
              All previous demo images have been cleared. As an administrator, you can now add authentic garments with custom photography, pricing, and textile specifications.
            </p>

            <HandwrittenNote
              text="“new collections will automatically assemble here once products are created in the admin portal”"
              color="text-[#A66551]"
              rotate="-0.5deg"
              className="mb-8"
            />

            <div className="flex flex-wrap justify-center items-center gap-4">
              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-6 py-3.5 shadow-md hover:bg-[#2C2A29]"
              >
                <span>+ ADD FIRST GARMENT</span>
                <ArrowUpRight width={14} height={14} />
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 bg-[#EFE8DC] text-[#191817] font-mono text-xs uppercase tracking-widest px-6 py-3.5 border border-[#D1C9BC] hover:bg-[#E3D5B8]"
                >
                  <span>ADMIN DASHBOARD</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map((category, catIdx) => {
              const catProducts = products.filter((p) => p.category === category);
              return (
                <div key={category} className="bg-[#FDFCF9] p-6 sm:p-10 border border-[#2C2A29]/15 shadow-sm relative">
                  <div className="absolute -top-3.5 left-8 pointer-events-none">
                    <Tape
                      rotate={catIdx % 2 === 0 ? '-2deg' : '2deg'}
                      variant={catIdx % 2 === 0 ? 'kraft' : 'dark'}
                      text={`CHAPTER 0${catIdx + 1} • ${category.toUpperCase()}`}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-4 border-b border-[#2C2A29]/10 pt-2">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal">
                        {category}
                      </h2>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#7A756F]">
                        {catProducts.length} {catProducts.length === 1 ? 'PIECE' : 'PIECES'} CATALOGUED
                      </span>
                    </div>

                    <Link
                      to={`/products?category=${category}`}
                      className="font-mono text-xs uppercase tracking-wider text-[#191817] hover:text-[#A66551] inline-flex items-center gap-1 transition-colors mt-2 sm:mt-0"
                    >
                      <span>VIEW FULL CHAPTER</span>
                      <ArrowUpRight width={12} height={12} />
                    </Link>
                  </div>

                  {/* Grid of products belonging to this collection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {catProducts.map((product, pIdx) => (
                      <ProductCard key={product._id || product.id} product={product} index={pIdx} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Collections;
