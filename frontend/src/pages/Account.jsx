import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  ShoppingBag,
  Printer,
  Copy,
  Check,
  Search,
} from 'iconoir-react';
import { logoutUser } from '../redux/userSlice';
import { getProduct, getAdminDashboard, getMySubmissions } from '../redux/productSlice';
import { openRemovalModal } from '../redux/cartSlice';
import api from '../api/apiClient';
import Tape from '../components/Tape';
import ThemeImage from '../components/ThemeImage';
import ReceiptBill from '../components/ReceiptBill';

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useSelector((state) => state.user || { user: null });
  const { allAdminProducts, products, mySubmissions = [], loading } = useSelector(
    (state) => state.product || { allAdminProducts: [], products: [], mySubmissions: [], loading: false }
  );

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');

  // Primary tab: 'orders' | 'submissions'
  const initialSection = searchParams.get('tab') === 'submissions' ? 'submissions' : 'orders';
  const [accountSection, setAccountSection] = useState(initialSection);

  // Submissions filter tab
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [dismissedAlerts, setDismissedAlerts] = useState({});

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'in_transit' | 'delivered' | 'cod'
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [copiedDocket, setCopiedDocket] = useState(null);

  // Fetch Orders from Backend and sync with localStorage
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      // 1. Fetch from backend API
      let apiOrders = [];
      try {
        const res = await api.get('/api/order/my-orders');
        if (res.data?.orders && Array.isArray(res.data.orders)) {
          apiOrders = res.data.orders;
        }
      } catch (apiErr) {
        console.warn('Backend orders fetch failed or requires auth, checking local cache:', apiErr?.message);
      }

      // 2. Local fallback storage keys (both email casing & guest fallback)
      const userEmailKey = `atelier_orders_${user.email?.trim() || 'guest'}`;
      const lowerEmailKey = `atelier_orders_${user.email?.toLowerCase()?.trim() || 'guest'}`;
      const guestKey = 'atelier_orders_guest';

      let localOrders = [];
      try {
        const l1 = JSON.parse(localStorage.getItem(userEmailKey) || '[]');
        const l2 = JSON.parse(localStorage.getItem(lowerEmailKey) || '[]');
        const lg = JSON.parse(localStorage.getItem(guestKey) || '[]');
        localOrders = [...l1, ...l2, ...lg];
      } catch (storageErr) {
        console.warn('Could not parse localStorage orders:', storageErr);
      }

      // 3. Deduplicate and merge (Map by orderDocketId or _id)
      const map = new Map();

      // Seed with local orders
      localOrders.forEach((ord) => {
        if (!ord) return;
        const key = String(ord.orderDocketId || ord._id || ord.id || '');
        if (key) map.set(key, ord);
      });

      // Overwrite with API orders (fresher database records)
      apiOrders.forEach((ord) => {
        if (!ord) return;
        const key = String(ord.orderDocketId || ord._id || ord.id || '');
        if (key) map.set(key, ord);
      });

      const merged = Array.from(map.values()).sort((a, b) => {
        const dateA = new Date(a.createdAt || a.orderDate || 0);
        const dateB = new Date(b.createdAt || b.orderDate || 0);
        return dateB - dateA;
      });

      setOrders(merged);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  useEffect(() => {
    dispatch(getProduct());
    if (user) {
      dispatch(getMySubmissions());
      fetchOrders();
    }
    if (isAdmin) {
      dispatch(getAdminDashboard());
    }
  }, [dispatch, user, isAdmin, fetchOrders]);

  // Keep URL in sync with primary tab
  const handleSectionChange = (sec) => {
    setAccountSection(sec);
    setSearchParams(sec === 'submissions' ? { tab: 'submissions' } : {});
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleDismissAlert = (id) => {
    setDismissedAlerts((prev) => ({ ...prev, [id]: true }));
  };

  const handleCopyDocket = (docketId) => {
    navigator.clipboard?.writeText(docketId);
    setCopiedDocket(docketId);
    setTimeout(() => setCopiedDocket(null), 2500);
  };

  // Close receipt modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedReceiptOrder) {
        setSelectedReceiptOrder(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedReceiptOrder]);

  // Format order date helper
  const formatOrderDate = (dateVal) => {
    if (!dateVal) return 'Recently Placed';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return 'Recently Placed';
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return 'Recently Placed';
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Search filter
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matchDocket = ord.orderDocketId?.toLowerCase().includes(q);
        const matchName = ord.clientName?.toLowerCase().includes(q);
        const matchItem = ord.items?.some((it) => it.name?.toLowerCase().includes(q));
        if (!matchDocket && !matchName && !matchItem) return false;
      }

      // Status filter
      if (orderFilter === 'all') return true;
      if (orderFilter === 'in_transit') {
        return ['placed', 'tailoring', 'dispatched'].includes(ord.orderStatus || 'placed');
      }
      if (orderFilter === 'delivered') {
        return ord.orderStatus === 'delivered';
      }
      if (orderFilter === 'cod') {
        return ord.paymentMethod === 'cod' || ord.paymentStatus === 'cod_due';
      }
      return ord.orderStatus === orderFilter;
    });
  }, [orders, orderFilter, orderSearchQuery]);

  const inTransitCount = orders.filter((o) =>
    ['placed', 'tailoring', 'dispatched'].includes(o.orderStatus || 'placed')
  ).length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'delivered').length;
  const codCount = orders.filter(
    (o) => o.paymentMethod === 'cod' || o.paymentStatus === 'cod_due'
  ).length;

  // Local fallback storage for offline/resilience of submissions
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

  // Derived status lists for submissions
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
            Sign in to access your order acquisitions, track delivery dockets, and view thermal receipts.
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
                to="/products"
                className="inline-flex items-center gap-2 bg-[#EFE8DC] hover:bg-[#E3D5B8] text-[#191817] font-mono text-xs uppercase tracking-widest px-4 py-2.5 border border-[#D1C9BC] transition-colors font-medium"
              >
                <ShoppingBag width={14} height={14} />
                <span>EXPLORE COLLECTION</span>
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

        {/* PRIMARY ACCOUNT NAVIGATION TABS */}
        <div className="flex items-center gap-3 border-b border-[#2C2A29]/15 pb-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleSectionChange('orders')}
            className={`font-mono text-xs uppercase tracking-widest px-5 py-3 transition-all flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
              accountSection === 'orders'
                ? 'bg-[#191817] text-[#FAF7F2] font-bold shadow-md'
                : 'bg-[#FDFCF9] text-[#7A756F] hover:text-[#191817] border border-[#2C2A29]/15 hover:bg-[#FAF7F2]'
            }`}
          >
            <ShoppingBag width={14} height={14} />
            <span>ORDER HISTORY &amp; ACQUISITIONS</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                accountSection === 'orders'
                  ? 'bg-[#FAF7F2] text-[#191817]'
                  : 'bg-[#EFE8DC] text-[#7A756F]'
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSectionChange('submissions')}
            className={`font-mono text-xs uppercase tracking-widest px-5 py-3 transition-all flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
              accountSection === 'submissions'
                ? 'bg-[#191817] text-[#FAF7F2] font-bold shadow-md'
                : 'bg-[#FDFCF9] text-[#7A756F] hover:text-[#191817] border border-[#2C2A29]/15 hover:bg-[#FAF7F2]'
            }`}
          >
            <Plus width={14} height={14} />
            <span>GARMENT SUBMISSIONS</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                accountSection === 'submissions'
                  ? 'bg-[#FAF7F2] text-[#191817]'
                  : 'bg-[#EFE8DC] text-[#7A756F]'
              }`}
            >
              {userSubmissions.length}
            </span>
            {visibleRejectedAlerts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#D94F65] animate-ping" />
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: ORDER HISTORY & ACQUISITIONS                                   */}
        {/* ========================================================================= */}
        {accountSection === 'orders' && (
          <div className="bg-[#FDFCF9] border border-[#2C2A29]/15 p-6 sm:p-10 shadow-sm relative space-y-6">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between pb-4 border-b border-[#2C2A29]/10 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#7A756F]">
                    CLIENT ACQUISITIONS &amp; DISPATCH DOCKETS
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#191817] font-normal">
                  My Order History
                </h2>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={fetchOrders}
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#7A756F] hover:text-[#191817] border border-[#2C2A29]/15 px-3.5 py-2 bg-[#FAF7F2] transition-colors cursor-pointer"
                  title="Synchronize order dockets with server"
                >
                  <Refresh width={13} height={13} className={ordersLoading ? 'animate-spin' : ''} />
                  <span>SYNC ORDERS</span>
                </button>

                <Link
                  to="/products"
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider bg-[#191817] text-[#FAF7F2] px-4 py-2 hover:bg-[#2C2A29] transition-colors shadow-sm"
                >
                  <ShoppingBag width={13} height={13} />
                  <span>CURATE MORE PIECES</span>
                </Link>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#2C2A29]/10">
              {/* Order Status Filters */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setOrderFilter('all')}
                  className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    orderFilter === 'all'
                      ? 'bg-[#191817] text-[#FAF7F2] font-bold'
                      : 'bg-[#EFE8DC]/60 text-[#7A756F] hover:text-[#191817]'
                  }`}
                >
                  ALL DOCKETS ({orders.length})
                </button>

                <button
                  type="button"
                  onClick={() => setOrderFilter('in_transit')}
                  className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    orderFilter === 'in_transit'
                      ? 'bg-[#A66551] text-[#FAF7F2] font-bold'
                      : 'bg-[#EFE8DC]/60 text-[#7A756F] hover:text-[#191817]'
                  }`}
                >
                  <Clock width={11} height={11} />
                  <span>ACTIVE / IN TRANSIT ({inTransitCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderFilter('delivered')}
                  className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    orderFilter === 'delivered'
                      ? 'bg-[#2E5A36] text-[#FAF7F2] font-bold'
                      : 'bg-[#EFE8DC]/60 text-[#7A756F] hover:text-[#191817]'
                  }`}
                >
                  <CheckCircle width={11} height={11} />
                  <span>DELIVERED ({deliveredCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderFilter('cod')}
                  className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    orderFilter === 'cod'
                      ? 'bg-[#4A5D6E] text-[#FAF7F2] font-bold'
                      : 'bg-[#EFE8DC]/60 text-[#7A756F] hover:text-[#191817]'
                  }`}
                >
                  PAY ON ARRIVAL ({codCount})
                </button>
              </div>

              {/* Docket Search Input */}
              <div className="relative w-full sm:w-64">
                <Search
                  width={14}
                  height={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A756F]"
                />
                <input
                  type="text"
                  placeholder="Search docket # or piece..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 pl-8 pr-3 py-1.5 text-xs font-mono text-[#191817] placeholder:text-[#7A756F] focus:outline-none focus:border-[#191817]"
                />
                {orderSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setOrderSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A756F] hover:text-[#191817]"
                  >
                    <Xmark width={12} height={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Orders Feed */}
            {ordersLoading && orders.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-[#2C2A29]/20 p-8 bg-[#FAF7F2]">
                <Refresh width={28} height={28} className="animate-spin text-[#A66551] mx-auto mb-3" />
                <p className="font-mono text-xs uppercase tracking-widest text-[#7A756F]">
                  RETRIEVING ATELIER ARCHIVE DOCKETS...
                </p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-[#2C2A29]/20 p-8 bg-[#FAF7F2]">
                <ShoppingBag width={32} height={32} className="text-[#A66551] mx-auto mb-3 opacity-70" />
                <h3 className="font-serif text-2xl text-[#191817] mb-2 font-normal">
                  {orderSearchQuery
                    ? 'No orders match your search query.'
                    : orderFilter === 'all'
                    ? 'No atelier acquisitions recorded yet.'
                    : `No ${orderFilter} order dockets found.`}
                </h3>
                <p className="font-sans text-xs text-[#5C5751] font-light max-w-md mx-auto mb-6 leading-relaxed">
                  Every garment curated through the Atelier is issued an authentic dispatch docket, complete with physical thermal receipts, courier telemetry, and archival logging.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-[#191817] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest px-6 py-3 shadow-md hover:bg-[#2C2A29] transition-all"
                >
                  <ShoppingBag width={14} height={14} />
                  <span>CURATE YOUR FIRST GARMENT</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((ord) => {
                  const docketId = ord.orderDocketId || `ELO-${String(ord._id || ord.id).slice(-6).toUpperCase()}`;
                  const orderDateFormatted = formatOrderDate(ord.createdAt || ord.orderDate);
                  const isPaid = ord.paymentStatus === 'paid';
                  const isCod = ord.paymentMethod === 'cod' || ord.paymentStatus === 'cod_due';
                  const status = ord.orderStatus || 'placed';

                  return (
                    <motion.div
                      key={docketId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-[#2C2A29]/20 bg-[#FAF7F2] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {/* Top Tape Manifest Badge */}
                      <div className="bg-[#191817] text-[#FAF7F2] px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2C2A29]/20">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-[10px] tracking-widest uppercase text-[#E3D5B8] font-bold">
                            OFFICIAL DOCKET REF:
                          </span>
                          <span className="font-mono text-xs tracking-wider font-bold text-white bg-white/10 px-2 py-0.5 border border-white/20">
                            {docketId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyDocket(docketId)}
                            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase text-[#E3D5B8] hover:text-white transition-colors cursor-pointer"
                            title="Copy Docket ID"
                          >
                            {copiedDocket === docketId ? (
                              <>
                                <Check width={12} height={12} className="text-emerald-400" />
                                <span className="text-emerald-400 font-bold">COPIED!</span>
                              </>
                            ) : (
                              <>
                                <Copy width={12} height={12} />
                                <span>COPY</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] text-white/70">
                            DATE: {orderDateFormatted}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 space-y-5">
                        {/* Status Pills Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2C2A29]/10">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Fulfillment Status Pill */}
                            <span
                              className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold px-2.5 py-1 ${
                                status === 'delivered'
                                  ? 'bg-[#2E5A36] text-white'
                                  : status === 'dispatched'
                                  ? 'bg-[#191817] text-[#FAF7F2]'
                                  : status === 'tailoring'
                                  ? 'bg-[#4A5D6E] text-white'
                                  : status === 'cancelled'
                                  ? 'bg-[#D94F65] text-white'
                                  : 'bg-[#A66551] text-white'
                              }`}
                            >
                              <CheckCircle width={11} height={11} />
                              <span>
                                {status === 'delivered'
                                  ? 'DELIVERED TO CLIENT'
                                  : status === 'dispatched'
                                  ? 'DISPATCHED / EN ROUTE'
                                  : status === 'tailoring'
                                  ? 'BESPOKE TAILORING'
                                  : status === 'cancelled'
                                  ? 'ORDER CANCELLED'
                                  : 'ORDER CONFIRMED'}
                              </span>
                            </span>

                            {/* Settlement Status Pill */}
                            <span
                              className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-2.5 py-1 ${
                                isPaid
                                  ? 'bg-[#E8F3EA] text-[#2E5A36] border border-[#2E5A36]/30'
                                  : isCod
                                  ? 'bg-[#FFF8F0] text-[#A66551] border border-[#A66551]/30'
                                  : 'bg-[#FAF7F2] text-[#7A756F] border border-[#2C2A29]/20'
                              }`}
                            >
                              {isPaid ? '✓ PAID IN FULL' : isCod ? 'CONCIERGE COD DUE' : 'PAYMENT PENDING'}
                            </span>

                            {/* Payment Gateway Reference */}
                            <span className="font-mono text-[10px] text-[#7A756F]">
                              METHOD: {ord.paymentMethod?.toUpperCase() || 'RAZORPAY'}
                              {ord.razorpayPaymentId ? ` (${ord.razorpayPaymentId.slice(-8)})` : ''}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-mono text-[10px] uppercase text-[#7A756F] block">
                              DOCKET TOTAL
                            </span>
                            <span className="font-mono font-bold text-lg text-[#191817]">
                              ₹{Number(ord.grandTotal || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Items Purchased in Order */}
                        <div className="space-y-3">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A756F] block font-bold">
                            ITEMIZED ATELIER PIECES ({(ord.items || []).length}):
                          </span>

                          <div className="divide-y divide-[#2C2A29]/10 border border-[#2C2A29]/15 bg-white">
                            {(ord.items || []).map((item, idx) => {
                              const itemImage = item.image || item.images?.[0];
                              const linePrice = (Number(item.price) || 0) * (Number(item.quantity) || 1);

                              return (
                                <div
                                  key={item.id || item._id || item.productId || idx}
                                  className="p-3 sm:p-4 flex items-center justify-between gap-4"
                                >
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="w-12 h-14 bg-[#ECE8DF] border border-[#2C2A29]/15 overflow-hidden flex-shrink-0">
                                      <ThemeImage
                                        src={itemImage}
                                        alt={item.name}
                                        compact={true}
                                        wrapperClassName="w-full h-full"
                                      />
                                    </div>

                                    <div className="truncate">
                                      {item.productId ? (
                                        <Link
                                          to={`/product/${item.productId}`}
                                          className="font-serif text-sm sm:text-base text-[#191817] hover:text-[#A66551] font-normal truncate block transition-colors"
                                        >
                                          {item.name || 'Atelier Piece'}
                                        </Link>
                                      ) : (
                                        <p className="font-serif text-sm sm:text-base text-[#191817] font-normal truncate">
                                          {item.name || 'Atelier Piece'}
                                        </p>
                                      )}

                                      <p className="font-mono text-[10px] text-[#7A756F] mt-0.5">
                                        Qty: {item.quantity || 1} • Size: {item.size || 'M'} • Color:{' '}
                                        {item.color || 'Signature'}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="text-right flex-shrink-0">
                                    <span className="font-mono text-xs sm:text-sm font-bold text-[#191817]">
                                      ₹{linePrice.toLocaleString('en-IN')}
                                    </span>
                                    <span className="block font-mono text-[9px] text-[#7A756F]">
                                      ₹{Number(item.price || 0).toLocaleString('en-IN')} ea
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Destination & Order Note Particulars */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-[#FAF7F2] border border-[#2C2A29]/15 p-3.5 sm:p-4">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-[#7A756F] block font-bold mb-1">
                              📍 COURIER DISPATCH DESTINATION:
                            </span>
                            <p className="font-bold text-[#191817]">{ord.clientName || user.name}</p>
                            <p className="text-[#5C5751] font-sans text-xs mt-0.5 leading-relaxed">
                              {ord.clientAddress}
                            </p>
                            {ord.clientPhone && (
                              <p className="text-[#7A756F] text-[10px] mt-1">
                                Contact: {ord.clientPhone}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider text-[#7A756F] block font-bold mb-1">
                              📋 SETTLEMENT BREAKDOWN:
                            </span>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#7A756F]">Subtotal:</span>
                              <span>₹{Number(ord.subtotal || 0).toLocaleString('en-IN')}</span>
                            </div>
                            {Number(ord.discountAmount || 0) > 0 && (
                              <div className="flex justify-between text-[11px] text-[#A66551]">
                                <span>Discount ({ord.promo?.code || 'PROMO'}):</span>
                                <span>-₹{Number(ord.discountAmount).toLocaleString('en-IN')}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#7A756F]">Atelier Courier:</span>
                              <span className="text-emerald-700 font-bold">
                                {Number(ord.shipping || 0) === 0 ? 'COMPLIMENTARY' : `₹${ord.shipping}`}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs font-bold pt-1 border-t border-[#2C2A29]/10 text-[#191817]">
                              <span>Grand Total:</span>
                              <span>₹{Number(ord.grandTotal || 0).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Action Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2C2A29]/10">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* View Thermal Receipt Modal Action */}
                            <button
                              type="button"
                              onClick={() => setSelectedReceiptOrder(ord)}
                              className="inline-flex items-center gap-1.5 bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-wider px-4 py-2.5 shadow-sm transition-all cursor-pointer"
                            >
                              <Printer width={14} height={14} />
                              <span>VIEW THERMAL RECEIPT</span>
                            </button>

                            {/* Copy Docket ID */}
                            <button
                              type="button"
                              onClick={() => handleCopyDocket(docketId)}
                              className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF7F2] text-[#191817] font-mono text-xs uppercase tracking-wider px-3.5 py-2.5 border border-[#2C2A29]/20 transition-all cursor-pointer"
                            >
                              {copiedDocket === docketId ? (
                                <>
                                  <Check width={13} height={13} className="text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">DOCKET COPIED</span>
                                </>
                              ) : (
                                <>
                                  <Copy width={13} height={13} />
                                  <span>COPY DOCKET #</span>
                                </>
                              )}
                            </button>
                          </div>

                          <a
                            href={`mailto:concierge@elora-atelier.com?subject=Inquiry regarding Docket ${docketId}`}
                            className="inline-flex items-center gap-1.5 text-[#7A756F] hover:text-[#191817] font-mono text-xs uppercase tracking-wider transition-colors"
                          >
                            <Mail width={12} height={12} />
                            <span>CONCIERGE INQUIRY</span>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: GARMENT SUBMISSIONS & CURATION DOSSIERS                        */}
        {/* ========================================================================= */}
        {accountSection === 'submissions' && (
          <div className="space-y-6">
            
            {/* SUBMISSION NOTIFICATION MESSAGES (REJECTED / APPROVED ACTIVE BANNERS) */}
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

                            <div className="bg-[#FAF7F2] border border-[#D94F65]/30 p-3.5 sm:p-4 text-xs font-sans text-[#191817]">
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
        )}

      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE THERMAL RECEIPT MODAL                                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedReceiptOrder && (
          <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-start justify-center"
            onClick={() => setSelectedReceiptOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full max-w-xl my-6 bg-[#FAF7F2] border border-[#2C2A29]/25 shadow-2xl p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Top-Right */}
              <button
                type="button"
                onClick={() => setSelectedReceiptOrder(null)}
                className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] flex items-center justify-center transition-colors cursor-pointer shadow-md"
                aria-label="Close Thermal Receipt"
                title="Close (Esc)"
              >
                <Xmark width={16} height={16} />
              </button>

              <ReceiptBill
                receipt={selectedReceiptOrder}
                onReset={() => setSelectedReceiptOrder(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
};

export default Account;
