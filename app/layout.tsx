import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hark Back - 3D Portfolio Gallery",
  description: "A 3D walkable virtual art gallery portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
