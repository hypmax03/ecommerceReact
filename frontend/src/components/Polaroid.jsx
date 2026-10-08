import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Tape from './Tape';

const Polaroid = ({
  image,
  caption,
  subCaption = '',
  rotate = '-2deg',
  hasTape = true,
  tapeText = '',
  tapeRotate = '1deg',
  tapeVariant = 'kraft',
  className = '',
  aspect = 'aspect-square',
  onClick,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const initialRotate = shouldReduceMotion ? '0deg' : rotate;

  return (
    <motion.div
      initial={{ rotate: initialRotate }}
      whileHover={{
        rotate: shouldReduceMotion ? '0deg' : '0deg',
        scale: 1.025,
        y: -4,
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`polaroid-frame relative bg-[#FFFFFF] inline-block cursor-pointer select-none group ${className}`}
    >
      {/* Optional Tape at top */}
      {hasTape && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <Tape
            rotate={tapeRotate}
            variant={tapeVariant}
            text={tapeText}
            width="w-20 sm:w-24"
            height="h-5 sm:h-6"
          />
        </div>
      )}

      {/* Photo Frame Container */}
      <div className={`relative w-full ${aspect} overflow-hidden bg-[#ECE8DF] border border-black/5`}>
        <img
          src={image}
          alt={caption || 'Polaroid journal memory'}
          className="w-full h-full object-cover object-center filter saturate-[0.92] contrast-[1.03] transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-amber-950/5 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Handwritten Caption Area at Bottom */}
      <div className="mt-3 sm:mt-3.5 px-1 text-center">
        {caption && (
          <p className="font-handwriting text-base sm:text-lg text-[#2C2A29] leading-tight font-medium">
            {caption}
          </p>
        )}
        {subCaption && (
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#A8A39D] mt-0.5">
            {subCaption}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Polaroid;
