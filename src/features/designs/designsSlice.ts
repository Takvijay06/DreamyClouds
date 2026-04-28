import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { buildStickerProductsFromDesigns } from '../../data/designs';
import { Design } from '../order/orderTypes';
import { createDesignInApi, DesignMutationInput, fetchDesignsFromApi, updateDesignInApi } from './designsApi';

type DesignsState = {
  items: Design[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastUpdated: string | null;
  saveStatus: 'idle' | 'saving' | 'succeeded' | 'failed';
  saveError: string | null;
};

const initialState: DesignsState = {
  items: [],
  status: 'idle',
  error: null,
  lastUpdated: null,
  saveStatus: 'idle',
  saveError: null
};

export const fetchDesigns = createAsyncThunk<Design[]>(
  'designs/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDesignsFromApi();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

export const createDesign = createAsyncThunk<Design, DesignMutationInput>(
  'designs/create',
  async (input, { rejectWithValue }) => {
    try {
      return await createDesignInApi(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

export const updateDesign = createAsyncThunk<Design, { id: string; input: DesignMutationInput }>(
  'designs/update',
  async ({ id, input }, { rejectWithValue }) => {
    try {
      return await updateDesignInApi(id, input);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

const designsSlice = createSlice({
  name: 'designs',
  initialState,
  reducers: {
    resetDesignSaveState(state) {
      state.saveStatus = 'idle';
      state.saveError = null;
    }
  },
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
      })
      .addCase(createDesign.pending, (state) => {
        state.saveStatus = 'saving';
        state.saveError = null;
      })
      .addCase(createDesign.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.saveError = null;
        state.items = [action.payload, ...state.items.filter((item) => item.id !== action.payload.id)];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createDesign.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.saveError = typeof action.payload === 'string' ? action.payload : 'Failed to create design';
      })
      .addCase(updateDesign.pending, (state) => {
        state.saveStatus = 'saving';
        state.saveError = null;
      })
      .addCase(updateDesign.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.saveError = null;
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateDesign.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.saveError = typeof action.payload === 'string' ? action.payload : 'Failed to update design';
      });
  }
});

export const designsReducer = designsSlice.reducer;
export const { resetDesignSaveState } = designsSlice.actions;

export const selectDesigns = (state: RootState) => state.designs.items;
export const selectDesignsStatus = (state: RootState) => state.designs.status;
export const selectDesignsError = (state: RootState) => state.designs.error;
export const selectDesignsLastUpdated = (state: RootState) => state.designs.lastUpdated;
export const selectDesignSaveStatus = (state: RootState) => state.designs.saveStatus;
export const selectDesignSaveError = (state: RootState) => state.designs.saveError;
export const selectStickerProducts = (state: RootState) => buildStickerProductsFromDesigns(selectDesigns(state));
