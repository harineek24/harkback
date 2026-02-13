import type { Metadata } from "next";
import SweetsBuilder from "@/components/sweets/SweetsBuilder";

export const metadata: Metadata = {
  title: "SweetBox - Build a Digital Sweets Assortment",
  description:
    "Pick cupcakes, macarons, truffles, and more to build a personalized digital gift box. Each sweet carries a special meaning.",
};

export default function SweetsPage() {
  return <SweetsBuilder />;
}
