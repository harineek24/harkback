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
    const { medication_name } = body;

    if (!medication_name) {
      return NextResponse.json(
        { detail: "medication_name field is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

    const prompt = `Provide detailed information about the medication "${medication_name}".
Return ONLY a valid JSON object with no markdown formatting, no code blocks, no extra text.
The JSON object should have these fields:
- name: the brand/common name of the medication
- generic_name: the generic name
- drug_class: the drug class (e.g., "ACE Inhibitor", "Statin")
- common_uses: an array of common uses/conditions it treats (strings)
- side_effects: an array of common side effects (strings)
- interactions: an array of known drug interactions (strings)
- warnings: an array of important warnings (strings)

Provide accurate, real medical information.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const cleaned = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let details;
    try {
      details = JSON.parse(cleaned);
    } catch {
      details = {
        name: medication_name,
        generic_name: "Unknown",
        drug_class: "Unknown",
        common_uses: [],
        side_effects: [],
        interactions: [],
        warnings: [],
      };
    }

    return NextResponse.json(details);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
