import { Resend } from "resend";

export async function sendAuthEmail(options: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM || "JobHaund <noreply@localhost>";
  if (!key) {
    console.info("[mail:dev]", options.to, options.subject, options.text);
    return;
  }
  const resend = new Resend(key);
  await resend.emails.send({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
}
