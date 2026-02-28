import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { normalizeCouponCode } from './couponRules';
import { CustomerDetails, OrderState } from './orderTypes';

const STORAGE_KEY = 'dreamyclouds-order';

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
  couponCode: '',
  quantity: 1,
  cartItems: [],
  designId: null,
  stickerFromGallery: '',
  placementPreference: 'design-yourself',
  customDesignImageName: '',
  designCustomerName: '',
  giftWrap: false,
  personalizedNote: '',
  customerDetails: initialCustomerDetails
};

const resetSelectionAndPricingState = (state: OrderState) => {
  state.productId = null;
  state.selectedColor = '';
  state.quantity = 1;
  state.designId = null;
  state.stickerFromGallery = '';
  state.placementPreference = 'design-yourself';
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
      state.stickerFromGallery = '';
      state.placementPreference = 'design-yourself';
      state.customDesignImageName = '';
      state.designCustomerName = '';
    },
    setSelectedColor(state, action: PayloadAction<string>) {
      state.selectedColor = action.payload;
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
    addToCart(state, action: PayloadAction<{ productId: string; quantity: number; selectedColor: string }>) {
      const { productId, quantity, selectedColor } = action.payload;
      const normalizedQty = Math.max(1, quantity);
      const existing = state.cartItems.find((item) => item.productId === productId && item.selectedColor === selectedColor);
      if (existing) {
        existing.quantity += normalizedQty;
        return;
      }

      state.cartItems.push({
        id: `${productId}-${selectedColor}-${Date.now()}`,
        productId,
        quantity: normalizedQty,
        selectedColor
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
    setStickerFromGallery(state, action: PayloadAction<'' | 'yes' | 'no'>) {
      state.stickerFromGallery = action.payload;
      if (action.payload === 'yes') {
        state.placementPreference = 'design-yourself';
        state.customDesignImageName = '';
      }
      if (action.payload === 'no') {
        state.designId = null;
      }
    },
    setPlacementPreference(state, action: PayloadAction<'design-yourself' | 'decide-by-daisy'>) {
      state.placementPreference = action.payload;
      if (action.payload !== 'design-yourself') {
        state.customDesignImageName = '';
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
  setCouponCode,
  clearCouponCode,
  setQuantity,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setDesign,
  clearDesignSelection,
  setStickerFromGallery,
  setPlacementPreference,
  setCustomDesignImageName,
  setDesignCustomerName,
  setGiftWrap,
  setPersonalizedNote,
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
