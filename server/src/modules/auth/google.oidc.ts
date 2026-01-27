import { Issuer, generators } from "openid-client";
import type { Client } from "openid-client";

let cachedClient: Client | null = null;

export async function getGoogleClient(): Promise<Client> {
  if (cachedClient) return cachedClient;

  const issuer = await Issuer.discover(
    "https://accounts.google.com/.well-known/openid-configuration"
  );

  cachedClient = new issuer.Client({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uris: [process.env.GOOGLE_REDIRECT_URI!],
    response_types: ["code"],
  });

  return cachedClient;
}

export function genOidcParams() {
  const state = generators.state();
  const nonce = generators.nonce();

  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  return { state, nonce, codeVerifier, codeChallenge };
}
