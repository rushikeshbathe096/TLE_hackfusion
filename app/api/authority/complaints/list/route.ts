
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getDepartmentComplaints } from "@/lib/services/authority/getDepartmentComplaints";
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
        const user = await User.findById(decoded.id);
        if (!user || user.role !== 'authority' || !user.department) {
            return NextResponse.json({ error: "Authority profile error" }, { status: 400 });
        }

        const complaints = await getDepartmentComplaints(user.department);

        return NextResponse.json({ complaints }, { status: 200 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
