import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PROJECT_CONTEXT = `
CityPulse is a civic issue management web application.

General navigation:
- Users log in to access their role-based dashboard
- Users can log out using the Logout button in the dashboard or profile menu

Roles:
Citizen:
- Raise complaints from Dashboard → Raise Complaint
- Track complaint status (Pending, Assigned, Resolved)

Authority:
- View complaints by department
- Assign complaints to staff
- Monitor complaint resolution

Staff:
- Log in to Staff Dashboard
- View assigned tasks in the "My Tasks" section
- Each task shows complaint details and current status
- Update task status (e.g., In Progress, Resolved)
- Upload proof of work when resolving a complaint

Complaint lifecycle:
Pending → Assigned → Resolved

Rules:
- Answer only based on CityPulse features
- If asked for steps, give numbered steps
- If feature exists, explain it clearly
- If feature does not exist, say it is not available
- Never invent new features
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { text: "Chatbot is not configured correctly." },
        { status: 500 }
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { text: "Please ask a valid question." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
      systemInstruction: `
You are CityPulse Assistant.

Use ONLY the information below to answer user questions:

${PROJECT_CONTEXT}

Behavior rules:
- Be clear and practical
- Prefer step-by-step answers
- Do not say "I am having trouble connecting"
- If the question is unclear, ask a follow-up
`,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 400,
      },
    });

    const safeHistory = Array.isArray(history)
      ? history.slice(-5).map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: String(m.content || "") }],
        }))
      : [];

    const chat = model.startChat({ history: safeHistory });

    const result = await chat.sendMessage(message);
    const text = result?.response?.text();

    //  Graceful fallback
    return NextResponse.json({
      text:
        text && text.trim().length > 0
          ? text
          : "I can help with using CityPulse. Please ask about complaints, tasks, or dashboards.",
    });

  } catch (error) {
    console.error("Chatbot error:", error);

    // Honest error message
    return NextResponse.json({
      text:
        "I'm unable to answer that right now. Please try again or ask a different question related to CityPulse.",
    });
  }
}
