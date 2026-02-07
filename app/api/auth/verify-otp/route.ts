import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import OTP from "../../../../lib/models/OTP";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
    }

    await connectDB();
    const record = await OTP.findOne({ email, code: otp });
    
    if (!record) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: "OTP expired" }, { status: 401 });
    }

    // OTP is valid; return a reset token valid for 15 min
    const resetToken = Buffer.from(`${email}:${Date.now()}`).toString("base64");
    
    return NextResponse.json({ ok: true, resetToken }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
