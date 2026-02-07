import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization") || "";
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(parts[1]);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    await connectDB();
    const user = await User.findById((payload as any).id).select("email name createdAt");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ ok: true, user }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
