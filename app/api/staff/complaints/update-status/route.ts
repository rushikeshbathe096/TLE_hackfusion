
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/lib/models/Complaint";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || (decoded as any).role !== "staff") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { taskId, status } = await req.json();

        if (!taskId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const validStatuses = ["OPEN", "IN_PROGRESS", "ON_HOLD", "RESOLVED"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        await connectDB();

        const complaint = await Complaint.findById(taskId);
        if (!complaint) return NextResponse.json({ error: "Task not found" }, { status: 404 });

        // Verify staff is assigned
        const isAssigned = complaint.assignedStaff.some(
            (id: any) => id.toString() === (decoded as any).id
        );

        if (!isAssigned) {
            return NextResponse.json({ error: "Not authorized for this task" }, { status: 403 });
        }

        // Update status
        await Complaint.findByIdAndUpdate(taskId, {
            status: status,
            $push: {
                statusHistory: {
                    status: status,
                    changedBy: (decoded as any).id,
                    notes: `Status updated to ${status} by staff member.`
                }
            }
        });

        return NextResponse.json({ success: true, message: "Status updated successfully" });

    } catch (error: any) {
        console.error("Update Task Status Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
