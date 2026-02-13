import { NextRequest, NextResponse } from "next/server";
import { store } from "@/app/medease/_lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ testName: string }> }
) {
  try {
    const { testName } = await params;
    const decodedName = decodeURIComponent(testName);
    const history = store.getTestResultHistory(decodedName);
    return NextResponse.json(history);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
