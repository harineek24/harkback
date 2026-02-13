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
    const { medications } = body;

    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json(
        { detail: "medications array is required and must not be empty" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

    const prompt = `Analyze the following list of medications for potential drug interactions.
Medications: ${medications.join(", ")}

Return ONLY a valid JSON object with no markdown formatting, no code blocks, no extra text.
The JSON object should have this structure:
{
  "interactions": [
    {
      "drug1": "name of first drug",
      "drug2": "name of second drug",
      "severity": "high" | "moderate" | "low",
      "description": "brief description of the interaction and potential effects"
    }
  ]
}

If no interactions are found, return {"interactions": []}.
Only include real, medically accurate drug interactions.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const cleaned = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let analysis;
    try {
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = { interactions: [] };
    }

    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
