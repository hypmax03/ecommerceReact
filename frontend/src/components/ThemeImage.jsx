import React, { useState, useEffect, useRef } from 'react';

/**
 * ThemeImage
 * 
 * An atelier-themed image component with darkroom exposure & warm parchment loading states.
 * While loading, renders an editorial craft paper shimmer with a rotating compass/aperture motif
 * and typeset "DEVELOPING PLATE..." label.
 * Eagerly pre-initiates image loading, monitors instantaneous browser completion,
 * and provides smooth photographic reveals without artificial delays.
 */
const ThemeImage = ({
  src,
  alt = 'Atelier garment plate',
  className = '',
  wrapperClassName = '',
  aspect = '',
  loading = 'eager',
  priority = false,
  compact = false,
  label = 'DEVELOPING PLATE...',
  subLabel = 'atelier archive',
  objectFit = 'object-cover',
  dark = false,
  fallbackSrc = null,
  onLoad = null,
  onError = null,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc || '');
  const imgRef = useRef(null);

  // Sync internal src with prop changes and reset states
  useEffect(() => {
    const nextSrc = src || fallbackSrc || '';
    setCurrentSrc(nextSrc);
    setHasError(false);

    // If there's an existing image node with this src that is already complete, mark loaded immediately
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src, fallbackSrc]);

  // Continuously check for instant completion (e.g. from disk/memory cache)
  useEffect(() => {
    if (isLoaded || !currentSrc) return;

    // Check immediately and on brief intervals to avoid any synthetic event lag
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      return;
    }

    const interval = setInterval(() => {
      if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setIsLoaded(true);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [currentSrc, isLoaded]);

  const handleImageLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setHasError(true);
    setIsLoaded(true);
    if (onError) onError(e);
  };

  // Ref callback to capture instant DOM completion
  const handleRef = (node) => {
    imgRef.current = node;
    if (node && node.complete && node.naturalWidth > 0) {
      setIsLoaded(true);
    }
  };

  return (
    <div
      className={`relative overflow-hidden select-none ${aspect} ${
        dark ? 'bg-[#181412]' : 'bg-[#ECE8DF]'
      } ${wrapperClassName}`}
    >
      {/* =========================================================================
          1. ATELIER THEMED LOADING ANIMATION & DARKROOM SHIMMER
          ========================================================================= */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-400 ease-out ${
          dark ? 'bg-[#181412]' : 'bg-[#ECE8DF]'
        } ${isLoaded || hasError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-hidden="true"
      >
        {/* Subtle paper grain texture pattern */}
        <div
          className={`absolute inset-0 opacity-[0.06] pointer-events-none ${
            dark
              ? 'bg-[radial-gradient(#FAF7F2_1px,transparent_1px)]'
              : 'bg-[radial-gradient(#191817_1px,transparent_1px)]'
          } [background-size:16px_16px]`}
        />

        {/* Warm Parchment Light Sweep Shimmer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`w-full h-full animate-shimmer-paper ${
              dark
                ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
                : 'bg-gradient-to-r from-transparent via-[#FAF7F2]/65 to-transparent'
            }`}
          />
        </div>

        {/* Themed Centerpiece Indicator */}
        {compact ? (
          /* Compact Micro Loader for Small Thumbnails (Cart, Search, Swatches) */
          <div className="relative flex items-center justify-center">
            <div
              className={`w-6 h-6 rounded-full border border-dashed animate-spin-slow ${
                dark ? 'border-white/30' : 'border-[#7A756F]/40'
              }`}
            />
            <div className="absolute w-2 h-2 rounded-full bg-[#A66551] animate-film-pulse" />
          </div>
        ) : (
          /* Full Atelier Darkroom Exposure Indicator for Editorial & Cards */
          <div className="relative z-10 flex flex-col items-center justify-center p-3 text-center">
            {/* Rotating Dashed Compass Ring with Aperture Core */}
            <div className="relative w-11 h-11 flex items-center justify-center mb-2.5">
              {/* Outer Dashed Compass Ring */}
              <div
                className={`absolute inset-0 rounded-full border border-dashed animate-spin-slow ${
                  dark ? 'border-white/30' : 'border-[#7A756F]/45'
                }`}
              />
              {/* Inner Thin Frame */}
              <div
                className={`absolute inset-1.5 rounded-full border ${
                  dark ? 'border-white/15' : 'border-[#2C2A29]/10'
                }`}
              />
              {/* Central Pulsing Darkroom Aperture Icon */}
              <div className="w-4 h-4 text-[#A66551] animate-film-pulse flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-full h-full"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.2" strokeDasharray="3 2" />
                  <path
                    d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m11 0l-2-2m-7-7l-2-2"
                    strokeWidth="1"
                  />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.25" />
                </svg>
              </div>
            </div>

            {/* Typeset status text */}
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.24em] font-medium block animate-pulse ${
                dark ? 'text-white/70' : 'text-[#7A756F]'
              }`}
            >
              {label}
            </span>

            {/* Handwritten sub-label */}
            {subLabel && (
              <span className="font-handwriting text-xs text-[#A66551] mt-0.5 block tracking-normal">
                {subLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          2. THEMED FALLBACK FOR MISSING OR ERRORED IMAGES
          ========================================================================= */}
      {hasError || !currentSrc ? (
        <div
          className={`w-full h-full flex flex-col items-center justify-center p-3 text-center border ${
            dark
              ? 'bg-[#181412] border-white/10 text-white/60'
              : 'bg-[#FDFCF9] border-[#2C2A29]/15 text-[#7A756F]'
          }`}
        >
          <div className="w-8 h-8 rounded-full border border-dashed border-current/40 flex items-center justify-center mb-1.5 opacity-60">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest font-bold">
            [ARCHIVED PLATE]
          </span>
          <span className="font-handwriting text-xs text-[#A66551] mt-0.5">
            atelier specimen record
          </span>
        </div>
      ) : (
        /* =========================================================================
            3. PRIMARY IMAGE WITH DARKROOM REVEAL TRANSITION
            ========================================================================= */
        <img
          ref={handleRef}
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : loading}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full ${objectFit} transition-all duration-500 ease-out ${
            isLoaded
              ? 'opacity-100 filter-none scale-100'
              : 'opacity-0 scale-[1.01]'
          } ${className}`}
          {...rest}
        />
      )}
    </div>
  );
};

export default ThemeImage;
