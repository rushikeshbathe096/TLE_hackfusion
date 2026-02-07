import nodemailer from "nodemailer";
// ⚠️ HACKATHON-ONLY: College network TLS interception workaround
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

console.log("ENV CHECK:", {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? "LOADED" : "MISSING",
});

export async function sendOTPEmail(email: string, otp: string) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials not configured in environment");
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Attempting to send OTP email to:", email);
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Reset OTP - SPIT HF",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Password Reset Request</h2>
          <p>You requested a password reset. Use the OTP below:</p>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="color: #fbbf24; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 12px;">This OTP expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
    console.log("Email sent successfully with message ID:", result.messageId);
    return true;
  } catch (err: any) {
    console.error("Email send failed:", err.message || err);
    return false;
  }
}
