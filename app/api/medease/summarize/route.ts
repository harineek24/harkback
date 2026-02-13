import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_EXTENSIONS = new Set([".pdf", ".png", ".jpg", ".jpeg"]);

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
}

function getMimeType(filename: string): string {
  const ext = getExtension(filename);
  const mimeTypes: Record<string, string> = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

const EHR_PROMPT = `You are a compassionate medical interpreter helping patients understand their medical records.
Analyze the provided medical document and create a patient-friendly summary.

CRITICAL INSTRUCTIONS:
- Use simple, everyday language (avoid medical jargon)
- Be empathetic and reassuring in tone
- Organize information clearly with headers and sections
- Use emojis sparingly for visual cues only
- Be accurate but understandable
- Focus on what matters to the patient

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:

## Quick Overview
[Extract: Patient name, date of visit/admission, hospital/clinic name, type of visit]

## What Happened
[Explain the diagnosis, condition, or reason for visit in plain English. Avoid terms like "acute myocardial infarction" - say "heart attack" instead]

## Your Medications
[List each medication with:
- Name (brand name if available)
- What it's for in simple terms
- How to take it
Example: "Lisinopril (blood pressure pill) - Take one tablet every morning"]

## Test Results
[Present test results in simple terms:
- Mark normal results with checkmark
- Mark abnormal results with warning
- Explain what each test measures
Example: "Blood sugar: 95 (Normal - good control!)"]

## What to Do Next
[List follow-up care instructions:
- Appointments to schedule
- Lifestyle changes
- Things to monitor at home
Be specific with timeframes]

## When to Seek Immediate Help
[List warning signs that require emergency care:
- Specific symptoms to watch for
- When to call 911 vs. when to call the doctor
Be clear and direct]

---

**Important Notes:**
- If any information is unclear or missing from the document, indicate this
- Do not make up or assume medical information
- Focus on actionable guidance for the patient

Now, please analyze the provided medical document and create the summary following this exact format.`;

function extractPatientName(summary: string): string {
  const lines = summary.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Quick Overview") && i + 1 < lines.length) {
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const line = lines[j].toLowerCase();
        if (line.includes("patient") || line.includes("name")) {
          const parts = lines[j].split(":");
          if (parts.length > 1) {
            const name = parts[1]
              .trim()
              .split(",")[0]
              .trim()
              .replace(/\*/g, "")
              .trim();
            if (name && name.length > 2) return name;
          }
        }
      }
    }
  }
  return "Patient";
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { detail: "GEMINI_API_KEY not configured. Set it in environment variables." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { detail: "No file provided" },
        { status: 400 }
      );
    }

    const ext = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { detail: `Invalid file type. Allowed types: ${[...ALLOWED_EXTENSIONS].join(", ")}` },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    if (buffer.byteLength > MAX_FILE_SIZE) {
      return NextResponse.json(
        { detail: "File too large. Maximum size: 25MB" },
        { status: 400 }
      );
    }

    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = getMimeType(file.name);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

    const result = await model.generateContent([
      EHR_PROMPT,
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
    ]);

    const summary = result.response.text();
    const patientName = extractPatientName(summary);

    return NextResponse.json({
      summary,
      markdown_path: "",
      patient_name: patientName,
      date_processed: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json(
      { detail: `Error generating summary: ${message}` },
      { status: 500 }
    );
  }
}
