export const LEGAL_PAGES = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refunds", label: "Refund Policy" },
] as const;

export const SELLER_LEGAL_NAME = "Saugat Karki";
export const SELLER_ABN = "59 615 422 149";
export const SUPPORT_EMAIL = "riosaugat@gmail.com";
export const SUPPORT_PHONE = "+61 405 458 465";
export const SUPPORT_PHONE_TEL = "+61405458465";
export const LEGAL_LAST_UPDATED = "8 September 2026";
export const SITE_URL = "https://www.jobcific.com";
export const PADDLE_BUYER_PORTAL = "https://paddle.net";
export const PADDLE_HELP_EMAIL = "help@paddle.com";
export const REFUND_FIRST_PAYMENT_DAYS = 30;

export const PADDLE_MOR_STATEMENT =
  "Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.";

export function sellerIdentity(): string {
  return `${SELLER_LEGAL_NAME} (ABN ${SELLER_ABN}), trading as Jobcific`;
}

export function canStartSubscribe(agreedToLegal: boolean): boolean {
  return agreedToLegal;
}
