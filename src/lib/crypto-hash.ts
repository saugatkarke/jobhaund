import { createHash, randomBytes } from "node:crypto";

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function newSecret(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function allowedRedirectUris(): string[] {
  return String(process.env.EXTENSION_REDIRECT_URIS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isAllowedRedirectUri(uri: string): boolean {
  return allowedRedirectUris().includes(uri);
}

export function pkceS256Challenge(verifier: string): string {
  const digest = createHash("sha256").update(verifier).digest();
  return digest.toString("base64url");
}
