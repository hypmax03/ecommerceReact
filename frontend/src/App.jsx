import React from 'react'
import ProductList from './components/ProductList'
import { Link, Route, Routes } from 'react-router-dom'
import ProductDetails from './components/ProductDetails'
import './App.css'
import UpdateProduct from './components/UpdateProduct'
import Home from './pages/Home'
import ProductForm from './components/ProductForm'
import Login from './pages/Login'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Collections', to: '/products' },
  { label: 'About', to: '/' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand-mark">
            NOUVEAU
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} className="site-nav__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-actions">
            <span className="site-meta">Search</span>
            <span className="site-meta">Account</span>
            <span className="site-meta">Bag (2)</span>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add" element={<ProductForm />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/updateproduct" element={<UpdateProduct />} />
      </Routes>
    </div>
  )
}

export default App
