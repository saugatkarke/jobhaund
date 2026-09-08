import { render } from "react-email";
import { describe, expect, it } from "vitest";
import { AuthEmail } from "../../emails/auth-email";

describe("AuthEmail", () => {
  it("renders a verify email with the action url", async () => {
    const html = await render(
      AuthEmail({
        kind: "verify",
        url: "https://www.jobcific.com/verify?token=abc",
        name: "Sam",
      }),
    );

    expect(html).toContain("Verify your email");
    expect(html).toContain("Verify email");
    expect(html).toContain("https://www.jobcific.com/verify?token=abc");
    expect(html).toContain("Sam");
    expect(html).toMatch(/object-fit:\s*contain/);
  });

  it("renders a reset email with the action url", async () => {
    const html = await render(
      AuthEmail({
        kind: "reset",
        url: "https://www.jobcific.com/reset-password?token=xyz",
      }),
    );

    expect(html).toContain("Reset your password");
    expect(html).toContain("Reset password");
    expect(html).toContain("https://www.jobcific.com/reset-password?token=xyz");
  });

  it("renders a magic-link email with the action url", async () => {
    const html = await render(
      AuthEmail({
        kind: "magic-link",
        url: "https://www.jobcific.com/login?token=link",
      }),
    );

    expect(html).toContain("Sign in to Jobcific");
    expect(html).toContain("Sign in");
    expect(html).toContain("https://www.jobcific.com/login?token=link");
  });
});
