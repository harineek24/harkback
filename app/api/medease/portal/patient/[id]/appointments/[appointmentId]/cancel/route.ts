import { NextRequest, NextResponse } from "next/server";
import { store } from "@/app/medease/_lib/store";

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; appointmentId: string }> }
) {
  try {
    const { appointmentId } = await params;
    const result = store.cancelAppointment(parseInt(appointmentId, 10));

    if (!result) {
      return NextResponse.json(
        { detail: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
