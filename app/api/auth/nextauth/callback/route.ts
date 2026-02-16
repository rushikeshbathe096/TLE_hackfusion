import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      const url = new URL(req.url);
      const redirectTo = url.searchParams.get("redirect") || "/";
      const abs = new URL(redirectTo, req.url);
      abs.searchParams.set("error", "auth");
      return NextResponse.redirect(abs);
    }

    const email = session.user.email as string;
    const name = session.user.name ?? undefined;

    await connectDB();

    let user = await User.findOne({ email }).lean();

    if (!user) {
      user = await User.create({
        email,
        name,
        role: "citizen",
        isVerified: true,
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const url = new URL(req.url);
    const redirectTo = url.searchParams.get("redirect") || "/";

    // Redirect back to frontend with token as query param (use absolute URL)
    const abs = new URL(redirectTo, req.url);
    abs.searchParams.set("token", token);

    return NextResponse.redirect(abs);
  } catch (error) {
    console.error("NextAuth exchange error:", error);
    const url = new URL(req.url);
    const redirectTo = url.searchParams.get("redirect") || "/";
    const abs = new URL(redirectTo, req.url);
    abs.searchParams.set("error", "server");
    return NextResponse.redirect(abs);
  }
}
