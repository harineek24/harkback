import { NextRequest, NextResponse } from "next/server";

async function handleUnmatchedRoute(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const fullPath = `/api/medease/${path.join("/")}`;
  console.log(`[MedEase] Unhandled API route: ${request.method} ${fullPath}`);

  // Return a reasonable empty response to prevent frontend errors
  // Use empty array for routes that likely return lists, empty object otherwise
  const pathStr = path.join("/");
  const likelyListEndpoints = [
    "patients", "doctors", "appointments", "medications",
    "summaries", "results", "records", "updates", "replies",
    "statements", "payments", "configs", "fields", "slots",
    "history", "feed", "specialties", "names", "timeline",
  ];

  const isListEndpoint = likelyListEndpoints.some(
    (keyword) => pathStr.endsWith(keyword) || pathStr.includes(keyword + "/")
  );

  if (isListEndpoint) {
    return NextResponse.json([]);
  }

  return NextResponse.json({});
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleUnmatchedRoute(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleUnmatchedRoute(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleUnmatchedRoute(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleUnmatchedRoute(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleUnmatchedRoute(request, context);
}
