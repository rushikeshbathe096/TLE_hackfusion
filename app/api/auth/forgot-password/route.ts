import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import OTP from "../../../../lib/models/OTP";
import User from "../../../../lib/models/User";
import { sendOTPEmail } from "../../../../lib/email";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Save OTP
    await OTP.deleteMany({ email }); // Clear old OTPs
    await OTP.create({ email, code: otp, expiresAt });

    // Send email
    const sent = await sendOTPEmail(email, otp);
    console.log("OTP send result:", sent, "for email:", email);
    if (!sent) {
      console.error("Failed to send OTP to", email);
      return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "OTP sent to email" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
