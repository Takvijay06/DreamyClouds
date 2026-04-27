import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ApiProduct, buildProductsFromApi } from '../../data/products';
import { Product } from '../order/orderTypes';

const PRODUCTS_API_URL = 'https://ftyqsddrhhqodlytyyca.supabase.co/rest/v1/products';
const PRODUCTS_API_KEY = 'sb_publishable_11G_1zZ-Uv55Jdw15gdaSQ_8yHltBRH';

type ProductsState = {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastUpdated: string | null;
};

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  lastUpdated: null
};

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(PRODUCTS_API_URL, {
        headers: {
          apikey: PRODUCTS_API_KEY,
          Authorization: `Bearer ${PRODUCTS_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const data = (await response.json()) as ApiProduct[];
      return buildProductsFromApi(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
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
      });
  }
});

export const productsReducer = productsSlice.reducer;

export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductsLastUpdated = (state: RootState) => state.products.lastUpdated;
