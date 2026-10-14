import { createSlice } from "@reduxjs/toolkit";

const getSavedCart = () => {
  try {
    const saved = localStorage.getItem("atelier_cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: getSavedCart(),
  isCartOpen: false,
  isSearchOpen: false,
  quickViewProduct: null,
  removalModalData: null, // { product?: object, title?: string, id?: string }
  toast: null,
  promo: null, // { code: 'ATELIER10', discountPercent: 10, discountAmount: 0, label: '10% Atelier Courtesy' }
  orderNote: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, size = "M", color, quantity = 1 } = action.payload;
      const chosenColor = color || (product.colors && product.colors[0]?.name) || "Signature";
      const itemKey = `${product._id || product.id}_${size}_${chosenColor}`;

      const primaryImage =
        (product.images && product.images.length > 0 ? product.images[0] : product.image) || "";

      const existingIndex = state.items.findIndex((item) => item.key === itemKey);
      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          key: itemKey,
          id: product._id || product.id,
          name: product.name,
          price: Number(product.price) || 0,
          image: primaryImage,
          category: product.category || "Atelier Occasionwear",
          gender: product.gender || "Women",
          size,
          color: chosenColor,
          quantity,
          material: product.material || "",
          edition: product.edition || "COLLECTION 2026",
        });
      }

      try {
        localStorage.setItem("atelier_cart", JSON.stringify(state.items));
      } catch (err) {
        console.error("Cart storage error", err);
      }

      state.isCartOpen = true;
      state.toast = {
        title: "Added to Sartorial Bag",
        name: product.name,
        size,
        color: chosenColor,
      };
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.key !== action.payload);
      try {
        localStorage.setItem("atelier_cart", JSON.stringify(state.items));
      } catch (err) {
        console.error("Cart storage error", err);
      }
    },

    updateQuantity: (state, action) => {
      const { key, delta } = action.payload;
      const target = state.items.find((item) => item.key === key);
      if (target) {
        const newQty = target.quantity + delta;
        if (newQty <= 0) {
          state.items = state.items.filter((item) => item.key !== key);
        } else {
          target.quantity = newQty;
        }
      }
      try {
        localStorage.setItem("atelier_cart", JSON.stringify(state.items));
      } catch (err) {
        console.error("Cart storage error", err);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.promo = null;
      state.orderNote = "";
      try {
        localStorage.removeItem("atelier_cart");
      } catch (err) {
        console.error("Cart storage error", err);
      }
    },

    applyPromo: (state, action) => {
      const code = String(action.payload || "").trim().toUpperCase();
      if (code === "ATELIER10") {
        state.promo = {
          code: "ATELIER10",
          discountPercent: 10,
          label: "10% Curated Client Privilege",
        };
      } else if (code === "ELORA2026" || code === "ELORA500") {
        state.promo = {
          code: "ELORA500",
          discountAmount: 500,
          label: "₹500 Atelier Welcome Gift",
        };
      } else if (code === "FREESHIP") {
        state.promo = {
          code: "FREESHIP",
          freeShipping: true,
          label: "Complimentary Global Delivery",
        };
      }
    },

    removePromo: (state) => {
      state.promo = null;
    },

    setOrderNote: (state, action) => {
      state.orderNote = action.payload || "";
    },

    toggleCart: (state, action) => {
      state.isCartOpen = action.payload !== undefined ? action.payload : !state.isCartOpen;
    },

    toggleSearch: (state, action) => {
      state.isSearchOpen = action.payload !== undefined ? action.payload : !state.isSearchOpen;
    },

    setQuickViewProduct: (state, action) => {
      state.quickViewProduct = action.payload;
    },

    openRemovalModal: (state, action) => {
      state.removalModalData = action.payload || {};
    },

    closeRemovalModal: (state) => {
      state.removalModalData = null;
    },

    showToast: (state, action) => {
      state.toast = action.payload;
    },

    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromo,
  removePromo,
  setOrderNote,
  toggleCart,
  toggleSearch,
  setQuickViewProduct,
  openRemovalModal,
  closeRemovalModal,
  showToast,
  clearToast,
} = cartSlice.actions;

export default cartSlice.reducer;
