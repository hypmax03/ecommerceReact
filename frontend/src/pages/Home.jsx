import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'iconoir-react';
import HeroScrapbook from '../components/HeroScrapbook';
import EditorialSection from '../components/EditorialSection';
import HorizontalCollection from '../components/HorizontalCollection';
import ProductCard from '../components/ProductCard';
import HandwrittenNote from '../components/HandwrittenNote';
import { getProduct } from '../redux/productSlice';
import { DRESS_COLLECTION_PRODUCTS } from '../data/fashionProducts';

const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product || { products: [] });
  const { user } = useSelector((state) => state.user || { user: null });
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');

  const [selectedGenderTab, setSelectedGenderTab] = useState('All');

  // Real-time synchronization polling (syncs live approved items periodically)
  useEffect(() => {
    dispatch(getProduct({ status: 'approved' }));
    const interval = setInterval(() => {
      dispatch(getProduct({ status: 'approved' }));
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Seamlessly prioritize live approved backend products, falling back to curated dress collection
  const displayProducts = products && products.length > 0 ? products : DRESS_COLLECTION_PRODUCTS;

  // Filter products by Gender
  const filteredProducts = displayProducts.filter((p) => {
    if (selectedGenderTab !== 'All' && p.gender !== selectedGenderTab) return false;
    return true;
  });

  return (
    <main className="w-full bg-[#FAF7F2]">
      {/* 1. Scrapbook Hero Section */}
      <HeroScrapbook />

      {/* 2. Horizontal Scrapbook Scroll (Dynamic Real Products) */}
      <HorizontalCollection />

      {/* 3. Broken-Grid Editorial Section ("WHAT WE KEEP.") */}
      <EditorialSection />

      {/* 4. Featured Catalog Pinboard (Dynamic Real Products) */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-[#FAF7F2] border-b border-[#2C2A29]/10 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header with Gender Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#2C2A29]/15">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                  CURATED SELECTION • SECTION 06
                </span>
                <span className="font-handwriting text-base text-[#A66551]">
                  (considered pieces for the modern wardrobe)
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191817]">
                FEATURED COLLECTIONS
              </h2>
            </div>

            {/* Gender Filter Tabs */}
            <div className="flex items-center gap-2 mt-4 md:mt-0 flex-wrap">
              {['All', 'Women', 'Men'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedGenderTab(tab)}
                  className={`font-mono text-xs uppercase tracking-widest px-3.5 py-1.5 border transition-all cursor-pointer ${
                    selectedGenderTab === tab
                      ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] font-bold shadow-sm'
                      : 'bg-[#FDFCF9] text-[#7A756F] border-[#2C2A29]/20 hover:border-[#191817] hover:text-[#191817]'
                  }`}
                >
                  {tab === 'All' ? `ALL PIECES (${displayProducts.length})` : tab === 'Women' ? 'WOMEN’S' : 'MEN’S'}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid with Scrapbook cards */}
          {displayProducts.length === 0 ? (
            <div className="py-20 text-center bg-[#FDFCF9] border border-dashed border-[#2C2A29]/20 p-8">
              <h3 className="font-serif text-2xl text-[#191817]">No pieces published to the atelier catalog yet.</h3>
              <HandwrittenNote
                text="“new garments will appear here once submitted and approved by the admin”"
                color="text-[#7A756F]"
                className="mt-2"
              />
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  to="/add"
                  className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-6 py-3.5 shadow hover:bg-[#2C2A29] transition-colors"
                >
                  <span>+ SUBMIT A PIECE FOR CURATION</span>
                  <ArrowUpRight width={14} height={14} />
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 bg-[#EFE8DC] text-[#191817] font-mono text-xs uppercase tracking-widest px-6 py-3.5 border border-[#D1C9BC] hover:bg-[#E3D5B8] transition-colors"
                  >
                    <span>CURATOR DASHBOARD</span>
                  </Link>
                )}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-[#FDFCF9] border border-[#2C2A29]/15 p-6">
              <p className="font-serif text-lg text-[#5C5751]">No pieces found in this category.</p>
              <button
                type="button"
                onClick={() => setSelectedGenderTab('All')}
                className="mt-4 font-mono text-xs uppercase tracking-wider text-[#A66551] underline cursor-pointer"
              >
                View all pieces
              </button>
            </div>
          ) : (
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
          )}

          {/* Bottom Catalog Action Link */}
          <div className="mt-16 text-center">
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-[0.2em] px-8 py-4 shadow-lg hover:bg-[#2C2A29] transition-transform hover:-translate-y-0.5"
            >
              <span>EXPLORE THE FULL COLLECTION</span>
              <ArrowUpRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <div className="mt-3">
              <HandwrittenNote
                text="“thoughtfully selected styles for a modern wardrobe”"
                color="text-[#7A756F]"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;