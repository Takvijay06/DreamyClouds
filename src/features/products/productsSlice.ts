import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Product } from '../order/orderTypes';
import {
  createProductInApi,
  fetchProductsFromApi,
  ProductMutationInput,
  updateProductInApi
} from './productsApi';

type ProductsState = {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastUpdated: string | null;
  saveStatus: 'idle' | 'saving' | 'succeeded' | 'failed';
  saveError: string | null;
};

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  lastUpdated: null,
  saveStatus: 'idle',
  saveError: null
};

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProductsFromApi();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

export const createProduct = createAsyncThunk<Product, ProductMutationInput>(
  'products/create',
  async (input, { rejectWithValue }) => {
    try {
      return await createProductInApi(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk<Product, { id: string; input: ProductMutationInput }>(
  'products/update',
  async ({ id, input }, { rejectWithValue }) => {
    try {
      return await updateProductInApi(id, input);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductSaveState(state) {
      state.saveStatus = 'idle';
      state.saveError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to load products';
      })
      .addCase(createProduct.pending, (state) => {
        state.saveStatus = 'saving';
        state.saveError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.saveError = null;
        state.items = [action.payload, ...state.items.filter((item) => item.id !== action.payload.id)];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.saveError = typeof action.payload === 'string' ? action.payload : 'Failed to create product';
      })
      .addCase(updateProduct.pending, (state) => {
        state.saveStatus = 'saving';
        state.saveError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.saveError = null;
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.saveError = typeof action.payload === 'string' ? action.payload : 'Failed to update product';
      });
  }
});

export const productsReducer = productsSlice.reducer;
export const { resetProductSaveState } = productsSlice.actions;

export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductsLastUpdated = (state: RootState) => state.products.lastUpdated;
export const selectProductSaveStatus = (state: RootState) => state.products.saveStatus;
export const selectProductSaveError = (state: RootState) => state.products.saveError;
