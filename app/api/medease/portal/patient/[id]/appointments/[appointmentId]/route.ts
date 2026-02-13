import { NextRequest, NextResponse } from "next/server";
import { store } from "@/app/medease/_lib/store";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; appointmentId: string }> }
) {
  try {
    const { appointmentId } = await params;
    const body = await request.json().catch(() => ({}));

    if (body.status === "cancelled") {
      const result = store.cancelAppointment(parseInt(appointmentId, 10));
      if (!result) {
        return NextResponse.json(
          { detail: "Appointment not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(result);
    }

    return NextResponse.json({ detail: "Unsupported status update" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; appointmentId: string }> }
) {
  try {
    const { id, appointmentId } = await params;
    const appointments = store.getAppointments(parseInt(id, 10));
    const appointment = appointments.find(
      (a: { id: number }) => a.id === parseInt(appointmentId, 10)
    );

    if (!appointment) {
      return NextResponse.json(
        { detail: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
