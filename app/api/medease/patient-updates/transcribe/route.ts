import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") || formData.get("file");

    if (!audio) {
      return NextResponse.json(
        { detail: "No audio file provided" },
        { status: 400 }
      );
    }

    // Mock transcription response
    return NextResponse.json({
      text: "Transcribed audio content. Patient reports feeling better today with reduced symptoms. Blood pressure readings have been stable at home.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
