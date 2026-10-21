import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingBag, Eye, ArrowUpRight } from 'iconoir-react';
import { addToCart, setQuickViewProduct } from '../redux/cartSlice';
import Tape from './Tape';
import ThemeImage from './ThemeImage';

const ProductCard = ({ product, index = 0, priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  if (!product) return null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        product,
        size: product.sizes ? product.sizes[0] : 'M',
        color: product.colors ? product.colors[0]?.name : 'Signature',
        quantity: 1,
      })
    );
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setQuickViewProduct(product));
  };

  // Subtle rotation for organic scrapbook feel
  const rotations = ['-0.6deg', '0.5deg', '-0.4deg', '0.6deg', '-0.3deg', '0.4deg'];
  const cardRotation = rotations[index % rotations.length];
  const lookNumber = `LOOK ${String((index % 24) + 1).padStart(2, '0')}`;
  const tapeVariant = index % 3 === 0 ? 'kraft' : index % 3 === 1 ? 'dark' : 'cream';

  const productImage =
    product.images?.[0] ||
    product.image ||
    product.localImage ||
    '';

  const productHoverImage =
    product.images?.[1] ||
    product.hoverImage;

  return (
    <div className="pt-6 pb-3 px-1">
      <div
        style={{ transform: `rotate(${cardRotation})` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-[#FDFCF9] p-4 sm:p-5 pt-7 sm:pt-8 border border-[#2C2A29]/15 shadow-[0_6px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_14px_35px_rgba(0,0,0,0.09)] hover:-translate-y-1.5 hover:rotate-0 flex flex-col justify-between"
      >
        {/* Washi Tape Header with "LOOK 01" */}
        <div className="absolute -top-3.5 left-5 sm:left-6 z-30 pointer-events-none drop-shadow-sm">
          <Tape
            rotate={index % 2 === 0 ? '-2.5deg' : '2deg'}
            variant={tapeVariant}
            text={lookNumber}
          />
        </div>

        {/* Top Monospace Metadata Header */}
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-dashed border-[#2C2A29]/10 pt-1">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7A756F]">
            {product.category || 'READY-TO-WEAR'}
          </span>
          <span className="font-handwriting text-sm text-[#A66551]">
            {product.gender === 'Women' ? 'Women’s' : product.gender === 'Men' ? 'Men’s' : 'Unisex'}
          </span>
        </div>

        {/* Image Stage with Crossfade & Quick Action */}
        <Link
          to={`/product/${product._id || product.id}`}
          className="relative block w-full aspect-[3/4] overflow-hidden bg-[#ECE8DF] cursor-pointer"
        >
          {/* Primary Image */}
          <ThemeImage
            src={productImage}
            fallbackSrc={product.localImage || (product.images && product.images[1])}
            alt={product.name}
            priority={priority}
            wrapperClassName="w-full h-full"
            className={`transition-all duration-700 ease-out group-hover:scale-105 ${
              productHoverImage && isHovered ? 'opacity-0' : ''
            }`}
            label="DEVELOPING..."
            subLabel="garment plate"
          />

          {/* Secondary Crossfade Image */}
          {productHoverImage && (
            <div
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out ${
                isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <ThemeImage
                src={productHoverImage}
                alt={`${product.name} alternate view`}
                loading="lazy"
                wrapperClassName="w-full h-full"
                className="transition-transform duration-700 ease-out group-hover:scale-105"
                label="ALTERNATE LOOK..."
                subLabel="atelier view"
              />
            </div>
          )}

          {/* Badge Stamps */}
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-[#191817] text-[#FAF7F2] font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 z-10">
              NEW ARRIVAL
            </span>
          )}

          {/* Hover Action Strip */}
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
            <button
              type="button"
              onClick={handleQuickView}
              className="flex-1 bg-[#FAF7F2]/95 hover:bg-[#FAF7F2] text-[#191817] font-mono text-[9px] uppercase tracking-wider py-2 px-2.5 flex items-center justify-center gap-1 border border-[#2C2A29]/20 shadow-sm cursor-pointer"
            >
              <Eye width={12} height={12} />
              <span>QUICK VIEW</span>
            </button>
            <button
              type="button"
              onClick={handleQuickAdd}
              className="bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] p-2 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              aria-label="Add to bag"
            >
              <ShoppingBag width={13} height={13} />
            </button>
          </div>
        </Link>

        {/* Product Information Section */}
        <div className="pt-3.5 space-y-2">
          <Link
            to={`/product/${product._id || product.id}`}
            className="block font-serif text-base sm:text-lg text-[#191817] font-normal leading-snug group-hover:text-[#A66551] transition-colors truncate"
          >
            {product.name}
          </Link>

          {/* Price & View Action */}
          <div className="pt-2 border-t border-dashed border-[#2C2A29]/10 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#191817]">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>

            <Link
              to={`/product/${product._id || product.id}`}
              className="font-mono text-[10px] uppercase tracking-widest text-[#7A756F] group-hover:text-[#191817] inline-flex items-center gap-1 transition-colors"
            >
              <span>VIEW</span>
              <ArrowUpRight width={10} height={10} />
            </Link>
          </div>

          {/* Micro Handwritten Annotation on Hover */}
          <div className="h-5 overflow-hidden">
            <p
              className={`font-handwriting text-xs text-[#A66551] transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {product.material ? product.material.split('&')[0].trim() : 'single-origin natural fiber'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
