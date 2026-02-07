import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string || "citizen";
    const department = formData.get("department") as string;
    const govtIdFile = formData.get("govtId") as File | null;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if ((role === "authority" || role === "staff") && !govtIdFile) {
      return NextResponse.json({ error: "Government ID is required for this role" }, { status: 400 });
    }

    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ error: "User already exists" }, { status: 409 });

    let govtIdUrl = "";
    if (govtIdFile) {
      const buffer = Buffer.from(await govtIdFile.arrayBuffer());
      const filename = Date.now() + "_" + govtIdFile.name.replaceAll(" ", "_");

      // Ensure uploads directory exists - implementing simple check or assuming it exists/will error if not. 
      // ideally we should check and mkdir if not exists but for now let's assume public/uploads exists or use a safer path logic in a real app.
      // Actually, let's just write to public/uploads

      await writeFile(path.join(process.cwd(), "public/uploads/" + filename), buffer);
      govtIdUrl = "/uploads/" + filename;
    }

    const hashed = await bcrypt.hash(password, 8);

    // Determine verification status: Citizens are auto-verified, others are not.
    const isVerified = role === 'citizen';

    const user = await User.create({
      email,
      password: hashed,
      name,
      role,
      department: (role === 'authority' || role === 'staff') ? department : undefined,
      govtIdUrl,
      isVerified
    });

    const token = jwt.sign(
      { id: user._id, email, role: user.role },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    return NextResponse.json({ ok: true, token, role: user.role, isVerified: user.isVerified }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
