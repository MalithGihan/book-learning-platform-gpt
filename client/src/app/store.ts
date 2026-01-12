import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import consentReducer from "../features/consent/consentSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    consent: consentReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
