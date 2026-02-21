import { configureStore } from '@reduxjs/toolkit';
import { orderReducer, persistOrderMiddleware } from '../features/order/orderSlice';

export const store = configureStore({
  reducer: {
    order: orderReducer
  }
});

store.subscribe(() => {
  persistOrderMiddleware(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
