import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import QuickViewModal from './components/QuickViewModal';
import ToastNotification from './components/ToastNotification';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import ProductForm from './components/ProductForm';
import UpdateProduct from './components/UpdateProduct';

// Pages
import Home from './pages/Home';
import Collections from './pages/Collections';
import Archive from './pages/Archive';
import About from './pages/About';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import Bags from './pages/Bags';

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

      {/* Main Routed Content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/bags" element={<Bags />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/add" element={<ProductForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/updateproduct" element={<UpdateProduct />} />
        </Routes>
      </div>

      {/* Scrapbook Overlays & Modals */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <ToastNotification />

      {/* Footer rendered on public pages only (hidden on admin dashboard) */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
