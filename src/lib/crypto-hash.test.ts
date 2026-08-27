import { describe, expect, it, vi } from "vitest";
import {
  isAllowedRedirectUri,
  pkceS256Challenge,
} from "./crypto-hash";

describe("pkceS256Challenge", () => {
  it("matches RFC 7636 test vector for a known verifier", () => {
    const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
    expect(pkceS256Challenge(verifier)).toBe(
      "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
    );
  });
});

describe("isAllowedRedirectUri", () => {
  it("accepts only listed chromiumapp URIs", () => {
    vi.stubEnv(
      "EXTENSION_REDIRECT_URIS",
      "https://abcdefghijklmnopqrstuvwxyzabcdefghijk.chromiumapp.org/",
    );
    expect(
      isAllowedRedirectUri(
        "https://abcdefghijklmnopqrstuvwxyzabcdefghijk.chromiumapp.org/",
      ),
    ).toBe(true);
    expect(
      isAllowedRedirectUri("https://evil.example/callback"),
    ).toBe(false);
  });
});
