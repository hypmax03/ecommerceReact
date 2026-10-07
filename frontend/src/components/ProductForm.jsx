import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addProduct } from '../redux/productSlice'
import { useNavigate, Link } from 'react-router-dom'
import {
  WOMEN_CATEGORIES,
  MEN_CATEGORIES,
  GENDERS
} from '../data/fashionProducts'

const SAMPLE_IMAGE_PRESETS = [
  // Women
  { label: 'Silk Gown (W)', gender: 'Women', category: 'Evening Gowns', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80' },
  { label: 'Summer Dress (W)', gender: 'Women', category: 'Summer Dresses', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80' },
  { label: 'Black Velvet (W)', gender: 'Women', category: 'Cocktail Dresses', url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80' },
  { label: 'Red Satin (W)', gender: 'Women', category: 'Evening Gowns', url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80' },
  { label: 'Boho Maxi (W)', gender: 'Women', category: 'Bohemian', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80' },
  // Men
  { label: 'Wool Suit (M)', gender: 'Men', category: 'Suits & Tailoring', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80' },
  { label: 'Overcoat (M)', gender: 'Men', category: 'Outerwear & Coats', url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=80' },
  { label: 'Tuxedo (M)', gender: 'Men', category: 'Suits & Tailoring', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80' },
  { label: 'Linen Shirt (M)', gender: 'Men', category: 'Linen & Shirts', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80' },
  { label: 'Velvet Smoking (M)', gender: 'Men', category: 'Blazers & Jackets', url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80' },
  { label: 'Leather Jacket (M)', gender: 'Men', category: 'Blazers & Jackets', url: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80' },
]

function ProductForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    gender: 'Women',
    category: 'Evening Gowns',
    stock: '10',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80',
    description: '',
  })

  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'gender') {
      const defaultCat = value === 'Men' ? 'Suits & Tailoring' : 'Evening Gowns'
      setFormData({
        ...formData,
        gender: value,
        category: defaultCat,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSelectPreset = (preset) => {
    setFormData({
      ...formData,
      image: preset.url,
      gender: preset.gender,
      category: preset.category,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const product = {
      name: formData.name.trim(),
      price: Number(formData.price),
      gender: formData.gender,
      category: formData.category,
      stock: Number(formData.stock),
      image: formData.image.trim(),
      description: formData.description.trim(),
    }

    try {
      await dispatch(addProduct(product)).unwrap()
      setFormData({
        name: '',
        price: '',
        gender: 'Women',
        category: 'Evening Gowns',
        stock: '',
        image: '',
        description: '',
      })
      navigate(`/products?gender=${product.gender}`)
    } catch (error) {
      console.log('Failed to add product:', error)
      navigate('/products')
    } finally {
      setSubmitting(false)
    }
  }

  const activeCategories =
    formData.gender === 'Men'
      ? MEN_CATEGORIES.filter((c) => c !== 'All')
      : WOMEN_CATEGORIES.filter((c) => c !== 'All')

  return (
    <div className="page-shell">
      <div className="page-container form-container-wrapper">
        <div className="form-card">
          <div className="form-header">
            <span className="brand-badge">ATELIER CATALOG</span>
            <h2>Add New Fashion Design</h2>
            <p style={{ color: '#a0a0a0', fontSize: '0.85rem', marginTop: '4px' }}>
              Publish a bespoke Women's or Men's creation to your luxury store.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Design / Piece Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Milano Double-Breasted Wool Suit"
              />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Department / Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="fashion-select"
                >
                  <option value="Women">Women's Atelier</option>
                  <option value="Men">Men's Sartorial</option>
                  <option value="Unisex">Unisex Couture</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Silhouette / Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="fashion-select"
                >
                  {activeCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Bespoke Design">Other Silhouette</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 8499"
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL (Royalty-free Unsplash Link) *</label>
              <input
                type="url"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
              <div className="image-presets-row">
                <span style={{ fontSize: '0.7rem', color: '#888', width: '100%', marginBottom: '4px' }}>
                  Quick Pick Royalty-Free Presets:
                </span>
                {SAMPLE_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="preset-btn"
                    onClick={() => handleSelectPreset(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Image Preview */}
            {formData.image && (
              <div className="image-preview-box">
                <span className="preview-label">Live Preview:</span>
                <div className="preview-media">
                  <img
                    src={formData.image}
                    alt="Preview"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                    onLoad={(e) => {
                      e.target.style.display = 'block'
                    }}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Description &amp; Fabric Specifications</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the fabric (e.g. Super 130s Italian Wool, Silk Crepe, French Flax Linen), tailoring fit, and occasions..."
              />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="primary-btn" disabled={submitting}>
                {submitting ? 'Publishing...' : 'Publish Piece to Store'}
              </button>
              <Link to="/products" className="secondary-btn">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductForm