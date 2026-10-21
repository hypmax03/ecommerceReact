import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Printer, Copy, Check, ArrowUpRight } from 'iconoir-react';
import Tape from './Tape';
import ThemeImage from './ThemeImage';

const ReceiptBill = ({ receipt, onReset }) => {
  const [copied, setCopied] = useState(false);

  if (!receipt) return null;

  const {
    orderDocketId = 'ELO-268910',
    clientName = 'Valued Client',
    clientAddress = 'Atelier Delivery Address',
    clientEmail = '',
    clientPhone = '',
    items = [],
    subtotal = 0,
    discountAmount = 0,
    shipping = 0,
    grandTotal = 0,
    promo = null,
    orderNote = '',
    paymentMethod = 'razorpay',
    razorpayPaymentId = '',
    razorpayOrderId = '',
    cardLast4 = '',
    paymentStatus = 'paid',
    orderDate = new Date(),
  } = receipt;

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(orderDate));

  const handleCopy = () => {
    navigator.clipboard?.writeText(orderDocketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getPaymentLabel = () => {
    switch (paymentMethod) {
      case 'razorpay':
        return razorpayPaymentId
          ? `RAZORPAY SECURE (${razorpayPaymentId})`
          : 'RAZORPAY GATEWAY (VERIFIED)';
      case 'card':
        return `CARD SETTLEMENT (•••• ${cardLast4 || 'CARD'})`;
      case 'upi':
        return 'INSTANT UPI SETTLEMENT (VERIFIED)';
      case 'cod':
        return 'CONCIERGE PAY ON ARRIVAL';
      default:
        return 'AUTHORIZED ATELIER SETTLEMENT';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6 sm:py-10">
      {/* 1. RETRO POS CASH REGISTER & THERMAL PRINTER SLOT */}
      <div className="bg-gradient-to-b from-[#252220] via-[#1A1817] to-[#121110] border border-[#3E3834] rounded-t-xl p-4 sm:p-5 shadow-2xl relative">
        {/* Register Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#E3D5B8] font-bold">
              ELORA ATELIER POS TERMINAL • MODEL EL-2026
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/50 bg-white/5 px-2 py-0.5 border border-white/10">
            FEED ONLINE
          </span>
        </div>

        {/* Machine Status Screen */}
        <div className="my-3 px-3 py-2 bg-[#0E0D0C] border border-white/10 font-mono text-[10px] text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white/40">&gt;&gt;</span>
            <span className="tracking-wider uppercase">TRANSACTION AUTHORIZED • PRINTING OFFICIAL DOCKET</span>
          </div>
          <span className="text-[#E3D5B8] animate-pulse">● REC FEED</span>
        </div>

        {/* Physical Narrow Printer Slot Slit (where the bill emerges) */}
        <div className="relative mx-auto mt-2 h-3.5 bg-[#090807] rounded-full border border-black shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Subtle roller highlights inside slit */}
          <div className="absolute inset-x-4 top-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>

      {/* 2. THE ANIMATED BILL / RECEIPT (Emerging down from the printer slot) */}
      <div className="overflow-hidden pt-0 relative" id="printable-receipt-area">
        <motion.div
          initial={{ y: -650, opacity: 0.1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1], // Smooth physical paper emergence curve
          }}
          className="mx-auto bg-[#FDFCF9] text-[#191817] shadow-[0_30px_70px_rgba(0,0,0,0.18)] border-x border-[#2C2A29]/15 relative font-mono text-xs"
        >
          {/* Sawtooth Perforated Torn Top Edge */}
          <div className="w-full overflow-hidden leading-none -mt-0.5 pointer-events-none select-none">
            <svg
              className="w-full h-3 text-[#252220] fill-current"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <polygon points="0,0 2.5,10 5,0 7.5,10 10,0 12.5,10 15,0 17.5,10 20,0 22.5,10 25,0 27.5,10 30,0 32.5,10 35,0 37.5,10 40,0 42.5,10 45,0 47.5,10 50,0 52.5,10 55,0 57.5,10 60,0 62.5,10 65,0 67.5,10 70,0 72.5,10 75,0 77.5,10 80,0 82.5,10 85,0 87.5,10 90,0 92.5,10 95,0 97.5,10 100,0 100,10 0,10" />
            </svg>
          </div>

          {/* Stamped Washi Tape at Top */}
          <div className="pt-4 flex justify-center pointer-events-none">
            <Tape rotate="-1deg" variant="kraft" text="OFFICIAL ATELIER RECEIPT" width="w-48" />
          </div>

          {/* Stamp Animation: "PAID IN FULL" or "CONCIERGE ARRIVAL" */}
          <motion.div
            initial={{ scale: 3.5, opacity: 0, rotate: -35 }}
            animate={{ scale: 1, opacity: 1, rotate: -9 }}
            transition={{ delay: 1.5, duration: 0.45, type: 'spring', stiffness: 220, damping: 14 }}
            className={`absolute top-14 right-4 sm:right-8 border-2 border-dashed px-3 py-1.5 font-mono uppercase tracking-[0.25em] text-[10px] sm:text-xs font-bold rounded-sm pointer-events-none select-none shadow-sm z-20 ${
              paymentStatus === 'cod_due'
                ? 'border-[#7A756F] text-[#5C5751] bg-[#FAF7F2]/90'
                : 'border-[#A66551] text-[#A66551] bg-[#FAF7F2]/90'
            }`}
          >
            {paymentStatus === 'cod_due' ? 'COD ARRIVAL' : '✓ PAID IN FULL'}
            <span className="block text-[8px] tracking-widest text-[#7A756F]">
              {paymentMethod === 'razorpay' ? 'RZP-AUTH-OK' : paymentStatus === 'cod_due' ? 'AUTH-PAY-ON-DELIVERY' : 'AUTH-EL-2026-OK'}
            </span>
          </motion.div>

          {/* Receipt Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Atelier Brand Masthead */}
            <div className="text-center space-y-1 border-b border-dashed border-[#2C2A29]/20 pb-5">
              <h2 className="font-serif text-3xl font-normal tracking-widest text-[#191817]">
                ELORA ATELIER
              </h2>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#7A756F]">
                HAUTE SARTORIAL CURATION &amp; BESPOKE ARCHIVE
              </p>
              <p className="font-mono text-[9px] text-[#7A756F]">
                MILAN • PARIS • LONDON • TOKYO • NEW YORK
              </p>
              <p className="font-handwriting text-sm text-[#A66551] pt-1">
                “thank you for curating with the atelier”
              </p>
            </div>

            {/* Docket Metadata Details */}
            <div className="space-y-1.5 text-[11px] font-mono border-b border-dashed border-[#2C2A29]/20 pb-4">
              <div className="flex justify-between items-center">
                <span className="text-[#7A756F]">DOCKET NO:</span>
                <span className="font-bold text-[#191817] tracking-wider">{orderDocketId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A756F]">DATE &amp; TIME:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A756F]">SETTLEMENT:</span>
                <span className="font-bold text-[#191817]">{getPaymentLabel()}</span>
              </div>
              {razorpayPaymentId && (
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#7A756F]">RAZORPAY ID:</span>
                  <span className="text-emerald-800 font-bold tracking-wider">{razorpayPaymentId}</span>
                </div>
              )}
              {razorpayOrderId && (
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#7A756F]">GATEWAY REF:</span>
                  <span className="text-[#5C5751]">{razorpayOrderId}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[#7A756F]">AUTH CODE:</span>
                <span className="text-[#5C5751]">{razorpayPaymentId ? `RZP-${razorpayPaymentId.slice(-6).toUpperCase()}` : 'TXN-EL-9948271'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A756F]">DISPATCH:</span>
                <span className="text-emerald-700 font-bold">READY FOR DISPATCH</span>
              </div>
            </div>

            {/* Client Destination Particulars */}
            <div className="bg-[#F5EFE6] p-3.5 border border-[#2C2A29]/15 space-y-1 text-[11px]">
              <span className="text-[9px] uppercase tracking-widest text-[#7A756F] block font-bold">
                CLIENT &amp; SHIPPING PARTICULARS:
              </span>
              <p className="font-bold text-[#191817] text-xs">{clientName}</p>
              <p className="text-[#5C5751] font-sans leading-relaxed">{clientAddress}</p>
              {clientEmail && <p className="text-[#7A756F] text-[10px]">{clientEmail}</p>}
              {clientPhone && <p className="text-[#7A756F] text-[10px]">{clientPhone}</p>}
            </div>

            {/* Itemized Table */}
            <div className="space-y-3 border-b border-dashed border-[#2C2A29]/20 pb-5">
              <div className="flex justify-between text-[10px] uppercase tracking-wider text-[#7A756F] border-b border-[#2C2A29]/15 pb-1">
                <span>ITEM PARTICULARS</span>
                <span>AMOUNT</span>
              </div>

              {items.map((item, idx) => (
                <div key={item.key || idx} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.image && (
                      <div className="w-8 h-10 border border-[#2C2A29]/15 flex-shrink-0 overflow-hidden bg-[#ECE8DF]">
                        <ThemeImage
                          src={item.image}
                          alt={item.name}
                          compact={true}
                          wrapperClassName="w-full h-full"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-serif text-sm text-[#191817] truncate font-medium">
                        {item.name}
                      </p>
                      <p className="font-mono text-[9px] text-[#7A756F]">
                        {item.quantity}x • {item.size} • {item.color}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-[#191817] flex-shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Ledger */}
            <div className="space-y-2 text-xs border-b border-dashed border-[#2C2A29]/20 pb-4">
              <div className="flex justify-between text-[#5C5751]">
                <span>SUBTOTAL</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#A66551] font-bold">
                  <span>VOUCHER PRIVILEGE ({promo?.code || 'ATELIER'})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#5C5751]">
                <span>EXPRESS COURIER</span>
                <span>{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}</span>
              </div>

              <div className="flex justify-between text-[#5C5751]">
                <span>ARCHIVAL PAPER BOX</span>
                <span>COMPLIMENTARY</span>
              </div>

              <div className="pt-2 border-t border-[#2C2A29]/20 flex justify-between font-bold text-base text-[#191817]">
                <span>TOTAL AMOUNT PAID</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Tailoring Note if provided */}
            {orderNote && (
              <div className="p-2.5 bg-[#FAF7F2] border border-dashed border-[#2C2A29]/20 text-[10px]">
                <span className="font-bold text-[#7A756F] uppercase tracking-wider block mb-0.5">
                  CLIENT TAILORING NOTE:
                </span>
                <p className="font-handwriting text-sm text-[#191817] italic">
                  “{orderNote}”
                </p>
              </div>
            )}

            {/* Barcode & Signature Seal */}
            <div className="pt-2 text-center space-y-2">
              <div className="flex items-center justify-center gap-[2.5px] h-10 overflow-hidden opacity-85 px-4">
                {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 3, 1, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 4, 2, 1, 3].map((w, i) => (
                  <div key={i} className="bg-[#191817] h-full" style={{ width: `${w}px` }} />
                ))}
              </div>
              <p className="font-mono text-[9px] tracking-[0.3em] text-[#7A756F]">
                * {orderDocketId} *
              </p>
              <p className="font-sans text-[10px] text-[#7A756F] font-light max-w-xs mx-auto leading-relaxed pt-1">
                14-day complimentary exchanges and returns supported with original intact garment labels.
              </p>
            </div>
          </div>

          {/* Sawtooth Perforated Torn Bottom Edge */}
          <div className="w-full overflow-hidden leading-none -mb-0.5 pointer-events-none select-none">
            <svg
              className="w-full h-3 text-[#252220] fill-current rotate-180"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <polygon points="0,0 2.5,10 5,0 7.5,10 10,0 12.5,10 15,0 17.5,10 20,0 22.5,10 25,0 27.5,10 30,0 32.5,10 35,0 37.5,10 40,0 42.5,10 45,0 47.5,10 50,0 52.5,10 55,0 57.5,10 60,0 62.5,10 65,0 67.5,10 70,0 72.5,10 75,0 77.5,10 80,0 82.5,10 85,0 87.5,10 90,0 92.5,10 95,0 97.5,10 100,0 100,10 0,10" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* 3. INTERACTIVE RECEIPT ACTIONS */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-6 py-3.5 shadow-lg hover:bg-[#2C2A29] transition-all cursor-pointer"
        >
          <Printer width={16} height={16} />
          <span>PRINT PHYSICAL RECEIPT</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 bg-[#F5EFE6] text-[#191817] border border-[#2C2A29]/20 font-mono text-xs uppercase tracking-widest px-5 py-3.5 hover:bg-[#EFE8DC] transition-all cursor-pointer"
        >
          {copied ? <Check width={15} height={15} className="text-emerald-600" /> : <Copy width={15} height={15} />}
          <span>{copied ? 'DOCKET COPIED!' : 'COPY DOCKET #'}</span>
        </button>

        <Link
          to="/products"
          onClick={onReset}
          className="inline-flex items-center gap-2 bg-transparent text-[#191817] border border-[#191817] font-mono text-xs uppercase tracking-widest px-6 py-3.5 hover:bg-[#191817] hover:text-[#FAF7F2] transition-all"
        >
          <span>CONTINUE SHOPPING</span>
          <ArrowUpRight width={14} height={14} />
        </Link>
      </div>
    </div>
  );
};

export default ReceiptBill;
