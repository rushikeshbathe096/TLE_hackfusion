import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const email = searchParams.get("email");
    const rawName = searchParams.get("name");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const name = rawName ?? undefined;

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

    return NextResponse.json(
      {
        success: true,
        token,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
