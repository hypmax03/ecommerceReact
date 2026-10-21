import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus } from 'iconoir-react';
import Tape from '../components/Tape';
import Polaroid from '../components/Polaroid';
import HandwrittenNote from '../components/HandwrittenNote';
import { getProduct } from '../redux/productSlice';
import { DRESS_COLLECTION_PRODUCTS } from '../data/fashionProducts';

const rotations = ['-2.5deg', '2deg', '-1.5deg', '3deg', '-2deg', '1.5deg', '-1deg', '2.5deg'];
const tapeVariants = ['kraft', 'dark', 'cream'];

const Archive = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product || { products: [] });
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getProduct({ status: 'approved' }));
    }
  }, [dispatch, products]);

  const displayProducts = products && products.length > 0 ? products : DRESS_COLLECTION_PRODUCTS;
  const categories = ['All', ...new Set(displayProducts.map((p) => p.category).filter(Boolean))];

  const filteredProducts = displayProducts.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-[#2C2A29]/15 pb-8 mb-10 relative">
          <div className="absolute -top-3 right-6 pointer-events-none hidden sm:block">
            <Tape rotate="2deg" variant="kraft" text="ATELIER DOSSIER" width="w-36" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7A756F]">
              DOCUMENTARY ARCHIVE • VOL. IV
            </span>
            <span className="font-handwriting text-base text-[#A66551]">
              (uncropped manual product records)
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#191817]">
            POLAROID &amp; FILM ARCHIVES
          </h1>
          <p className="font-sans text-sm text-[#5C5751] font-light mt-2 max-w-xl">
            Physical photographic plates and catalog prints documenting bespoke garments curated into the collection.
          </p>
        </div>

        {/* Category Filter Strip if products exist */}
        {displayProducts.length > 0 && categories.length > 1 && (
          <div className="flex items-center gap-2 mb-12 flex-wrap bg-[#F5EFE6] p-3 border border-[#2C2A29]/15">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] mr-2">
              CURATION CATEGORY:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`font-mono text-xs uppercase tracking-wider px-3 py-1 border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] font-bold shadow-sm'
                    : 'bg-[#FAF7F2] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
                }`}
              >
                {cat === 'All' ? `ALL PIECES (${displayProducts.length})` : cat}
              </button>
            ))}
          </div>
        )}

        {/* Empty Archive State when no manual products have been added yet */}
        {displayProducts.length === 0 ? (
          <div className="py-24 px-8 text-center bg-[#FDFCF9] border border-dashed border-[#2C2A29]/25 max-w-3xl mx-auto shadow-sm">
            <div className="inline-block mb-4">
              <Tape rotate="-1deg" variant="kraft" text="ARCHIVE VAULT" width="w-32" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal mb-3">
              The Atelier Archive is Empty
            </h2>
            <p className="font-sans text-sm text-[#5C5751] max-w-md mx-auto leading-relaxed mb-6 font-light">
              No physical catalog pieces have been added yet. Once garments are added and approved through the admin atelier, photographic plates will automatically appear here.
            </p>
            <HandwrittenNote
              text="“all garment entries are cataloged manually”"
              color="text-[#7A756F]"
              className="mb-8"
            />
            <div className="flex justify-center">
              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-7 py-3.5 shadow hover:bg-[#2C2A29] transition-colors"
              >
                <Plus width={15} height={15} />
                <span>+ ADD MANUAL PIECE TO ATELIER</span>
              </Link>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-[#FDFCF9] border border-[#2C2A29]/15 p-6">
            <p className="font-serif text-lg text-[#5C5751]">No pieces found in this category.</p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="mt-4 font-mono text-xs uppercase tracking-wider text-[#A66551] underline cursor-pointer"
            >
              View all archive pieces
            </button>
          </div>
        ) : (
          /* Polaroids Scattered Grid for real manual products */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-center">
            {filteredProducts.map((item, idx) => {
              const imgUrl = item.images?.[0] || item.image;
              const rotate = rotations[idx % rotations.length];
              const tapeVariant = tapeVariants[idx % tapeVariants.length];
              const tapeText = item.gender?.toUpperCase() || item.category?.toUpperCase() || 'ATELIER';

              return (
                <motion.div
                  key={item._id || item.id || idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: (idx % 8) * 0.08 }}
                  className="flex justify-center"
                >
                  <Link to={`/product/${item._id || item.id}`} className="block">
                    <Polaroid
                      image={imgUrl}
                      caption={item.name}
                      subCaption={`₹${item.price?.toLocaleString('en-IN')} • ${item.category || 'Atelier'}`}
                      rotate={rotate}
                      tapeText={tapeText}
                      tapeVariant={tapeVariant}
                      aspect="aspect-[4/5]"
                      className="w-full max-w-[270px]"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

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
