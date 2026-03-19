import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Lorekeeper — D&D 5e Rules Companion",
  description:
    "Your AI-powered D&D 5th Edition rules companion. Ask about spells, monsters, classes, races, conditions, and mechanics from the SRD.",

  keywords: [
    "D&D 5e",
    "Dungeons and Dragons",
    "D&D spells",
    "D&D rules",
    "SRD 5e",
    "AI D&D assistant",
  ],

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
