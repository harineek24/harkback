import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedEase - AI-Powered Healthcare Platform",
  description: "Multi-portal healthcare platform with EHR summarization, drug interaction checking, and AI voice consultations",
};

export default function MedEaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
