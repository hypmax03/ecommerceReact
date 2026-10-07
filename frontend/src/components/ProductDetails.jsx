import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductById } from '../redux/productSlice'

function ProductDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { product, products, loading } = useSelector((state) => state.product)

  const [selectedSize, setSelectedSize] = useState('M')
  const [bagAdded, setBagAdded] = useState(false)

  // Find product either from active product or products list in redux
  const currentProduct =
    product && (product._id === id || product.id === id)
      ? product
      : products.find((p) => p._id === id || p.id === id)

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id))
    }
  }, [dispatch, id])

  const fallbackImg =
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80"

  if (loading && !currentProduct) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="glass-panel hero-panel">
            <h2>Loading piece details...</h2>
          </div>
        </div>
      </div>
    )
  }

  if (!currentProduct) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="empty-state">
            <h2>Design piece not found.</h2>
            <p style={{ marginTop: '8px', color: '#cbd5e1' }}>
              The requested piece might have been removed or does not exist.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link to="/products" className="primary-btn">
                ← Return to Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isMen = currentProduct.gender === 'Men'
  const sizes = isMen ? ['38R / S', '40R / M', '42R / L', '44R / XL', '46R / XXL'] : ['XS', 'S', 'M', 'L', 'XL']

  const handleAddToBag = () => {
    setBagAdded(true)
    setTimeout(() => setBagAdded(false), 2500)
  }

  return (
    <div className="page-shell">
      <div className="page-container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/products?gender=${currentProduct.gender || 'Women'}`}>
            {currentProduct.gender === 'Men' ? "Men's Sartorial" : "Women's Atelier"}
          </Link>
          <span>/</span>
          <span>{currentProduct.name}</span>
        </nav>

        <div className="dress-detail-layout">
          {/* Left: Product Image Visual */}
          <div className="dress-detail-visual">
            <div className="dress-detail-image-wrapper">
              <img
                src={currentProduct.image && currentProduct.image.trim() ? currentProduct.image : fallbackImg}
                alt={currentProduct.name}
                className="dress-detail-image"
                onError={(e) => {
                  e.target.src = fallbackImg
                }}
              />
              <span className="visual-badge">
                {currentProduct.gender === 'Men' ? 'BESPOKE SARTORIAL' : 'HAUTE ATELIER'}
              </span>
            </div>
          </div>

          {/* Right: Product Info and Purchase CTA */}
          <div className="dress-detail-info">
            <div className="dress-header">
              <div className="detail-tags-row">
                <span className="brand-badge">{currentProduct.gender || 'Women'}'s</span>
                <span className="category-subtag">{currentProduct.category}</span>
              </div>
              <h1 className="dress-title">{currentProduct.name}</h1>
              <div className="dress-price-tag">
                ₹{currentProduct.price ? currentProduct.price.toLocaleString('en-IN') : '0'}
                <span className="tax-note">Includes all taxes &amp; duties</span>
              </div>
            </div>

            {/* Description */}
            <div className="dress-description">
              <p>
                {currentProduct.description ||
                  "Impeccably tailored piece showcasing bespoke craftsmanship, sculpted lines, and luxury fabric tailored to perfection for modern sophistication."}
              </p>
            </div>

            {/* Size Selector */}
            <div className="dress-options">
              <div className="option-label">
                <span>SELECT TAILORED SIZE</span>
                <button type="button" className="size-guide-btn">Bespoke Size Guide</button>
              </div>
              <div className="size-selector">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-btn size-btn--extended ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Availability */}
            <div className="dress-stock-status">
              <span className={`status-indicator ${currentProduct.stock > 0 ? 'in-stock' : 'out-of-stock'}`} />
              <span>
                {currentProduct.stock > 0
                  ? `In Stock (${currentProduct.stock} pieces crafted)`
                  : 'Currently Sold Out'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="dress-actions-group">
              <button
                type="button"
                className="primary-btn add-to-bag-btn"
                onClick={handleAddToBag}
                disabled={currentProduct.stock <= 0}
              >
                {bagAdded ? "✓ ADDED TO BESPOKE BAG" : "ADD TO BAG — ₹" + (currentProduct.price ? currentProduct.price.toLocaleString('en-IN') : '0')}
              </button>

              <div className="secondary-action-row">
                <button
                  type="button"
                  onClick={() => navigate('/updateproduct', { state: { product: currentProduct } })}
                  className="secondary-btn"
                  style={{ flex: 1 }}
                >
                  Edit Design Info
                </button>
                <Link to={`/products?gender=${currentProduct.gender || 'Women'}`} className="secondary-btn" style={{ flex: 1 }}>
                  Return to Shop
                </Link>
              </div>
            </div>

            {/* Additional Luxury Notes */}
            <div className="dress-accordion">
              <div className="accordion-item">
                <strong>ATELIER CRAFTSMANSHIP &amp; CARE</strong>
                <p>Superfine fabrics. Hand-finished stitching. Specialist dry clean only.</p>
              </div>
              <div className="accordion-item">
                <strong>COMPLIMENTARY CONCIERGE &amp; SHIPPING</strong>
                <p>Complimentary white-glove worldwide delivery with bespoke gift packaging.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
