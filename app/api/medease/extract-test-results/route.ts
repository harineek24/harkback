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

    const prompt = `Extract all test results mentioned in the following medical summary.
Return ONLY a valid JSON array with no markdown formatting, no code blocks, no extra text.
Each test result should have these fields:
- name: the name of the test (e.g., "Blood Glucose", "Total Cholesterol")
- value: the numeric value as a string (e.g., "95")
- unit: the unit of measurement (e.g., "mg/dL", "mmHg") or "Not specified"
- reference_range: the normal reference range (e.g., "70-100 mg/dL") or "Not specified"
- status: "Normal", "High", "Low", or "Borderline" based on the result

If no test results are found, return an empty array [].

Medical summary:
${text}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const cleaned = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let testResults;
    try {
      testResults = JSON.parse(cleaned);
    } catch {
      testResults = [];
    }

    return NextResponse.json({ test_results: testResults });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
