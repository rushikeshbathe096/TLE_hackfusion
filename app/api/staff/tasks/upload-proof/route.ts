
import { NextResponse } from "next/server";
import { uploadProof } from "@/lib/services/staff/uploadProof";
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

        const formData = await req.formData();
        const taskId = formData.get("taskId") as string;
        const resolutionNotes = formData.get("resolutionNotes") as string;
        const proofFile = formData.get("proof") as File | null;

        if (!taskId) {
            return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
        }

        let proofUrl = "";
        if (proofFile) {
            const buffer = Buffer.from(await proofFile.arrayBuffer());
            const filename = Date.now() + "_" + proofFile.name.replaceAll(" ", "_");

            // Write to public/uploads
            const { writeFile } = require("fs/promises");
            const path = require("path");
            await writeFile(path.join(process.cwd(), "public/uploads/" + filename), buffer);

            proofUrl = "/uploads/" + filename;
        } else {
            // If no file uploaded, maybe they provided a URL string or it's optional?
            // For now, let's say file is optional if they just want to add notes, 
            // but user asked for file upload specifically.
            // If they paste a URL in a text field, we could handle that too, but let's prioritize file.
            const url = formData.get("proofUrl") as string;
            if (url) proofUrl = url;
        }

        if (!proofUrl) {
            return NextResponse.json({ error: "Proof (image or URL) is required" }, { status: 400 });
        }

        const updatedTask = await uploadProof({
            taskId,
            staffId: decoded.id,
            proofUrl,
            resolutionNotes
        });

        return NextResponse.json({ task: updatedTask }, { status: 200 });
    } catch (error: any) {
        // If service throws unauthorized, catch it here
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
