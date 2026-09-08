import Link from "next/link";
import { LegalPage, legalMetadata } from "@/components/LegalPage";
import { APP_NAME, DISCLAIMER } from "@/lib/copy";
import {
  PADDLE_BUYER_PORTAL,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL,
  sellerIdentity,
} from "@/lib/legal";

export const metadata = legalMetadata(
  "Privacy Policy",
  `How ${APP_NAME} collects, uses, and stores account and billing data.`,
);

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This policy explains how {sellerIdentity()} (“we”, “us”) handles
        personal information when you use {APP_NAME} at{" "}
        <Link href="/">jobcific.com</Link>, create an account, subscribe to Pro,
        or connect the Chrome extension. {DISCLAIMER}
      </p>

      <h2>1. Who we are</h2>
      <p>
        {APP_NAME} is a job-tracking product for Indeed and Seek. The website
        provides accounts and Pro billing. The Chrome extension tracks jobs
        locally in your browser. For privacy questions, email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or call{" "}
        <a href={`tel:${SUPPORT_PHONE_TEL}`}>{SUPPORT_PHONE}</a>.
      </p>

      <h2>2. Information we collect</h2>
      <p>When you use the website, we may collect:</p>
      <ul>
        <li>
          Account details: name, email address, password hash, and email
          verification status.
        </li>
        <li>
          Session data: login cookies, IP address, and browser user agent used
          to keep you signed in and protect the account.
        </li>
        <li>
          Billing identifiers: Paddle customer ID, subscription ID, price ID,
          plan, status, and current period end. We use these to know whether
          your account is Free or Pro.
        </li>
        <li>
          Extension connection data: short-lived authorization codes and
          tokens so the extension can read your Pro vs Free status. These are
          not used to read your jobs.
        </li>
      </ul>

      <h2>3. Information we do not collect</h2>
      <ul>
        <li>We do not store card numbers, CVV, or bank details.</li>
        <li>
          Job descriptions, tracked jobs, Kanban boards, resumes, and ATS API
          keys stay in the browser extension. We do not receive them on this
          website.
        </li>
        <li>
          We do not run advertising analytics, marketing pixels, or sell
          personal information.
        </li>
      </ul>

      <h2>4. How we use information</h2>
      <p>We use personal information to:</p>
      <ul>
        <li>Create and secure your account, including email verification and password reset.</li>
        <li>Send transactional email (verification, magic link, and password reset).</li>
        <li>Process Pro subscriptions through Paddle and keep entitlement in sync.</li>
        <li>Let the connected Chrome extension read whether you have Pro.</li>
        <li>Respond to support requests and meet legal obligations.</li>
      </ul>
      <p>
        We rely on performing our contract with you, our legitimate interests in
        running and securing the service, and (where required) your consent.
      </p>

      <h2>5. Payments and Paddle</h2>
      <p>
        Paid orders are processed by Paddle, the merchant of record. Paddle
        collects payment details, tax information, and billing address as needed
        to complete checkout. Paddle’s privacy policy applies to that processing.
        You can manage receipts and some billing requests at{" "}
        <a href={PADDLE_BUYER_PORTAL} rel="noopener noreferrer">
          paddle.net
        </a>
        .
      </p>

      <h2>6. Email</h2>
      <p>
        We send transactional email through Resend. We do not send marketing
        newsletters unless you later opt in. Magic-link and reset emails contain
        a sign-in or reset URL. Do not forward those emails.
      </p>

      <h2>7. Chrome extension</h2>
      <p>
        The extension stores job data and resumes on your device. It sends a
        session token to this website only to read whether your plan is Pro or
        Free. Uninstalling the extension does not delete your website account.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use essential cookies and similar storage to keep you signed in and
        to remember short-lived UI state (for example, a pricing animation). We
        do not use non-essential tracking cookies.
      </p>

      <h2>9. Sharing</h2>
      <p>We share personal information only with:</p>
      <ul>
        <li>Paddle, for checkout, tax, invoices, and refunds.</li>
        <li>Resend, to deliver account email.</li>
        <li>
          Hosting and database providers who process data on our instructions to
          run the website.
        </li>
        <li>Professional advisers or authorities if the law requires it.</li>
      </ul>
      <p>We do not sell personal information.</p>

      <h2>10. International transfers</h2>
      <p>
        {APP_NAME} is operated from Australia. Paddle, email, hosting, and
        database providers may process data in other countries, including the
        United Kingdom, European Economic Area, and United States. Those
        providers are engaged to provide the service described in this policy.
      </p>

      <h2>11. Retention</h2>
      <p>
        We keep account and subscription records while your account is open and
        for a reasonable period afterwards so we can handle billing, refunds,
        disputes, and legal requirements. You can ask us to delete your account
        data. We may retain limited records where we must, for example tax or
        dispute records held by Paddle.
      </p>

      <h2>12. Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct,
        delete, or receive a copy of your personal information, to object to or
        restrict certain processing, and to complain to a regulator. Email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we will
        respond within 30 days where we can. Australian users can also contact
        the Office of the Australian Information Commissioner. EEA and UK users
        can contact their local data protection authority. Paddle can also
        handle requests about payment data it holds.
      </p>

      <h2>13. Security</h2>
      <p>
        We use HTTPS, hashed passwords, and access controls on account and
        billing data. No method of transmission or storage is completely secure.
      </p>

      <h2>14. Children</h2>
      <p>
        {APP_NAME} is not directed at children under 16. We do not knowingly
        collect personal information from children.
      </p>

      <h2>15. Changes</h2>
      <p>
        We may update this policy when the product or the law changes. The “Last
        updated” date at the top will change. Continued use after an update means
        you accept the revised policy.
      </p>

      <h2>16. Contact</h2>
      <p>
        {sellerIdentity()}
        <br />
        Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        <br />
        Phone: <a href={`tel:${SUPPORT_PHONE_TEL}`}>{SUPPORT_PHONE}</a>
      </p>
    </LegalPage>
  );
}
