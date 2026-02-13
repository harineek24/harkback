import { NextRequest, NextResponse } from "next/server";
import { store } from "@/app/medease/_lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { update_id, text } = body;

    if (!update_id || !text) {
      return NextResponse.json(
        { detail: "update_id and text are required" },
        { status: 400 }
      );
    }

    const reply = store.addDoctorReply(
      parseInt(update_id, 10),
      parseInt(id, 10),
      text
    );

    if (!reply) {
      return NextResponse.json(
        { detail: "Update not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
