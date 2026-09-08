import { AuthEmail, type AuthEmailProps } from "./auth-email";

export default function VerifyEmail({
  url,
  name,
  logoSrc,
}: Pick<AuthEmailProps, "url" | "name" | "logoSrc">) {
  return <AuthEmail kind="verify" url={url} name={name} logoSrc={logoSrc} />;
}

VerifyEmail.PreviewProps = {
  url: "https://www.jobcific.com/verify?token=preview",
  name: "Sam",
  logoSrc: "/static/jobcific-logo.png",
} satisfies Pick<AuthEmailProps, "url" | "name" | "logoSrc">;
