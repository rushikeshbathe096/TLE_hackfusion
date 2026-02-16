
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";

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
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        const uploadResponse = await cloudinary.uploader.upload(base64, {
            folder: type === "profile" ? "profile_images" : "profile_documents",
            resource_type: "auto",
        });

        const fileUrl = uploadResponse.secure_url;

        return NextResponse.json({ url: fileUrl }, { status: 200 });

    } catch (e: any) {
        console.error("Upload error:", e);
        return NextResponse.json({ error: "Upload failed: " + e.message }, { status: 500 });
    }
}
