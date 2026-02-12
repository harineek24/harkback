"use client";

import dynamic from "next/dynamic";

const GalleryCanvas = dynamic(
  () => import("@/components/gallery/GalleryCanvas"),
  { ssr: false }
);

export default function Home() {
  return <GalleryCanvas />;
}
