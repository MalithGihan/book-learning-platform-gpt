import { Resend } from "resend";
import { verificationEmailTemplate } from "../template/verificationEmailTemplate";

export async function sendVerificationEmail(to: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[DEV] verification code:", { to, code });
      return;
    }
    throw new Error("Missing env: RESEND_API_KEY or EMAIL_FROM");
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from,
      to,
      subject: "Verify your email",
      text: `Your verification code is: ${code}`,
      html: verificationEmailTemplate(code),
    });
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[DEV] resend failed, OTP fallback:", {
        to,
        code,
        message: err?.message,
      });
      return;
    }
    throw err;
  }
}
