// File: src/templates/emails/verificationEmail.ts
export const verificationEmailTemplate = (code: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin:0; padding:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="background:#ffffff; padding:40px 20px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
      
      <div style="background:linear-gradient(135deg, #4CE38F 0%, #3AB574 100%); padding:32px 24px; text-align:center;">
        <div style="display:inline-block;">
          <h1 style="margin:0; font-size:20px; font-weight:700; color:#ffffff; letter-spacing:-0.5px;">
            Book Learning Management System
          </h1>
        </div>
        <p style="margin:12px 0 0; font-size:14px; color:rgba(255,255,255,0.9);">
          Email Verification
        </p>
      </div>

      <div style="padding:40px 32px;">
        <h2 style="margin:0 0 16px; font-size:20px; font-weight:700; color:#111827;">
          Verify Your Email Address
        </h2>
        
        <p style="margin:0 0 24px; font-size:12px; line-height:1.6; color:#4b5563;">
          Thank you for signing up! Please use the verification code below to confirm your email address and complete your registration.
        </p>

        <div style="background:linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding:24px; text-align:center; margin:24px 0;">
          <p style="margin:0 0 12px; font-size:12px; font-weight:600; color:#059669; text-transform:uppercase; letter-spacing:1px;">
            Your Verification Code
          </p>
          <div style="font-size:36px; font-weight:800; color:#16a34a; letter-spacing:8px; font-family:'Courier New',monospace;">
            ${code}
          </div>
        </div>

        <div style="">
          <p style="margin:0 0 8px; font-size:13px; color:#92400e; font-weight:600;">
            Important Information
          </p>
          <p style="margin:0; font-size:13px; line-height:1.5; color:#78350f;">
            This code will expire in <strong>10 minutes</strong>. For security reasons, please don't share this code with anyone.
          </p>
        </div>

        <p style="margin:24px 0 0; font-size:12px; line-height:1.6; color:#6b7280;">
          If you didn't create an account with BookLMS, you can safely ignore this email. No action is required.
        </p>
      </div>

      <div style="background:#f9fafb; padding:24px 32px; border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 12px; font-size:12px; color:#6b7280; text-align:center;">
          Need help? Contact us at <a href="mailto:support@booklms.com" style="color:#4CE38F; text-decoration:none;">support@booklms.com</a>
        </p>
        <p style="margin:0; font-size:11px; color:#9ca3af; text-align:center;">
          © ${new Date().getFullYear()} BookLMS. All rights reserved.
        </p>
      </div>
    </div>

    <p style="margin:24px 0 0; font-size:11px; color:#9ca3af; text-align:center;">
      This email was sent to you because you registered on BookLMS.
    </p>
  </div>
</body>
</html>
`;
