import { afterEach, describe, expect, it, vi } from "vitest";
import { appTrustedOrigins } from "./auth-origins";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("appTrustedOrigins", () => {
  it("dedupes auth and public app URLs and strips trailing slashes", () => {
    vi.stubEnv("BETTER_AUTH_URL", "https://jobhaund.com/");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://jobhaund.com");
    expect(appTrustedOrigins()).toEqual(["https://jobhaund.com"]);
  });

  it("keeps distinct origins when they differ", () => {
    vi.stubEnv("BETTER_AUTH_URL", "https://jobhaund.com");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://www.jobhaund.com");
    expect(appTrustedOrigins()).toEqual([
      "https://jobhaund.com",
      "https://www.jobhaund.com",
    ]);
  });
});
