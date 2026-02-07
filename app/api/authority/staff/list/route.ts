
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Complaint from "@/lib/models/Complaint";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || (decoded as any).role !== "authority") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await connectDB();
        const authority = await User.findById((decoded as any).id);
        if (!authority) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // 1. Get all staff in this department
        const allStaff = await User.find({
            role: "staff",
            department: authority.department
        }).select("name email department");

        // 2. Find which staff are currently busy
        // "Busy" means they are in 'assignedStaff' of any complaint that is NOT 'RESOLVED'
        const busyComplaints = await Complaint.find({
            department: authority.department,
            status: { $in: ["OPEN", "IN_PROGRESS", "ON_HOLD"] }
        }).select("assignedStaff");

        const busyStaffIds = new Set<string>();
        busyComplaints.forEach((c: any) => {
            if (c.assignedStaff && Array.isArray(c.assignedStaff)) {
                c.assignedStaff.forEach((id: any) => busyStaffIds.add(id.toString()));
            }
        });

        // 3. Map availability
        const staffWithStatus = allStaff.map((staff: any) => ({
            _id: staff._id,
            name: staff.name,
            email: staff.email,
            isAvailable: !busyStaffIds.has(staff._id.toString())
        }));

        return NextResponse.json({
            success: true,
            staff: staffWithStatus
        });

    } catch (error: any) {
        console.error("Fetch Staff Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
