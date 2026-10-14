import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Eye,
  Plus,
  Minus,
  Check,
  ArrowUpRight,
} from 'iconoir-react';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';
import { addToCart, setQuickViewProduct } from '../redux/cartSlice';
import { ATELIER_BAGS } from '../data/fashionProducts';

const SILHOUETTES = [
  'All Bags',
  'Crossbody & Shoulder',
  'Totes & Shoppers',
  'Evening Clutches',
  'Travel & Weekend',
];

const BagSection = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product || { products: [] });

  // Merge database bags with handcrafted atelier reference bags
  const dbBags = (products || []).filter(
    (p) =>
      p.category &&
      (p.category.toLowerCase().includes('bag') ||
        p.category.toLowerCase().includes('leather') ||
        p.category.toLowerCase().includes('tote') ||
        p.category.toLowerCase().includes('clutch'))
  );

  const allAvailableBags = [...dbBags, ...ATELIER_BAGS];

  const [activeSilhouette, setActiveSilhouette] = useState('All Bags');
  const [selectedBagIndex, setSelectedBagIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Active hero bag
  const activeBag = allAvailableBags[selectedBagIndex] || ATELIER_BAGS[0];
  const activeColor =
    activeBag.colors && activeBag.colors[selectedColorIndex]
      ? activeBag.colors[selectedColorIndex]
      : { name: 'Signature Leather', image: activeBag.image || activeBag.images?.[0] };

  const currentDisplayImage =
    activeColor.image || activeBag.image || activeBag.images?.[0];

  // Filtered grid bags
  const filteredBags = allAvailableBags.filter((b) => {
    if (activeSilhouette === 'All Bags') return true;
    return (
      b.silhouette === activeSilhouette ||
      (b.category && b.category.toLowerCase().includes(activeSilhouette.toLowerCase()))
    );
  });

  const handleAddToCart = (bag, colorName = null) => {
    const chosenColor =
      colorName ||
      (bag.colors && bag.colors[0]?.name) ||
      'Signature Leather';

    dispatch(
      addToCart({
        product: {
          _id: bag._id || bag.id,
          name: bag.name,
          price: bag.price,
          image: bag.image || (bag.images && bag.images[0]),
          category: bag.category || 'Bags & Leather Goods',
          gender: bag.gender || 'Women',
          edition: 'ATELIER MAROQUINERIE',
        },
        size: 'One Size',
        color: chosenColor,
        quantity: quantity,
      })
    );

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleQuickView = (bag) => {
    dispatch(
      setQuickViewProduct({
        ...bag,
        image: bag.image || (bag.images && bag.images[0]),
      })
    );
  };

  return (
    <section
      id="atelier-bags"
      className="py-24 sm:py-32 bg-[#FAF7F2] text-[#191817] relative border-b border-[#2C2A29]/10 overflow-hidden"
    >
      {/* Background Scrapbook Watermarks */}
      <div className="absolute top-10 right-10 font-mono text-[9px] uppercase tracking-[0.3em] text-[#A8A39D] pointer-events-none select-none">
        FIG. 04 — ATELIER MAROQUINERIE
      </div>
      <div className="absolute top-16 left-6 font-handwriting text-base text-[#A66551] rotate-[-3deg] pointer-events-none select-none hidden lg:block">
        (vegetable-tanned leathers &amp; bespoke brass hardware)
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* Section Header */}
        <div className="border-b border-[#2C2A29]/15 pb-8 mb-12 relative">
          <div className="absolute -top-3.5 right-6 pointer-events-none hidden sm:block">
            <Tape rotate="1.5deg" variant="kraft" text="HANDMADE LEATHER GOODS" width="w-48" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
              SECTION 04 • BAG ARCHIVE &amp; LEATHER STUDY
            </span>
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#EFE8DC] text-[#4A443A] border border-[#D1C9BC] uppercase tracking-wider">
              VOL. IV
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191817]">
                ATELIER BAGS &amp; LEATHER
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#5C5751] font-light mt-2 max-w-2xl leading-relaxed">
                Sculpted by master maroquiniers using full-grain Tuscan hides, hand-burnished beeswax edges,
                and solid antiqued brass fixtures meant to endure a lifetime of journeys.
              </p>
            </div>

            {/* Silhouette Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {SILHOUETTES.map((sil) => (
                <button
                  key={sil}
                  type="button"
                  onClick={() => setActiveSilhouette(sil)}
                  className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border transition-all ${
                    activeSilhouette === sil
                      ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] shadow-sm'
                      : 'bg-[#FDFCF9] text-[#5C5751] border-[#2C2A29]/20 hover:border-[#191817] hover:text-[#191817]'
                  }`}
                >
                  {sil}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. HERO SPOTLIGHT: Interactive Centerpiece Bag */}
        <div className="bg-[#FDFCF9] border border-[#2C2A29]/15 p-6 sm:p-10 lg:p-12 shadow-sm mb-16 relative">
          <div className="absolute -top-3.5 left-10 pointer-events-none">
            <Tape rotate="-1.5deg" variant="dark" text="FEATURED ATELIER PIECE" width="w-44" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Tactile Photographic Spread with Frame and Washi Tape */}
            <div className="lg:col-span-6 relative">
              <div className="relative bg-[#FAF7F2] p-4 sm:p-6 border border-[#2C2A29]/15 shadow-md">
                <div className="absolute -top-3 right-6 pointer-events-none">
                  <Tape rotate="2.5deg" variant="masking" text="CRAFT NO. 04" width="w-28" />
                </div>

                <div className="aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-[#EFE8DC] relative group">
                  <motion.img
                    key={currentDisplayImage}
                    initial={{ opacity: 0.8, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src={currentDisplayImage}
                    alt={activeBag.name}
                    className="w-full h-full object-cover object-center filter contrast-[1.03] group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#191817]/85 text-[#FAF7F2] font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 backdrop-blur-sm">
                    {activeColor.name}
                  </div>
                </div>

                {/* Sub-thumb previews if colors exist */}
                {activeBag.colors && activeBag.colors.length > 1 && (
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#2C2A29]/10">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F]">
                      FINISHES:
                    </span>
                    <div className="flex items-center gap-2">
                      {activeBag.colors.map((c, idx) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColorIndex(idx)}
                          className={`w-7 h-7 rounded-none border transition-all flex items-center justify-center p-0.5 ${
                            selectedColorIndex === idx
                              ? 'border-[#191817] ring-1 ring-[#191817]'
                              : 'border-[#2C2A29]/20 hover:border-[#191817]'
                          }`}
                          title={c.name}
                        >
                          <span
                            className="w-full h-full block"
                            style={{ backgroundColor: c.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Tactile Bag Dossier & Interactive Bag Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] bg-[#EFE8DC] border border-[#D1C9BC] px-2 py-0.5 text-[#191817]">
                    {activeBag.silhouette || 'MAROQUINERIE'}
                  </span>
                  <span className="font-mono text-[9px] text-[#7A756F]">
                    REF: {activeBag._id ? String(activeBag._id).slice(-6).toUpperCase() : 'ATEL-04'}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#191817] mb-2">
                  {activeBag.name}
                </h3>

                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-2xl font-bold text-[#191817]">
                    ₹{activeBag.price?.toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono text-[10px] text-[#7A756F] uppercase tracking-wider">
                    (VAT INCLUDED • COMPLIMENTARY INSURED COURIER)
                  </span>
                </div>
              </div>

              <p className="font-sans text-xs sm:text-sm text-[#5C5751] font-light leading-relaxed">
                {activeBag.description}
              </p>

              {/* Technical Specifications Dossier Table */}
              <div className="p-4 bg-[#FAF7F2] border border-[#2C2A29]/10 font-mono text-[10px] space-y-2">
                <div className="flex justify-between border-b border-[#2C2A29]/10 pb-1.5">
                  <span className="text-[#7A756F]">TEXTILE / HIDE:</span>
                  <span className="text-[#191817] font-semibold text-right max-w-[240px]">
                    {activeBag.material || 'Full-Grain Tuscan Box Calf'}
                  </span>
                </div>
                {activeBag.dimensions && (
                  <div className="flex justify-between border-b border-[#2C2A29]/10 pb-1.5">
                    <span className="text-[#7A756F]">DIMENSIONS:</span>
                    <span className="text-[#191817] font-semibold">{activeBag.dimensions}</span>
                  </div>
                )}
                {activeBag.strapDrop && (
                  <div className="flex justify-between border-b border-[#2C2A29]/10 pb-1.5">
                    <span className="text-[#7A756F]">STRAP DROP:</span>
                    <span className="text-[#191817] font-semibold">{activeBag.strapDrop}</span>
                  </div>
                )}
                {activeBag.hardware && (
                  <div className="flex justify-between">
                    <span className="text-[#7A756F]">HARDWARE:</span>
                    <span className="text-[#191817] font-semibold">{activeBag.hardware}</span>
                  </div>
                )}
              </div>

              {/* Quantity & Interactive Add to Bag Controls */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#2C2A29]/20 bg-[#FAF7F2]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-10 flex items-center justify-center text-[#191817] hover:bg-[#EFE8DC] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus width={13} height={13} />
                    </button>
                    <span className="w-10 text-center font-mono text-xs font-semibold text-[#191817]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-10 flex items-center justify-center text-[#191817] hover:bg-[#EFE8DC] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus width={13} height={13} />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(activeBag, activeColor.name)}
                    className="flex-grow bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] font-mono text-xs uppercase tracking-widest py-3 px-6 flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.99]"
                  >
                    {addedAnimation ? (
                      <>
                        <Check width={15} height={15} className="text-[#A6C3A6]" />
                        <span>ADDED TO YOUR BAG</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag width={15} height={15} />
                        <span>ADD TO SHOPPING BAG • ₹{(activeBag.price * quantity).toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickView(activeBag)}
                    className="w-full bg-[#EFE8DC] hover:bg-[#E3D5B8] text-[#191817] font-mono text-xs uppercase tracking-wider py-2.5 border border-[#D1C9BC] flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye width={14} height={14} />
                    <span>QUICK INSPECTION DOSSIER</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CURATED LEATHER CATALOGUE: Grid of Bags */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#2C2A29]/15">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#7A756F]">
                CATALOGUE SELECTION • {filteredBags.length} PIECES
              </span>
              <h3 className="font-serif text-2xl text-[#191817] font-normal mt-0.5">
                The Leather Goods Repertoire
              </h3>
            </div>

            <Link
              to="/products?category=Bags%20%26%20Leather%20Goods"
              className="font-mono text-xs uppercase tracking-widest text-[#191817] hover:underline flex items-center gap-1.5"
            >
              <span>VIEW ENTIRE LEATHER ARCHIVE</span>
              <ArrowUpRight width={13} height={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredBags.map((bag, idx) => {
              const bagImg = bag.image || (bag.images && bag.images[0]);
              const tapeRotations = ['-1deg', '1.5deg', '-2deg', '0.8deg', '-1.2deg', '1.8deg'];
              const tapeRotation = tapeRotations[idx % tapeRotations.length];

              return (
                <div
                  key={bag._id || bag.id || idx}
                  className="bg-[#FDFCF9] border border-[#2C2A29]/15 p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between group"
                >
                  <div className="absolute -top-3 left-8 pointer-events-none z-10">
                    <Tape
                      rotate={tapeRotation}
                      variant={idx % 2 === 0 ? 'kraft' : 'masking'}
                      text={`NO. 0${idx + 1}`}
                      width="w-24"
                    />
                  </div>

                  <div>
                    {/* Polaroid-style Bag Photo */}
                    <div className="aspect-[4/3] overflow-hidden bg-[#EFE8DC] mb-4 relative">
                      <img
                        src={bagImg}
                        alt={bag.name}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-500 filter contrast-[1.02]"
                        loading="lazy"
                      />

                      {/* Silhouette Tag */}
                      <div className="absolute bottom-2 left-2 bg-[#191817]/85 text-[#FAF7F2] font-mono text-[8px] uppercase tracking-widest px-2 py-0.5">
                        {bag.silhouette || 'ATELIER LEATHER'}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F]">
                          {bag.gender ? `${bag.gender.toUpperCase()}'S` : 'UNISEX'}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#191817]">
                          ₹{bag.price?.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <h4 className="font-serif text-lg text-[#191817] font-normal line-clamp-1 group-hover:text-[#A66551] transition-colors">
                        {bag.name}
                      </h4>

                      <p className="font-sans text-[11px] text-[#5C5751] font-light line-clamp-2 leading-relaxed">
                        {bag.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#2C2A29]/10 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickView(bag)}
                      className="bg-[#FAF7F2] hover:bg-[#EFE8DC] text-[#191817] font-mono text-[10px] uppercase tracking-wider py-2 border border-[#2C2A29]/15 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye width={12} height={12} />
                      <span>DETAILS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(bag)}
                      className="bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] font-mono text-[10px] uppercase tracking-wider py-2 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <ShoppingBag width={12} height={12} />
                      <span>ADD TO BAG</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. ATELIER LEATHER SERVICES & LIFETIME MONOGRAM BANNER */}
        <div className="p-6 sm:p-10 bg-[#FAF3E8] border border-[#D9C4A9] relative shadow-sm">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none">
            <Tape rotate="-1deg" variant="kraft" text="ATELIER MAROQUINERIE GUARANTEE" width="w-64" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center md:text-left">
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8B5E3C] font-bold block">
                01 / COMPLIMENTARY MONOGRAMMING
              </span>
              <p className="font-serif text-lg text-[#191817]">Blind Debossing</p>
              <p className="font-sans text-xs text-[#5C5751] font-light leading-relaxed">
                Add up to 3 initials hand-debossed in cold foil or traditional blind stamp at no additional charge.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8B5E3C] font-bold block">
                02 / VEGETABLE-TANNED CERTIFICATE
              </span>
              <p className="font-serif text-lg text-[#191817]">Tuscan Tannery Consortium</p>
              <p className="font-sans text-xs text-[#5C5751] font-light leading-relaxed">
                Tanned exclusively using plant extracts and chestnut bark with zero chrome or synthetic toxins.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8B5E3C] font-bold block">
                03 / LIFETIME STITCH WARRANTY
              </span>
              <p className="font-serif text-lg text-[#191817]">Generational Restoration</p>
              <p className="font-sans text-xs text-[#5C5751] font-light leading-relaxed">
                Complimentary edge re-burnishing and thread maintenance for the lifespan of each bag.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BagSection;
