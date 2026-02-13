import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const sessionId = `demo-session-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    return NextResponse.json({
      session_id: sessionId,
      config: {
        patient_id: body.patient_id || null,
        doctor_id: body.doctor_id || null,
        consultation_type: body.consultation_type || "general",
        fields: [
          "Chief Complaint",
          "History of Present Illness",
          "Review of Systems",
          "Physical Examination",
          "Assessment",
          "Plan",
        ],
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
