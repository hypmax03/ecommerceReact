import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Trash,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowLeft,
  ShoppingBag,
  Xmark,
  CreditCard,
  QrCode,
  Bank,
  Cash,
} from 'iconoir-react';
import api from '../api/apiClient';
import { removeFromCart, updateQuantity, clearCart, applyPromo, removePromo, setOrderNote } from '../redux/cartSlice';
import Tape from '../components/Tape';
import HandwrittenNote from '../components/HandwrittenNote';
import ReceiptBill from '../components/ReceiptBill';

const createDocketId = () => {
  return `ELO-${Math.floor(100000 + Math.random() * 900000)}`;
};

const Cart = () => {
  const dispatch = useDispatch();
  const { items, promo, orderNote } = useSelector((state) => state.cart || { items: [], promo: null, orderNote: '' });
  const [isOrdered, setIsOrdered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Payment Option State
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'netbanking' | 'cod'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('atelier.client@elora');
  const [selectedBank, setSelectedBank] = useState('HDFC');

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // Autofill Demo Card Credentials
  const fillDemoCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvv('888');
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

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

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientAddress.trim()) {
      alert('Please provide your name and delivery address.');
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
      fillDemoCard();
    }

    setIsProcessing(true);
    const generatedId = createDocketId();

    const snapshotReceipt = {
      orderDocketId: generatedId,
      clientName: clientName.trim(),
      clientAddress: clientAddress.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      items: [...items],
      subtotal,
      discountAmount,
      shipping,
      grandTotal,
      promo,
      orderNote,
      paymentMethod,
      cardLast4: cardNumber ? cardNumber.replace(/\s+/g, '').slice(-4) : '4242',
      orderDate: new Date(),
    };

    // 1. Send Order to backend MongoDB API (logs order and decrements inventory)
    try {
      const orderPayload = {
        orderDocketId: generatedId,
        clientName: clientName.trim(),
        clientAddress: clientAddress.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim(),
        items: items.map((it) => ({
          id: it.id || it._id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          size: it.size,
          color: it.color,
          image: it.image,
        })),
        subtotal,
        discountAmount,
        shipping,
        grandTotal,
        promo,
        orderNote,
        paymentMethod,
      };
      await api.post('/api/order/create', orderPayload);
    } catch (orderApiErr) {
      console.warn('Backend order logging (offline/local fallback):', orderApiErr.message);
    }

    // 2. Cache order locally for instant client access
    try {
      const ordersKey = `atelier_orders_${clientEmail.trim() || 'guest'}`;
      const previousOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
      localStorage.setItem(ordersKey, JSON.stringify([snapshotReceipt, ...previousOrders]));
    } catch (cacheErr) {
      console.warn('Could not cache order locally:', cacheErr);
    }

    setReceiptData(snapshotReceipt);

    // Simulated terminal authorization & thermal paper feed delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsOrdered(true);
      dispatch(clearCart());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  if (isOrdered && receiptData) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] pt-24 sm:pt-32 pb-24 px-4 sm:px-8">
        <ReceiptBill
          receipt={receiptData}
          onReset={() => {
            setIsOrdered(false);
            setReceiptData(null);
          }}
        />
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
                PAGE 07 • ORDER SUMMARY
              </span>
              <span className="font-handwriting text-base text-[#A66551]">
                ({totalCount} {totalCount === 1 ? 'item' : 'items'} in bag)
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191817]">
              YOUR SHOPPING BAG
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
              text="“no pieces collected yet for this order”"
              color="text-[#7A756F]"
            />
            <div className="pt-4">
              <Link
                to="/products"
                className="bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-8 py-3.5 inline-block"
              >
                EXPLORE COLLECTIONS
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
                    <div className="w-20 h-24 bg-[#ECE8DF] overflow-hidden border border-[#2C2A29]/10 flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <span className="font-mono text-[9px] text-[#7A756F]">[GARMENT]</span>
                      )}
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
                        SIZE: {item.size} • COLOURWAY: {item.color}
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
                <Tape rotate="1deg" variant="dark" text="ORDER SUMMARY" width="w-36" />
              </div>

              <h3 className="font-serif text-2xl text-[#191817] font-normal border-b border-[#2C2A29]/15 pb-3">
                ORDER SUMMARY
              </h3>

              <div className="space-y-2 font-mono text-xs text-[#5C5751]">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {promo && discountAmount > 0 && (
                  <div className="flex justify-between text-[#A66551] font-bold">
                    <span>VOUCHER ({promo.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>EXPRESS DELIVERY</span>
                  <span>{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>PACKAGING</span>
                  <span>RECYCLABLE GIFT BOX (FREE)</span>
                </div>
                <div className="pt-3 border-t border-dashed border-[#2C2A29]/15 flex justify-between font-bold text-sm text-[#191817]">
                  <span>TOTAL ESTIMATED</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-2 border-t border-dashed border-[#2C2A29]/15 pt-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block">
                  PROMO VOUCHER
                </span>
                {promo ? (
                  <div className="flex items-center justify-between bg-[#EFE8DC] p-2 border border-[#D1C9BC] font-mono text-xs">
                    <span className="font-bold text-[#191817]">{promo.code} ({promo.label})</span>
                    <button
                      type="button"
                      onClick={() => dispatch(removePromo())}
                      className="text-[#7A756F] hover:text-[#A66551] p-1"
                    >
                      <Xmark width={12} height={12} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="e.g. ATELIER10"
                      className="flex-1 bg-[#FDFCF9] border border-[#2C2A29]/20 px-2.5 py-1.5 font-mono text-xs uppercase focus:outline-none focus:border-[#191817]"
                    />
                    <button
                      type="submit"
                      className="bg-[#191817] text-[#FAF7F2] font-mono text-xs px-3 py-1.5 uppercase hover:bg-[#2C2A29]"
                    >
                      APPLY
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="font-mono text-[10px] text-red-700">{promoError}</p>
                )}
              </div>

              {/* Special Tailoring Notes */}
              <div className="space-y-1">
                <label htmlFor="cart-notes" className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block">
                  PACKAGING &amp; TAILORING NOTE
                </label>
                <textarea
                  id="cart-notes"
                  rows={2}
                  value={orderNote}
                  onChange={(e) => dispatch(setOrderNote(e.target.value))}
                  placeholder="Optional handwritten note or tailoring instructions"
                  className="w-full bg-[#FDFCF9] border border-[#2C2A29]/20 p-2 font-sans text-xs focus:outline-none focus:border-[#191817] resize-none"
                />
              </div>

              <form onSubmit={handleCheckout} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] font-bold block">
                    1. CLIENT &amp; DISPATCH DESTINATION
                  </span>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Full Client Name *"
                    className="w-full bg-[#FDFCF9] border border-[#2C2A29]/20 px-3.5 py-2 font-sans text-xs focus:outline-none focus:border-[#191817]"
                  />
                  <input
                    type="text"
                    required
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Delivery Street Address, City &amp; Postal Code *"
                    className="w-full bg-[#FDFCF9] border border-[#2C2A29]/20 px-3.5 py-2 font-sans text-xs focus:outline-none focus:border-[#191817]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="Email for Digital Docket"
                      className="bg-[#FDFCF9] border border-[#2C2A29]/20 px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#191817]"
                    />
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Phone for Courier SMS"
                      className="bg-[#FDFCF9] border border-[#2C2A29]/20 px-3 py-2 font-sans text-xs focus:outline-none focus:border-[#191817]"
                    />
                  </div>
                </div>

                {/* 2. Settlement / Fake Payment Option Selector */}
                <div className="space-y-3 pt-3 border-t border-dashed border-[#2C2A29]/15">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] font-bold">
                      2. PAYMENT METHOD (DEMO / SIMULATED)
                    </span>
                    <span className="font-mono text-[9px] bg-[#EFE8DC] text-[#4A443A] px-1.5 py-0.5 border border-[#D1C9BC] font-bold">
                      TEST MODE
                    </span>
                  </div>

                  {/* 4 Payment Method Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2 border text-left flex flex-col justify-between h-14 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] shadow-sm'
                          : 'bg-[#FDFCF9] text-[#7A756F] border-[#2C2A29]/20 hover:border-[#191817]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <CreditCard width={15} height={15} />
                        {paymentMethod === 'card' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider font-bold">CARD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2 border text-left flex flex-col justify-between h-14 transition-all cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] shadow-sm'
                          : 'bg-[#FDFCF9] text-[#7A756F] border-[#2C2A29]/20 hover:border-[#191817]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <QrCode width={15} height={15} />
                        {paymentMethod === 'upi' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider font-bold">UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-2 border text-left flex flex-col justify-between h-14 transition-all cursor-pointer ${
                        paymentMethod === 'netbanking'
                          ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] shadow-sm'
                          : 'bg-[#FDFCF9] text-[#7A756F] border-[#2C2A29]/20 hover:border-[#191817]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Bank width={15} height={15} />
                        {paymentMethod === 'netbanking' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider font-bold">NETBANKING</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2 border text-left flex flex-col justify-between h-14 transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] shadow-sm'
                          : 'bg-[#FDFCF9] text-[#7A756F] border-[#2C2A29]/20 hover:border-[#191817]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Cash width={15} height={15} />
                        {paymentMethod === 'cod' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider font-bold">COD / ARRIVAL</span>
                    </button>
                  </div>

                  {/* Active Payment Method Inputs */}
                  {paymentMethod === 'card' && (
                    <div className="bg-[#FAF7F2] p-3 border border-[#2C2A29]/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F]">
                          SIMULATED CARD CREDENTIALS
                        </span>
                        <button
                          type="button"
                          onClick={fillDemoCard}
                          className="font-mono text-[9px] text-[#A66551] uppercase font-bold hover:underline cursor-pointer"
                        >
                          ⚡ AUTOFILL DEMO CARD
                        </button>
                      </div>

                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number (e.g. 4242 4242 4242 4242)"
                        className="w-full bg-[#FDFCF9] border border-[#2C2A29]/20 px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-[#191817]"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY (e.g. 12/28)"
                          className="bg-[#FDFCF9] border border-[#2C2A29]/20 px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-[#191817]"
                        />
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV (e.g. 888)"
                          maxLength={4}
                          className="bg-[#FDFCF9] border border-[#2C2A29]/20 px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-[#191817]"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="bg-[#FAF7F2] p-3 border border-[#2C2A29]/15 space-y-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block">
                        SIMULATED UPI VPA HANDLE
                      </span>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="client@okhdfcbank or atelier@upi"
                        className="w-full bg-[#FDFCF9] border border-[#2C2A29]/20 px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-[#191817]"
                      />
                      <p className="font-sans text-[10px] text-[#7A756F] font-light">
                        Simulated auto-approval. Instant verification on order submission.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="bg-[#FAF7F2] p-3 border border-[#2C2A29]/15 space-y-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block">
                        SELECT SIMULATED BANKING PORTAL
                      </span>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-[#FDFCF9] border border-[#2C2A29]/20 px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-[#191817]"
                      >
                        <option value="HDFC">HDFC Bank (Demo Corporate Gateway)</option>
                        <option value="ICICI">ICICI Bank Infinity</option>
                        <option value="SBI">State Bank of India</option>
                        <option value="AXIS">Axis Bank Sartorial</option>
                        <option value="STANCHAR">Standard Chartered Private Banking</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="bg-[#FAF7F2] p-3 border border-[#2C2A29]/15 space-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#191817] font-bold block">
                        CONCIERGE PAY ON ARRIVAL
                      </span>
                      <p className="font-sans text-[11px] text-[#5C5751] font-light leading-relaxed">
                        Our courier brings a portable card reader and receipt docket. Cash or card accepted upon handover.
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Action Button with Printing Indicator */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#191817] hover:bg-[#2C2A29] disabled:bg-[#3D3A38] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest py-4 flex items-center justify-center gap-2 shadow-lg transition-all font-bold cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>AUTHORIZING &amp; ENGAGING THERMAL PRINTER...</span>
                    </div>
                  ) : (
                    <>
                      <span>PAY &amp; PRINT OFFICIAL RECEIPT (₹{grandTotal.toLocaleString('en-IN')})</span>
                      <ArrowUpRight width={14} height={14} />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center">
                <HandwrittenNote
                  text="“dispatched within 24 hours with tracked delivery”"
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