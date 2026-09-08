import { AuthEmail, type AuthEmailProps } from "./auth-email";

export default function ResetPasswordEmail({
  url,
  logoSrc,
}: Pick<AuthEmailProps, "url" | "logoSrc">) {
  return <AuthEmail kind="reset" url={url} logoSrc={logoSrc} />;
}

ResetPasswordEmail.PreviewProps = {
  url: "https://www.jobcific.com/reset-password?token=preview",
  logoSrc: "/static/jobcific-logo.png",
} satisfies Pick<AuthEmailProps, "url" | "logoSrc">;
