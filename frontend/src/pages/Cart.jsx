import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash, Plus, Minus, ArrowUpRight, ArrowLeft, Check, ShoppingBag } from 'iconoir-react';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import Tape from '../components/Tape';
import HandwrittenNote from '../components/HandwrittenNote';

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart || { items: [] });
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal >= 8000 || items.length === 0 ? 0 : 250;
  const total = subtotal + shipping;

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsOrdered(true);
    dispatch(clearCart());
  };

  if (isOrdered) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] pt-36 pb-24 px-6 sm:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-[#FDFCF9] p-8 sm:p-12 border border-[#2C2A29]/15 shadow-2xl relative text-center">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <Tape rotate="-1deg" variant="kraft" text="ORDER DOCKET #2689" width="w-44" />
          </div>

          <div className="w-12 h-12 mx-auto rounded-full bg-[#191817] text-[#FAF7F2] flex items-center justify-center mb-4">
            <Check width={20} height={20} />
          </div>

          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F] block mb-1">
            CLIENT ORDER CONFIRMED
          </span>
          <h2 className="font-serif text-3xl text-[#191817] font-normal mb-3">
            Thank You for Collecting.
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#5C5751] font-light leading-relaxed mb-6">
            Your garment docket has been transmitted to our master tailors. Each piece will be hand-pressed, inspected, and dispatched in recycled paper boxes with personalized handwritten notes.
          </p>

          <div className="p-4 bg-[#F5EFE6] border border-[#2C2A29]/10 text-left font-mono text-xs space-y-1 mb-6">
            <p><strong>ESTIMATED COURIER:</strong> 2–4 Business Days</p>
            <p><strong>CLIENT CONCIERGE:</strong> concierge@ateliervéricourt.com</p>
          </div>

          <Link
            to="/products"
            className="inline-block bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-8 py-3.5 shadow-md hover:bg-[#2C2A29] transition-colors"
          >
            RETURN TO JOURNAL
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-[#2C2A29]/15 pb-6 mb-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
                PAGE 07 • SARTORIAL ORDER DOCKET
              </span>
              <span className="font-handwriting text-base text-[#A66551]">
                ({totalCount} {totalCount === 1 ? 'item' : 'items'} in docket)
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191817]">
              YOUR SARTORIAL BAG
            </h1>
          </div>

          <Link
            to="/products"
            className="font-mono text-xs uppercase tracking-wider text-[#7A756F] hover:text-[#191817] inline-flex items-center gap-1.5"
          >
            <ArrowLeft width={14} height={14} />
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center bg-[#FDFCF9] border border-dashed border-[#2C2A29]/20 p-8 space-y-4">
            <div className="w-12 h-12 mx-auto bg-[#F5EFE6] border border-[#D1C9BC] flex items-center justify-center text-[#7A756F]">
              <ShoppingBag width={20} height={20} />
            </div>
            <h3 className="font-serif text-2xl text-[#191817]">Your bag is currently empty.</h3>
            <HandwrittenNote
              text="“no pieces collected yet for this docket”"
              color="text-[#7A756F]"
            />
            <div className="pt-4">
              <Link
                to="/products"
                className="bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-8 py-3.5 inline-block"
              >
                OPEN GARMENT CATALOG
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Items Table */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="bg-[#FDFCF9] p-4 sm:p-6 border border-[#2C2A29]/15 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-24 bg-[#ECE8DF] overflow-hidden border border-[#2C2A29]/10 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A756F]">
                        {item.category} • {item.edition}
                      </span>
                      <Link
                        to={`/product/${item.id}`}
                        className="font-serif text-lg sm:text-xl text-[#191817] font-normal hover:text-[#A66551] block"
                      >
                        {item.name}
                      </Link>
                      <p className="font-mono text-xs text-[#7A756F] mt-1">
                        SIZE: {item.size} • COLOR: {item.color}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-dashed border-[#2C2A29]/10">
                    <div className="flex items-center border border-[#2C2A29]/20 bg-[#FAF7F2]">
                      <button
                        type="button"
                        onClick={() => dispatch(updateQuantity({ key: item.key, delta: -1 }))}
                        className="p-1.5 hover:bg-[#EFE8DC]"
                      >
                        <Minus width={12} height={12} />
                      </button>
                      <span className="font-mono text-xs px-3 font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => dispatch(updateQuantity({ key: item.key, delta: 1 }))}
                        className="p-1.5 hover:bg-[#EFE8DC]"
                      >
                        <Plus width={12} height={12} />
                      </button>
                    </div>

                    <span className="font-mono text-sm font-bold text-[#191817]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(item.key))}
                      className="text-[#7A756F] hover:text-[#A66551]"
                      aria-label="Remove item"
                    >
                      <Trash width={16} height={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Summary Docket */}
            <div className="lg:col-span-4 bg-[#F5EFE6] p-6 sm:p-8 border border-[#2C2A29]/15 shadow-sm space-y-6 relative">
              <div className="absolute -top-3 left-8 pointer-events-none">
                <Tape rotate="1deg" variant="dark" text="DISPATCH SUMMARY" width="w-36" />
              </div>

              <h3 className="font-serif text-2xl text-[#191817] font-normal border-b border-[#2C2A29]/15 pb-3">
                ORDER DOCKET
              </h3>

              <div className="space-y-2 font-mono text-xs text-[#5C5751]">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>EXPRESS COURIER</span>
                  <span>{shipping === 0 ? 'COMPLIMENTARY' : '₹250'}</span>
                </div>
                <div className="flex justify-between">
                  <span>PACKAGING</span>
                  <span>RECYCLED GIFT BOX (FREE)</span>
                </div>
                <div className="pt-3 border-t border-dashed border-[#2C2A29]/15 flex justify-between font-bold text-sm text-[#191817]">
                  <span>TOTAL ESTIMATED</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-3 pt-2">
                <input
                  type="text"
                  required
                  placeholder="Full Delivery Name"
                  className="w-full bg-[#FDFCF9] border border-[#2C2A29]/20 px-3.5 py-2.5 font-sans text-xs focus:outline-none focus:border-[#191817]"
                />
                <input
                  type="text"
                  required
                  placeholder="Delivery Address & Postal Code"
                  className="w-full bg-[#FDFCF9] border border-[#2C2A29]/20 px-3.5 py-2.5 font-sans text-xs focus:outline-none focus:border-[#191817]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest py-4 flex items-center justify-center gap-2 shadow-md transition-colors font-bold"
                >
                  <span>COMPLETE SARTORIAL ORDER</span>
                  <ArrowUpRight width={14} height={14} />
                </button>
              </form>

              <div className="text-center">
                <HandwrittenNote
                  text="“dispatched in 24 hours with trackable courier”"
                  color="text-[#7A756F]"
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;