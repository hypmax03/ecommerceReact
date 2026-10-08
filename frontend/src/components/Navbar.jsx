import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, Xmark, ArrowRight } from 'iconoir-react';
import { toggleCart, toggleSearch } from '../redux/cartSlice';

const navLinks = [
  { label: 'SHOP', to: '/products' },
  { label: 'COLLECTION', to: '/collections' },
  { label: 'ABOUT', to: '/about' },
  { label: 'ARCHIVE', to: '/archive' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart?.items || []);
  const user = useSelector((state) => state.user?.user);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md py-3 border-b border-[#2C2A29]/10 shadow-[0_4px_20px_rgba(44,42,41,0.04)]'
            : 'bg-[#FAF7F2]/60 backdrop-blur-[2px] py-4 sm:py-5 border-b border-[#2C2A29]/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Brand Logo on Left (Paper Stamp Style) */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex flex-col group focus:outline-none"
              aria-label="Atelier Journal Homepage"
            >
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#191817] group-hover:opacity-80 transition-opacity">
                  ATELIER JOURNAL
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#EFE8DC] text-[#4A443A] border border-[#D1C9BC] uppercase tracking-wider rounded-none hidden sm:inline">
                  VOL. IV
                </span>
              </div>
              <span className="font-handwriting text-sm text-[#7A756F] -mt-1 group-hover:text-[#191817] transition-colors">
                notes, garments &amp; collected memories
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => {
              const isActive =
                link.to === '/products'
                  ? location.pathname === '/products' && !location.search
                  : location.pathname === link.to;

              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-200 relative py-1 ${
                    isActive
                      ? 'text-[#191817] font-bold'
                      : 'text-[#7A756F] hover:text-[#191817]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navTabUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#191817]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Search, Account, Bag) */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => dispatch(toggleSearch(true))}
              className="flex items-center gap-1.5 text-[#191817] hover:opacity-60 transition-opacity p-1 focus:outline-none"
              aria-label="Open search journal"
            >
              <Search width={18} height={18} strokeWidth={1.5} />
              <span className="font-mono text-[10px] uppercase tracking-wider hidden lg:inline text-[#7A756F]">
                SEARCH
              </span>
            </button>

            {/* Account Link */}
            <Link
              to={user ? '/account' : '/login'}
              className="flex items-center gap-1.5 text-[#191817] hover:opacity-60 transition-opacity p-1 focus:outline-none"
              aria-label={user ? `Account: ${user.name}` : 'Login to Journal'}
            >
              <User width={18} height={18} strokeWidth={1.5} />
              {user && (
                <span className="font-handwriting text-base text-[#191817] max-w-[80px] truncate hidden md:inline">
                  {user.name}
                </span>
              )}
            </Link>

            {/* Bag Button */}
            <button
              type="button"
              onClick={() => dispatch(toggleCart(true))}
              className="relative flex items-center gap-1.5 text-[#191817] hover:opacity-60 transition-opacity p-1 focus:outline-none"
              aria-label={`Open Bag (${totalCartCount} items)`}
            >
              <ShoppingBag width={18} height={18} strokeWidth={1.5} />
              <span className="font-mono text-[10px] uppercase tracking-wider hidden lg:inline text-[#7A756F]">
                BAG
              </span>
              {totalCartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#2C2A29] text-[#FAF7F2] font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                >
                  {totalCartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 text-[#191817] hover:opacity-60 transition-opacity focus:outline-none ml-1"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <Xmark width={22} height={22} strokeWidth={1.5} />
              ) : (
                <Menu width={22} height={22} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Scrapbook Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-[#FAF7F2] pt-24 px-8 pb-10 flex flex-col justify-between md:hidden border-b border-[#2C2A29]/15 shadow-xl"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#2C2A29]/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                  JOURNAL SECTIONS
                </span>
                <span className="font-handwriting text-base text-[#A66551]">
                  page index 01–04
                </span>
              </div>

              <div className="flex flex-col space-y-4">
                {navLinks.map((link, idx) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="flex items-center justify-between py-2 group border-b border-dashed border-[#2C2A29]/10"
                  >
                    <div>
                      <span className="font-serif text-3xl font-normal text-[#191817] group-hover:translate-x-2 inline-block transition-transform">
                        {link.label}
                      </span>
                      <p className="font-handwriting text-sm text-[#7A756F]">
                        {idx === 0 && 'browse all garments'}
                        {idx === 1 && 'moodboards & lookbooks'}
                        {idx === 2 && 'the atelier story'}
                        {idx === 3 && 'polaroid archives'}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[#7A756F]">
                      0{idx + 1}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-[#2C2A29]/15 pt-6 space-y-3">
              <Link
                to={user ? '/account' : '/login'}
                className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#191817]"
              >
                <span>{user ? `CLIENT ACCOUNT: ${user.name}` : 'CLIENT LOGIN / REGISTER'}</span>
                <ArrowRight width={14} height={14} />
              </Link>
              <p className="font-handwriting text-sm text-[#7A756F]">
                Atelier Scrapbook Edition • Issue 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
