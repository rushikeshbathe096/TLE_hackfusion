
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Helper to get user from token
async function getUserFromRequest() {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    try {
        const decoded: any = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch {
        return null;
    }
}

export async function GET(req: Request) {
    try {
        const decoded = await getUserFromRequest();
        if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ user }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const decoded = await getUserFromRequest();
        if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        await connectDB();

        const user = await User.findById(decoded.id);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Update allowed fields
        if (body.name) user.name = body.name;
        if (body.dob) user.dob = new Date(body.dob);
        if (body.phoneNumber) user.phoneNumber = body.phoneNumber;
        if (body.address) user.address = body.address;
        if (body.profileImage) user.profileImage = body.profileImage;
        if (body.govtIdUrl) user.govtIdUrl = body.govtIdUrl;

        await user.save();

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
