import { NextRequest, NextResponse } from "next/server";
import { store } from "@/app/medease/_lib/store";

export async function GET(_request: NextRequest) {
  try {
    const doctors = store.getDoctors();
    return NextResponse.json(doctors);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
