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
  toast: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, size = "M", color, quantity = 1 } = action.payload;
      const chosenColor = color || (product.colors && product.colors[0]?.name) || "Signature";
      const itemKey = `${product._id || product.id}_${size}_${chosenColor}`;

      const existingIndex = state.items.findIndex((item) => item.key === itemKey);
      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          key: itemKey,
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          gender: product.gender,
          size,
          color: chosenColor,
          quantity,
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
      try {
        localStorage.removeItem("atelier_cart");
      } catch (err) {
        console.error("Cart storage error", err);
      }
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
  toggleCart,
  toggleSearch,
  setQuickViewProduct,
  clearToast,
} = cartSlice.actions;

export default cartSlice.reducer;
