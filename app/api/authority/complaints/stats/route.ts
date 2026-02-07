
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

        const complaints = await Complaint.find({ department: authority.department }).lean();

        // Calculate Stats
        const stats = {
            total: complaints.length,
            open: complaints.filter((c: any) => c.status === 'OPEN').length,
            inProgress: complaints.filter((c: any) => c.status === 'IN_PROGRESS').length,
            resolved: complaints.filter((c: any) => c.status === 'RESOLVED').length,
            highPriority: 0,
            mediumPriority: 0,
            lowPriority: 0
        };

        // Calculate Priority Distribution based on formula
        complaints.forEach((c: any) => {
            const score = calculatePriority({
                frequency: c.frequency || 1,
                createdAt: c.createdAt
            });
            // No explicit buckets defined for High/Med/Low in score, but let's infer:
            // Max score = (3*2) + 3 = 9. Min = (1*2) + 1 = 3.
            // Let's say: High >= 7, Medium >= 5, Low < 5. Or just return raw distribution?
            // User didn't ask for "High/Med/Low" stats specifically, just "stats".
            // The prompt said "Output I Want From You... Priority calculation logic... Sorting + grouping logic".
            // Grouping implies maybe grouping by priority?
            // Let's rely on status counts mainly, but priority info is good.
            // Let's define: High (>6), Medium (5-6), Low (<5).
            if (score >= 7) stats.highPriority++;
            else if (score >= 5) stats.mediumPriority++;
            else stats.lowPriority++;
        });

        return NextResponse.json({ stats }, { status: 200 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
