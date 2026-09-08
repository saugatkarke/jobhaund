import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  pixelBasedPreset,
} from "react-email";
import { APP_NAME, DISCLAIMER } from "../src/lib/copy";

export type AuthEmailKind = "verify" | "reset" | "magic-link";

export type AuthEmailProps = {
  kind: AuthEmailKind;
  url: string;
  name?: string;
  logoSrc?: string;
};

const SITE_URL = "https://www.jobcific.com";

const COPY: Record<
  AuthEmailKind,
  {
    subject: string;
    preview: string;
    heading: string;
    action: string;
    footer: string;
  }
> = {
  verify: {
    subject: `Verify your ${APP_NAME} email`,
    preview: `Verify your ${APP_NAME} email`,
    heading: "Verify your email",
    action: "Verify email",
    footer: "If you didn't create this account, you can ignore this email.",
  },
  reset: {
    subject: `Reset your ${APP_NAME} password`,
    preview: `Reset your ${APP_NAME} password`,
    heading: "Reset your password",
    action: "Reset password",
    footer:
      "If you didn't request this, you can ignore this email. Your password will stay the same.",
  },
  "magic-link": {
    subject: `Sign in to ${APP_NAME}`,
    preview: `Sign in to ${APP_NAME}`,
    heading: `Sign in to ${APP_NAME}`,
    action: "Sign in",
    footer: "If you didn't request this, you can ignore this email.",
  },
};

export function authEmailSubject(kind: AuthEmailKind): string {
  return COPY[kind].subject;
}

const DEFAULT_LOGO_SRC = `${SITE_URL}/Jobcific-logo-white-bg.png`;

function greeting(name?: string): string {
  const who = name?.trim();
  return who ? `Hi ${who},` : "Hi,";
}

function bodyText(kind: AuthEmailKind, name?: string): string {
  const hi = greeting(name);
  if (kind === "verify") {
    return `${hi} confirm this address to finish setting up your ${APP_NAME} account.`;
  }
  if (kind === "reset") {
    return `${hi} we received a request to reset the password for this ${APP_NAME} account.`;
  }
  return `${hi} use this link to sign in. It expires soon and can only be used once.`;
}

export function AuthEmail({
  kind,
  url,
  name,
  logoSrc = DEFAULT_LOGO_SRC,
}: AuthEmailProps) {
  const copy = COPY[kind];

  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                ink: "#000000",
                muted: "#5b6470",
                line: "#e4e8ee",
              },
            },
          },
        }}
      >
        <Head />
        <Body className="bg-[#f4f6f8] font-sans text-ink">
          <Preview>{copy.preview}</Preview>
          <Container className="mx-auto my-8 max-w-xl bg-white p-8">
            <Section>
              <Link href={SITE_URL}>
                <Img
                  src={logoSrc}
                  alt={`${APP_NAME} home`}
                  width="140"
                  height="35"
                  className="block h-[35px] w-[140px] object-contain"
                  style={{ objectFit: "contain" }}
                />
              </Link>
            </Section>
            <Hr className="my-6 border-solid border-line" />
            <Heading as="h1" className="m-0 text-[24px] font-bold text-ink">
              {copy.heading}
            </Heading>
            <Text className="mt-4 text-[15px] leading-[24px] text-ink">
              {bodyText(kind, name)}
            </Text>
            <Section className="my-6">
              <Button
                href={url}
                className="box-border rounded-[50px] bg-ink px-5 py-3 text-center text-[14px] font-medium text-white no-underline"
              >
                {copy.action}
              </Button>
            </Section>
            <Text className="text-[13px] leading-[20px] text-muted">
              If the button does not work, copy and paste this link into your
              browser:
            </Text>
            <Text className="text-[13px] leading-[20px] break-all">
              <Link href={url} className="text-ink underline">
                {url}
              </Link>
            </Text>
            <Hr className="my-6 border-solid border-line" />
            <Text className="m-0 text-[13px] leading-[20px] text-muted">
              {copy.footer}
            </Text>
            <Text className="mt-4 text-[12px] leading-[18px] text-muted">
              <Link href={SITE_URL} className="text-muted no-underline">
                {APP_NAME}
              </Link>
              {" · "}
              {DISCLAIMER}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

AuthEmail.PreviewProps = {
  kind: "verify",
  url: "https://www.jobcific.com/verify?token=preview",
  name: "Sam",
  logoSrc: "/static/jobcific-logo.png",
} satisfies AuthEmailProps;
