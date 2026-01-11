export type CookieConsent = {
  necessary: true;    
  analytics: boolean;  
  marketing: boolean; 
  decidedAt: string;   
  version: number;    
};

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "cookie_consent_v1";
