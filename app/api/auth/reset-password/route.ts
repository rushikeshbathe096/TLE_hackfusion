import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";
import OTP from "../../../../lib/models/OTP";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    
    // Verify OTP
    const record = await OTP.findOne({ email, code: otp });
    if (!record || new Date() > record.expiresAt) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    }

    // Update password
    const hashed = await bcrypt.hash(newPassword, 8);
    const user = await User.findOneAndUpdate({ email }, { password: hashed }, { new: true });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete OTP record
    await OTP.deleteOne({ _id: record._id });

    return NextResponse.json({ ok: true, message: "Password reset successful" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
