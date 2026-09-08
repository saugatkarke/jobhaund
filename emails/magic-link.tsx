import { AuthEmail, type AuthEmailProps } from "./auth-email";

export default function MagicLinkEmail({
  url,
  logoSrc,
}: Pick<AuthEmailProps, "url" | "logoSrc">) {
  return <AuthEmail kind="magic-link" url={url} logoSrc={logoSrc} />;
}

MagicLinkEmail.PreviewProps = {
  url: "https://www.jobcific.com/login?token=preview",
  logoSrc: "/static/jobcific-logo.png",
} satisfies Pick<AuthEmailProps, "url" | "logoSrc">;
