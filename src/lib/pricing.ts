export const MONTHLY_LABEL = "$4.99 / month";
export const YEARLY_LABEL = "$39 / year";
export const PRODUCT_NAME = "JobHaund Pro";
export const MONTHLY_AMOUNT = 4.99;
export const YEARLY_AMOUNT = 39;

export function monthlyPriceId(): string {
  return process.env.PADDLE_PRICE_ID_MONTHLY || "";
}

export function yearlyPriceId(): string {
  return process.env.PADDLE_PRICE_ID_YEARLY || "";
}

export function isProPriceId(priceId: string): boolean {
  const id = String(priceId || "");
  return Boolean(id) && (id === monthlyPriceId() || id === yearlyPriceId());
}

export function formatPrice(amount: number): string {
  if (Number.isInteger(amount)) return `$${amount}`;
  return `$${amount.toFixed(2)}`;
}

export function yearlyDiscountPercent(): number {
  const full = MONTHLY_AMOUNT * 12;
  if (full <= 0) return 0;
  return Math.round((1 - YEARLY_AMOUNT / full) * 100);
}

export function yearlySavingsLabel(): string {
  const full = MONTHLY_AMOUNT * 12;
  const saved = Math.round(full - YEARLY_AMOUNT);
  return `Save $${saved} vs 12× monthly`;
}
