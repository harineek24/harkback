import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { session_id, doctor_notes, transcript } = body;

    return NextResponse.json({
      session_id: session_id || "demo-session",
      summary: "Patient presented for consultation. History and examination were reviewed. Assessment and plan have been documented.",
      doctor_notes: doctor_notes || {},
      transcript: transcript || "",
      generated_at: new Date().toISOString(),
      recommendations: [
        "Follow up in 2 weeks",
        "Continue current medications",
        "Monitor symptoms and report any changes",
      ],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
