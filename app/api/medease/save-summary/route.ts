import { NextRequest, NextResponse } from "next/server";
import { store } from "@/app/medease/_lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patient_name, summary, filename, patient_id } = body;

    if (!patient_name || !summary || !filename) {
      return NextResponse.json(
        { detail: "patient_name, summary, and filename are required" },
        { status: 400 }
      );
    }

    const result = store.saveSummary({
      patient_id: patient_id || 1,
      patient_name,
      summary,
      filename,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
