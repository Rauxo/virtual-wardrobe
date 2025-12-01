import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import wardrobeReducer from './slices/wardrobeSlice';
import donationReducer from './slices/donationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wardrobe: wardrobeReducer,
    donation: donationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});