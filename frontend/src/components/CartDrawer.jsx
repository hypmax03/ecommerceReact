import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Xmark, Trash, Plus, Minus, ArrowUpRight, ShoppingBag } from 'iconoir-react';
import { toggleCart, removeFromCart, updateQuantity } from '../redux/cartSlice';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { items, isCartOpen } = useSelector((state) => state.cart || { items: [], isCartOpen: false });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 8000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleCart(false))}
            className="fixed inset-0 bg-[#191817]/60 backdrop-blur-sm z-50"
          />

          {/* Slide-out Paper Journal Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FAF7F2] text-[#191817] shadow-2xl z-50 flex flex-col justify-between border-l border-[#2C2A29]/15"
          >
            {/* Top Drawer Header with Tape & Stamp */}
            <div className="p-6 border-b border-[#2C2A29]/15 bg-[#F5EFE6] relative">
              <div className="absolute -bottom-3 left-8 z-10 pointer-events-none">
                <Tape rotate="-2deg" variant="kraft" text="RECEIPT DOCKET" width="w-28" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                      ATELIER BAG
                    </span>
                    <span className="font-mono text-[9px] bg-[#EFE8DC] px-1.5 py-0.5 border border-[#D1C9BC] font-bold">
                      {totalCount} {totalCount === 1 ? 'PIECE' : 'PIECES'}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-[#191817] mt-0.5">
                    YOUR SARTORIAL BAG
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(toggleCart(false))}
                  className="w-9 h-9 flex items-center justify-center border border-[#2C2A29]/20 hover:bg-[#191817] hover:text-[#FAF7F2] transition-colors"
                  aria-label="Close bag"
                >
                  <Xmark width={18} height={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Free Shipping Meter */}
              <div className="mt-4 pt-3 border-t border-dashed border-[#2C2A29]/10">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#7A756F] mb-1.5">
                  <span>
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-[#A66551] font-bold">✓ COMPLIMENTARY DISPATCH UNLOCKED</span>
                    ) : (
                      `ADD ₹${(freeShippingThreshold - subtotal).toLocaleString('en-IN')} FOR COMPLIMENTARY COURIER`
                    )}
                  </span>
                  <span>{Math.round(progressToFreeShipping)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EFE8DC] overflow-hidden">
                  <div
                    style={{ width: `${progressToFreeShipping}%` }}
                    className="h-full bg-[#191817] transition-all duration-500 ease-out"
                  />
                </div>
              </div>
            </div>

            {/* Cart Items Scrollable List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto bg-[#F5EFE6] border border-[#D1C9BC] flex items-center justify-center text-[#7A756F]">
                    <ShoppingBag width={24} height={24} />
                  </div>
                  <h4 className="font-serif text-xl text-[#191817]">Your bag is currently empty.</h4>
                  <HandwrittenNote
                    text="“no pieces collected yet”"
                    color="text-[#7A756F]"
                  />
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => dispatch(toggleCart(false))}
                      className="inline-block bg-[#191817] text-[#FAF7F2] font-mono text-[10px] uppercase tracking-widest px-6 py-3"
                    >
                      BROWSE THE JOURNAL
                    </button>
                  </div>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.key}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3.5 bg-[#FDFCF9] border border-[#2C2A29]/15 shadow-sm flex gap-4 items-center relative group"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-24 flex-shrink-0 bg-[#ECE8DF] overflow-hidden border border-[#2C2A29]/10">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <Link
                          to={`/product/${item.id}`}
                          onClick={() => dispatch(toggleCart(false))}
                          className="font-serif text-base text-[#191817] font-normal hover:text-[#A66551] transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(item.key))}
                          className="text-[#7A756F] hover:text-[#A66551] p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash width={14} height={14} />
                        </button>
                      </div>

                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] mt-0.5">
                        SIZE: {item.size} • COLOR: {item.color}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#2C2A29]/20 bg-[#FAF7F2]">
                          <button
                            type="button"
                            onClick={() => dispatch(updateQuantity({ key: item.key, delta: -1 }))}
                            className="p-1.5 hover:bg-[#EFE8DC] text-[#191817]"
                            aria-label="Decrease quantity"
                          >
                            <Minus width={11} height={11} />
                          </button>
                          <span className="font-mono text-xs px-2.5 font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => dispatch(updateQuantity({ key: item.key, delta: 1 }))}
                            className="p-1.5 hover:bg-[#EFE8DC] text-[#191817]"
                            aria-label="Increase quantity"
                          >
                            <Plus width={11} height={11} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-mono text-xs font-bold text-[#191817]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Bottom Checkout Action Box */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#2C2A29]/15 bg-[#F5EFE6] space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-[#7A756F]">
                    <span>SUBTOTAL</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#7A756F]">
                    <span>ESTIMATED TAX &amp; COURIER</span>
                    <span>{subtotal >= freeShippingThreshold ? 'FREE' : '₹250'}</span>
                  </div>
                  <div className="pt-2 border-t border-dashed border-[#2C2A29]/15 flex items-center justify-between font-mono text-sm font-bold text-[#191817]">
                    <span>TOTAL ESTIMATED</span>
                    <span>₹{(subtotal + (subtotal >= freeShippingThreshold ? 0 : 250)).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/cart"
                    onClick={() => dispatch(toggleCart(false))}
                    className="w-full bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-[0.2em] py-3.5 flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowUpRight width={14} height={14} />
                  </Link>

                  <div className="text-center">
                    <span className="font-handwriting text-sm text-[#7A756F]">
                      Hand-packed in recycled paper boxes with personalized note.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
