
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Complaint from "@/lib/models/Complaint";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { calculatePriority } from "@/lib/services/authority/calculatePriority";

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

        const complaints = await Complaint.find({ department: authority.department })
            .populate('createdBy', 'name email phoneNumber address')
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean();

        // Limit to 10 for the "Recent Reports" view, but use all for stats calculation
        // (Optimally we might want separate queries but carrying full list for stats is okay for MVP scale)
        // Limit to 50 for the "Recent Reports" view to allow "See More"
        const recentComplaints = complaints.slice(0, 50);

        // 1. Average Resolution Time
        const resolvedComplaints = complaints.filter((c: any) => c.status === 'RESOLVED');
        let totalTime = 0;
        resolvedComplaints.forEach((c: any) => {
            const created = new Date(c.createdAt).getTime();
            const updated = new Date(c.updatedAt).getTime(); // Assuming updatedAt is resolution time for simplicity
            totalTime += (updated - created);
        });
        const avgResolutionTimeHours = resolvedComplaints.length > 0
            ? (totalTime / resolvedComplaints.length) / (1000 * 60 * 60)
            : 0;

        // 2. Complaints by Location
        const locationMap: Record<string, number> = {};
        complaints.forEach((c: any) => {
            locationMap[c.location] = (locationMap[c.location] || 0) + 1;
        });
        const topLocations = Object.entries(locationMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20) // Return top 20 for "See More" functionality
            .map(([location, count]) => ({ location, count }));

        // 3. Priority Distribution
        const priorityDistribution = { high: 0, medium: 0, low: 0 };
        complaints.forEach((c: any) => {
            const score = calculatePriority({
                frequency: c.frequency || 1,
                createdAt: c.createdAt
            });
            if (score >= 7) priorityDistribution.high++;
            else if (score >= 5) priorityDistribution.medium++;
            else priorityDistribution.low++;
        });

        return NextResponse.json({
            avgResolutionTimeHours: Math.round(avgResolutionTimeHours),
            topLocations,
            priorityDistribution,
            totalComplaints: complaints.length,
            recentComplaints
        }, { status: 200 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
