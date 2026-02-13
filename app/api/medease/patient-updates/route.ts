import { NextRequest, NextResponse } from "next/server";
import { store } from "@/app/medease/_lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patient_id, text } = body;

    if (!patient_id || !text) {
      return NextResponse.json(
        { detail: "patient_id and text are required" },
        { status: 400 }
      );
    }

    const update = store.createPatientUpdate({
      patient_id: parseInt(patient_id, 10),
      text,
    });

    return NextResponse.json(update, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
