import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowUpRight, Check, Plus, Minus, ArrowLeft, Refresh } from 'iconoir-react';
import { getProductById, deleteProduct } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';
import Polaroid from './Polaroid';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.product || { products: [] });
  const user = useSelector((state) => state.user?.user);

  // Find product in local list or fallback
  const product = products.find((p) => (p._id || p.id) === id) || products[0];

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [openAccordion, setOpenAccordion] = useState('provenance');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes ? product.sizes[0] : 'M');
      setSelectedColor(product.colors ? product.colors[0]?.name : 'Signature');
      setActiveImage(product.image);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-6 text-center bg-[#FAF7F2]">
        <h2 className="font-serif text-3xl">Piece Not Found</h2>
        <Link to="/products" className="font-mono text-xs text-[#A66551] underline mt-4 inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const galleryImages = [
    product.image,
    product.hoverImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
  ].filter(Boolean);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        size: selectedSize,
        color: selectedColor,
        quantity,
      })
    );
  };

  const handleDelete = () => {
    if (window.confirm('Remove this design from the atelier index?')) {
      dispatch(deleteProduct(product._id || product.id));
      navigate('/products');
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation & Breadcrumb */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#2C2A29]/15">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#7A756F] hover:text-[#191817] transition-colors"
          >
            <ArrowLeft width={14} height={14} />
            <span>BACK TO GARMENT CATALOG</span>
          </Link>

          <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A756F]">
            PLATE REF: {product._id || product.id}
          </span>
        </div>

        {/* 2 Column Editorial Layout (Left: Large Images, Right: Sticky Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Multi-image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Large Image with Tape Pin */}
            <div className="bg-[#FDFCF9] p-4 sm:p-5 border border-[#2C2A29]/15 shadow-md relative">
              <div className="absolute -top-3.5 left-12 z-20 pointer-events-none">
                <Tape rotate="-2deg" variant="kraft" text="PRIMARY PLATE" width="w-32" />
              </div>

              <div className="aspect-[3/4] overflow-hidden bg-[#ECE8DF]">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-[#7A756F] border-t border-dashed border-[#2C2A29]/10 pt-2 uppercase">
                <span>{product.edition || 'PERMANENT ARCHIVE'}</span>
                <span className="font-handwriting text-sm text-[#A66551]">natural studio lighting</span>
              </div>
            </div>

            {/* Thumbnail Swatch Strip */}
            <div className="grid grid-cols-3 gap-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`bg-[#FDFCF9] p-2 border transition-all text-left group ${
                    activeImage === img ? 'border-[#191817] shadow-md scale-[1.02]' : 'border-[#2C2A29]/15 hover:border-[#7A756F]'
                  }`}
                >
                  <div className="aspect-[4/5] bg-[#ECE8DF] overflow-hidden mb-1.5">
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#7A756F] block">
                    ANGLE 0{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Polaroid Detail Photo */}
            <div className="pt-6 hidden sm:block">
              <Polaroid
                image={product.hoverImage || product.image}
                caption={`${product.name} — atelier fitting`}
                subCaption={`Handcrafted in ${product.madeIn || 'Como, Italy'}`}
                rotate="1deg"
                tapeText="DETAIL SWATCH"
                tapeVariant="dark"
              />
            </div>
          </div>

          {/* RIGHT: Sticky Product Specification Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            {/* Header / Brand & Name */}
            <div className="bg-[#FDFCF9] p-6 sm:p-8 border border-[#2C2A29]/15 shadow-sm space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                    {product.category} • {product.gender || 'UNISEX'}
                  </span>
                  {product.isNew && (
                    <span className="font-mono text-[8px] bg-[#191817] text-[#FAF7F2] px-2 py-0.5 uppercase tracking-widest">
                      NEW EDITION
                    </span>
                  )}
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl text-[#191817] font-normal leading-tight mt-1">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-mono text-2xl font-bold text-[#191817]">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono text-[10px] text-[#7A756F] uppercase">
                    (INCL. ALL TAXES &amp; DUTIES)
                  </span>
                </div>
              </div>

              {/* Editorial Description */}
              <p className="font-sans text-xs sm:text-sm text-[#5C5751] font-light leading-relaxed border-t border-dashed border-[#2C2A29]/10 pt-4">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F]">
                      FABRIC DYE: <strong className="text-[#191817]">{selectedColor}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor === c.name ? 'border-[#191817] scale-110 shadow-sm' : 'border-transparent hover:border-[#A8A39D]'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor === c.name && (
                          <Check
                            width={13}
                            height={13}
                            className={c.hex === '#111111' || c.hex === '#161616' ? 'text-white' : 'text-black'}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F]">
                    SELECT SIZE
                  </span>
                  <span className="font-handwriting text-sm text-[#A66551]">
                    (true to bespoke measurements)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || ['XS', 'S', 'M', 'L', 'XL']).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-11 px-3.5 font-mono text-xs uppercase border transition-all ${
                        selectedSize === size
                          ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] font-bold shadow-sm'
                          : 'bg-[#FAF7F2] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & ADD TO BAG */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <div className="flex items-center border border-[#2C2A29]/20 bg-[#FAF7F2] px-2 h-12">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-[#EFE8DC] text-[#191817]"
                    aria-label="Decrease quantity"
                  >
                    <Minus width={12} height={12} />
                  </button>
                  <span className="font-mono text-sm px-4 font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-[#EFE8DC] text-[#191817]"
                    aria-label="Increase quantity"
                  >
                    <Plus width={12} height={12} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-[0.2em] h-12 flex items-center justify-center gap-2.5 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <ShoppingBag width={15} height={15} />
                  <span>ADD PIECE TO BAG</span>
                </button>
              </div>

              {/* Admin Actions if signed in or modifying */}
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#7A756F]">
                <Link
                  to={`/updateproduct`}
                  state={{ product }}
                  className="hover:underline"
                >
                  [ EDIT PIECE SPECIFICATIONS ]
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-red-700 hover:underline"
                >
                  [ ARCHIVE DELETE ]
                </button>
              </div>
            </div>

            {/* Accordion Specification Cards */}
            <div className="space-y-3">
              {/* Accordion 1: Material & Provenance */}
              <div className="bg-[#FDFCF9] border border-[#2C2A29]/15 p-4">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'provenance' ? '' : 'provenance')}
                  className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#191817] font-bold text-left"
                >
                  <span>01 / TEXTILE PROVENANCE &amp; ORIGIN</span>
                  <span>{openAccordion === 'provenance' ? '−' : '+'}</span>
                </button>
                {openAccordion === 'provenance' && (
                  <div className="mt-3 pt-3 border-t border-dashed border-[#2C2A29]/10 font-sans text-xs text-[#5C5751] space-y-1.5 leading-relaxed">
                    <p><strong>Origin:</strong> {product.madeIn || 'Como & Biella, Northern Italy'}</p>
                    <p><strong>Fiber:</strong> {product.material || 'Super 130s Extra-Fine Italian Wool'}</p>
                    <p><strong>Fit:</strong> {product.fit || 'Bespoke architectural drape, true to measurement'}</p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Care & Maintenance */}
              <div className="bg-[#FDFCF9] border border-[#2C2A29]/15 p-4">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? '' : 'care')}
                  className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#191817] font-bold text-left"
                >
                  <span>02 / GARMENT CARE &amp; CONSERVATION</span>
                  <span>{openAccordion === 'care' ? '−' : '+'}</span>
                </button>
                {openAccordion === 'care' && (
                  <div className="mt-3 pt-3 border-t border-dashed border-[#2C2A29]/10 font-sans text-xs text-[#5C5751] space-y-1.5 leading-relaxed">
                    <p>• Specialist green dry clean only for virgin wool and silk blends.</p>
                    <p>• Store on wide wooden cedar hangers to preserve shoulder structure.</p>
                    <p>• Steam gently between wears to release natural travel creases.</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Dispatch & Returns */}
              <div className="bg-[#FDFCF9] border border-[#2C2A29]/15 p-4">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                  className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#191817] font-bold text-left"
                >
                  <span>03 / COMPLIMENTARY COURIER &amp; PACKAGING</span>
                  <span>{openAccordion === 'shipping' ? '−' : '+'}</span>
                </button>
                {openAccordion === 'shipping' && (
                  <div className="mt-3 pt-3 border-t border-dashed border-[#2C2A29]/10 font-sans text-xs text-[#5C5751] space-y-1.5 leading-relaxed">
                    <p>• Complimentary express dispatch on all orders over ₹8,000.</p>
                    <p>• Hand-packed in reusable recycled paper boxes with cedar moth repellent.</p>
                    <p>• 14-day physical returns and size swaps accommodated seamlessly.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
