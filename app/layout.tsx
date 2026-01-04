import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Life Balance",
  description: "Life Balance app",
  openGraph: {
    title: "Life Balance",
    description: "Life Balance app",
    images: [
      {
        url: "/api/life",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
