
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/lib/models/Complaint";
import User from "@/lib/models/User";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || (decoded as any).role !== "authority") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { complaintId, staffIds } = await req.json();

        if (!complaintId || !staffIds || !Array.isArray(staffIds)) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        await connectDB();

        // Validate complaint exists and belongs to authority's department
        const authority = await User.findById((decoded as any).id);
        if (!authority) {
            return NextResponse.json({ error: "Authority user not found" }, { status: 404 });
        }

        if (authority.role !== "authority") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
        if (!authority.department || complaint.department !== authority.department) {
            return NextResponse.json({ error: "Unauthorized for this department" }, { status: 403 });
        }

        // Update Complaint
        // Add new staff to valid list (avoid duplicates if any)
        // Set status to IN_PROGRESS if it was OPEN

        // Update Complaint
        // Using $set to overwrite means we can handle both add and remove.
        // If staffIds is empty, we are unassigning everyone. Status should probably go back to OPEN or maybe ON_HOLD?
        // Let's say if 0 staff, status -> OPEN (if it was RESOLVED, maybe keep resolved? No, 'assign' implies active management).
        // Let's keep it simple: overwrites list. If active assignment (len > 0) -> IN_PROGRESS.

        const updateQuery: any = {
            $set: { assignedStaff: staffIds }
        };

        if (staffIds.length > 0 && complaint.status === 'OPEN') {
            updateQuery.$set.status = "IN_PROGRESS";
        }

        await Complaint.findByIdAndUpdate(complaintId, {
            ...updateQuery,
            $push: {
                statusHistory: {
                    status: updateQuery.$set?.status || complaint.status,
                    changedBy: authority._id || (decoded as any).id,
                    notes: `Updated staff assignment. Count: ${staffIds.length}`
                }
            }
        });

        return NextResponse.json({ success: true, message: "Staff assigned successfully" });

    } catch (error: any) {
        console.error("Assign Staff Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
