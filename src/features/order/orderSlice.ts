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
  designId: null,
  giftWrap: false,
  personalizedNote: '',
  customerDetails: initialCustomerDetails
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
    setDesign(state, action: PayloadAction<string>) {
      state.designId = action.payload;
    },
    clearDesignSelection(state) {
      state.designId = null;
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
  setDesign,
  clearDesignSelection,
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
