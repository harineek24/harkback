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
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { detail: "text field is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

    const prompt = `Extract patient overview information from the following medical summary.
Return ONLY a valid JSON object with no markdown formatting, no code blocks, no extra text.
The JSON object should have these fields:
- patient_name: the patient's full name or "Unknown"
- age: the patient's age as a string (e.g., "35") or "Unknown"
- gender: the patient's gender or "Unknown"
- visit_date: the date of the visit (e.g., "January 15, 2025") or "Unknown"
- facility: the name of the hospital or clinic or "Unknown"
- visit_type: the type of visit (e.g., "Annual Physical", "Follow-up") or "Unknown"
- primary_diagnosis: the primary diagnosis or reason for visit or "Unknown"

Medical summary:
${text}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const cleaned = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let overview;
    try {
      overview = JSON.parse(cleaned);
    } catch {
      overview = {
        patient_name: "Unknown",
        age: "Unknown",
        gender: "Unknown",
        visit_date: "Unknown",
        facility: "Unknown",
        visit_type: "Unknown",
        primary_diagnosis: "Unknown",
      };
    }

    return NextResponse.json(overview);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
