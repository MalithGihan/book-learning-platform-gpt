import {  CONSENT_STORAGE_KEY, CONSENT_VERSION, type CookieConsent } from "./types";

export function loadConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;

    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.necessary !== true) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(consent: CookieConsent) {
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
}
