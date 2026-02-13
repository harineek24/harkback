import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { detail: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, session_id } = body;

    if (!message) {
      return NextResponse.json(
        { detail: "message is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

    const prompt = `You are a helpful, empathetic healthcare assistant for the MedEase platform.
You provide general health information and guidance. You are NOT a doctor and always recommend
consulting with a healthcare professional for medical decisions.

Important guidelines:
- Be warm, empathetic, and supportive
- Provide general health information only
- Always recommend seeing a doctor for specific medical concerns
- Never diagnose conditions or prescribe treatments
- Use simple, easy-to-understand language
- If the question is about an emergency, always advise calling 911 or going to the ER

User message: ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({
      response: responseText,
      session_id: session_id || `session-${Date.now()}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
