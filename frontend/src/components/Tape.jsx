import React from 'react';

const Tape = ({
  className = '',
  rotate = '-2deg',
  width = 'w-24 sm:w-28',
  height = 'h-6 sm:h-7',
  variant = 'kraft', // 'kraft' | 'dark' | 'cream' | 'translucent'
  text = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return 'bg-[#2C2A29]/80 text-[#FAF7F2] border-x border-dashed border-white/30';
      case 'cream':
        return 'bg-[#FAF7F2]/90 text-[#2C2A29] border-x border-dashed border-[#A8A39D]/40';
      case 'translucent':
        return 'bg-white/60 text-[#2C2A29] border-x border-dashed border-black/20';
      case 'kraft':
      default:
        return 'bg-[#E3D5B8]/85 text-[#4A443A] border-x border-dashed border-[#BDB091]/70';
    }
  };

  return (
    <div
      style={{ transform: `rotate(${rotate})` }}
      className={`relative inline-flex items-center justify-center ${width} ${height} ${getVariantStyles()} shadow-[0_2px_6px_rgba(0,0,0,0.06)] backdrop-blur-[1px] select-none pointer-events-none z-20 transition-transform duration-300 hover:scale-105 ${className}`}
    >
      {text && (
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] font-semibold opacity-85 truncate px-1">
          {text}
        </span>
      )}
    </div>
  );
};

export default Tape;
