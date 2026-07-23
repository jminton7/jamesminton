import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

/**
 * Cloudflare Web Bot Auth key directory.
 *
 * Serves a JWKS containing the Ed25519 public key that InStock signs its
 * outgoing requests with, and signs the response itself so that no one else
 * can copy the JWKS onto their own domain and claim ownership of the key.
 *
 * Spec: https://datatracker.ietf.org/doc/html/draft-meunier-http-message-signatures-directory-03
 * Cloudflare setup: https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/
 */

// Cloudflare hits this path on every verification cycle — we sign the response
// per request because the signature covers the requester's ``@authority``.
export const dynamic = 'force-dynamic';
// node:crypto Ed25519 support requires the Node.js runtime, not the Edge
// runtime.
export const runtime = 'nodejs';

const SIGNATURE_LABEL = 'sig1';
const SIGNATURE_TAG = 'http-message-signatures-directory';
const ALGORITHM = 'ed25519';
// Response signature lifetime. One hour is generous — Cloudflare fetches this
// endpoint infrequently and caches the result.
const EXPIRES_SECONDS = 60 * 60;

type Jwk = { readonly crv: 'Ed25519'; readonly kty: 'OKP'; readonly x: string };

type LoadedKey = {
  readonly privateKey: crypto.KeyObject;
  readonly jwk: Jwk;
  readonly keyid: string;
};

let cachedKey: LoadedKey | null = null;

/**
 * Loads the Ed25519 signing key from the ``WEB_BOT_AUTH_PRIVATE_KEY_B64``
 * environment variable. The env var value is the base64-encoded contents of
 * the private-key.pem file (produced by ``openssl genpkey -algorithm ed25519``).
 *
 * The key, its public-half JWK, and the JWK thumbprint (``keyid``) are cached
 * for the lifetime of the serverless function instance.
 */
function loadKey(): LoadedKey {
  if (cachedKey) return cachedKey;

  const b64 = process.env.WEB_BOT_AUTH_PRIVATE_KEY_B64;
  if (!b64) {
    throw new Error('WEB_BOT_AUTH_PRIVATE_KEY_B64 environment variable is not set');
  }

  const pem = Buffer.from(b64, 'base64').toString('utf-8');
  const privateKey = crypto.createPrivateKey({ key: pem, format: 'pem' });
  const publicKey = crypto.createPublicKey(privateKey);

  // Ed25519 SubjectPublicKeyInfo DER is a fixed 12-byte prefix followed by
  // the 32-byte raw public key. Slice off the trailing 32 bytes to get the
  // JWK ``x`` value.
  const spkiDer = publicKey.export({ format: 'der', type: 'spki' });
  const rawPub = spkiDer.subarray(spkiDer.length - 32);
  const x = rawPub.toString('base64url');
  const jwk: Jwk = { crv: 'Ed25519', kty: 'OKP', x };

  cachedKey = { privateKey, jwk, keyid: jwkThumbprint(jwk) };
  return cachedKey;
}

/**
 * RFC 7638 / RFC 8037 JWK thumbprint for an Ed25519 public key.
 *
 * The canonical form is the JWK as a JSON object with keys sorted
 * lexicographically (``crv`` < ``kty`` < ``x``), no whitespace, UTF-8 encoded,
 * then SHA-256 hashed and base64url encoded without padding.
 */
function jwkThumbprint(jwk: Jwk): string {
  // Explicit string construction avoids relying on JS engine key-insertion
  // order to match RFC 7638's lexicographic ordering.
  const canonical = `{"crv":"${jwk.crv}","kty":"${jwk.kty}","x":"${jwk.x}"}`;
  return crypto.createHash('sha256').update(canonical, 'utf8').digest('base64url');
}

/**
 * Extracts the HTTP ``@authority`` derived component from the request. This
 * is the request's ``Host`` header value verbatim (Cloudflare compares
 * against the Host header, and Vercel populates it exactly as the client
 * sent it).
 */
function getAuthority(req: NextRequest): string {
  return req.headers.get('host') ?? '';
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const authority = getAuthority(req);
  if (!authority) {
    return new NextResponse('Missing Host header', { status: 400 });
  }

  const { privateKey, jwk, keyid } = loadKey();

  const created = Math.floor(Date.now() / 1000);
  const expires = created + EXPIRES_SECONDS;
  // Cloudflare does not currently validate nonces but the spec requires a
  // fresh one per response; 32 bytes of CSPRNG output is plenty.
  const nonce = crypto.randomBytes(32).toString('base64');

  // Signature-Input parameter string per RFC 9421 and CF's directory rules.
  // ``@authority`` carries the ``;req`` component parameter because the
  // signed value is the *request's* authority, not the response's.
  const signatureParams =
    `("@authority";req)` +
    `;created=${created}` +
    `;keyid="${keyid}"` +
    `;alg="${ALGORITHM}"` +
    `;expires=${expires}` +
    `;nonce="${nonce}"` +
    `;tag="${SIGNATURE_TAG}"`;

  // Signature base per RFC 9421 §2.5: one line per covered component (with
  // ``;req`` retained in the identifier), then the signature-params line,
  // joined by \n with no trailing newline.
  const signatureBase =
    `"@authority";req: ${authority}\n` +
    `"@signature-params": ${signatureParams}`;

  const rawSignature = crypto.sign(null, Buffer.from(signatureBase, 'utf-8'), privateKey);
  const signatureB64 = rawSignature.toString('base64');

  // Response body: standard JWKS. Ordering keys for readability; CF only
  // requires the ``kty``, ``crv``, and ``x`` fields to be present.
  const body = JSON.stringify({
    keys: [{ crv: jwk.crv, kty: jwk.kty, x: jwk.x }],
  });

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/http-message-signatures-directory+json',
      'Cache-Control': 'max-age=86400',
      'Signature-Input': `${SIGNATURE_LABEL}=${signatureParams}`,
      Signature: `${SIGNATURE_LABEL}=:${signatureB64}:`,
    },
  });
}
