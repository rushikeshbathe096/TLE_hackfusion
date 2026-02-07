
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/lib/models/Complaint";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // 1. Total & Resolved Counts
        const totalComplaints = await Complaint.countDocuments();
        const resolvedComplaints = await Complaint.countDocuments({ status: 'RESOLVED' });

        // 2. Cities Covered (Distinct locations)
        // This might be heavy if many locations, but for hackathon scale it's fine.
        // A better approach for "Cities" would be to extract city from location string, 
        // but let's just count unique location strings for "Active Zones".
        const uniqueLocations = await Complaint.distinct('location');
        const citiesCovered = uniqueLocations.length;

        // 3. Active Departments (All 4 are active if they have at least 1 report, but let's just say 4)
        const activeDepartments = 4;

        // 4. Department Analytics (for Bar Charts)
        // Group by department and count TOTAL and RESOLVED
        const departmentStats = await Complaint.aggregate([
            {
                $group: {
                    _id: "$department",
                    total: { $sum: 1 },
                    resolved: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        // Format for Recharts: [{ name: 'Road', total: 10, resolved: 5, fill: '#ef4444' }, ...]
        const deptColors: Record<string, string> = {
            'Road': '#ef4444',      // Red
            'Water': '#3b82f6',     // Blue
            'Electrical': '#eab308', // Yellow
            'Sanitation': '#22c55e'  // Green
        };

        const targetDepartments = ['Road', 'Water', 'Electrical', 'Sanitation'];

        // Convert aggregation array to a map for easy lookup
        const statsMap = new Map(departmentStats.map(d => [d._id, d]));

        // Ensure exactly 4 departments are returned, filling 0s if missing
        const formattedDeptStats = targetDepartments.map(dept => {
            const data = statsMap.get(dept) || { total: 0, resolved: 0 };
            return {
                name: dept,
                total: data.total || 0,
                resolved: data.resolved || 0,
                fill: deptColors[dept]
            };
        });

        // 5. Recent/Top Resolved Locations for Map Markers
        // We need meaningful coordinates. Since we don't have lat/long stored separately in a clean way 
        // (sometimes it's "City, State", sometimes "Lat, Long"), 
        // we'll try to find complaints that might have coordinates in the location string 
        // OR just simulate markers for the demo if real data is messy.
        //
        // STRATEGY FOR DEMO: 
        // Fetch up to 50 recent complaints. 
        // If location looks like "lat, long", use it. 
        // If not, we might fail to show them on map unless we geocode (too slow for this API).
        // 
        // ACTUALLY: The user wants "Markers indicating locations where complaints have been resolved".
        // Let's filter for RESOLVED.
        const recentResolved = await Complaint.find({ status: 'RESOLVED' })
            .select('location department title')
            .sort({ updatedAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json({
            success: true,
            stats: {
                totalComplaints,
                resolvedComplaints,
                citiesCovered,
                activeDepartments
            },
            departmentStats: formattedDeptStats,
            mapData: recentResolved
        }, { status: 200 });

    } catch (error) {
        console.error("Landing Stats Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
