import React from 'react';
import { motion } from 'framer-motion';

const HandwrittenNote = ({
  children,
  text,
  arrow = 'right', // 'right' | 'left' | 'down' | 'up-right' | 'none'
  rotate = '-1.5deg',
  className = '',
  color = 'text-[#2C2A29]',
  badge = false,
}) => {
  const renderArrow = () => {
    switch (arrow) {
      case 'right':
        return <span className="inline-block ml-1.5 transition-transform duration-300 group-hover:translate-x-1">→</span>;
      case 'left':
        return <span className="inline-block mr-1.5 transition-transform duration-300 group-hover:-translate-x-1">←</span>;
      case 'down':
        return <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-y-1">↓</span>;
      case 'up-right':
        return <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>;
      case 'none':
      default:
        return null;
    }
  };

  if (badge) {
    return (
      <div
        style={{ transform: `rotate(${rotate})` }}
        className={`inline-flex items-center gap-1 px-3 py-1 bg-[#F5EFE6] border border-[#D1C9BC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-handwriting ${color} ${className}`}
      >
        <span>{text || children}</span>
        {renderArrow()}
      </div>
    );
  }

  return (
    <div
      style={{ transform: `rotate(${rotate})` }}
      className={`font-handwriting text-lg sm:text-xl md:text-2xl leading-snug tracking-wide ${color} ${className}`}
    >
      <span>{text || children}</span>
      {renderArrow()}
    </div>
  );
};

export default HandwrittenNote;
