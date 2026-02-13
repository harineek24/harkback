import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    fields: [
      {
        name: "Chief Complaint",
        description: "The primary reason for the patient's visit",
        required: true,
      },
      {
        name: "History of Present Illness",
        description: "Detailed history of the current medical concern",
        required: true,
      },
      {
        name: "Past Medical History",
        description: "Previous medical conditions, surgeries, hospitalizations",
        required: false,
      },
      {
        name: "Family History",
        description: "Relevant family medical history",
        required: false,
      },
      {
        name: "Social History",
        description: "Lifestyle factors including smoking, alcohol, exercise",
        required: false,
      },
      {
        name: "Review of Systems",
        description: "Systematic review of body systems",
        required: false,
      },
      {
        name: "Physical Examination",
        description: "Findings from the physical exam",
        required: true,
      },
      {
        name: "Assessment",
        description: "Clinical assessment and diagnosis",
        required: true,
      },
      {
        name: "Plan",
        description: "Treatment plan and follow-up instructions",
        required: true,
      },
      {
        name: "Current Medications",
        description: "List of current medications",
        required: false,
      },
      {
        name: "Allergies",
        description: "Known allergies and reactions",
        required: false,
      },
      {
        name: "Vital Signs",
        description: "Blood pressure, heart rate, temperature, etc.",
        required: false,
      },
    ],
  });
}
