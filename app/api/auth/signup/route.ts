import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";
import cloudinary from "../../../../lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) || "citizen";
    const department = formData.get("department") as string;
    const govtIdFile = formData.get("govtId") as File | null;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if ((role === "authority" || role === "staff") && !govtIdFile) {
      return NextResponse.json(
        { error: "Government ID is required for this role" },
        { status: 400 }
      );
    }

    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    let govtIdUrl = "";

    if (govtIdFile) {
      const buffer = Buffer.from(await govtIdFile.arrayBuffer());

      if (buffer.length > 4.5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File too large" },
          { status: 413 }
        );
      }

      const base64 = `data:${govtIdFile.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64, {
        folder: "govt_ids",
        resource_type: "auto",
      });

      govtIdUrl = uploadResponse.secure_url;
    }

    const hashed = await bcrypt.hash(password, 10);

    const isVerified = role === "citizen";

    const user = await User.create({
      email,
      password: hashed,
      name,
      role,
      department:
        role === "authority" || role === "staff" ? department : undefined,
      govtIdUrl,
      isVerified,
    });

    const token = jwt.sign(
      { id: user._id, email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      { ok: true, token, role: user.role, isVerified: user.isVerified },
      { status: 201 }
    );
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
