import { configureStore } from "@reduxjs/toolkit";
import consentReducer from "../features/consent/consentSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    consent: consentReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
