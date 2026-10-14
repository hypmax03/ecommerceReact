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
    <div className="min-h-[55vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-9 h-9 border-2 border-[#191817]/20 border-t-[#8B2635] rounded-full animate-spin mb-4" />
      <span className="font-serif italic text-xs tracking-[0.2em] text-[#7C7267] uppercase">
        Curating Atelier Edition...
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
