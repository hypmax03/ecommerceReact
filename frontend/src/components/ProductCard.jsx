import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, ArrowUpRight } from 'iconoir-react';
import { addToCart, setQuickViewProduct } from '../redux/cartSlice';

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

  // Subtle rotation for slight organic variation
  const rotations = ['-0.8deg', '0.6deg', '-0.5deg', '0.8deg', '-0.4deg', '0.5deg'];
  const cardRotation = rotations[index % rotations.length];

  return (
    <div
      style={{ transform: `rotate(${cardRotation})` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#FDFCF9] p-3 sm:p-4 border border-[#2C2A29]/15 shadow-[0_6px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.09)] hover:-translate-y-1.5 hover:rotate-0 flex flex-col justify-between"
    >
      {/* Top Monospace Label & Badge */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-dashed border-[#2C2A29]/10">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7A756F]">
          {`0${(index % 9) + 1}`} / {product.category || 'ESSENTIAL'}
        </span>
        <span className="font-handwriting text-sm text-[#A66551]">
          {product.gender === 'Women' ? 'Atelier W' : product.gender === 'Men' ? 'Sartorial M' : 'Unisex'}
        </span>
      </div>

      {/* Image Stage with Crossfade & Quick Action */}
      <Link
        to={`/product/${product._id || product.id}`}
        className="relative block w-full aspect-[3/4] overflow-hidden bg-[#ECE8DF] cursor-pointer"
      >
        {/* Primary Image */}
        <img
          src={product.image}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
            product.hoverImage && isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Secondary Crossfade Image */}
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} alternate view`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Badge Stamps */}
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-[#191817] text-[#FAF7F2] font-mono text-[8px] uppercase tracking-widest px-2 py-0.5">
            NEW ARRIVAL
          </span>
        )}

        {/* Hover Action Strip */}
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
          <button
            type="button"
            onClick={handleQuickView}
            className="flex-1 bg-[#FAF7F2]/95 hover:bg-[#FAF7F2] text-[#191817] font-mono text-[9px] uppercase tracking-wider py-2 px-2.5 flex items-center justify-center gap-1 border border-[#2C2A29]/20 shadow-sm"
          >
            <Eye width={12} height={12} />
            <span>SWATCH VIEW</span>
          </button>
          <button
            type="button"
            onClick={handleQuickAdd}
            className="bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] p-2 flex items-center justify-center transition-colors shadow-sm"
            aria-label="Add to bag"
          >
            <ShoppingBag width={13} height={13} />
          </button>
        </div>
      </Link>

      {/* Product Information Section */}
      <div className="pt-3">
        <Link
          to={`/product/${product._id || product.id}`}
          className="block font-serif text-base sm:text-lg text-[#191817] font-normal leading-tight group-hover:text-[#A66551] transition-colors truncate"
        >
          {product.name}
        </Link>

        {/* Price & View Action */}
        <div className="mt-2 pt-2 border-t border-dashed border-[#2C2A29]/10 flex items-center justify-between">
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
        <div className="h-5 overflow-hidden mt-1">
          <p
            className={`font-handwriting text-xs text-[#A66551] transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {product.material ? `handcrafted • ${product.material.split('&')[0]}` : 'pure single-origin textile'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
