import { useEffect } from 'react'
import ProductList from './components/ProductList'
import { Link, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProductDetails from './components/ProductDetails'
import './App.css'
import UpdateProduct from './components/UpdateProduct'
import Home from './pages/Home'
import ProductForm from './components/ProductForm'
import Login from './pages/Login'
import Register from './pages/Register'
import { getUser } from './redux/userSlice'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Women', to: '/products?gender=Women' },
  { label: 'Men', to: '/products?gender=Men' },
  { label: 'All Pieces', to: '/products' },
  { label: '+ Add Design', to: '/add' },
]

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand-mark">
            NOUVEAU ATELIER
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} className="site-nav__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-actions">
            <Link to="/products" className="site-meta">Shop</Link>
            {user && (
              <span className="site-user" aria-label={`Signed in as ${user.name}`}>
                <span className="site-user__avatar" aria-hidden="true">
                  {user.image ? (
                    <img src={user.image} alt="" />
                  ) : (
                    user.name?.trim().charAt(0).toUpperCase()
                  )}
                </span>
                <span>{user.name}</span>
              </span>
            )}
            <Link to="/login" className="site-meta">Account</Link>
            <Link to="/cart" className="site-meta">Bag</Link>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add" element={<ProductForm />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/updateproduct" element={<UpdateProduct />} />
      </Routes>
    </div>
  )
}

export default App
