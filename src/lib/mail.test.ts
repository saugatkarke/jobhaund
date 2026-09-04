import { describe, expect, it } from "vitest";
import { assertMailDelivered } from "./mail";

describe("assertMailDelivered", () => {
  it("throws a generic error when Resend returns an error", () => {
    expect(() =>
      assertMailDelivered({ error: { message: "Invalid API key" } }),
    ).toThrow("Could not send email");
  });

  it("does not throw when Resend reports success", () => {
    expect(() => assertMailDelivered({ error: null })).not.toThrow();
    expect(() => assertMailDelivered({ data: { id: "ok" } })).not.toThrow();
  });
});
