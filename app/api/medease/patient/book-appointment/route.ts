import { NextRequest, NextResponse } from "next/server";
import { store } from "@/app/medease/_lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patient_id, doctor_id, date, time, reason } = body;

    if (!patient_id || !doctor_id || !date || !time) {
      return NextResponse.json(
        { detail: "patient_id, doctor_id, date, and time are required" },
        { status: 400 }
      );
    }

    const appointment = store.bookAppointment({
      patient_id: parseInt(patient_id, 10),
      doctor_id: parseInt(doctor_id, 10),
      date,
      time,
      reason: reason || "General appointment",
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
