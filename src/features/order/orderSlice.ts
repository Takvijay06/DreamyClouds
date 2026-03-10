import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { normalizeCouponCode } from './couponRules';
import { CustomerDetails, OrderState } from './orderTypes';

export const STORAGE_KEY = 'dreamyclouds-order';

const initialCustomerDetails: CustomerDetails = {
  fullName: '',
  address: '',
  contactNumber: '',
  alternateNumber: '',
  email: ''
};

const defaultState: OrderState = {
  productId: null,
  selectedColor: '',
  candleScented: false,
  candleNote: '',
  couponCode: '',
  quantity: 1,
  cartItems: [],
  designId: null,
  placementStyle: '',
  letDaisyDecide: false,
  customDesignImageName: '',
  designCustomerName: '',
  giftWrap: false,
  personalizedNote: '',
  customerDetails: initialCustomerDetails
};

const resetSelectionAndPricingState = (state: OrderState) => {
  state.productId = null;
  state.selectedColor = '';
  state.candleScented = false;
  state.candleNote = '';
  state.quantity = 1;
  state.designId = null;
  state.placementStyle = '';
  state.letDaisyDecide = false;
  state.customDesignImageName = '';
  state.designCustomerName = '';
  state.giftWrap = false;
  state.personalizedNote = '';
  state.couponCode = '';
};

const hydrateState = (): OrderState => {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OrderState>;
    return {
      ...defaultState,
      ...parsed,
      customerDetails: {
        ...initialCustomerDetails,
        ...(parsed.customerDetails ?? {})
      }
    };
  } catch {
    return defaultState;
  }
};

const orderSlice = createSlice({
  name: 'order',
  initialState: hydrateState(),
  reducers: {
    setProduct(state, action: PayloadAction<string>) {
      state.productId = action.payload;
      state.designId = null;
      state.selectedColor = '';
      state.candleScented = false;
      state.candleNote = '';
      state.placementStyle = '';
      state.letDaisyDecide = false;
      state.customDesignImageName = '';
      state.designCustomerName = '';
    },
    setSelectedColor(state, action: PayloadAction<string>) {
      state.selectedColor = action.payload;
    },
    setCandleScented(state, action: PayloadAction<boolean>) {
      state.candleScented = action.payload;
    },
    setCandleNote(state, action: PayloadAction<string>) {
      state.candleNote = action.payload;
    },
    setCouponCode(state, action: PayloadAction<string>) {
      state.couponCode = normalizeCouponCode(action.payload);
    },
    clearCouponCode(state) {
      state.couponCode = '';
    },
    setQuantity(state, action: PayloadAction<number>) {
      state.quantity = Math.max(1, action.payload);
    },
    addToCart(
      state,
      action: PayloadAction<{
        productId: string;
        quantity: number;
        selectedColor: string;
        candleScented?: boolean;
        candleNote?: string;
        selectedStickerId?: string | null;
        personalizedNote?: string;
        replaceExisting?: boolean;
      }>
    ) {
      const {
        productId,
        quantity,
        selectedColor,
        candleScented = false,
        candleNote = '',
        selectedStickerId = null,
        personalizedNote = '',
        replaceExisting = false
      } = action.payload;
      const normalizedPersonalizedNote = personalizedNote.trim();
      const normalizedCandleNote = candleNote.trim();
      const normalizedQty = Math.max(1, quantity);
      const existingByProductDesign = state.cartItems.find(
        (item) =>
          item.productId === productId &&
          item.selectedColor === selectedColor &&
          (item.selectedStickerId ?? null) === selectedStickerId &&
          !!item.candleScented === candleScented &&
          (item.candleNote ?? '') === normalizedCandleNote
      );
      if (replaceExisting && existingByProductDesign) {
        existingByProductDesign.quantity = normalizedQty;
        existingByProductDesign.personalizedNote = normalizedPersonalizedNote;
        existingByProductDesign.candleScented = candleScented;
        existingByProductDesign.candleNote = normalizedCandleNote;
        return;
      }
      const existing = state.cartItems.find(
        (item) =>
          item.productId === productId &&
          item.selectedColor === selectedColor &&
          (item.selectedStickerId ?? null) === selectedStickerId &&
          (item.personalizedNote ?? '') === normalizedPersonalizedNote &&
          !!item.candleScented === candleScented &&
          (item.candleNote ?? '') === normalizedCandleNote
      );
      if (existing) {
        existing.quantity += normalizedQty;
        return;
      }

      state.cartItems.push({
        id: `${productId}-${selectedColor}-${selectedStickerId ?? 'no-sticker'}-${normalizedPersonalizedNote || 'no-note'}-${
          candleScented ? 'scented' : 'unscented'
        }-${normalizedCandleNote || 'no-candle-note'}-${Date.now()}`,
        productId,
        quantity: normalizedQty,
        selectedColor,
        candleScented,
        candleNote: normalizedCandleNote,
        selectedStickerId,
        personalizedNote: normalizedPersonalizedNote
      });
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      if (state.cartItems.length === 0) {
        resetSelectionAndPricingState(state);
      }
    },
    updateCartItemQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.cartItems.find((entry) => entry.id === action.payload.id);
      if (!item) {
        return;
      }
      item.quantity = Math.max(1, action.payload.quantity);
    },
    clearCart(state) {
      state.cartItems = [];
      resetSelectionAndPricingState(state);
    },
    setDesign(state, action: PayloadAction<string>) {
      state.designId = action.payload;
    },
    clearDesignSelection(state) {
      state.designId = null;
    },
    setPlacementStyle(state, action: PayloadAction<'' | 'full-wrap' | 'random-placement'>) {
      state.placementStyle = action.payload;
    },
    setLetDaisyDecide(state, action: PayloadAction<boolean>) {
      state.letDaisyDecide = action.payload;
      if (action.payload) {
        state.placementStyle = '';
      }
    },
    setCustomDesignImageName(state, action: PayloadAction<string>) {
      state.customDesignImageName = action.payload;
    },
    setDesignCustomerName(state, action: PayloadAction<string>) {
      state.designCustomerName = action.payload;
    },
    setGiftWrap(state, action: PayloadAction<boolean>) {
      state.giftWrap = action.payload;
    },
    setPersonalizedNote(state, action: PayloadAction<string>) {
      state.personalizedNote = action.payload;
    },
    resetCurrentSelection(state) {
      state.productId = null;
      state.selectedColor = '';
      state.candleScented = false;
      state.candleNote = '';
      state.quantity = 1;
      state.designId = null;
      state.placementStyle = '';
      state.letDaisyDecide = false;
      state.customDesignImageName = '';
      state.designCustomerName = '';
      state.personalizedNote = '';
    },
    setCustomerDetails(state, action: PayloadAction<CustomerDetails>) {
      state.customerDetails = action.payload;
    },
    clearOrder() {
      return defaultState;
    }
  }
});

export const {
  setProduct,
  setSelectedColor,
  setCandleScented,
  setCandleNote,
  setCouponCode,
  clearCouponCode,
  setQuantity,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setDesign,
  clearDesignSelection,
  setPlacementStyle,
  setLetDaisyDecide,
  setCustomDesignImageName,
  setDesignCustomerName,
  setGiftWrap,
  setPersonalizedNote,
  resetCurrentSelection,
  setCustomerDetails,
  clearOrder
} = orderSlice.actions;

export const orderReducer = orderSlice.reducer;

export const persistOrderMiddleware = (state: RootState): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.order));
};

export const clearPersistedOrder = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};
