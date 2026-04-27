import { configureStore } from '@reduxjs/toolkit';
import { orderReducer, persistOrderMiddleware } from '../features/order/orderSlice';
import { designsReducer } from '../features/designs/designsSlice';
import { productsReducer } from '../features/products/productsSlice';

export const store = configureStore({
  reducer: {
    order: orderReducer,
    designs: designsReducer,
    products: productsReducer
  }
});

store.subscribe(() => {
  persistOrderMiddleware(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
