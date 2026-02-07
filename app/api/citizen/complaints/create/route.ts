
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { createComplaint } from "@/lib/services/citizen/createComplaint";

export async function POST(req: Request) {
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
            return NextResponse.json({ error: "Forbidden: Only citizens can create complaints" }, { status: 403 });
        }

        // 2. Parse Body
        const body = await req.json();
        const { title, department, location, description, imageUrl } = body;

        // 3. Validation
        if (!title || !department || !location || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const validDepartments = ['Road', 'Water', 'Electrical', 'Sanitation'];
        if (!validDepartments.includes(department)) {
            return NextResponse.json({ error: "Invalid department" }, { status: 400 });
        }

        // 4. Call Service
        const result = await createComplaint({
            userId: user._id.toString(),
            title,
            department,
            location,
            description,
            imageUrl
        });

        return NextResponse.json({
            success: true,
            message: result.message,
            data: result.complaint,
            isDuplicate: result.isDuplicate
        }, { status: 201 });

    } catch (error) {
        console.error("Create Complaint Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
