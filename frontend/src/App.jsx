import { useEffect, lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Common Layout & Overlay Components (eagerly loaded for instant UX)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import QuickViewModal from './components/QuickViewModal';
import ToastNotification from './components/ToastNotification';
import RemovalModal from './components/RemovalModal';

// Lazy Loaded Route Components & Pages (Code Splitting)
const Home = lazy(() => import('./pages/Home'));
const Collections = lazy(() => import('./pages/Collections'));
const Archive = lazy(() => import('./pages/Archive'));
const About = lazy(() => import('./pages/About'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Account = lazy(() => import('./pages/Account'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const ProductList = lazy(() => import('./components/ProductList'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const ProductForm = lazy(() => import('./components/ProductForm'));
const UpdateProduct = lazy(() => import('./components/UpdateProduct'));

// Redux
import { getUser } from './redux/userSlice';
import { getProduct } from './redux/productSlice';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-[55vh] flex flex-col items-center justify-center p-8 text-center select-none">
      <div className="relative w-12 h-12 flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full border border-dashed border-[#7A756F]/45 animate-spin-slow" />
        <div className="absolute inset-1.5 rounded-full border border-[#2C2A29]/10" />
        <div className="w-4 h-4 text-[#A66551] animate-film-pulse flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
            <circle cx="12" cy="12" r="9" strokeWidth="1.2" strokeDasharray="3 2" />
            <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m11 0l-2-2m-7-7l-2-2" strokeWidth="1" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.25" />
          </svg>
        </div>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7A756F] font-medium block">
        CURATING ATELIER EDITION...
      </span>
      <span className="font-handwriting text-xs text-[#A66551] mt-1 block">
        considered archival pieces
      </span>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  useEffect(() => {
    dispatch(getUser());
    dispatch(getProduct());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#191817] font-sans antialiased selection:bg-[#2C2A29] selection:text-[#FAF7F2] relative">
      <ScrollToTop />
      
      {/* Scrapbook Sticky Navigation */}
      <Navbar />

      {/* Main Routed Content with Lazy Loaded Suspense */}
      <div className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/add" element={<ProductForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/updateproduct" element={<UpdateProduct />} />
          </Routes>
        </Suspense>
      </div>

      {/* Scrapbook Overlays & Modals */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <ToastNotification />
      <RemovalModal />

      {/* Footer rendered on public pages only (hidden on admin dashboard) */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
