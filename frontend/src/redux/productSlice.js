import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { INITIAL_FASHION_PRODUCTS } from "../data/fashionProducts";

const initialState = {
  products: INITIAL_FASHION_PRODUCTS,
  product: null,
  loading: false,
  error: null,
};

export const getProduct = createAsyncThunk("product/getProduct", async () => {
  const response = await axios.get("http://localhost:3000/product/");
  return response.data.products;
});

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (product) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/product/add",
        product,
      );
      return response.data.newProduct || response.data;
    } catch {
      // Fallback local creation if server is offline
      return {
        ...product,
        _id: "local_" + Date.now(),
      };
    }
  },
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/product/${id}`);
      return response.data?.product || response.data || null;
    } catch {
      return null;
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "/product/deleteProduct",
  async (id) => {
    try {
      await axios.delete(`http://localhost:3000/product/delete/${id}`);
    } catch {
      // Fallback local deletion
    }
    return id;
  },
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (product) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/product/update/${product._id}`,
        product,
      );
      return response.data?.updatedProduct || response.data || product;
    } catch {
      return product;
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductDirect: (state, action) => {
      state.product = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = false; // keep responsive
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.products = action.payload;
        }
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.products.unshift(action.payload);
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (v) => (v._id || v.id) != action.payload,
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.updatedProduct || action.payload;
        if (updated && (updated._id || updated.id)) {
          const index = state.products.findIndex(
            (v) => (v._id || v.id) === (updated._id || updated.id),
          );
          if (index !== -1) {
            state.products[index] = updated;
          }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setProductDirect } = productSlice.actions;
export default productSlice.reducer;
