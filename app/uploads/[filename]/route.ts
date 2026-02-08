import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;

        // Basic security check (do NOT mutate filename)
        if (!filename || filename.includes("..") || filename.includes("/")) {
            return new NextResponse("Invalid filename", { status: 400 });
        }

        const filePath = path.join(
            process.cwd(),
            "public",
            "uploads",
            filename
        );

        await fs.access(filePath);

        const fileBuffer = await fs.readFile(filePath);

        const ext = path.extname(filename).toLowerCase();
        const contentTypeMap: Record<string, string> = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".pdf": "application/pdf",
            ".svg": "image/svg+xml",
        };

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentTypeMap[ext] || "application/octet-stream",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });

    } catch (error) {
        // Suppress error logs for missing files to keep terminal clean
        return new NextResponse("File not found", { status: 404 });
    }
}
