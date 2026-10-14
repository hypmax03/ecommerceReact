import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Xmark, Mail, CheckCircle, Trash } from 'iconoir-react';
import { closeRemovalModal, showToast } from '../redux/cartSlice';
import { sendFormspreeNotification } from '../utils/formspree';
import Tape from './Tape';

export default function RemovalModal() {
  const dispatch = useDispatch();
  const removalData = useSelector((state) => state.cart?.removalModalData);
  const { user } = useSelector((state) => state.user || { user: null });

  const product = removalData?.product || null;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    productName: product?.name || removalData?.productName || '',
    productId: product?._id || product?.id || removalData?.productId || '',
    reasonType: product ? 'Withdraw My Garment' : 'Takedown / Copyright Request',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!removalData) return null;

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    dispatch(closeRemovalModal());
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const payload = {
      event: 'PRODUCT_REMOVAL_REQUEST',
      subject: `[Atelier Removal] Request to Remove: "${formData.productName || 'Garment'}" by ${formData.name || 'User'}`,
      action_type: 'REMOVE_PRODUCT_REQUEST',
      product_name: formData.productName || 'Not specified',
      product_id: formData.productId || (product?._id || product?.id) || 'N/A',
      product_price: product?.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : 'N/A',
      product_category: product?.category || 'N/A',
      product_status: product?.status || 'Active Catalog',
      reason_category: formData.reasonType,
      requester_name: formData.name || 'Anonymous',
      requester_email: formData.email,
      message_or_explanation: formData.message || 'No additional notes provided.',
      timestamp: new Date().toISOString(),
    };

    const result = await sendFormspreeNotification(payload);

    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);

      // If user is removing their own cached submission, update local storage
      if (user?.email && (formData.productId || product?._id)) {
        try {
          const localKey = `atelier_submissions_${user.email}`;
          const current = JSON.parse(localStorage.getItem(localKey) || '[]');
          const targetId = formData.productId || product?._id;
          const updated = current.filter((item) => (item._id || item.id) !== targetId);
          localStorage.setItem(localKey, JSON.stringify(updated));
        } catch (err) {
          console.warn('Could not update local storage after removal request:', err);
        }
      }

      dispatch(
        showToast({
          message: 'Removal request dispatched to curator desk via Formspree.',
          type: 'success',
        })
      );
    } else {
      setErrorMessage(result.error || 'Failed to dispatch request. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#191817]/70 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-[#FAF7F2] border border-[#2C2A29]/25 shadow-2xl max-w-lg w-full p-6 sm:p-8 z-10 overflow-hidden"
        >
          {/* Scrapbook Tape Accent */}
          <div className="absolute -top-3.5 left-8 pointer-events-none">
            <Tape rotate="-1.5deg" variant="kraft" text="CURATION TAKEDOWN DESK" width="w-52" />
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#7A756F] hover:text-[#191817] p-1.5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <Xmark width={20} height={20} />
          </button>

          {isSuccess ? (
            /* Success Confirmation Screen */
            <div className="pt-4 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#EBF5EC] border border-[#2E5A36]/30 flex items-center justify-center text-[#2E5A36] shadow-inner">
                <CheckCircle width={32} height={32} />
              </div>

              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#2E5A36] font-bold block mb-1">
                  DISPATCH CONFIRMED
                </span>
                <h3 className="font-serif text-2xl text-[#191817]">
                  Removal Request Transmitted
                </h3>
                <p className="font-sans text-xs text-[#5C5751] font-light leading-relaxed max-w-sm mx-auto mt-2">
                  An email notification has been dispatched directly to the curator desk via Formspree. Our team will review the request and remove the piece promptly.
                </p>
              </div>

              {formData.productName && (
                <div className="p-3 bg-[#F5EFE6] border border-[#2C2A29]/15 font-mono text-xs text-[#191817] max-w-sm mx-auto">
                  <span className="text-[#7A756F] uppercase text-[9px] block">Piece:</span>
                  <span className="font-serif text-sm font-bold">{formData.productName}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest py-3 px-4 transition-colors font-bold cursor-pointer"
              >
                CLOSE CONFIRMATION
              </button>
            </div>
          ) : (
            /* Form Screen */
            <form onSubmit={handleSubmit} className="pt-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#8B263E]/10 border border-[#8B263E]/30 flex items-center justify-center text-[#8B263E]">
                  <Trash width={14} height={14} />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8B263E] font-bold block">
                    PRODUCT REMOVAL &amp; TAKEDOWN
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#191817] font-normal">
                    {product ? 'Request Item Removal' : 'Mail to Remove Products'}
                  </h3>
                </div>
              </div>

              <p className="font-sans text-xs text-[#5C5751] font-light leading-relaxed">
                {product
                  ? 'Request to withdraw or delete this piece from the atelier catalog. An instant notification will be delivered to the curation desk.'
                  : 'Submit a takedown or removal notice for any garment photograph, design, or piece featured in the archive. We honor all requests with immediate gratitude.'}
              </p>

              {/* Product Preview Snippet (if passed) */}
              {product && (
                <div className="p-3 bg-[#F5EFE6] border border-[#2C2A29]/15 flex items-center gap-3">
                  {(product.images?.[0] || product.image) && (
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="w-12 h-14 object-cover border border-[#2C2A29]/20 flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-serif text-sm text-[#191817] font-bold block truncate">
                      {product.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#7A756F] block">
                      Ref: #{String(product._id || product.id).slice(-8).toUpperCase()} • ₹{Number(product.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              {/* Input Fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block mb-1">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full bg-[#FAF7F2] border border-[#2C2A29]/25 px-3 py-2 text-xs font-sans text-[#191817] focus:outline-none focus:border-[#191817]"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block mb-1">
                      YOUR EMAIL *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full bg-[#FAF7F2] border border-[#2C2A29]/25 px-3 py-2 text-xs font-sans text-[#191817] focus:outline-none focus:border-[#191817]"
                    />
                  </div>
                </div>

                {!product && (
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block mb-1">
                      PRODUCT NAME / URL / REF CODE *
                    </label>
                    <input
                      type="text"
                      name="productName"
                      required
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="e.g. Silk Organza Trench or Catalog URL"
                      className="w-full bg-[#FAF7F2] border border-[#2C2A29]/25 px-3 py-2 text-xs font-sans text-[#191817] focus:outline-none focus:border-[#191817]"
                    />
                  </div>
                )}

                <div>
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block mb-1">
                    REMOVAL REASON *
                  </label>
                  <select
                    name="reasonType"
                    value={formData.reasonType}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F2] border border-[#2C2A29]/25 px-3 py-2 text-xs font-sans text-[#191817] focus:outline-none focus:border-[#191817]"
                  >
                    <option value="Withdraw My Garment">Withdraw My Garment Submission</option>
                    <option value="Piece Sold Out / Discontinued">Piece Sold Out / Discontinued Elsewhere</option>
                    <option value="Takedown / Copyright Request">Copyright / Image Takedown Request</option>
                    <option value="Pricing or Detail Revision Needed">Pricing or Specification Revision Needed</option>
                    <option value="Other">Other Reason</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block mb-1">
                    EXPLANATION / ADDITIONAL COMMENTS
                  </label>
                  <textarea
                    rows={2}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide any details regarding why you are removing this piece or your preferred attribution..."
                    className="w-full bg-[#FAF7F2] border border-[#2C2A29]/25 p-2.5 text-xs font-sans text-[#191817] focus:outline-none focus:border-[#191817]"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-[#FFF0F2] border border-[#D94F65]/30 text-xs font-mono text-[#D94F65]">
                  {errorMessage}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 bg-[#8B263E] hover:bg-[#6D1E31] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest py-3 px-4 text-center transition-colors font-bold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Mail width={14} height={14} />
                  <span>{isSubmitting ? 'TRANSMITTING VIA FORMSPREE...' : 'DISPATCH REMOVAL NOTIFICATION'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto bg-transparent hover:bg-[#EFE8DC] text-[#7A756F] font-mono text-xs uppercase tracking-widest py-3 px-4 border border-[#2C2A29]/20 transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
              </div>

              <div className="text-center pt-1 font-mono text-[9px] text-[#7A756F]">
                Secured via Formspree Email Pipeline • Real-time Courier
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
