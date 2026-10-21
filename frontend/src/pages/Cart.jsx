import { useState, useEffect } from 'react';
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
  Cash,
} from 'iconoir-react';
import api from '../api/apiClient';
import { removeFromCart, updateQuantity, clearCart, applyPromo, removePromo, setOrderNote } from '../redux/cartSlice';
import Tape from '../components/Tape';
import HandwrittenNote from '../components/HandwrittenNote';
import ThemeImage from '../components/ThemeImage';
import ReceiptBill from '../components/ReceiptBill';
import { loadScript } from '../utils/loadScript';

const createDocketId = () => {
  return `ELO-${Math.floor(100000 + Math.random() * 900000)}`;
};

const Cart = () => {
  const dispatch = useDispatch();
  const { items, promo, orderNote } = useSelector((state) => state.cart || { items: [], promo: null, orderNote: '' });
  const { user } = useSelector((state) => state.user || { user: null });

  const [isOrdered, setIsOrdered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Payment Option: 'razorpay' (UPI, Cards, Netbanking) or 'cod' (Concierge Cash/Card on Delivery)
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // Auto-fill client details if signed in
  useEffect(() => {
    if (user) {
      if (!clientName && user.name) setClientName(user.name);
      if (!clientEmail && user.email) setClientEmail(user.email);
    }
  }, [user]);

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
    setCheckoutError('');

    if (!clientName.trim() || !clientAddress.trim()) {
      setCheckoutError('Please provide your full name and delivery address.');
      return;
    }

    if (paymentMethod === 'razorpay' && !clientPhone.trim()) {
      setCheckoutError('Please provide a mobile phone number for Razorpay authorization & courier dispatch.');
      return;
    }

    setIsProcessing(true);
    const generatedDocketId = createDocketId();

    const orderPayload = {
      orderDocketId: generatedDocketId,
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

    // Concierge Pay on Arrival (COD)
    if (paymentMethod === 'cod') {
      try {
        const res = await api.post('/api/order/create', orderPayload);
        const finalOrder = res.data?.order || {
          ...orderPayload,
          paymentStatus: 'cod_due',
          orderDate: new Date(),
        };

        const ordersKey = `atelier_orders_${clientEmail.trim() || 'guest'}`;
        const previousOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
        localStorage.setItem(ordersKey, JSON.stringify([finalOrder, ...previousOrders]));

        setReceiptData(finalOrder);
        setIsOrdered(true);
        dispatch(clearCart());
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setCheckoutError(err.response?.data?.message || 'Failed to place cash on delivery order');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Razorpay Flow
    try {
      // 1. Initialize Razorpay Order on Backend
      const createOrderRes = await api.post('/api/order/razorpay/create-order', {
        amount: grandTotal,
        receipt: generatedDocketId,
        notes: {
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
        },
      });

      const { orderId, amount, currency, keyId, isSandbox } = createOrderRes.data;

      // 2. Ensure Razorpay Checkout SDK is ready
      await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      if (window.Razorpay && !isSandbox) {
        const options = {
          key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency || 'INR',
          name: 'ELORA ATELIER',
          description: `Order Settlement • Docket ${generatedDocketId}`,
          order_id: orderId,
          handler: async function (response) {
            try {
              // 3. Verify Payment Signature on Backend
              const verifyRes = await api.post('/api/order/razorpay/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: orderPayload,
              });

              const confirmedOrder = verifyRes.data?.order || {
                ...orderPayload,
                paymentStatus: 'paid',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderDate: new Date(),
              };

              const ordersKey = `atelier_orders_${clientEmail.trim() || 'guest'}`;
              const previousOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
              localStorage.setItem(ordersKey, JSON.stringify([confirmedOrder, ...previousOrders]));

              setReceiptData(confirmedOrder);
              setIsOrdered(true);
              dispatch(clearCart());
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (vErr) {
              setCheckoutError(vErr.response?.data?.message || 'Payment verification failed');
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: clientName.trim(),
            email: clientEmail.trim(),
            contact: clientPhone.trim(),
          },
          theme: {
            color: '#191817',
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setCheckoutError('Payment session cancelled. Your bag items remain saved.');
            },
          },
        };

        const rzpInstance = new window.Razorpay(options);
        rzpInstance.on('payment.failed', function (resp) {
          setIsProcessing(false);
          setCheckoutError(resp.error?.description || 'Payment authorization failed');
        });
        rzpInstance.open();
      } else {
        // Fallback / Development sandbox mode when Razorpay credentials are not yet set in .env
        const simulatedPaymentId = `pay_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
        const verifyRes = await api.post('/api/order/razorpay/verify-payment', {
          razorpay_order_id: orderId,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: 'test_signature_valid',
          orderDetails: orderPayload,
        });

        const confirmedOrder = verifyRes.data?.order || {
          ...orderPayload,
          paymentStatus: 'paid',
          razorpayOrderId: orderId,
          razorpayPaymentId: simulatedPaymentId,
          orderDate: new Date(),
        };

        const ordersKey = `atelier_orders_${clientEmail.trim() || 'guest'}`;
        const previousOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
        localStorage.setItem(ordersKey, JSON.stringify([confirmedOrder, ...previousOrders]));

        setReceiptData(confirmedOrder);
        setIsOrdered(true);
        dispatch(clearCart());
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Razorpay checkout error:', err);
      setCheckoutError(err.response?.data?.message || err.message || 'Payment processing error');
      setIsProcessing(false);
    }
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
                      <ThemeImage
                        src={item.image}
                        alt={item.name}
                        compact={true}
                        wrapperClassName="w-full h-full"
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

                {/* Checkout Error Notification */}
                {checkoutError && (
                  <div className="p-3 bg-[#FDF2F4] border border-[#8B263E]/30 text-[#8B263E] font-mono text-xs animate-fadeIn">
                    {checkoutError}
                  </div>
                )}

                {/* 2. Payment Gateway & Settlement */}
                <div className="space-y-3 pt-3 border-t border-dashed border-[#2C2A29]/15">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] font-bold">
                      2. PAYMENT SETTLEMENT
                    </span>
                    <span className="font-mono text-[9px] bg-[#EFE8DC] text-[#4A443A] px-2 py-0.5 border border-[#D1C9BC] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      SECURE 256-BIT SSL
                    </span>
                  </div>

                  {/* Payment Choices: Razorpay vs COD */}
                  <div className="space-y-2">
                    {/* Razorpay Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`w-full p-3.5 border text-left flex items-start justify-between transition-all cursor-pointer ${
                        paymentMethod === 'razorpay'
                          ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] shadow-sm'
                          : 'bg-[#FDFCF9] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 border mt-0.5 ${paymentMethod === 'razorpay' ? 'bg-[#2C2A29] border-white/20 text-[#FAF7F2]' : 'bg-[#FAF7F2] border-[#2C2A29]/15 text-[#191817]'}`}>
                          <CreditCard width={16} height={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold uppercase tracking-wider">
                              RAZORPAY PAYMENT GATEWAY
                            </span>
                            <span className="font-mono text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 uppercase font-bold">
                              RECOMMENDED
                            </span>
                          </div>
                          <p className={`font-sans text-[11px] mt-1 leading-snug ${paymentMethod === 'razorpay' ? 'text-white/80' : 'text-[#7A756F]'}`}>
                            UPI (Google Pay, PhonePe, Paytm, BHIM), Cards (Visa, Mastercard, RuPay), Netbanking &amp; Wallets.
                          </p>
                        </div>
                      </div>

                      <div className="mt-1 flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-white bg-white' : 'border-[#2C2A29]/40 bg-transparent'}`}>
                          {paymentMethod === 'razorpay' && <div className="w-2 h-2 rounded-full bg-[#191817]" />}
                        </div>
                      </div>
                    </button>

                    {/* Cash / Card On Delivery Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full p-3.5 border text-left flex items-start justify-between transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] shadow-sm'
                          : 'bg-[#FDFCF9] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 border mt-0.5 ${paymentMethod === 'cod' ? 'bg-[#2C2A29] border-white/20 text-[#FAF7F2]' : 'bg-[#FAF7F2] border-[#2C2A29]/15 text-[#191817]'}`}>
                          <Cash width={16} height={16} />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold uppercase tracking-wider block">
                            CONCIERGE PAY ON ARRIVAL (COD)
                          </span>
                          <p className={`font-sans text-[11px] mt-1 leading-snug ${paymentMethod === 'cod' ? 'text-white/80' : 'text-[#7A756F]'}`}>
                            Pay upon delivery at your doorstep via cash or mobile POS card reader.
                          </p>
                        </div>
                      </div>

                      <div className="mt-1 flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-white bg-white' : 'border-[#2C2A29]/40 bg-transparent'}`}>
                          {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-[#191817]" />}
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Active Payment Details Preview */}
                  {paymentMethod === 'razorpay' ? (
                    <div className="bg-[#FAF7F2] p-3 border border-[#2C2A29]/15 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#5C5751]">
                        <span className="font-bold text-[#191817]">POWERED BY RAZORPAY</span>
                        <span className="text-emerald-700 font-bold">100% SECURE CHECKOUT</span>
                      </div>
                      <p className="font-sans text-[11px] text-[#7A756F] leading-relaxed">
                        After clicking below, the official Razorpay Checkout window will open allowing you to complete payment via your preferred UPI app, debit/credit card, or netbanking account.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#FAF7F2] p-3 border border-[#2C2A29]/15 space-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#191817] font-bold block">
                        DELIVERY INSTRUCTIONS
                      </span>
                      <p className="font-sans text-[11px] text-[#5C5751] font-light leading-relaxed">
                        Our courier partner will deliver the curated parcel in a tamper-evident archival box. Payment will be collected upon receipt.
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#191817] hover:bg-[#2C2A29] disabled:bg-[#3D3A38] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest py-4 flex items-center justify-center gap-2 shadow-lg transition-all font-bold cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>CONNECTING RAZORPAY GATEWAY...</span>
                    </div>
                  ) : paymentMethod === 'razorpay' ? (
                    <>
                      <span>PROCEED TO PAY WITH RAZORPAY (₹{grandTotal.toLocaleString('en-IN')})</span>
                      <ArrowUpRight width={14} height={14} />
                    </>
                  ) : (
                    <>
                      <span>CONFIRM ORDER (PAY ON ARRIVAL - ₹{grandTotal.toLocaleString('en-IN')})</span>
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