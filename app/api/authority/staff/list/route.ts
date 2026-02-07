
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: Request) {
    try {
        const headersList = await headers();
        const authHeader = headersList.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = authHeader.split(" ")[1];
        let decoded: any;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        if (decoded.role !== 'authority') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await connectDB();
        const authority = await User.findById(decoded.id);
        if (!authority || !authority.department) {
            return NextResponse.json({ error: "Authority data invalid" }, { status: 400 });
        }

        const staff = await User.find({
            role: 'staff',
            department: authority.department
        }).select('name email _id');

        return NextResponse.json({ staff }, { status: 200 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
