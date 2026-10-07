import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fadhil Rahmat — Video Editor",
  description: "Portfolio of Fadhil Rahmat, professional video editor.",
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
