import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ArrowUpRight } from 'iconoir-react';
import { updateProduct } from '../redux/productSlice';
import Tape from './Tape';
import { ALL_CATEGORIES } from '../data/fashionProducts';

const UpdateProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = location.state?.product;
  const reduxProducts = useSelector((state) => state.product?.products || []);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Evening Gowns',
    gender: 'Women',
    image: '',
    hoverImage: '',
    description: '',
    material: '',
    madeIn: 'Como, Italy',
  });

  const [customCategories, setCustomCategories] = useState([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  const availableCategories = useMemo(() => {
    const defaultCats = ALL_CATEGORIES.filter((c) => c !== 'All');
    const productCats = reduxProducts.map((p) => p.category).filter(Boolean);
    const currentCat = product?.category ? [product.category] : [];
    return Array.from(new Set([...defaultCats, ...currentCat, ...customCategories, ...productCats]));
  }, [customCategories, reduxProducts, product]);

  const [primaryUploadMode, setPrimaryUploadMode] = useState('file'); // 'file' | 'url'
  const [hoverUploadMode, setHoverUploadMode] = useState('url'); // 'file' | 'url'
  const [isDraggingPrimary, setIsDraggingPrimary] = useState(false);
  const [isDraggingHover, setIsDraggingHover] = useState(false);

  const handleFileUpload = (file, fieldName) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === '__CREATE_NEW__') {
      setIsCreatingCategory(true);
    } else {
      setIsCreatingCategory(false);
      setFormData((prev) => ({ ...prev, category: value }));
    }
  };

  const handleAddCustomCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (!customCategories.includes(trimmed)) {
      setCustomCategories((prev) => [...prev, trimmed]);
    }
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setIsCreatingCategory(false);
    setNewCategoryInput('');
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || 'Evening Gowns',
        gender: product.gender || 'Women',
        image: product.image || '',
        hoverImage: product.hoverImage || '',
        description: product.description || '',
        material: product.material || '',
        madeIn: product.madeIn || 'Como, Italy',
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-6 text-center bg-[#FAF7F2]">
        <h2 className="font-serif text-2xl">No design selected for modification.</h2>
        <Link to="/products" className="font-mono text-xs text-[#A66551] underline mt-3 inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory = isCreatingCategory && newCategoryInput.trim()
      ? newCategoryInput.trim()
      : formData.category;

    const updated = {
      ...product,
      ...formData,
      category: finalCategory,
      price: Number(formData.price),
    };
    dispatch(updateProduct(updated));
    navigate(`/product/${product._id || product.id}`);
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <Link
          to={`/product/${product._id || product.id}`}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#7A756F] hover:text-[#191817] mb-6"
        >
          <ArrowLeft width={14} height={14} />
          <span>BACK TO PIECE</span>
        </Link>

        <div className="bg-[#FDFCF9] p-8 sm:p-12 border border-[#2C2A29]/15 shadow-xl relative">
          <div className="absolute -top-3.5 left-10 pointer-events-none">
            <Tape rotate="1deg" variant="dark" text="UPDATE SPECIFICATION" width="w-44" />
          </div>

          <div className="border-b border-[#2C2A29]/15 pb-6 mb-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#7A756F] block mb-1">
              MODIFY DOCKET • REF {product._id || product.id}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#191817] font-normal">
              Update Piece Details
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                  GARMENT NAME
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-serif text-base text-[#191817] focus:outline-none focus:border-[#191817]"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                  PRICE (INR ₹)
                </label>
                <input
                  type="number"
                  required
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-mono text-sm text-[#191817] focus:outline-none focus:border-[#191817]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                  ATELIER GENDER
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-mono text-xs uppercase tracking-wider text-[#191817] focus:outline-none"
                >
                  <option value="Women">Women's Atelier</option>
                  <option value="Men">Men's Sartorial</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F]">
                    CATEGORY
                  </label>
                  {!isCreatingCategory && (
                    <button
                      type="button"
                      onClick={() => setIsCreatingCategory(true)}
                      className="font-mono text-[9px] uppercase tracking-wider text-[#A66551] hover:text-[#191817] underline cursor-pointer"
                    >
                      + Custom Category
                    </button>
                  )}
                </div>

                <select
                  name="category"
                  value={isCreatingCategory ? '__CREATE_NEW__' : formData.category}
                  onChange={handleCategoryChange}
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-mono text-xs uppercase tracking-wider text-[#191817] focus:outline-none focus:border-[#191817]"
                >
                  <option value="__CREATE_NEW__">✦ + CREATE NEW CATEGORY...</option>
                  <optgroup label="AVAILABLE CATEGORIES">
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </optgroup>
                </select>

                {isCreatingCategory && (
                  <div className="mt-2.5 p-3 bg-[#F5EFE6] border border-[#2C2A29]/20 shadow-inner">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                      Enter Custom Category Name
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomCategory();
                          }
                        }}
                        placeholder="e.g. Resort Wear, Bridal Couture..."
                        className="flex-1 bg-[#FAF7F2] border border-[#2C2A29]/30 px-3 py-2 font-mono text-xs text-[#191817] focus:outline-none focus:border-[#191817]"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomCategory}
                        className="bg-[#191817] text-[#FAF7F2] hover:bg-[#2C2A29] px-3.5 py-2 font-mono text-[10px] uppercase tracking-widest font-bold transition-colors"
                      >
                        CONFIRM
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingCategory(false);
                          setNewCategoryInput('');
                        }}
                        className="bg-transparent hover:bg-[#2C2A29]/10 border border-[#2C2A29]/30 text-[#191817] px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PRIMARY IMAGE / COVER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F]">
                  PRIMARY GARMENT IMAGE <span className="text-[#A66551]">*</span>
                </label>
                <div className="flex items-center gap-1 bg-[#ECE8DF] p-0.5 border border-[#2C2A29]/15">
                  <button
                    type="button"
                    onClick={() => setPrimaryUploadMode('file')}
                    className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 transition-colors ${
                      primaryUploadMode === 'file'
                        ? 'bg-[#191817] text-[#FAF7F2] font-bold'
                        : 'text-[#7A756F] hover:text-[#191817]'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrimaryUploadMode('url')}
                    className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 transition-colors ${
                      primaryUploadMode === 'url'
                        ? 'bg-[#191817] text-[#FAF7F2] font-bold'
                        : 'text-[#7A756F] hover:text-[#191817]'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {primaryUploadMode === 'file' ? (
                <div>
                  <input
                    type="file"
                    id="update-primary-image-upload"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'image');
                      e.target.value = '';
                    }}
                    className="hidden"
                  />

                  {formData.image ? (
                    <div className="p-3 bg-[#F5EFE6] border border-[#2C2A29]/20 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={formData.image}
                          alt="Primary preview"
                          className="w-14 h-18 object-cover border border-[#2C2A29]/20 shadow-xs bg-[#ECE8DF] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-[#191817] font-bold block">
                            ✓ Current Image Attached
                          </span>
                          <span className="font-mono text-[9px] text-[#7A756F] truncate block">
                            {formData.image.startsWith('data:') ? 'Local file uploaded via browser' : formData.image}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <label
                          htmlFor="update-primary-image-upload"
                          className="font-mono text-[9px] uppercase tracking-wider bg-[#FAF7F2] hover:bg-[#ECE8DF] text-[#191817] border border-[#2C2A29]/20 px-2.5 py-1.5 cursor-pointer"
                        >
                          Change
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                          className="font-mono text-[9px] uppercase tracking-wider text-[#A66551] hover:text-[#7D3E2F] px-2 py-1.5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="update-primary-image-upload"
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingPrimary(true);
                      }}
                      onDragLeave={() => setIsDraggingPrimary(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingPrimary(false);
                        if (e.dataTransfer.files?.[0]) {
                          handleFileUpload(e.dataTransfer.files[0], 'image');
                        }
                      }}
                      className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors block ${
                        isDraggingPrimary
                          ? 'border-[#191817] bg-[#ECE8DF]'
                          : 'border-[#2C2A29]/20 hover:border-[#191817] bg-[#FDFCF9]'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="font-mono text-xs uppercase tracking-wider text-[#191817] font-bold block">
                          ↑ Browse or Drop New Garment Image
                        </span>
                        <span className="font-sans text-[11px] text-[#7A756F] block">
                          Supports JPG, PNG, WEBP, AVIF
                        </span>
                      </div>
                    </label>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    required={!formData.image}
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-mono text-xs text-[#191817] focus:outline-none focus:border-[#191817]"
                  />
                  {formData.image && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-[#F5EFE6] border border-[#2C2A29]/15">
                      <img
                        src={formData.image}
                        alt="URL Preview"
                        className="w-10 h-12 object-cover border border-[#2C2A29]/20 bg-[#ECE8DF]"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="font-mono text-[9px] text-[#7A756F]">URL Image Preview Loaded</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                EDITORIAL DESCRIPTION
              </label>
              <textarea
                rows={3}
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-sans text-xs text-[#191817] focus:outline-none focus:border-[#191817]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest py-4 flex items-center justify-center gap-2 shadow-lg transition-colors font-bold"
            >
              <span>SAVE UPDATED SPECIFICATION</span>
              <ArrowUpRight width={14} height={14} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdateProduct;
