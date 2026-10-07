import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProduct } from "../redux/productSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  GENDERS,
  WOMEN_CATEGORIES,
  MEN_CATEGORIES,
  ALL_CATEGORIES
} from "../data/fashionProducts";

function ProductList() {
  const { products, loading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedGender, setSelectedGender] = useState(
    searchParams.get("gender") || "All"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  // Sync state when URL params change
  useEffect(() => {
    const gender = searchParams.get("gender");
    const category = searchParams.get("category");
    if (gender) setSelectedGender(gender);
    if (category) setSelectedCategory(category);
    if (!gender && !category) {
      // If neither is present, reset if they were previously forced
      if (!searchParams.has("gender")) setSelectedGender("All");
      if (!searchParams.has("category")) setSelectedCategory("All");
    }
  }, [searchParams]);

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setSelectedCategory("All");
    const nextParams = {};
    if (gender !== "All") nextParams.gender = gender;
    setSearchParams(nextParams);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const nextParams = {};
    if (selectedGender !== "All") nextParams.gender = selectedGender;
    if (cat !== "All") nextParams.category = cat;
    setSearchParams(nextParams);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this piece from the catalog?")) {
      dispatch(deleteProduct(id));
    }
  };

  // Determine available categories based on selected gender
  const availableCategories = useMemo(() => {
    if (selectedGender === "Women") return WOMEN_CATEGORIES;
    if (selectedGender === "Men") return MEN_CATEGORIES;
    return ALL_CATEGORIES;
  }, [selectedGender]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let list = products.filter((p) => {
      // Match Gender
      const matchGender =
        selectedGender === "All" ||
        (selectedGender === "Women" && (p.gender === "Women" || !p.gender)) ||
        (p.gender && p.gender.toLowerCase() === selectedGender.toLowerCase());

      // Match Category
      const matchCat =
        selectedCategory === "All" ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      // Match Search Query
      const matchSearch =
        !searchQuery.trim() ||
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchGender && matchCat && matchSearch;
    });

    // Sorting
    if (sortBy === "price-low") {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "name-asc") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, selectedGender, selectedCategory, searchQuery, sortBy]);

  if (loading && (!products || products.length === 0)) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="glass-panel hero-panel">
            <h2>Loading atelier catalog...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container">
        {/* Header Section */}
        <div className="section-header">
          <div>
            <span className="brand-badge">
              {selectedGender === "Women"
                ? "WOMEN'S ATELIER"
                : selectedGender === "Men"
                ? "MEN'S SARTORIAL"
                : "HAUTE COLLECTION"}
            </span>
            <h2>
              {selectedGender === "Women"
                ? "Couture Silhouettes & Dresses"
                : selectedGender === "Men"
                ? "Bespoke Menswear & Tailoring"
                : "All Couture & Sartorial Pieces"}
            </h2>
          </div>
          <div className="header-actions">
            <Link to="/add" className="primary-btn" style={{ padding: '0.75rem 1.2rem' }}>
              + Add New Design
            </Link>
          </div>
        </div>

        {/* Gender Tabs */}
        <div className="gender-tabs-bar">
          {GENDERS.map((gender) => (
            <button
              key={gender}
              type="button"
              className={`gender-tab-btn ${selectedGender === gender ? 'active' : ''}`}
              onClick={() => handleGenderChange(gender)}
            >
              {gender === "All" ? "All Collections" : gender === "Women" ? "Women's Collection" : "Men's Collection"}
            </button>
          ))}
        </div>

        {/* Filter and Search Bar */}
        <div className="filter-controls-bar">
          <div className="filter-top-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name, fabric, or silhouette..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="fashion-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ×
                </button>
              )}
            </div>

            <div className="sort-box">
              <label>Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="fashion-select sort-select"
              >
                <option value="featured">Featured Pieces</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Design Name A–Z</option>
              </select>
            </div>
          </div>

          <div className="category-pill-group">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>No pieces match your selection.</h3>
            <p style={{ marginTop: '8px', color: '#cbd5e1' }}>
              {searchQuery || selectedCategory !== "All" || selectedGender !== "All"
                ? "Try adjusting your gender, category, or search filters."
                : "Add a new design piece to get started."}
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => { setSelectedGender("All"); setSelectedCategory("All"); setSearchQuery(""); setSearchParams({}); }}
                className="secondary-btn"
              >
                Reset All Filters
              </button>
              <Link to="/add" className="primary-btn">
                Add New Design
              </Link>
            </div>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const fallbackImg =
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80";
              const imgSrc = product.image && product.image.trim() ? product.image : fallbackImg;

              return (
                <div key={product._id || product.id} className="product-card">
                  <Link to={`/product/${product._id || product.id}`} className="product-card__img-container">
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="product-card__image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = fallbackImg;
                      }}
                    />
                    <div className="product-card__badges-row">
                      <span className="product-card__gender-badge">
                        {product.gender || "Women"}
                      </span>
                      <span className="product-card__category-badge">
                        {product.category || 'Atelier'}
                      </span>
                    </div>
                  </Link>

                  <div className="product-card__content">
                    <h3 className="product-card__title">
                      <Link to={`/product/${product._id || product.id}`}>
                        {product.name}
                      </Link>
                    </h3>

                    {product.description && (
                      <p className="product-card__snippet">
                        {product.description}
                      </p>
                    )}

                    <div className="meta-row">
                      <span>Price</span>
                      <strong className="product-card__price">
                        ₹{product.price ? product.price.toLocaleString('en-IN') : '0'}
                      </strong>
                    </div>

                    <div className="meta-row">
                      <span>Availability</span>
                      <strong className={product.stock > 0 ? "stock-in" : "stock-out"}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Sold Out"}
                      </strong>
                    </div>

                    <div className="card-actions">
                      <Link
                        to={`/product/${product._id || product.id}`}
                        className="card-btn primary"
                        style={{ flex: 1.2 }}
                      >
                        View Piece
                      </Link>
                      <button
                        onClick={() => navigate('/updateproduct', { state: { product } })}
                        className="card-btn warn"
                        title="Edit design"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id || product.id)}
                        className="card-btn danger"
                        title="Delete design"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
