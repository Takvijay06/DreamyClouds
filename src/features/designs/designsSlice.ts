import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ApiDesign, buildDesignsFromApi, buildStickerProductsFromDesigns } from '../../data/designs';
import { Design } from '../order/orderTypes';

const DESIGNS_API_URL = 'https://ftyqsddrhhqodlytyyca.supabase.co/rest/v1/designs';
const DESIGNS_API_KEY = 'sb_publishable_11G_1zZ-Uv55Jdw15gdaSQ_8yHltBRH';

type DesignsState = {
  items: Design[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastUpdated: string | null;
};

const initialState: DesignsState = {
  items: [],
  status: 'idle',
  error: null,
  lastUpdated: null
};

export const fetchDesigns = createAsyncThunk<Design[]>(
  'designs/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(DESIGNS_API_URL, {
        headers: {
          apikey: DESIGNS_API_KEY,
          Authorization: `Bearer ${DESIGNS_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const data = (await response.json()) as ApiDesign[];
      return buildDesignsFromApi(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

const designsSlice = createSlice({
  name: 'designs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesigns.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDesigns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDesigns.rejected, (state, action) => {
        state.status = 'failed';
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to load designs';
      });
  }
});

export const designsReducer = designsSlice.reducer;

export const selectDesigns = (state: RootState) => state.designs.items;
export const selectDesignsStatus = (state: RootState) => state.designs.status;
export const selectDesignsError = (state: RootState) => state.designs.error;
export const selectDesignsLastUpdated = (state: RootState) => state.designs.lastUpdated;
export const selectStickerProducts = (state: RootState) => buildStickerProductsFromDesigns(selectDesigns(state));
