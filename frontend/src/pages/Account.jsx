import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User,
  ShoppingBag,
  Plus,
  ArrowUpRight,
  LogOut,
  ShieldCheck,
  CheckCircle,
  Clock,
  Xmark,
  Mail,
} from 'iconoir-react';
import { logoutUser } from '../redux/userSlice';
import { getProduct, getAdminDashboard } from '../redux/productSlice';
import Tape from '../components/Tape';
import HandwrittenNote from '../components/HandwrittenNote';

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user || { user: null });
  const { allAdminProducts, products } = useSelector((state) => state.product || { allAdminProducts: [], products: [] });

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');

  useEffect(() => {
    dispatch(getProduct());
    if (isAdmin) {
      dispatch(getAdminDashboard());
    }
  }, [dispatch, isAdmin]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

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
            Sign in to view your profile, manage your garment submissions, and track moderation requests.
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

  // Filter garments submitted by this logged-in user
  const userSubmissions = (allAdminProducts.length > 0 ? allAdminProducts : products).filter((p) => {
    if (!p.submittedBy) return false;
    return (
      (p.submittedBy.email && p.submittedBy.email.toLowerCase() === user.email.toLowerCase()) ||
      (p.submittedBy.name && p.submittedBy.name.toLowerCase() === user.name.toLowerCase())
    );
  });

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
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
                className="inline-flex items-center gap-2 bg-[#EFE8DC] hover:bg-[#E3D5B8] text-[#191817] font-mono text-xs uppercase tracking-widest px-4 py-2.5 border border-[#D1C9BC] transition-colors"
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

        {/* User Submissions & Curation Status Section */}
        <div className="bg-[#FDFCF9] border border-[#2C2A29]/15 p-6 sm:p-10 shadow-sm relative">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-4 border-b border-[#2C2A29]/10 gap-2">
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

            <Link
              to="/add"
              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#191817] hover:text-[#A66551] transition-colors self-start sm:self-auto"
            >
              <span>+ PROPOSE ANOTHER PIECE</span>
              <ArrowUpRight width={12} height={12} />
            </Link>
          </div>

          {userSubmissions.length === 0 ? (
            <div className="py-14 text-center border border-dashed border-[#2C2A29]/20 p-6 bg-[#FAF7F2]">
              <Clock width={24} height={24} className="text-[#A66551] mx-auto mb-3 opacity-80" />
              <h3 className="font-serif text-xl text-[#191817] mb-1">
                No garment submissions yet.
              </h3>
              <p className="font-sans text-xs text-[#5C5751] font-light max-w-sm mx-auto mb-5">
                Propose your custom clothing pieces and textiles. Submissions are instantly routed to the Admin Curation Desk for review and storefront publication.
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
              {userSubmissions.map((item) => {
                const img = item.images?.[0] || item.image;
                const isApproved = item.status === 'approved';
                const isRejected = item.status === 'rejected';

                return (
                  <div
                    key={item._id || item.id}
                    className="p-4 sm:p-5 border border-[#2C2A29]/15 bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#191817]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-[#ECE8DF] border border-[#2C2A29]/10 overflow-hidden flex-shrink-0">
                        {img ? (
                          <img
                            src={img}
                            alt={item.name}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-[8px] text-[#7A756F]">
                            NO IMAGE
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block">
                          {item.category || 'READY-TO-WEAR'} • ₹{item.price?.toLocaleString('en-IN')}
                        </span>
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

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center flex-wrap">
                      <div className="text-right">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-[#2E5A36] bg-[#E8F3EA] border border-[#2E5A36]/30 px-2.5 py-1">
                            <CheckCircle width={12} height={12} />
                            <span>APPROVED &amp; LIVE</span>
                          </span>
                        )}
                        {isRejected && (
                          <div className="space-y-1 text-right">
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-[#8B263E] bg-[#FDF2F4] border border-[#8B263E]/30 px-2.5 py-1">
                              <Xmark width={12} height={12} />
                              <span>REJECTED BY CURATOR</span>
                            </span>
                            {item.rejectionReason && (
                              <p className="font-sans text-[10px] text-[#8B263E] max-w-xs">
                                Note: {item.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                        {!isApproved && !isRejected && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-[#A66551] bg-[#FDF5F2] border border-[#A66551]/30 px-2.5 py-1">
                            <Clock width={12} height={12} />
                            <span>AWAITING ADMIN REVIEW</span>
                          </span>
                        )}
                      </div>

                      {isApproved && (
                        <Link
                          to={`/product/${item._id || item.id}`}
                          className="font-mono text-[10px] uppercase font-bold text-[#191817] hover:text-[#A66551] inline-flex items-center gap-1 border border-[#2C2A29]/20 px-2.5 py-1 bg-white"
                        >
                          <span>VIEW PIECE</span>
                          <ArrowUpRight width={10} height={10} />
                        </Link>
                      )}
                    </div>
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
