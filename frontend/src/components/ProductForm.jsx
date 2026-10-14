import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, CheckCircle, Mail, ShieldCheck, Xmark } from 'iconoir-react';
import { addProduct } from '../redux/productSlice';
import Tape from './Tape';
import HandwrittenNote from './HandwrittenNote';

function ProductForm() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user || { user: null });
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    gender: 'Women',
    material: '',
    description: '',
    stock: '1',
    submitterName: user?.name || '',
    submitterEmail: user?.email || '',
    submitterNote: '',
    images: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Prepare FormData for Backend MongoDB creation
      const productPayload = new FormData();
      productPayload.append('name', formData.name);
      productPayload.append('price', Number(formData.price));
      productPayload.append('category', formData.category || 'Occasionwear');
      productPayload.append('gender', formData.gender);
      productPayload.append('material', formData.material);
      productPayload.append('description', formData.description);
      productPayload.append('stock', Number(formData.stock) || 1);
      productPayload.append('submitterName', formData.submitterName || user?.name || 'Atelier Client');
      productPayload.append('submitterEmail', formData.submitterEmail || user?.email || '');
      productPayload.append('submitterNote', formData.submitterNote || '');
      
      // If submitted by Admin directly, publish immediately; otherwise set as pending approval
      if (isAdmin) {
        productPayload.append('status', 'approved');
      } else {
        productPayload.append('status', 'pending');
      }

      formData.images.forEach((image) => {
        productPayload.append('images', image);
      });

      // Dispatch directly to Redux + Backend Database
      await dispatch(addProduct(productPayload)).unwrap();

      setLastSubmitted({
        name: formData.name,
        price: formData.price,
        category: formData.category || 'Occasionwear',
        gender: formData.gender,
        imagesCount: formData.images.length,
      });

      setSubmissionSuccess(true);
      setFormData({
        name: '',
        price: '',
        category: '',
        gender: 'Women',
        material: '',
        description: '',
        stock: '1',
        submitterName: user?.name || '',
        submitterEmail: user?.email || '',
        submitterNote: '',
        images: [],
      });
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Could not submit garment docket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#7A756F] hover:text-[#191817] transition-colors"
          >
            <ArrowLeft width={14} height={14} />
            <span>BACK TO CATALOG</span>
          </Link>

          {isAdmin ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 hover:bg-[#2C2A29] transition-colors shadow-sm"
            >
              <span>ADMIN DASHBOARD →</span>
            </Link>
          ) : user ? (
            <Link
              to="/account"
              className="inline-flex items-center gap-2 bg-[#EFE8DC] text-[#191817] font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 border border-[#D1C9BC] hover:bg-[#E3D5B8] transition-colors"
            >
              <span>MY ACCOUNT →</span>
            </Link>
          ) : null}
        </div>

        {/* Modal: Submission Success Popup */}
        <AnimatePresence>
          {submissionSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSubmissionSuccess(false)}
                className="fixed inset-0 bg-[#191817]/70 backdrop-blur-sm cursor-pointer"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-[#FAF7F2] border border-[#2C2A29]/20 shadow-2xl max-w-lg w-full p-6 sm:p-8 z-10 overflow-hidden"
              >
                {/* Vintage Tape Accent */}
                <div className="absolute -top-3 left-8 pointer-events-none">
                  <Tape rotate="-1deg" variant="kraft" text="DOCKET CONFIRMATION" width="w-44" />
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSubmissionSuccess(false)}
                  className="absolute top-4 right-4 text-[#7A756F] hover:text-[#191817] p-1 transition-colors"
                  aria-label="Close modal"
                >
                  <Xmark width={20} height={20} />
                </button>

                {/* Modal Header */}
                <div className="pt-2 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#EBF5EC] border border-[#2E5A36]/30 flex items-center justify-center text-[#2E5A36] mb-4 shadow-inner">
                    <CheckCircle width={30} height={30} strokeWidth={2} />
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2E5A36] font-bold block mb-1">
                    {isAdmin ? 'PUBLISHED DIRECTLY' : 'CURATION DOCKET TRANSMITTED'}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal mb-2">
                    {isAdmin
                      ? 'Garment Published Successfully'
                      : 'Garment Submitted for Review'}
                  </h3>
                  <p className="font-sans text-xs text-[#5C5751] font-light leading-relaxed max-w-md mx-auto">
                    {isAdmin
                      ? 'Your piece has been added directly to the active catalog and is now live across the storefront.'
                      : 'Your garment details have been securely recorded and dispatched to the Atelier Administrator Dashboard for curation review.'}
                  </p>
                </div>

                {/* Receipt Card Summary */}
                {lastSubmitted && (
                  <div className="mt-5 p-4 bg-[#F5EFE6] border border-[#2C2A29]/15 text-left space-y-2">
                    <div className="flex items-center justify-between border-b border-[#2C2A29]/10 pb-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F]">
                        GARMENT DOCKET
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#2E5A36] font-bold">
                        {isAdmin ? 'STATUS: LIVE' : 'STATUS: PENDING REVIEW'}
                      </span>
                    </div>

                    <div>
                      <span className="font-serif text-base text-[#191817] block font-normal leading-snug">
                        {lastSubmitted.name}
                      </span>
                      <div className="flex items-center gap-3 font-mono text-[10px] text-[#7A756F] mt-1">
                        <span>{lastSubmitted.category}</span>
                        <span>•</span>
                        <span>{lastSubmitted.gender}</span>
                        <span>•</span>
                        <span className="text-[#191817] font-bold">₹{Number(lastSubmitted.price).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmissionSuccess(false)}
                    className="w-full sm:flex-1 bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest py-3 px-4 text-center transition-colors font-bold cursor-pointer"
                  >
                    SUBMIT ANOTHER
                  </button>

                  {user ? (
                    <Link
                      to="/account"
                      onClick={() => setSubmissionSuccess(false)}
                      className="w-full sm:flex-1 bg-[#EFE8DC] hover:bg-[#E3D5B8] text-[#191817] border border-[#D1C9BC] font-mono text-xs uppercase tracking-widest py-3 px-4 text-center transition-colors font-bold"
                    >
                      VIEW IN MY ACCOUNT
                    </Link>
                  ) : (
                    <Link
                      to="/products"
                      onClick={() => setSubmissionSuccess(false)}
                      className="w-full sm:flex-1 bg-[#EFE8DC] hover:bg-[#E3D5B8] text-[#191817] border border-[#D1C9BC] font-mono text-xs uppercase tracking-widest py-3 px-4 text-center transition-colors font-bold"
                    >
                      VIEW CATALOG
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Docket Form Card */}
        <div className="bg-[#FDFCF9] p-8 sm:p-12 border border-[#2C2A29]/15 shadow-xl relative">
          <div className="absolute -top-3.5 left-10 pointer-events-none">
            <Tape rotate="-1deg" variant="kraft" text="GARMENT SUBMISSION DOCKET" width="w-52" />
          </div>

          <div className="border-b border-[#2C2A29]/15 pb-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#7A756F] block mb-1">
                  ATELIER CURATION SYSTEM
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#191817] font-normal">
                  Submit Garment for Curation
                </h1>
              </div>

              {!isAdmin && (
                <div className="hidden sm:block text-right">
                  <span className="font-mono text-[9px] uppercase tracking-wider bg-[#EFE8DC] text-[#7A756F] px-2 py-1 border border-[#D1C9BC]">
                    REQUIRES ADMIN APPROVAL
                  </span>
                </div>
              )}
            </div>

            <p className="font-sans text-xs text-[#5C5751] font-light mt-2 max-w-xl">
              Propose a new garment for the store catalog. Submissions are dispatched directly to the administrator review console.
            </p>

            {/* Public Eyes & Pinterest Editorial Notice */}
            <div className="mt-4 p-3.5 bg-[#FAF3E8] border border-[#D9C4A9] text-[#5A4532] text-xs">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck width={15} height={15} className="text-[#8B5E3C] flex-shrink-0" />
                <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#8B5E3C]">
                  PUBLIC EXHIBITION &amp; CURATORIAL FAIR-USE NOTICE
                </span>
              </div>
              <p className="font-sans text-[11px] leading-relaxed text-[#5A4532]">
                <strong>Public Visibility:</strong> Once approved, submitted garments and details become publicly viewable across the catalog and editorial lookbooks.
                <br />
                <strong>Moodboards &amp; Imagery:</strong> Editorial reference photos curated by administrators originate from public design platforms (such as Pinterest and open lookbooks) solely for aesthetic inspiration, non-commercial styling, and visual demonstration. All copyrights belong to their respective creators and photographers.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Product Name */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                GARMENT NAME &amp; COLOURWAY <span className="text-[#A66551]">*</span>
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Classic Fit Pure Cashmere Overcoat — Camel Tan"
                className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-serif text-base text-[#191817] focus:outline-none focus:border-[#191817] transition-colors"
              />
              <span className="font-mono text-[9px] text-[#7A756F] block mt-1">
                Formula: [Style or Fit] + [Garment Type] + [Colour]
              </span>
            </div>

            {/* 2. Category & Department Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category Selection */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                  GARMENT CATEGORY <span className="text-[#A66551]">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-mono text-xs uppercase tracking-wider text-[#191817] focus:outline-none focus:border-[#191817] transition-colors"
                >
                  <option value="">-- SELECT CATEGORY --</option>
                  <option value="Evening Gowns">Evening Gowns</option>
                  <option value="Suits & Tailoring">Suits & Tailoring</option>
                  <option value="Outerwear & Coats">Outerwear & Coats</option>
                  <option value="Blazers & Jackets">Blazers & Jackets</option>
                  <option value="Cocktail Dresses">Cocktail Dresses</option>
                  <option value="Blazer Dresses">Blazer Dresses</option>
                  <option value="Linen & Shirts">Linen & Shirts</option>
                  <option value="Summer Dresses">Summer Dresses</option>
                  <option value="Knitwear">Knitwear</option>
                </select>
              </div>

              {/* Department / Gender */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                  DEPARTMENT / GENDER <span className="text-[#A66551]">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-mono text-xs uppercase tracking-wider text-[#191817] focus:outline-none focus:border-[#191817] transition-colors"
                >
                  <option value="Women">Women's Collection</option>
                  <option value="Men">Men's Collection</option>
                  <option value="Unisex">Unisex / All</option>
                </select>
              </div>
            </div>

            {/* 3. Fabric Material */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                FABRIC COMPOSITION &amp; PROVENANCE
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="e.g. 100% Heavyweight Mulberry Silk (28 Momme) / Como Atelier"
                className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-sans text-xs text-[#191817] focus:outline-none focus:border-[#191817] transition-colors"
              />
            </div>

            {/* 4. Price & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                  PRICE (INR ₹) <span className="text-[#A66551]">*</span>
                </label>
                <input
                  type="number"
                  required
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 8999"
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-mono text-sm text-[#191817] focus:outline-none focus:border-[#191817] transition-colors"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                  AVAILABLE STOCK UNITS <span className="text-[#A66551]">*</span>
                </label>
                <input
                  type="number"
                  required
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="e.g. 12"
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-mono text-sm text-[#191817] focus:outline-none focus:border-[#191817] transition-colors"
                />
              </div>
            </div>

            {/* 5. Editorial Description */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                EDITORIAL DESCRIPTION
              </label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="A versatile essential designed with a relaxed silhouette and a clean, understated finish. Pair with tailored trousers or cashmere knitwear."
                className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 p-3.5 font-serif text-sm text-[#191817] focus:outline-none focus:border-[#191817] transition-colors leading-relaxed"
              />
            </div>

            {/* 6. Submitter Contact Info for Formspree Notification */}
            <div className="bg-[#F5EFE6] p-4 border border-[#2C2A29]/15 space-y-4">
              <div className="flex items-center gap-2">
                <Mail width={14} height={14} className="text-[#A66551]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#191817] font-bold">
                  CURATOR CONTACT &amp; NOTIFICATIONS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block mb-1">
                    SUBMITTER NAME
                  </label>
                  <input
                    type="text"
                    name="submitterName"
                    value={formData.submitterName}
                    onChange={handleChange}
                    placeholder="Your Name / Studio"
                    className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3 py-2 font-sans text-xs text-[#191817] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block mb-1">
                    NOTIFICATION EMAIL
                  </label>
                  <input
                    type="email"
                    name="submitterEmail"
                    value={formData.submitterEmail}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3 py-2 font-sans text-xs text-[#191817] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block mb-1">
                  CURATOR NOTE TO ADMINISTRATOR
                </label>
                <input
                  type="text"
                  name="submitterNote"
                  value={formData.submitterNote}
                  onChange={handleChange}
                  placeholder="e.g. Sample swatch tested in Milan showroom; request expedited review."
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3 py-2 font-sans text-xs text-[#191817] focus:outline-none"
                />
              </div>
            </div>

            {/* 7. Image Upload Box */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                GARMENT PHOTOGRAPHS
              </label>

              <label
                htmlFor="product-images"
                className="border-2 border-dashed border-[#2C2A29]/20 hover:border-[#191817] bg-[#FAF7F2] p-6 text-center cursor-pointer transition-colors block"
              >
                <input
                  id="product-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#191817] font-bold block">
                    {formData.images.length > 0
                      ? `✓ ${formData.images.length} File${formData.images.length > 1 ? 's' : ''} Selected`
                      : '↑ Click to Browse Garment Photos'}
                  </span>
                  <span className="font-sans text-[11px] text-[#7A756F] block">
                    Select high-resolution garment or swatch photographs
                  </span>
                </div>
              </label>

              {formData.images.length > 0 && (
                <div className="mt-3 p-3 bg-[#F5EFE6] border border-[#2C2A29]/15">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                    ATTACHED FILES ({formData.images.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((file, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[10px] bg-[#FAF7F2] border border-[#2C2A29]/20 px-2 py-1 text-[#191817]"
                      >
                        {file.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Attribution & Takedown Protocol */}
            <div className="p-4 bg-[#F5EFE6] border border-[#2C2A29]/15 text-left space-y-1.5">
              <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#A66551] block">
                ATTRIBUTION &amp; TAKEDOWN
              </span>
              <p className="font-sans text-[11px] text-[#5C5751] font-light leading-relaxed">
                If you are the copyright holder or creator of any image displayed on this site and would like your work credited differently, or prefer it to be removed, please send a gentle note to our contact desk. We will honor your request and take it down immediately with gratitude.
              </p>
              <a
                href="mailto:concierge@elora.com?subject=Image%20Attribution%20or%20Removal%20Request"
                className="font-mono text-[10px] text-[#191817] hover:text-[#A66551] underline uppercase tracking-wider inline-block pt-0.5"
              >
                [→ REQUEST REMOVAL OR ATTRIBUTION]
              </a>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest py-4 flex items-center justify-center gap-2 shadow-lg transition-colors font-bold cursor-pointer disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? 'TRANSMITTING DOCKET...'
                  : isAdmin
                  ? 'PUBLISH DIRECTLY TO ATELIER'
                  : 'SUBMIT FOR ADMIN APPROVAL'}
              </span>
              <ArrowUpRight width={14} height={14} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ProductForm;