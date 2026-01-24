import geoip from "geoip-lite";

export type IpLocation = {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  ll?: [number, number];
} | null;

export function normalizeIp(ip?: string) {
  if (!ip) return "";
  return ip.replace("::ffff:", "");
}

export function lookupIpLocation(ip?: string): IpLocation {
  const norm = normalizeIp(ip);
  if (!norm || norm === "127.0.0.1" || norm === "::1") return null;

  const hit = geoip.lookup(norm);
  if (!hit) return null;

  return {
    country: hit.country,
    region: hit.region,
    city: hit.city,
    timezone: hit.timezone,
    ll: hit.ll as [number, number] | undefined,
  };
}
