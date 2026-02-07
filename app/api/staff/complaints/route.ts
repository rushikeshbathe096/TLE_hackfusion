
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/lib/models/Complaint";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || (decoded as any).role !== "staff") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await connectDB();

        // Fetch complaints where this staff member is in the assignedStaff array
        const complaints = await Complaint.find({
            assignedStaff: (decoded as any).id
        }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, complaints });

    } catch (error: any) {
        console.error("Fetch Staff Tasks Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
