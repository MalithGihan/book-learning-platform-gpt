import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {  CONSENT_VERSION, type CookieConsent } from "./types";
import { loadConsent, saveConsent } from "./storage";

type ConsentState = {
  consent: CookieConsent | null;
};

const initialState: ConsentState = {
  consent: typeof window !== "undefined" ? loadConsent() : null,
};

function withMeta(partial: Omit<CookieConsent, "decidedAt" | "version" | "necessary">): CookieConsent {
  return {
    necessary: true,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    ...partial,
  };
}

const consentSlice = createSlice({
  name: "consent",
  initialState,
  reducers: {
    setConsent(state, action: PayloadAction<CookieConsent>) {
      state.consent = action.payload;
      saveConsent(action.payload);
    },
    acceptAll(state) {
      const c = withMeta({ analytics: true, marketing: true });
      state.consent = c;
      saveConsent(c);
    },
    rejectOptional(state) {
      const c = withMeta({ analytics: false, marketing: false });
      state.consent = c;
      saveConsent(c);
    },
    saveCustom(state, action: PayloadAction<{ analytics: boolean; marketing: boolean }>) {
      const c = withMeta(action.payload);
      state.consent = c;
      saveConsent(c);
    },
  },
});

export const { setConsent, acceptAll, rejectOptional, saveCustom } = consentSlice.actions;
export default consentSlice.reducer;
