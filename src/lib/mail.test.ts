import { afterEach, describe, expect, it, vi } from "vitest";
import { assertMailDelivered, sendAuthEmail } from "./mail";

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

afterEach(() => {
  sendMock.mockReset();
  vi.unstubAllEnvs();
});

describe("assertMailDelivered", () => {
  it("throws a generic error when Resend returns an error", () => {
    expect(() =>
      assertMailDelivered({ error: { message: "Invalid API key" } }),
    ).toThrow("Could not send email");
  });

  it("does not throw when Resend reports success", () => {
    expect(() => assertMailDelivered({ error: null })).not.toThrow();
    expect(() => assertMailDelivered({ data: { id: "ok" } })).not.toThrow();
  });
});

describe("sendAuthEmail", () => {
  it("sends a React Email template through Resend", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM", "Jobcific <noreply@jobcific.com>");
    sendMock.mockResolvedValue({ data: { id: "email_1" }, error: null });

    await sendAuthEmail({
      to: "user@example.com",
      kind: "verify",
      url: "https://www.jobcific.com/verify?token=abc",
      name: "Sam",
    });

    expect(sendMock).toHaveBeenCalledTimes(1);
    const payload = sendMock.mock.calls[0][0];
    expect(payload.to).toBe("user@example.com");
    expect(payload.from).toBe("Jobcific <noreply@jobcific.com>");
    expect(payload.subject).toBe("Verify your Jobcific email");
    expect(payload.react).toBeTruthy();
    expect(payload.text).toContain("https://www.jobcific.com/verify?token=abc");
  });
});
