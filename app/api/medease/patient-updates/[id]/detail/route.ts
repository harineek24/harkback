import { NextRequest, NextResponse } from "next/server";
import { store } from "@/app/medease/_lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const update = store.getUpdateById(parseInt(id, 10));

    if (!update) {
      return NextResponse.json(
        { detail: "Update not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(update);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
