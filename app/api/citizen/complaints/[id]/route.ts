import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getComplaintDetails } from "@/lib/services/citizen/getComplaintDetails";

export const dynamic = "force-dynamic";

interface JwtPayload {
  id: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as JwtPayload | null;

    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(decoded.id).lean();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;

    const complaintDetails = await getComplaintDetails(id);

    if (!complaintDetails) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    if (complaintDetails.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Forbidden: You can only view your own complaints" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: complaintDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Complaint Detail Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
