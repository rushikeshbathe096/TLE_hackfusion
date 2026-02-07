
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getCitizenStats } from "@/lib/services/citizen/getStats";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.role !== 'citizen') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const stats = await getCitizenStats(user._id.toString());

        return NextResponse.json({
            success: true,
            data: stats
        }, { status: 200 });

    } catch (error) {
        console.error("Citizen Stats Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
