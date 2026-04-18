/**
 * Server-side in-memory store for verification codes.
 * Module-level Map persists across requests in the same process.
 * In production, replace with Redis or a similar persistent store.
 */

interface CodeEntry {
  code: string;
  expiry: number;   // Unix ms timestamp
  attempts: number; // wrong-attempt counter
}

const store = new Map<string, CodeEntry>();

/** Returns a random 6-digit string (zero-padded). */
export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Stores a code for the given key with a 10-minute expiry. */
export function storeCode(key: string, code: string): void {
  store.set(key, {
    code,
    expiry: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });
}

export type VerifyResult = "ok" | "expired" | "wrong" | "too_many";

/**
 * Checks an input code against the stored entry.
 * Increments attempt counter on wrong guesses.
 * Deletes the entry on success or expiry.
 */
export function verifyCode(key: string, input: string): VerifyResult {
  const entry = store.get(key);
  if (!entry) return "expired";

  if (Date.now() > entry.expiry) {
    store.delete(key);
    return "expired";
  }

  if (entry.attempts >= 3) return "too_many";

  if (entry.code !== input.trim()) {
    entry.attempts++;
    return "wrong";
  }

  store.delete(key);
  return "ok";
}
