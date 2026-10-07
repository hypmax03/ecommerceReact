import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Home = () => {
  const { products } = useSelector((state) => state.product)

  // Filter top women's and men's products for showcase
  const womenItems = products.filter((p) => p.gender === 'Women' || !p.gender).slice(0, 3)
  const menItems = products.filter((p) => p.gender === 'Men').slice(0, 3)

  return (
    <main className="page-shell">
      <div className="page-container">
        {/* Editorial Hero Section */}
        <section className="editorial-hero">
          <div className="editorial-copy">
            <p className="eyebrow">HAUTE COUTURE &amp; BESPOKE TAILORING</p>
            <h1>
              TIMELESS
              <span>ELEGANCE.</span>
              WOMEN &amp; MEN.
            </h1>
            <p className="lead">
              Distinctive evening gowns, fine summer silhouettes, Super 130s Italian wool suits, and cashmere overcoats designed for refined living.
            </p>

            <div className="cta-row">
              <Link to="/products?gender=Women" className="primary-btn">
                WOMEN'S ATELIER →
              </Link>
              <Link to="/products?gender=Men" className="secondary-btn">
                MEN'S SARTORIAL →
              </Link>
              <Link to="/add" className="ghost-btn">
                + ADD DESIGN
              </Link>
            </div>

            <div className="stat-row">
              <div>
                <strong>{products.length || '24+'}</strong>
                <span>Couture Designs</span>
              </div>
              <div>
                <strong>02</strong>
                <span>Ateliers (M &amp; W)</span>
              </div>
              <div>
                <strong>₹2,899</strong>
                <span>Starting at</span>
              </div>
            </div>
          </div>

          <div className="editorial-visual editorial-visual--dual">
            <div className="dual-visual-card">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
                alt="Women Couture Dress"
                className="hero-dress-img"
              />
              <span className="visual-tag">WOMEN / ATELIER</span>
            </div>
            <div className="dual-visual-card dual-visual-card--offset">
              <img
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
                alt="Men Bespoke Suit"
                className="hero-dress-img"
              />
              <span className="visual-tag">MEN / SARTORIAL</span>
            </div>
          </div>
        </section>

        {/* Dual Gateways Section: Women vs Men */}
        <section className="atelier-gateways">
          <div className="gateway-card">
            <div className="gateway-bg-wrap">
              <img
                src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80"
                alt="Women's Collection"
                className="gateway-bg-img"
              />
              <div className="gateway-overlay" />
            </div>
            <div className="gateway-content">
              <span className="gateway-tag">COLLECTION 01</span>
              <h2>Women's Haute Silhouettes</h2>
              <p>Silk evening gowns, smocked prairie dresses, and fluid party maxis.</p>
              <Link to="/products?gender=Women" className="gateway-btn">
                EXPLORE WOMEN'S →
              </Link>
            </div>
          </div>

          <div className="gateway-card">
            <div className="gateway-bg-wrap">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
                alt="Men's Collection"
                className="gateway-bg-img"
              />
              <div className="gateway-overlay" />
            </div>
            <div className="gateway-content">
              <span className="gateway-tag">COLLECTION 02</span>
              <h2>Men's Bespoke Sartorial</h2>
              <p>Double-breasted Italian wool suits, cashmere overcoats, and flax linen.</p>
              <Link to="/products?gender=Men" className="gateway-btn">
                EXPLORE MEN'S →
              </Link>
            </div>
          </div>
        </section>

        {/* Women's Featured Arrivals */}
        <section className="featured-section">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">WOMEN'S HIGHLIGHTS</p>
              <h2>Sculpted couture &amp; evening wear.</h2>
            </div>
            <Link to="/products?gender=Women" className="text-link">
              VIEW ALL WOMEN'S →
            </Link>
          </div>

          <div className="feature-grid">
            {womenItems.map((item, index) => (
              <article
                key={item._id || index}
                className={`feature-item ${index === 0 ? 'feature-item--large' : ''}`}
              >
                <Link to={`/product/${item._id}`} className="feature-media-link">
                  <div className="feature-media-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="feature-dress-img"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <div className="feature-meta">
                  <div>
                    <span>00{index + 1} • {item.category}</span>
                    <h3>{item.name}</h3>
                  </div>
                  <p>₹{item.price?.toLocaleString('en-IN')}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Men's Featured Arrivals */}
        <section className="featured-section" style={{ paddingTop: '54px' }}>
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">MEN'S HIGHLIGHTS</p>
              <h2>Bespoke suits, overcoats &amp; linen.</h2>
            </div>
            <Link to="/products?gender=Men" className="text-link">
              VIEW ALL MEN'S →
            </Link>
          </div>

          <div className="feature-grid">
            {menItems.map((item, index) => (
              <article
                key={item._id || index}
                className={`feature-item ${index === 0 ? 'feature-item--large' : ''}`}
              >
                <Link to={`/product/${item._id}`} className="feature-media-link">
                  <div className="feature-media-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="feature-dress-img"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <div className="feature-meta">
                  <div>
                    <span>00{index + 1} • {item.category}</span>
                    <h3>{item.name}</h3>
                  </div>
                  <p>₹{item.price?.toLocaleString('en-IN')}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home