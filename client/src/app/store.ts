import { configureStore } from "@reduxjs/toolkit";
import consentReducer from "../features/consent/consentSlice";

export const store = configureStore({
  reducer: {
    consent: consentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
