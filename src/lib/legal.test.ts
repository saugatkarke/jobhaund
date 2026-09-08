import { describe, expect, it } from "vitest";
import {
  LEGAL_PAGES,
  PADDLE_MOR_STATEMENT,
  REFUND_FIRST_PAYMENT_DAYS,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  canStartSubscribe,
  sellerIdentity,
} from "./legal";

describe("Paddle seller identity", () => {
  it("names the sole trader, ABN, and Jobcific brand", () => {
    expect(sellerIdentity()).toBe(
      "Saugat Karki (ABN 59 615 422 149), trading as Jobcific",
    );
  });

  it("lists buyer support email and phone", () => {
    expect(SUPPORT_EMAIL).toBe("riosaugat@gmail.com");
    expect(SUPPORT_PHONE).toBe("+61 405 458 465");
  });
});

describe("Paddle policy pages", () => {
  it("exposes separate privacy, terms, and refund URLs", () => {
    expect(LEGAL_PAGES).toEqual([
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/refunds", label: "Refund Policy" },
    ]);
  });

  it("includes Paddle's required Merchant of Record sentence", () => {
    expect(PADDLE_MOR_STATEMENT).toBe(
      "Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.",
    );
  });

  it("offers a 30-day refund on the first payment", () => {
    expect(REFUND_FIRST_PAYMENT_DAYS).toBe(30);
  });
});

describe("checkout legal acceptance", () => {
  it("blocks subscribe until the buyer agrees", () => {
    expect(canStartSubscribe(false)).toBe(false);
    expect(canStartSubscribe(true)).toBe(true);
  });
});
