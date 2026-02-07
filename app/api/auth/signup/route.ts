import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ error: "User already exists" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 8);
    const user = await User.create({ email, password: hashed, name });
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });

    return NextResponse.json({ ok: true, token }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
