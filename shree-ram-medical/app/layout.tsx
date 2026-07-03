import type { Metadata } from "next";
import { spaceGrotesk, inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Shree Ram Medical Agency — Wholesale Pharmaceutical Distribution",
    template: "%s — Shree Ram Medical Agency",
  },
  description:
    "Shree Ram Medical Agency connects 50+ pharmaceutical manufacturers to retail pharmacies, hospitals and clinics across India with a fully browsable catalogue, quote requests, and partner accounts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
