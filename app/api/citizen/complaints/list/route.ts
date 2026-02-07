
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { listMyComplaints } from "@/lib/services/citizen/listMyComplaints";

export const dynamic = 'force-dynamic'; // Ensure no caching for this route

export async function GET(req: Request) {
    try {
        // 1. Authentication
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
            return NextResponse.json({ error: "Forbidden: Only citizens can view their complaints" }, { status: 403 });
        }

        // 2. Call Service
        const complaints = await listMyComplaints(user._id.toString());

        return NextResponse.json({
            success: true,
            data: complaints
        }, { status: 200 });

    } catch (error) {
        console.error("List Complaints Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
