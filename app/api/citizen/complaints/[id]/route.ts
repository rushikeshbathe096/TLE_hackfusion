
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getComplaintDetails } from "@/lib/services/citizen/getComplaintDetails";

export const dynamic = 'force-dynamic';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
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

        if (!user || user.role !== 'citizen') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Await params if necessary (Next.js 15+ changes, but 14 is safe, keeping it simple)
        // Actually, in recent Next.js versions params is a Promise in some contexts, 
        // but typically in route handlers it's an object. 
        // We'll treat it as object.
        const id = params.id;

        const complaintDetails = await getComplaintDetails(id);

        if (!complaintDetails) {
            return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
        }

        // Verify ownership (Citizen can only view their own)
        if (complaintDetails.userId.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "Forbidden: You can only view your own complaints" }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            data: complaintDetails
        }, { status: 200 });

    } catch (error) {
        console.error("Complaint Detail Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
