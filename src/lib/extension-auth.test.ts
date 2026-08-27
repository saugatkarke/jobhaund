import { describe, expect, it } from "vitest";
import { pkceS256Challenge } from "./crypto-hash";
import { GrantError, assertCodeUsable, assertPkceMatch } from "./extension-auth";

describe("assertPkceMatch", () => {
  it("accepts a matching verifier", () => {
    const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
    expect(() => assertPkceMatch(verifier, pkceS256Challenge(verifier))).not.toThrow();
  });

  it("rejects a mismatched verifier", () => {
    expect(() => assertPkceMatch("wrong-verifier-value-here", "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM")).toThrow(
      GrantError,
    );
  });
});

describe("assertCodeUsable", () => {
  const redirectUri = "https://abcdefghijklmnopqrstuvwxyzabcdefghijk.chromiumapp.org/";
  const future = new Date("2026-08-24T00:05:00.000Z");
  const now = new Date("2026-08-24T00:00:00.000Z");

  it("rejects a consumed code", () => {
    expect(() =>
      assertCodeUsable(
        { consumedAt: now, expiresAt: future, redirectUri },
        now,
        redirectUri,
      ),
    ).toThrow(GrantError);
  });

  it("rejects a mismatched redirect_uri", () => {
    expect(() =>
      assertCodeUsable(
        { consumedAt: null, expiresAt: future, redirectUri },
        now,
        "https://evil.example/",
      ),
    ).toThrow(GrantError);
  });
});
