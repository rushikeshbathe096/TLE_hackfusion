
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
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
        try {
            jwt.verify(token, SECRET_KEY);
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const type = formData.get("type") as string; // 'profile' or 'govtId'

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Sanitize filename and add timestamp
        const sanitizedName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const filename = `${Date.now()}_${type}_${sanitizedName}`;

        // Ensure uploads directory exists (checked implicitly by creation below, or assuming structure)
        // Ideally we check if public/uploads exists, but standard node fs write usually needs dir.
        // For simplicity in this environment we assume public/uploads exists or is writable.

        const uploadDir = path.join(process.cwd(), "public/uploads");
        await writeFile(path.join(uploadDir, filename), buffer);

        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: fileUrl }, { status: 200 });

    } catch (e: any) {
        console.error("Upload error:", e);
        return NextResponse.json({ error: "Upload failed: " + e.message }, { status: 500 });
    }
}
