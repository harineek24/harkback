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

    const prompt = `Extract all medications mentioned in the following medical summary.
Return ONLY a valid JSON array with no markdown formatting, no code blocks, no extra text.
Each medication should have these fields:
- name: the medication name
- dosage: the dosage (e.g., "10mg", "500mg") or "Not specified" if not mentioned
- frequency: how often to take it (e.g., "Once daily", "Twice daily") or "Not specified"
- purpose: what the medication is for in simple terms or "Not specified"

If no medications are found, return an empty array [].

Medical summary:
${text}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Parse the JSON response, stripping any markdown code blocks if present
    const cleaned = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let medications;
    try {
      medications = JSON.parse(cleaned);
    } catch {
      medications = [];
    }

    return NextResponse.json({ medications });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
