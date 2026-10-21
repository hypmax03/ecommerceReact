import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Plus,
  ArrowUpRight,
  LogOut,
  ShieldCheck,
  CheckCircle,
  Clock,
  Xmark,
  Refresh,
  Mail,
  Trash,
} from 'iconoir-react';
import { logoutUser } from '../redux/userSlice';
import { getProduct, getAdminDashboard, getMySubmissions } from '../redux/productSlice';
import { openRemovalModal } from '../redux/cartSlice';
import Tape from '../components/Tape';
import ThemeImage from '../components/ThemeImage';

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user || { user: null });
  const { allAdminProducts, products, mySubmissions = [], loading } = useSelector(
    (state) => state.product || { allAdminProducts: [], products: [], mySubmissions: [], loading: false }
  );

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [dismissedAlerts, setDismissedAlerts] = useState({});

  useEffect(() => {
    dispatch(getProduct());
    if (user) {
      dispatch(getMySubmissions());
    }
    if (isAdmin) {
      dispatch(getAdminDashboard());
    }
  }, [dispatch, user, isAdmin]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleDismissAlert = (id) => {
    setDismissedAlerts((prev) => ({ ...prev, [id]: true }));
  };

  // Local fallback storage for offline/resilience
  const localKey = `atelier_submissions_${user?.email || 'guest'}`;
  const localSubmissions = useMemo(() => {
    try {
      const stored = localStorage.getItem(localKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, [localKey]);

  // Merge submissions across backend API, admin pool, and local storage (deduplicating by ID/name)
  const userSubmissions = useMemo(() => {
    if (!user) return [];

    const map = new Map();

    // 1. Prioritize direct backend mySubmissions endpoint
    (mySubmissions || []).forEach((item) => {
      const key = String(item._id || item.id || item.name);
      map.set(key, item);
    });

    // 2. If admin, check allAdminProducts
    if (isAdmin && Array.isArray(allAdminProducts)) {
      allAdminProducts.forEach((item) => {
        if (!item?.submittedBy) return;
        const matchesUser =
          (item.submittedBy.email && item.submittedBy.email.toLowerCase() === user.email.toLowerCase()) ||
          (item.submittedBy.name && item.submittedBy.name.toLowerCase() === user.name.toLowerCase());
        if (matchesUser) {
          const key = String(item._id || item.id || item.name);
          if (!map.has(key)) map.set(key, item);
        }
      });
    }

    // 3. Fallback to public catalog approved items matching user
    (products || []).forEach((item) => {
      if (!item?.submittedBy) return;
      const matchesUser =
        (item.submittedBy.email && item.submittedBy.email.toLowerCase() === user.email.toLowerCase()) ||
        (item.submittedBy.name && item.submittedBy.name.toLowerCase() === user.name.toLowerCase());
      if (matchesUser) {
        const key = String(item._id || item.id || item.name);
        if (!map.has(key)) map.set(key, item);
      }
    });

    // 4. Merge locally cached client submissions
    localSubmissions.forEach((item) => {
      const key = String(item._id || item.id || item.name);
      if (!map.has(key)) {
        map.set(key, item);
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [user, mySubmissions, allAdminProducts, products, localSubmissions, isAdmin]);

  // Derived status lists
  const pendingItems = userSubmissions.filter((p) => p.status === 'pending');
  const approvedItems = userSubmissions.filter((p) => p.status === 'approved');
  const rejectedItems = userSubmissions.filter((p) => p.status === 'rejected');

  const visibleRejectedAlerts = rejectedItems.filter(
    (item) => !dismissedAlerts[item._id || item.id]
  );
  const visibleApprovedAlerts = approvedItems.filter(
    (item) => !dismissedAlerts[item._id || item.id]
  );

  const filteredSubmissions = userSubmissions.filter((item) => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  // If user is not logged in, show clean account sign in gate
  if (!user) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] pt-36 pb-24 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#FDFCF9] p-8 sm:p-10 border border-[#2C2A29]/15 shadow-xl text-center relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none">
            <Tape rotate="-1deg" variant="kraft" text="CLIENT ACCOUNT" width="w-36" />
          </div>

          <div className="w-14 h-14 bg-[#191817] text-[#FAF7F2] flex items-center justify-center mx-auto mb-4">
            <User width={24} height={24} />
          </div>

          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#7A756F] block mb-1">
            ELORA • CLIENT ACCESS
          </span>
          <h1 className="font-serif text-3xl text-[#191817] font-normal mb-2">
            Client Registry
          </h1>
          <p className="font-sans text-xs text-[#5C5751] font-light leading-relaxed mb-6">
            Sign in to view your profile, manage your garment submissions, and track moderation decisions.
          </p>

          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] font-mono text-xs uppercase tracking-widest py-3.5 flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>SIGN IN TO ACCOUNT</span>
              <ArrowUpRight width={14} height={14} />
            </Link>

            <Link
              to="/register"
              className="w-full bg-[#EFE8DC] text-[#191817] hover:bg-[#E3D5B8] font-mono text-xs uppercase tracking-widest py-3 border border-[#D1C9BC] flex items-center justify-center transition-colors"
            >
              <span>CREATE NEW ACCOUNT</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Account Header Banner */}
        <div className="bg-[#FDFCF9] border border-[#2C2A29]/15 p-6 sm:p-10 shadow-sm relative">
          <div className="absolute -top-3.5 left-8 pointer-events-none">
            <Tape
              rotate="-1.5deg"
              variant={isAdmin ? 'dark' : 'kraft'}
              text={isAdmin ? 'ADMIN DOSSIER' : 'CLIENT PROFILE'}
              width="w-36"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Details */}
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#191817] text-[#FAF7F2] flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold flex-shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] bg-[#EFE8DC] border border-[#D1C9BC] px-2 py-0.5 text-[#191817]">
                    {isAdmin ? '👑 CURATOR ADMINISTRATOR' : 'CLIENT MEMBER'}
                  </span>
                  <span className="font-mono text-[9px] text-[#7A756F]">
                    ID: {user.id ? String(user.id).slice(-6).toUpperCase() : 'ELO-09'}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal">
                  {user.name}
                </h1>

                <p className="font-mono text-xs text-[#7A756F]">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Account Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap self-start md:self-center">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-4 py-2.5 shadow-sm hover:bg-[#2C2A29] transition-colors"
                >
                  <ShieldCheck width={14} height={14} />
                  <span>ADMIN DASHBOARD</span>
                </Link>
              )}

              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-[#EFE8DC] hover:bg-[#E3D5B8] text-[#191817] font-mono text-xs uppercase tracking-widest px-4 py-2.5 border border-[#D1C9BC] transition-colors font-medium"
              >
                <Plus width={14} height={14} />
                <span>SUBMIT GARMENT</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 bg-transparent hover:bg-[#FDF2F4] text-[#8B263E] font-mono text-xs uppercase tracking-wider px-3.5 py-2.5 border border-[#8B263E]/30 transition-colors cursor-pointer"
              >
                <LogOut width={13} height={13} />
                <span>SIGN OUT</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUBMISSION NOTIFICATION MESSAGES (REJECTED / APPROVED ACTIVE BANNERS)     */}
        {/* ========================================================================= */}
        
        {/* REJECTED SUBMISSION ALERT BANNER */}
        <AnimatePresence>
          {visibleRejectedAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {visibleRejectedAlerts.map((item) => (
                <div
                  key={`alert-reject-${item._id || item.id}`}
                  className="bg-[#FFF5F6] border-2 border-[#D94F65] p-5 sm:p-6 shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D94F65]/5 rounded-bl-full pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-[#D94F65] text-[#FAF7F2] flex items-center justify-center flex-shrink-0 font-bold text-sm shadow">
                        ✕
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[9px] uppercase tracking-[0.25em] bg-[#D94F65] text-white px-2 py-0.5 font-bold">
                            MODERATION UPDATE • SUBMISSION REJECTED
                          </span>
                          <span className="font-mono text-[10px] text-[#8B263E]">
                            Ref: #{String(item._id || item.id).slice(-6).toUpperCase()}
                          </span>
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl text-[#191817] font-normal">
                          &ldquo;{item.name}&rdquo; was not approved for live curation.
                        </h3>

                        {/* Exact Curator Rejection Reason Callout */}
                        <div className="bg-[#FAF7F2] border border-[#D94F65]/30 p-3.5 sm:p-4 text-xs font-sans text-[#191817] rounded-none">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#8B263E] block font-bold mb-1">
                            💬 CURATOR&apos;S STATED REASON:
                          </span>
                          <p className="italic text-[#2C2A29] leading-relaxed font-serif text-sm">
                            &ldquo;{item.rejectionReason || 'Does not meet current atelier photography, material authenticity, or seasonal palette curation standards.'}&rdquo;
                          </p>
                          <p className="font-sans text-[11px] text-[#7A756F] mt-2 border-t border-[#D94F65]/15 pt-2">
                            💡 <span className="font-bold">Next Step:</span> You can refine your garment details, provide higher-resolution studio images, or submit an alternate piece for reconsideration.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions on Alert */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0 self-end sm:self-start">
                      <Link
                        to="/add"
                        className="bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-[10px] uppercase tracking-widest px-4 py-2 shadow transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Plus width={12} height={12} />
                        <span>PROPOSE REVISED PIECE</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDismissAlert(item._id || item.id)}
                        className="text-[#8B263E] hover:text-[#191817] font-mono text-[10px] uppercase tracking-wider px-2 py-1 transition-colors"
                      >
                        Dismiss Notice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* APPROVED SUBMISSION CELEBRATION BANNER */}
        <AnimatePresence>
          {visibleApprovedAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {visibleApprovedAlerts.map((item) => (
                <div
                  key={`alert-approve-${item._id || item.id}`}
                  className="bg-[#F0F8F1] border border-[#2E5A36]/40 p-5 sm:p-6 shadow-sm relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-[#2E5A36] text-[#FAF7F2] flex items-center justify-center flex-shrink-0 font-bold text-sm shadow">
                        ✓
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[9px] uppercase tracking-[0.25em] bg-[#2E5A36] text-white px-2 py-0.5 font-bold">
                            MODERATION UPDATE • APPROVED &amp; PUBLISHED
                          </span>
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl text-[#191817] font-normal">
                          &ldquo;{item.name}&rdquo; is now live across the storefront!
                        </h3>

                        <p className="font-sans text-xs text-[#2E5A36] font-light leading-relaxed">
                          Your garment docket was accepted by the head curator and is now visible to all clients visiting the catalog.
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0 self-end sm:self-start">
                      <Link
                        to={`/product/${item._id || item.id}`}
                        className="bg-[#2E5A36] hover:bg-[#234629] text-[#FAF7F2] font-mono text-[10px] uppercase tracking-widest px-4 py-2 shadow transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <span>VIEW LIVE PIECE</span>
                        <ArrowUpRight width={12} height={12} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDismissAlert(item._id || item.id)}
                        className="text-[#7A756F] hover:text-[#191817] font-mono text-[10px] uppercase tracking-wider px-2 py-1 transition-colors"
                      >
                        Dismiss Notice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Submissions & Curation Status Section */}
        <div className="bg-[#FDFCF9] border border-[#2C2A29]/15 p-6 sm:p-10 shadow-sm relative">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-6 pb-4 border-b border-[#2C2A29]/10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#7A756F]">
                  GARMENT SUBMISSIONS &amp; MODERATION QUEUE
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal">
                My Garment Dockets
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  dispatch(getMySubmissions());
                  if (isAdmin) dispatch(getAdminDashboard());
                }}
                className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#7A756F] hover:text-[#191817] border border-[#2C2A29]/15 px-3 py-1.5 bg-[#FAF7F2] transition-colors cursor-pointer"
                title="Refresh submissions"
              >
                <Refresh width={12} height={12} className={loading ? 'animate-spin' : ''} />
                <span>SYNC STATUS</span>
              </button>

              <button
                type="button"
                onClick={() => dispatch(openRemovalModal())}
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#8B263E] border border-[#8B263E]/30 bg-white hover:bg-[#FFF0F2] px-3.5 py-1.5 transition-colors cursor-pointer shadow-xs"
                title="Mail curator to remove or withdraw a product"
              >
                <Mail width={12} height={12} />
                <span>MAIL TO REMOVE PIECE</span>
              </button>

              <Link
                to="/add"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider bg-[#191817] text-[#FAF7F2] px-3.5 py-1.5 hover:bg-[#2C2A29] transition-colors shadow-sm"
              >
                <Plus width={12} height={12} />
                <span>PROPOSE PIECE</span>
              </Link>
            </div>
          </div>

          {/* Filter Tabs by Moderation Status */}
          <div className="flex items-center gap-2 border-b border-[#2C2A29]/10 pb-3 mb-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#191817] text-[#FAF7F2] font-bold'
                  : 'bg-[#EFE8DC]/60 text-[#7A756F] hover:text-[#191817]'
              }`}
            >
              ALL DOCKETS ({userSubmissions.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-[#A66551] text-[#FAF7F2] font-bold'
                  : 'bg-[#EFE8DC]/60 text-[#7A756F] hover:text-[#191817]'
              }`}
            >
              <Clock width={11} height={11} />
              <span>UNDER REVIEW ({pendingItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('approved')}
              className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'approved'
                  ? 'bg-[#2E5A36] text-[#FAF7F2] font-bold'
                  : 'bg-[#EFE8DC]/60 text-[#7A756F] hover:text-[#191817]'
              }`}
            >
              <CheckCircle width={11} height={11} />
              <span>APPROVED &amp; LIVE ({approvedItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rejected')}
              className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'rejected'
                  ? 'bg-[#D94F65] text-[#FAF7F2] font-bold'
                  : 'bg-[#EFE8DC]/60 text-[#7A756F] hover:text-[#191817]'
              }`}
            >
              <Xmark width={11} height={11} />
              <span>REJECTED ({rejectedItems.length})</span>
            </button>
          </div>

          {/* Docket List Content */}
          {filteredSubmissions.length === 0 ? (
            <div className="py-14 text-center border border-dashed border-[#2C2A29]/20 p-6 bg-[#FAF7F2]">
              <Clock width={24} height={24} className="text-[#A66551] mx-auto mb-3 opacity-80" />
              <h3 className="font-serif text-xl text-[#191817] mb-1">
                {activeTab === 'all'
                  ? 'No garment submissions recorded yet.'
                  : `No ${activeTab} garment submissions found.`}
              </h3>
              <p className="font-sans text-xs text-[#5C5751] font-light max-w-sm mx-auto mb-5">
                Propose your custom clothing pieces and textiles. Submissions are instantly routed to the Atelier Curation Desk for review and storefront publication.
              </p>
              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-5 py-2.5 shadow-sm hover:bg-[#2C2A29]"
              >
                <Plus width={13} height={13} />
                <span>SUBMIT YOUR FIRST PIECE</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((item) => {
                const img = item.images?.[0] || item.image;
                const isApproved = item.status === 'approved';
                const isRejected = item.status === 'rejected';
                const isPending = !isApproved && !isRejected;

                return (
                  <div
                    key={item._id || item.id}
                    className={`p-4 sm:p-5 border bg-[#FAF7F2] transition-all ${
                      isRejected
                        ? 'border-[#D94F65]/40 hover:border-[#D94F65] bg-[#FFF8F9]'
                        : isApproved
                        ? 'border-[#2E5A36]/30 hover:border-[#2E5A36] bg-[#F7FBF8]'
                        : 'border-[#2C2A29]/15 hover:border-[#191817]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-20 bg-[#ECE8DF] border border-[#2C2A29]/10 overflow-hidden flex-shrink-0 relative">
                          <ThemeImage
                            src={img}
                            alt={item.name}
                            compact={true}
                            wrapperClassName="w-full h-full"
                          />

                          {isRejected && (
                            <div className="absolute top-0 right-0 bg-[#D94F65] text-white p-0.5">
                              <Xmark width={10} height={10} />
                            </div>
                          )}
                          {isApproved && (
                            <div className="absolute top-0 right-0 bg-[#2E5A36] text-white p-0.5">
                              <CheckCircle width={10} height={10} />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F]">
                              {item.category || 'READY-TO-WEAR'} • ₹{Number(item.price || 0).toLocaleString('en-IN')}
                            </span>
                            <span className="font-mono text-[9px] text-[#7A756F]">
                              • Ref: #{String(item._id || item.id).slice(-6).toUpperCase()}
                            </span>
                          </div>

                          <h4 className="font-serif text-lg text-[#191817] leading-snug">
                            {item.name}
                          </h4>

                          {item.material && (
                            <p className="font-mono text-[10px] text-[#7A756F]">
                              Fabric: {item.material}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Status Pill & Action Buttons */}
                      <div className="flex flex-col items-start md:items-end gap-2 self-start md:self-auto flex-shrink-0">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-[#2E5A36] bg-[#E8F3EA] border border-[#2E5A36]/30 px-2.5 py-1">
                            <CheckCircle width={12} height={12} />
                            <span>APPROVED &amp; LIVE IN CATALOG</span>
                          </span>
                        )}

                        {isRejected && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-[#8B263E] bg-[#FDF2F4] border border-[#8B263E]/40 px-2.5 py-1">
                            <Xmark width={12} height={12} />
                            <span>REJECTED BY CURATOR</span>
                          </span>
                        )}

                        {isPending && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-[#A66551] bg-[#FDF5F2] border border-[#A66551]/30 px-2.5 py-1">
                            <Clock width={12} height={12} />
                            <span>AWAITING CURATOR REVIEW</span>
                          </span>
                        )}

                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          {isApproved && (
                            <Link
                              to={`/product/${item._id || item.id}`}
                              className="font-mono text-[10px] uppercase font-bold text-[#191817] hover:text-[#A66551] inline-flex items-center gap-1 border border-[#2C2A29]/20 px-2.5 py-1 bg-white shadow-xs"
                            >
                              <span>VIEW IN CATALOG</span>
                              <ArrowUpRight width={10} height={10} />
                            </Link>
                          )}

                          {isRejected && (
                            <Link
                              to="/add"
                              className="font-mono text-[10px] uppercase font-bold bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] inline-flex items-center gap-1 px-2.5 py-1 shadow-xs"
                            >
                              <span>PROPOSE REVISED PIECE</span>
                              <Plus width={10} height={10} />
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={() => dispatch(openRemovalModal({ product: item }))}
                            className="font-mono text-[10px] uppercase font-bold text-[#8B263E] hover:text-[#5B1626] inline-flex items-center gap-1 border border-[#8B263E]/30 hover:border-[#8B263E] px-2.5 py-1 bg-white shadow-xs transition-colors cursor-pointer"
                            title="Request removal or withdraw this piece"
                          >
                            <Trash width={10} height={10} />
                            <span>REQUEST REMOVAL</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* REJECTION REASON CARD ACCENT */}
                    {isRejected && (
                      <div className="mt-3.5 pt-3 border-t border-[#D94F65]/20 bg-[#FAF7F2] p-3 text-xs space-y-1">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#8B263E] font-bold block">
                          FEEDBACK FROM ATELIER CURATOR:
                        </span>
                        <p className="italic text-[#191817] font-serif text-sm">
                          &ldquo;{item.rejectionReason || 'Submission does not meet collection tailoring standards or photography requirements.'}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* PENDING EXPLANATION ACCENT */}
                    {isPending && (
                      <div className="mt-2.5 pt-2 border-t border-[#2C2A29]/10 text-[10px] font-mono text-[#7A756F]">
                        Docket queued for moderation. You will receive real-time notification here when the curator reviews your piece.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  );
};

export default Account;
