import { afterEach, describe, expect, it, vi } from "vitest";
import { appTrustedOrigins } from "./auth-origins";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("appTrustedOrigins", () => {
  it("dedupes auth and public app URLs and strips trailing slashes", () => {
    vi.stubEnv("BETTER_AUTH_URL", "https://jobcific.com/");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://jobcific.com");
    expect(appTrustedOrigins()).toEqual(["https://jobcific.com"]);
  });

  it("keeps distinct origins when they differ", () => {
    vi.stubEnv("BETTER_AUTH_URL", "https://jobcific.com");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://www.jobcific.com");
    expect(appTrustedOrigins()).toEqual([
      "https://jobcific.com",
      "https://www.jobcific.com",
    ]);
  });
});
