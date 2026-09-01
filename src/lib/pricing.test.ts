import { describe, expect, it } from "vitest";
import {
  MONTHLY_AMOUNT,
  YEARLY_AMOUNT,
  formatPrice,
  yearlyDiscountPercent,
} from "./pricing";

describe("pricing display helpers", () => {
  it("formats whole dollars without decimals", () => {
    expect(formatPrice(YEARLY_AMOUNT)).toBe("$39");
  });

  it("keeps cents on monthly", () => {
    expect(formatPrice(MONTHLY_AMOUNT)).toBe("$4.99");
  });

  it("rounds yearly savings to a percent badge", () => {
    expect(yearlyDiscountPercent()).toBe(35);
  });
});
