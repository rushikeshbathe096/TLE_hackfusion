import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY || "";

        if (!apiKey) {
            return NextResponse.json({ error: "No API Key" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

        // Ensure history is an array, default to empty
        let safeHistory = Array.isArray(history) ? history : [];

        // Take the last 10 messages for context, preventing overload
        safeHistory = safeHistory.slice(-10);

        // Sanitize: Ensure first message is user
        // If the first message is from model, we must remove it
        while (safeHistory.length > 0 && safeHistory[0].role !== "user") {
            safeHistory.shift();
        }

        const chat = model.startChat({
            history: safeHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        // Make sure to parse response properly
        let text = response.text();

        // If response is empty or undefined, handle gracefully? 
        if (!text) text = "I'm sorry, I couldn't generate a response.";

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
