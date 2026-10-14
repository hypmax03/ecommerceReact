import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash,
  Plus,
  Minus,
  ArrowUpRight,
  Check,
  Percentage,
  Truck,
  ShieldCheck,
  Xmark,
} from 'iconoir-react';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromo,
  removePromo,
  setOrderNote,
  addToCart,
} from '../redux/cartSlice';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';

const CartSection = () => {
  const dispatch = useDispatch();
  const { items, promo, orderNote } = useSelector((state) => state.cart || { items: [], promo: null, orderNote: '' });
  const { products } = useSelector((state) => state.product || { products: [] });

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderDocketId, setOrderDocketId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (promo) {
    if (promo.discountPercent) {
      discountAmount = Math.round((subtotal * promo.discountPercent) / 100);
    } else if (promo.discountAmount) {
      discountAmount = Math.min(subtotal, promo.discountAmount);
    }
  }

  const freeShippingThreshold = 8000;
  const isFreeShipping = subtotal >= freeShippingThreshold || promo?.freeShipping || items.length === 0;
  const shipping = isFreeShipping ? 0 : 250;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'ATELIER10' || code === 'ELORA2026' || code === 'ELORA500' || code === 'FREESHIP') {
      dispatch(applyPromo(code));
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try ATELIER10 or ELORA500.');
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientAddress.trim()) {
      alert('Please provide your name and delivery address for dispatch.');
      return;
    }
    const generatedId = `ELO-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderDocketId(generatedId);
    setIsOrdered(true);
    dispatch(clearCart());
  };

  const handleQuickAdd = (product) => {
    dispatch(
      addToCart({
        product,
        size: product.sizes ? product.sizes[0] : 'M',
        color: product.colors ? product.colors[0]?.name : 'Signature',
        quantity: 1,
      })
    );
  };

  return (
    <section id="cart-section" className="py-24 sm:py-32 bg-[#FAF7F2] border-b border-[#2C2A29]/10 relative overflow-hidden">
      {/* Background Decorative Labels */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#2C2A29]/15 pb-6 relative">
          <div className="absolute -top-3.5 right-6 sm:right-10 pointer-events-none">
            <Tape rotate="1.5deg" variant="kraft" text="SECTION 05 • SARTORIAL DOCKET" width="w-44" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                BAG REPERTOIRE • ORDER INVENTORY
              </span>
              <span className="font-handwriting text-base text-[#A66551]">
                ({totalCount} {totalCount === 1 ? 'archival piece' : 'archival pieces'} selected)
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191817]">
              SARTORIAL BAG &amp; DOCKET
            </h2>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <Link
              to="/products"
              className="font-mono text-xs uppercase tracking-wider text-[#7A756F] hover:text-[#191817] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>BROWSE ALL COLLECTIONS</span>
              <ArrowUpRight width={13} height={13} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* ORDER SUCCESS MODAL OVERLAY */}
        <AnimatePresence>
          {isOrdered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FDFCF9] border border-[#2C2A29]/20 p-8 sm:p-12 mb-12 shadow-xl relative text-center max-w-2xl mx-auto"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Tape rotate="-1deg" variant="dark" text={`DOCKET #${orderDocketId}`} width="w-48" />
              </div>

              <div className="w-12 h-12 mx-auto rounded-full bg-[#191817] text-[#FAF7F2] flex items-center justify-center mb-4">
                <Check width={22} height={22} strokeWidth={2} />
              </div>

              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F] block mb-1">
                ORDER DISPATCH CONFIRMED
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#191817] font-normal mb-3">
                Thank You, {clientName}.
              </h3>

              <p className="font-sans text-xs sm:text-sm text-[#5C5751] font-light leading-relaxed max-w-lg mx-auto mb-6">
                Your sartorial order <strong>#{orderDocketId}</strong> has been logged in the atelier registry. Pieces will be prepared, steam-pressed, and dispatched to:
                <br />
                <span className="font-mono text-xs text-[#191817] block mt-2 bg-[#EFE8DC] p-2 border border-[#D1C9BC]">
                  {clientAddress}
                </span>
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto p-4 bg-[#F5EFE6] border border-[#2C2A29]/10 text-left font-mono text-xs mb-6">
                <div>
                  <span className="text-[10px] text-[#7A756F] block">DISPATCH TIMELINE</span>
                  <span className="font-bold text-[#191817]">2–4 Business Days</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A756F] block">CONCIERGE CONTACT</span>
                  <span className="font-bold text-[#191817]">concierge@elora.com</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOrdered(false);
                  setClientName('');
                  setClientAddress('');
                }}
                className="bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] font-mono text-xs uppercase tracking-widest px-8 py-3.5 shadow-md transition-colors"
              >
                DISMISS &amp; CONTINUE BROWSING
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {items.length === 0 ? (
          /* EMPTY STATE WITH QUICK-ADD RECOMMENDATIONS */
          <div className="bg-[#FDFCF9] border border-[#2C2A29]/15 p-8 sm:p-14 shadow-sm relative text-center">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none">
              <Tape rotate="-0.8deg" variant="kraft" text="EMPTY DOSSIER" width="w-36" />
            </div>

            <div className="w-16 h-16 mx-auto bg-[#F5EFE6] border border-[#D1C9BC] flex items-center justify-center text-[#7A756F] mb-4">
              <ShoppingBag width={28} height={28} strokeWidth={1.5} />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal mb-2">
              Your Sartorial Bag Is Blank.
            </h3>

            <p className="font-sans text-xs sm:text-sm text-[#5C5751] font-light max-w-md mx-auto mb-6">
              You haven't reserved any garments for this order session. Add archival silhouettes below to populate your live dispatch docket.
            </p>

            <HandwrittenNote
              text="“a capsule begins with a single considered cut”"
              color="text-[#A66551]"
              className="text-base mb-8 block"
            />

            {/* Quick Add Suggestions if products exist */}
            {products && products.length > 0 && (
              <div className="pt-8 border-t border-dashed border-[#2C2A29]/15">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F] block mb-6">
                  CURATED RECOMMENDATIONS FOR IMMEDIATE DOCKET ADDITION:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                  {products.slice(0, 3).map((prod, idx) => {
                    const prodImg = (prod.images && prod.images[0]) || prod.image || '';
                    return (
                      <div
                        key={prod._id || prod.id || idx}
                        className="bg-[#FAF7F2] p-4 border border-[#2C2A29]/15 flex flex-col justify-between group hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3">
                          <div className="aspect-[3/4] bg-[#ECE8DF] overflow-hidden border border-[#2C2A29]/10 relative">
                            {prodImg ? (
                              <img
                                src={prodImg}
                                alt={prod.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-[#7A756F]">
                                [ATELIER PIECE]
                              </div>
                            )}
                            <div className="absolute top-2 left-2">
                              <span className="font-mono text-[8px] bg-[#191817] text-[#FAF7F2] px-1.5 py-0.5 uppercase tracking-wider">
                                {prod.gender}
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block">
                              {prod.category}
                            </span>
                            <h4 className="font-serif text-base text-[#191817] font-normal truncate">
                              {prod.name}
                            </h4>
                            <p className="font-mono text-xs font-bold text-[#191817] mt-1">
                              ₹{Number(prod.price).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickAdd(prod)}
                          className="mt-4 w-full bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-[10px] uppercase tracking-widest py-2.5 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Plus width={12} height={12} />
                          <span>ADD TO BAG</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ACTIVE CART SECTION: 2-COLUMN SCRAPBOOK LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: Garment Items in Scrapbook Cards */}
            <div className="lg:col-span-7 space-y-5">
              {/* Top Free Shipping Progress Notice */}
              <div className="bg-[#F5EFE6] border border-[#2C2A29]/15 p-4 shadow-sm relative">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#191817] mb-2">
                  <span className="flex items-center gap-2">
                    <Truck width={14} height={14} />
                    {subtotal >= freeShippingThreshold ? (
                      <strong className="text-[#A66551]">✓ COMPLIMENTARY COURIER DISPATCH UNLOCKED</strong>
                    ) : (
                      <span>
                        Add <strong>₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')}</strong> for complimentary delivery
                      </span>
                    )}
                  </span>
                  <span className="font-bold">{Math.round(progressToFreeShipping)}%</span>
                </div>

                <div className="w-full h-1.5 bg-[#EFE8DC] overflow-hidden">
                  <div
                    style={{ width: `${progressToFreeShipping}%` }}
                    className="h-full bg-[#191817] transition-all duration-500 ease-out"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item, index) => {
                  const itemRotations = ['-0.5deg', '0.6deg', '-0.3deg', '0.4deg'];
                  const rotation = itemRotations[index % itemRotations.length];

                  return (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{ transform: `rotate(${rotation})` }}
                      className="bg-[#FDFCF9] p-5 sm:p-6 border border-[#2C2A29]/15 shadow-sm hover:shadow-md transition-shadow relative flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                    >
                      {/* Left side: Photo & details */}
                      <div className="flex gap-4 sm:gap-5 items-center w-full sm:w-auto">
                        <div className="w-20 h-28 sm:w-24 sm:h-32 bg-[#ECE8DF] border border-[#2C2A29]/15 overflow-hidden flex-shrink-0 relative group">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-[#7A756F] text-center p-1">
                              [ATELIER SWATCH]
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A756F]">
                              {item.category}
                            </span>
                            <span className="font-mono text-[8px] px-1.5 py-0.2 bg-[#EFE8DC] border border-[#D1C9BC] uppercase">
                              {item.gender}
                            </span>
                          </div>

                          <Link
                            to={`/product/${item.id}`}
                            className="font-serif text-lg sm:text-xl text-[#191817] font-normal hover:text-[#A66551] block truncate"
                          >
                            {item.name}
                          </Link>

                          <div className="font-mono text-xs text-[#7A756F] flex items-center gap-3">
                            <span>SIZE: <strong className="text-[#191817]">{item.size}</strong></span>
                            <span>•</span>
                            <span>TONE: <strong className="text-[#191817]">{item.color}</strong></span>
                          </div>

                          <span className="font-mono text-sm font-bold text-[#191817] block pt-1">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Right side: Quantity Stepper, Line Total, Delete */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-5 pt-3 sm:pt-0 border-t sm:border-0 border-dashed border-[#2C2A29]/15">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#2C2A29]/20 bg-[#FAF7F2]">
                          <button
                            type="button"
                            onClick={() => dispatch(updateQuantity({ key: item.key, delta: -1 }))}
                            className="p-2 hover:bg-[#EFE8DC] text-[#191817] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus width={12} height={12} />
                          </button>
                          <span className="font-mono text-xs px-3 font-bold min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => dispatch(updateQuantity({ key: item.key, delta: 1 }))}
                            className="p-2 hover:bg-[#EFE8DC] text-[#191817] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus width={12} height={12} />
                          </button>
                        </div>

                        {/* Line Total */}
                        <span className="font-mono text-sm font-bold text-[#191817] min-w-[75px] text-right">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>

                        {/* Trash Button */}
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(item.key))}
                          className="w-8 h-8 flex items-center justify-center text-[#7A756F] hover:text-[#A66551] hover:bg-[#FAF7F2] border border-transparent hover:border-[#2C2A29]/15 transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash width={16} height={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Clear Entire Bag Button */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] hover:text-[#A66551] transition-colors underline"
                >
                  [ CLEAR SARTORIAL BAG ]
                </button>
                <span className="font-handwriting text-sm text-[#7A756F]">
                  hand-inspected before packaging
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: Atelier Bill of Lading & Order Summary */}
            <div className="lg:col-span-5 bg-[#FDFCF9] border border-[#2C2A29]/15 p-6 sm:p-8 shadow-sm space-y-6 relative">
              <div className="absolute -top-3.5 left-8 pointer-events-none">
                <Tape rotate="-1deg" variant="dark" text="BILL OF LADING" width="w-36" />
              </div>

              <div className="border-b border-[#2C2A29]/15 pb-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#7A756F] block">
                  ORDER REQUISITION
                </span>
                <h3 className="font-serif text-2xl text-[#191817] font-normal mt-0.5">
                  DISPATCH SUMMARY
                </h3>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2.5 font-mono text-xs text-[#5C5751] border-b border-dashed border-[#2C2A29]/15 pb-4">
                <div className="flex justify-between">
                  <span>GARMENTS SUBTOTAL ({totalCount})</span>
                  <span className="text-[#191817]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {promo && discountAmount > 0 && (
                  <div className="flex justify-between text-[#A66551] font-bold">
                    <span>VOUCHER: {promo.label}</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>EXPRESS COURIER</span>
                  <span className="text-[#191817]">
                    {shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>ATELIER ARCHIVAL BOX</span>
                  <span className="text-[#191817]">INCLUDED</span>
                </div>

                <div className="pt-3 border-t border-[#2C2A29]/15 flex justify-between font-bold text-base text-[#191817]">
                  <span>TOTAL ESTIMATED</span>
                  <span className="text-xl">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block">
                  ATELIER COURTESY VOUCHER
                </span>

                {promo ? (
                  <div className="flex items-center justify-between bg-[#EFE8DC] p-2.5 border border-[#D1C9BC] font-mono text-xs">
                    <div className="flex items-center gap-2 text-[#191817]">
                      <Percentage width={13} height={13} />
                      <span className="font-bold">{promo.code}</span>
                      <span className="text-[10px] text-[#7A756F]">({promo.label})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch(removePromo())}
                      className="text-[#7A756F] hover:text-[#A66551] p-1"
                      aria-label="Remove promo code"
                    >
                      <Xmark width={14} height={14} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="e.g. ATELIER10 or ELORA500"
                      className="flex-1 bg-[#FAF7F2] border border-[#2C2A29]/20 px-3 py-2 font-mono text-xs uppercase focus:outline-none focus:border-[#191817]"
                    />
                    <button
                      type="submit"
                      className="bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs px-4 py-2 transition-colors uppercase"
                    >
                      APPLY
                    </button>
                  </form>
                )}

                {promoError && (
                  <p className="font-mono text-[10px] text-red-700">{promoError}</p>
                )}
                {!promo && (
                  <span className="font-mono text-[9px] text-[#7A756F] block">
                    Try <strong>ATELIER10</strong> (10% off) or <strong>ELORA500</strong> (₹500 off)
                  </span>
                )}
              </div>

              {/* Tailoring & Packaging Note */}
              <div className="space-y-1.5">
                <label htmlFor="atelier-notes" className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block">
                  SPECIAL TAILORING OR PACKAGING NOTE
                </label>
                <textarea
                  id="atelier-notes"
                  rows={2}
                  value={orderNote}
                  onChange={(e) => dispatch(setOrderNote(e.target.value))}
                  placeholder="e.g. Handwrite gift card for recipient, or express urgent delivery"
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 p-2.5 font-sans text-xs focus:outline-none focus:border-[#191817] resize-none"
                />
              </div>

              {/* Quick Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-3 pt-2 border-t border-dashed border-[#2C2A29]/15">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block">
                  DELIVERY DESTINATION
                </span>

                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Full Name"
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#191817]"
                />

                <input
                  type="text"
                  required
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Shipping Address, City & Postal Code"
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#191817]"
                />

                <button
                  type="submit"
                  className="w-full bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-[0.2em] py-4 flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <span>CONFIRM &amp; DISPATCH DOCKET</span>
                  <ArrowUpRight width={14} height={14} />
                </button>
              </form>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#7A756F] pt-1">
                <ShieldCheck width={13} height={13} />
                <span>ATELIER VERIFIED • COMPLIMENTARY 14-DAY RETURNS</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartSection;
