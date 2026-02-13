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
    const { message, summary_text, medications, test_results, session_id } = body;

    if (!message) {
      return NextResponse.json(
        { detail: "message is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

    let contextSection = "";
    if (summary_text) {
      contextSection += `\n\nPatient's Medical Summary:\n${summary_text}`;
    }
    if (medications) {
      const medList = Array.isArray(medications) ? medications.join(", ") : medications;
      contextSection += `\n\nCurrent Medications: ${medList}`;
    }
    if (test_results) {
      const testList = Array.isArray(test_results) ? JSON.stringify(test_results) : test_results;
      contextSection += `\n\nRecent Test Results: ${testList}`;
    }

    const prompt = `You are a knowledgeable, empathetic healthcare assistant for the MedEase platform.
You have access to this patient's medical context and can help them understand their health records.

Important guidelines:
- Be warm, empathetic, and supportive
- Use the patient's medical context to provide personalized guidance
- Explain medical terms in simple language
- Always recommend consulting their doctor for medical decisions
- Never change or suggest changes to prescribed medications without doctor approval
- If the question is about an emergency, always advise calling 911 or going to the ER
${contextSection}

Patient question: ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({
      response: responseText,
      session_id: session_id || `session-${Date.now()}`,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}
