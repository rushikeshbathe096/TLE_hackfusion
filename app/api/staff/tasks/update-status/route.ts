
import { NextResponse } from "next/server";
import { updateStatus } from "@/lib/services/staff/updateStatus"; // Assuming correct path
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
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
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        if (decoded.role !== 'staff') {
            return NextResponse.json({ error: "Forbidden: Staff access only" }, { status: 403 });
        }

        const { taskId, status, notes } = await req.json();

        if (!taskId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedTask = await updateStatus({
            taskId,
            staffId: decoded.id, // Ensure staff can only update if assigned (handled in service)
            status,
            notes
        });

        return NextResponse.json({ task: updatedTask }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
