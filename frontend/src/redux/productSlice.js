import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/apiClient";

const initialState = {
  products: [],
  allAdminProducts: [],
  adminStats: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  },
  product: null,
  loading: false,
  error: null,
};

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = `/api/product/${query ? `?${query}` : ""}`;
    const response = await api.get(url);
    return response.data.products;
  }
);

export const getAdminDashboard = createAsyncThunk(
  "product/getAdminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/product/admin/dashboard");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const approveProduct = createAsyncThunk(
  "product/approveProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/product/approve/${id}`, {});
      return response.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const rejectProduct = createAsyncThunk(
  "product/rejectProduct",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/product/reject/${id}`, { reason });
      return response.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/product/add", productData);
      return response.data.newProduct || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id) => {
    try {
      const response = await api.get(`/api/product/${id}`);
      return response.data?.product || response.data || null;
    } catch {
      return null;
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/product/delete/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/product/update/${product._id || product.id}`,
        product
      );
      return response.data?.updatedProduct || response.data || product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductDirect: (state, action) => {
      state.product = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = false;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        if (action.payload) {
          state.allAdminProducts = action.payload.products || [];
          state.adminStats = action.payload.stats || state.adminStats;
        }
      })
      .addCase(approveProduct.fulfilled, (state, action) => {
        const approved = action.payload;
        if (approved) {
          // Update in allAdminProducts list
          const idx = state.allAdminProducts.findIndex((p) => p._id === approved._id);
          if (idx !== -1) {
            state.allAdminProducts[idx] = approved;
          }
          // Add or update in public approved products
          const pubIdx = state.products.findIndex((p) => p._id === approved._id);
          if (pubIdx !== -1) {
            state.products[pubIdx] = approved;
          } else {
            state.products.unshift(approved);
          }
          // Adjust stats
          if (state.adminStats.pending > 0) state.adminStats.pending -= 1;
          state.adminStats.approved += 1;
        }
      })
      .addCase(rejectProduct.fulfilled, (state, action) => {
        const rejected = action.payload;
        if (rejected) {
          const idx = state.allAdminProducts.findIndex((p) => p._id === rejected._id);
          if (idx !== -1) {
            state.allAdminProducts[idx] = rejected;
          }
          // Remove from public live products if it was there
          state.products = state.products.filter((p) => p._id !== rejected._id);
          if (state.adminStats.pending > 0) state.adminStats.pending -= 1;
          state.adminStats.rejected += 1;
        }
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.allAdminProducts.unshift(action.payload);
          if (action.payload.status === "approved") {
            state.products.unshift(action.payload);
          }
          state.adminStats.total += 1;
          if (action.payload.status === "pending") {
            state.adminStats.pending += 1;
          }
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const id = action.payload;
        state.products = state.products.filter((v) => (v._id || v.id) !== id);
        state.allAdminProducts = state.allAdminProducts.filter((v) => (v._id || v.id) !== id);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload?.updatedProduct || action.payload;
        if (updated && (updated._id || updated.id)) {
          const id = updated._id || updated.id;
          const idx = state.products.findIndex((v) => (v._id || v.id) === id);
          if (idx !== -1) state.products[idx] = updated;
          const adminIdx = state.allAdminProducts.findIndex((v) => (v._id || v.id) === id);
          if (adminIdx !== -1) state.allAdminProducts[adminIdx] = updated;
        }
      });
  },
});

export const { setProductDirect } = productSlice.actions;
export default productSlice.reducer;
