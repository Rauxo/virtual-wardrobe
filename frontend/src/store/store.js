import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import wardrobeReducer from './slices/wardrobeSlice';
import donationReducer from './slices/donationSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wardrobe: wardrobeReducer,
    donation: donationReducer,
    notification: notificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});