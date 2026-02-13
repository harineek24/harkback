import { NextRequest, NextResponse } from "next/server";

const defaultConfigs = [
  {
    id: 1,
    name: "General Consultation",
    type: "general",
    fields: [
      "Chief Complaint",
      "History of Present Illness",
      "Review of Systems",
      "Physical Examination",
      "Assessment",
      "Plan",
    ],
    is_default: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Follow-up Visit",
    type: "follow_up",
    fields: [
      "Interval History",
      "Current Medications",
      "Symptom Update",
      "Assessment",
      "Plan Modifications",
    ],
    is_default: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "New Patient Intake",
    type: "new_patient",
    fields: [
      "Chief Complaint",
      "History of Present Illness",
      "Past Medical History",
      "Family History",
      "Social History",
      "Review of Systems",
      "Physical Examination",
      "Assessment",
      "Plan",
    ],
    is_default: false,
    created_at: "2025-01-01T00:00:00Z",
  },
];

export async function GET(_request: NextRequest) {
  return NextResponse.json(defaultConfigs);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newConfig = {
      id: defaultConfigs.length + 1,
      name: body.name || "Custom Consultation",
      type: body.type || "custom",
      fields: body.fields || ["Chief Complaint", "Assessment", "Plan"],
      is_default: false,
      created_at: new Date().toISOString(),
    };

    defaultConfigs.push(newConfig);
    return NextResponse.json(newConfig, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
