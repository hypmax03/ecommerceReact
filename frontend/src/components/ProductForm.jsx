import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'iconoir-react';
import { addProduct } from '../redux/productSlice';
import Tape from './Tape';

function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    // image: null
    images: [],
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: Array.from(e.target.files),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const product = new FormData();

    product.append('name', formData.name);
    product.append('price', Number(formData.price));
    product.append('category', formData.category);
    product.append('stock', Number(formData.stock));

    // Add image
    formData.images.forEach((image) => {
      product.append('images', image);
    });

    dispatch(addProduct(product));

    setFormData({
      name: '',
      price: '',
      category: '',
      stock: '',
      images: [],
    });
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#7A756F] hover:text-[#191817] mb-6 transition-colors"
        >
          <ArrowLeft width={14} height={14} />
          <span>BACK TO CATALOG</span>
        </Link>

        <div className="bg-[#FDFCF9] p-8 sm:p-12 border border-[#2C2A29]/15 shadow-xl relative">
          <div className="absolute -top-3.5 left-10 pointer-events-none">
            <Tape rotate="-1deg" variant="kraft" text="NEW PRODUCT REGISTRY" width="w-44" />
          </div>

          <div className="border-b border-[#2C2A29]/15 pb-6 mb-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#7A756F] block mb-1">
              ATELIER DOCKET
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#191817] font-normal">
              Register Product
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                PRODUCT NAME <span className="text-[#A66551]">*</span>
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Silk Evening Gown"
                className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-serif text-base text-[#191817] focus:outline-none focus:border-[#191817] transition-colors"
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                  PRICE (INR ₹) <span className="text-[#A66551]">*</span>
                </label>
                <input
                  type="number"
                  required
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 4999"
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-mono text-sm text-[#191817] focus:outline-none focus:border-[#191817] transition-colors"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                  STOCK QUANTITY <span className="text-[#A66551]">*</span>
                </label>
                <input
                  type="number"
                  required
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-mono text-sm text-[#191817] focus:outline-none focus:border-[#191817] transition-colors"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                CATEGORY <span className="text-[#A66551]">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-[#FAF7F2] border border-[#2C2A29]/20 px-3.5 py-2.5 font-mono text-xs uppercase tracking-wider text-[#191817] focus:outline-none focus:border-[#191817] transition-colors"
              >
                <option value="">-- SELECT CATEGORY --</option>
                <option value="Evening Gowns">Evening Gowns</option>
                <option value="Suits & Tailoring">Suits & Tailoring</option>
                <option value="Outerwear & Coats">Outerwear & Coats</option>
                <option value="Blazers & Jackets">Blazers & Jackets</option>
                <option value="Cocktail Dresses">Cocktail Dresses</option>
                <option value="Blazer Dresses">Blazer Dresses</option>
                <option value="Linen & Shirts">Linen & Shirts</option>
                <option value="Summer Dresses">Summer Dresses</option>
                <option value="Knitwear">Knitwear</option>
              </select>
            </div>

            {/* Images Upload */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                PRODUCT IMAGES
              </label>
              
              <label
                htmlFor="product-images"
                className="border-2 border-dashed border-[#2C2A29]/20 hover:border-[#191817] bg-[#FAF7F2] p-6 text-center cursor-pointer transition-colors block"
              >
                <input
                  id="product-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#191817] font-bold block">
                    {formData.images.length > 0
                      ? `✓ ${formData.images.length} File${formData.images.length > 1 ? 's' : ''} Selected`
                      : '↑ Click to Browse or Drop Images'}
                  </span>
                  <span className="font-sans text-[11px] text-[#7A756F] block">
                    Select multiple image files
                  </span>
                </div>
              </label>

              {/* Selected Files Badge List */}
              {formData.images.length > 0 && (
                <div className="mt-3 p-3 bg-[#F5EFE6] border border-[#2C2A29]/15">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#7A756F] block mb-1.5">
                    ATTACHED FILES ({formData.images.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((file, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[10px] bg-[#FAF7F2] border border-[#2C2A29]/20 px-2 py-1 text-[#191817]"
                      >
                        {file.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#191817] hover:bg-[#2C2A29] text-[#FAF7F2] font-mono text-xs uppercase tracking-widest py-4 flex items-center justify-center gap-2 shadow-lg transition-colors font-bold cursor-pointer"
            >
              <span>SUBMIT PRODUCT</span>
              <ArrowUpRight width={14} height={14} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ProductForm;