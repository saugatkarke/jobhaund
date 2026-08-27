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

export function yearlySavingsLabel(): string {
  const full = MONTHLY_AMOUNT * 12;
  const saved = Math.round(full - YEARLY_AMOUNT);
  return `Save $${saved} vs 12× monthly`;
}
