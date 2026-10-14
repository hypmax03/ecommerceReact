
const Tape = ({
  className = '',
  rotate = '-2deg',
  width = 'min-w-[6rem] px-3',
  height = 'h-6 sm:h-7',
  variant = 'kraft', // 'kraft' | 'dark' | 'cream' | 'translucent'
  text = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return 'bg-[#2C2A29] text-[#FAF7F2] border-x border-dashed border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.15)]';
      case 'cream':
        return 'bg-[#FAF7F2] text-[#2C2A29] border-x border-dashed border-[#A8A39D]/60 shadow-[0_2px_6px_rgba(0,0,0,0.08)]';
      case 'translucent':
        return 'bg-white/80 text-[#2C2A29] border-x border-dashed border-black/20 shadow-[0_2px_6px_rgba(0,0,0,0.06)]';
      case 'kraft':
      default:
        return 'bg-[#E5D7BC] text-[#3D372F] border-x border-dashed border-[#B8AA8A] shadow-[0_2px_6px_rgba(0,0,0,0.08)]';
    }
  };

  return (
    <div
      style={{ transform: `rotate(${rotate})` }}
      className={`relative inline-flex items-center justify-center ${width} ${height} ${getVariantStyles()} backdrop-blur-[1px] select-none pointer-events-none z-30 transition-transform duration-300 ${className}`}
    >
      {text && (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap leading-none px-1 text-center">
          {text}
        </span>
      )}
    </div>
  );
};

export default Tape;
