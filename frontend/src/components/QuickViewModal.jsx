import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Xmark, ShoppingBag, Check } from 'iconoir-react';
import { setQuickViewProduct, addToCart } from '../redux/cartSlice';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';

const QuickViewModal = () => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.cart?.quickViewProduct);

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes ? product.sizes[0] : 'M');
      setSelectedColor(product.colors ? product.colors[0]?.name : 'Signature');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleClose = () => {
    dispatch(setQuickViewProduct(null));
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        size: selectedSize,
        color: selectedColor,
        quantity,
      })
    );
    handleClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-[#191817]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#FAF7F2] text-[#191817] p-6 sm:p-8 border border-[#2C2A29]/20 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Washi Tape at Modal Header */}
          <div className="absolute -top-3.5 left-10 pointer-events-none">
            <Tape rotate="-3deg" variant="kraft" text="GARMENT SWATCH CARD" width="w-44" />
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center border border-[#2C2A29]/20 hover:bg-[#191817] hover:text-[#FAF7F2] transition-colors z-10"
            aria-label="Close modal"
          >
            <Xmark width={16} height={16} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
            {/* Left Photo View */}
            <div className="md:col-span-6">
              <div className="aspect-[3/4] bg-[#ECE8DF] border border-[#2C2A29]/15 overflow-hidden shadow-sm relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-2 left-2 bg-[#FAF7F2]/90 px-2 py-0.5 border border-[#2C2A29]/15 text-[8px] font-mono uppercase tracking-widest">
                  {product.edition || 'ATELIER EDITION'}
                </div>
              </div>
            </div>

            {/* Right Information & Selectors */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#7A756F] block">
                  {product.category} • {product.gender || 'UNISEX'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal leading-snug">
                  {product.name}
                </h3>
                <p className="font-mono text-base font-bold text-[#191817] mt-1">
                  ₹{product.price?.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Description */}
              <p className="font-sans text-xs text-[#5C5751] font-light leading-relaxed">
                {product.description || 'Handcrafted from single-origin Italian yarn with hand-finished hems and bespoke detailing.'}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F]">
                      COLOR: {selectedColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor === c.name ? 'border-[#191817] scale-110' : 'border-transparent hover:border-[#A8A39D]'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor === c.name && (
                          <Check
                            width={12}
                            height={12}
                            className={c.hex === '#111111' || c.hex === '#161616' ? 'text-white' : 'text-black'}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F]">
                    SELECT SIZE
                  </span>
                  <span className="font-handwriting text-xs text-[#A66551]">
                    true to Italian tailoring
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || ['XS', 'S', 'M', 'L', 'XL']).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[40px] h-9 px-3 font-mono text-xs uppercase border transition-colors ${
                        selectedSize === size
                          ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] font-bold'
                          : 'bg-[#FDFCF9] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Bag Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-[0.2em] py-3.5 flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <ShoppingBag width={14} height={14} />
                  <span>ADD PIECE TO BAG</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <HandwrittenNote
                  text="“dispatches worldwide in 24 hours”"
                  color="text-[#7A756F]"
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
