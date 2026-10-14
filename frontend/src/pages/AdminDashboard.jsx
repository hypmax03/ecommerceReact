import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Xmark,
  Trash,
  Refresh,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Lock,
} from 'iconoir-react';
import {
  getAdminDashboard,
  approveProduct,
  rejectProduct,
  deleteProduct,
} from '../redux/productSlice';
import Tape from '../components/Tape';
import HandwrittenNote from '../components/HandwrittenNote';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { allAdminProducts, loading } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user || { user: null });
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Does not meet current collection curation standards');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const refreshDashboard = () => {
    dispatch(getAdminDashboard());
  };

  useEffect(() => {
    if (isAdmin) {
      refreshDashboard();
    }
  }, [dispatch, isAdmin]);

  const handleApprove = async (id) => {
    await dispatch(approveProduct(id));
    setActionSuccessMessage('✓ Garment approved and published to live storefront.');
    setTimeout(() => setActionSuccessMessage(''), 3500);
    refreshDashboard();
  };

  const handleReject = async (id) => {
    await dispatch(rejectProduct({ id, reason: rejectionReason }));
    setRejectingId(null);
    setActionSuccessMessage('✕ Garment submission rejected.');
    setTimeout(() => setActionSuccessMessage(''), 3500);
    refreshDashboard();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this garment from the database?')) {
      await dispatch(deleteProduct(id));
      setActionSuccessMessage('Garment permanently removed from database.');
      setTimeout(() => setActionSuccessMessage(''), 3500);
      refreshDashboard();
    }
  };

  const filteredProducts = allAdminProducts.filter((product) => {
    if (activeTab !== 'all' && product.status !== activeTab) return false;
    return true;
  });

  const pendingCount = allAdminProducts.filter((p) => p.status === 'pending').length;
  const approvedCount = allAdminProducts.filter((p) => p.status === 'approved').length;
  const rejectedCount = allAdminProducts.filter((p) => p.status === 'rejected').length;

  // Access Restricted Gate for non-admin users
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] pt-36 pb-24 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#FDFCF9] p-8 sm:p-10 border border-[#2C2A29]/15 shadow-xl text-center relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none">
            <Tape rotate="-1deg" variant="dark" text="RESTRICTED ACCESS" width="w-44" />
          </div>

          <div className="w-14 h-14 bg-[#191817] text-[#FAF7F2] flex items-center justify-center mx-auto mb-5">
            <Lock width={24} height={24} />
          </div>

          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#7A756F] block mb-2">
            ELORA • SECURITY GATE
          </span>
          <h1 className="font-serif text-3xl text-[#191817] font-normal mb-3">
            Administrator Access Only
          </h1>
          <p className="font-sans text-xs text-[#5C5751] font-light leading-relaxed mb-8">
            The Curation Console and product moderation controls are reserved for registered atelier administrators.
          </p>

          <Link
            to="/login"
            className="w-full bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] font-mono text-xs uppercase tracking-widest py-3.5 flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <span>SIGN IN WITH ADMIN CREDENTIALS</span>
            <ArrowUpRight width={14} height={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-32 pb-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Bar */}
        <div className="border-b border-[#2C2A29]/15 pb-6 mb-8 relative">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck width={15} height={15} className="text-[#A66551]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F]">
              ATELIER CONSOLE • {user?.name || 'ADMINISTRATOR'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191817]">
                Curation Dashboard
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#5C5751] font-light mt-1.5">
                Review submitted garment dockets, moderate catalog pieces, and manage live inventory.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={refreshDashboard}
                className="inline-flex items-center gap-2 bg-[#FDFCF9] hover:bg-[#EFE8DC] text-[#191817] font-mono text-xs uppercase tracking-widest px-3.5 py-2.5 border border-[#2C2A29]/20 transition-colors cursor-pointer shadow-sm"
              >
                <Refresh width={13} height={13} className={loading ? 'animate-spin' : ''} />
                <span>SYNC</span>
              </button>

              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] font-mono text-xs uppercase tracking-widest px-4 py-2.5 transition-colors shadow-sm"
              >
                <Plus width={14} height={14} />
                <span>+ ADD GARMENT</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#191817] text-[#FAF7F2] p-3.5 mb-6 font-mono text-xs uppercase tracking-wider flex items-center justify-between shadow-md"
          >
            <span>{actionSuccessMessage}</span>
            <button
              type="button"
              onClick={() => setActionSuccessMessage('')}
              className="text-[#7A756F] hover:text-[#FAF7F2] text-sm"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#FDFCF9] p-4 sm:p-5 border border-[#2C2A29]/15 shadow-sm">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A756F] block mb-1">
              PENDING REVIEW
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#A66551]">
                {pendingCount}
              </span>
              <span className="font-mono text-[9px] text-[#A66551] uppercase">Awaiting</span>
            </div>
          </div>

          <div className="bg-[#FDFCF9] p-4 sm:p-5 border border-[#2C2A29]/15 shadow-sm">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A756F] block mb-1">
              LIVE IN STORE
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#191817]">
                {approvedCount}
              </span>
              <span className="font-mono text-[9px] text-[#2E5A36] uppercase">Published</span>
            </div>
          </div>

          <div className="bg-[#FDFCF9] p-4 sm:p-5 border border-[#2C2A29]/15 shadow-sm">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A756F] block mb-1">
              REJECTED
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#8B263E]">
                {rejectedCount}
              </span>
              <span className="font-mono text-[9px] text-[#8B263E] uppercase">Archived</span>
            </div>
          </div>

          <div className="bg-[#FDFCF9] p-4 sm:p-5 border border-[#2C2A29]/15 shadow-sm">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A756F] block mb-1">
              TOTAL CATALOG
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-[#191817]">
                {allAdminProducts.length}
              </span>
              <span className="font-mono text-[9px] text-[#7A756F] uppercase">Dockets</span>
            </div>
          </div>
        </div>

        {/* ATTRIBUTION & TAKEDOWN Advisory Box for Admin Approvals */}
        <div className="mb-8 bg-[#FDFCF9] border border-[#2C2A29]/20 p-6 sm:p-7 shadow-sm relative">
          <div className="absolute -top-3.5 left-6 pointer-events-none">
            <Tape rotate="-1deg" variant="kraft" text="CURATION &amp; ATTRIBUTION PROTOCOL" width="w-64" />
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 pt-1">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-[0.25em] text-[#A66551]">
                  ADMINISTRATOR ADVISORY • PRODUCT APPROVAL POLICY
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#191817] font-normal">
                ATTRIBUTION &amp; TAKEDOWN
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#5C5751] font-light leading-relaxed">
                If you are the copyright holder or creator of any image displayed on this site and would like your work credited differently, or prefer it to be removed, please send a gentle note to our contact desk. We will honor your request and take it down immediately with gratitude.
              </p>
            </div>

            <div className="pt-2 md:pt-1 flex-shrink-0">
              <a
                href="mailto:concierge@elora.com?subject=Image%20Attribution%20or%20Removal%20Request"
                className="inline-flex items-center gap-1.5 bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-[11px] uppercase tracking-wider px-4 py-3 shadow-sm transition-all"
              >
                <span>→ REQUEST REMOVAL OR ATTRIBUTION</span>
              </a>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#2C2A29]/15 pb-4 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] font-bold shadow-sm'
                : 'bg-[#FDFCF9] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
            }`}
          >
            PENDING APPROVALS ({pendingCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approved')}
            className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border transition-all cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] font-bold shadow-sm'
                : 'bg-[#FDFCF9] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
            }`}
          >
            LIVE STORE ({approvedCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rejected')}
            className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border transition-all cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] font-bold shadow-sm'
                : 'bg-[#FDFCF9] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
            }`}
          >
            REJECTED ({rejectedCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#191817] text-[#FAF7F2] border-[#191817] font-bold shadow-sm'
                : 'bg-[#FDFCF9] text-[#191817] border-[#2C2A29]/20 hover:border-[#191817]'
            }`}
          >
            ALL DOCKETS ({allAdminProducts.length})
          </button>
        </div>

        {/* Product Curation List */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#FDFCF9] border border-dashed border-[#2C2A29]/20 p-8 shadow-sm">
            <h3 className="font-serif text-2xl text-[#191817] font-normal mb-2">
              No {activeTab} garment dockets found.
            </h3>
            <p className="font-sans text-xs text-[#7A756F] mb-6">
              New submissions will arrive here for evaluation.
            </p>
            <Link
              to="/add"
              className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-5 py-2.5 shadow-sm hover:bg-[#2C2A29]"
            >
              <span>+ REGISTER NEW PRODUCT</span>
              <ArrowUpRight width={12} height={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const mainImage = product.images?.[0] || product.image;

              return (
                <div
                  key={product._id || product.id}
                  className="bg-[#FDFCF9] border border-[#2C2A29]/15 p-5 sm:p-6 shadow-sm relative transition-all hover:shadow-md"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Thumbnail */}
                    <div className="md:col-span-2">
                      <div className="aspect-[3/4] bg-[#ECE8DF] border border-[#2C2A29]/10 overflow-hidden relative">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-[#7A756F]">
                            NO IMAGE
                          </div>
                        )}
                        <span
                          className={`absolute top-1.5 left-1.5 font-mono text-[8px] uppercase px-1.5 py-0.5 font-bold ${
                            product.status === 'approved'
                              ? 'bg-[#2E5A36] text-[#FAF7F2]'
                              : product.status === 'rejected'
                              ? 'bg-[#8B263E] text-[#FAF7F2]'
                              : 'bg-[#A66551] text-[#FAF7F2]'
                          }`}
                        >
                          {product.status || 'PENDING'}
                        </span>
                      </div>
                    </div>

                    {/* Garment Details & Submitter Information */}
                    <div className="md:col-span-7 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A756F]">
                          {product.category || 'READY-TO-WEAR'} • {product.gender || 'UNISEX'}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl text-[#191817] font-normal leading-snug">
                        {product.name}
                      </h3>

                      <p className="font-sans text-xs text-[#5C5751] font-light line-clamp-2">
                        {product.description || 'No description provided.'}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-mono text-[#191817] pt-1">
                        <span><strong>Price:</strong> ₹{product.price?.toLocaleString('en-IN')}</span>
                        <span><strong>Stock:</strong> {product.stock || 1}</span>
                        {product.material && <span className="truncate max-w-[200px]"><strong>Fabric:</strong> {product.material}</span>}
                      </div>

                      {/* Submitter Info */}
                      <div className="text-[10px] font-mono text-[#7A756F] pt-1 border-t border-[#2C2A29]/10 flex items-center gap-2">
                        <span>SUBMITTED BY: <strong className="text-[#191817]">{product.submittedBy?.name || 'Guest'}</strong></span>
                        {product.submittedBy?.email && <span>({product.submittedBy.email})</span>}
                        {product.submittedBy?.note && <span className="italic text-[#A66551]">“{product.submittedBy.note}”</span>}
                      </div>

                      {product.status === 'pending' && (
                        <div className="text-[9.5px] font-mono text-[#7A756F] bg-[#FAF7F2] p-2 border border-dashed border-[#2C2A29]/15">
                          <strong className="text-[#A66551]">Attribution Protocol:</strong> Verify visual attribution before publishing. Creators may request removal or credit adjustment via{' '}
                          <a href="mailto:concierge@elora.com?subject=Image%20Attribution%20or%20Removal%20Request" className="underline text-[#191817]">
                            concierge@elora.com
                          </a>.
                        </div>
                      )}

                      {product.rejectionReason && (
                        <div className="text-[10px] font-mono text-[#8B263E] bg-[#FDF2F4] p-1.5 border border-[#8B263E]/20">
                          Rejection note: {product.rejectionReason}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-3 flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-[#2C2A29]/10 pt-3 md:pt-0 md:pl-5">
                      {product.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleApprove(product._id || product.id)}
                          className="w-full bg-[#2E5A36] hover:bg-[#24472A] text-[#FAF7F2] font-mono text-xs uppercase tracking-wider py-2 flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <Check width={13} height={13} />
                          <span>APPROVE &amp; PUBLISH</span>
                        </button>
                      )}

                      {product.status === 'pending' && (
                        <div>
                          {rejectingId === (product._id || product.id) ? (
                            <div className="space-y-1.5">
                              <input
                                type="text"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Reason..."
                                className="w-full bg-[#FAF7F2] border border-[#8B263E]/30 p-1.5 text-xs font-mono"
                              />
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleReject(product._id || product.id)}
                                  className="flex-1 bg-[#8B263E] text-[#FAF7F2] font-mono text-[10px] py-1"
                                >
                                  CONFIRM
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectingId(null)}
                                  className="px-2 border border-[#2C2A29]/20 text-[10px]"
                                >
                                  CANCEL
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setRejectingId(product._id || product.id)}
                              className="w-full bg-[#FAF7F2] hover:bg-[#FDF2F4] text-[#8B263E] border border-[#8B263E]/30 font-mono text-xs uppercase tracking-wider py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Xmark width={13} height={13} />
                              <span>REJECT</span>
                            </button>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          to={`/product/${product._id || product.id}`}
                          className="flex-1 text-center font-mono text-[10px] uppercase tracking-wider text-[#191817] hover:underline"
                        >
                          VIEW PRODUCT →
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id || product.id)}
                          className="text-[#7A756F] hover:text-[#8B263E] p-1 transition-colors"
                          title="Delete Product"
                        >
                          <Trash width={14} height={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
