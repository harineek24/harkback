import { NextRequest, NextResponse } from "next/server";
import { store } from "@/app/medease/_lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { detail: "Username and password are required" },
        { status: 400 }
      );
    }

    const result = store.patientLogin(username, password);
    if (result) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { detail: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
