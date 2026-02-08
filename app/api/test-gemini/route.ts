import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey) return NextResponse.json({ error: "No API Key found in env" });

        // Directly fetch from Google's REST API to see valid models for this key
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || "Failed to fetch models", details: data });
        }

        return NextResponse.json({
            key_preview: apiKey.substring(0, 5) + "...",
            available_models: data.models?.map((m: any) => m.name) || []
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
