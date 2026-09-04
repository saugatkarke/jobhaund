import { describe, expect, it } from "vitest";
import { checkoutSuccessUrl } from "./paddle-checkout";

describe("checkoutSuccessUrl", () => {
  it("sends paid users to the account success page", () => {
    expect(checkoutSuccessUrl("https://jobhaund.com")).toBe(
      "https://jobhaund.com/account?checkout=success",
    );
  });

  it("strips a trailing slash from the origin", () => {
    expect(checkoutSuccessUrl("https://jobhaund.com/")).toBe(
      "https://jobhaund.com/account?checkout=success",
    );
  });
});
