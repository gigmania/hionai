import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HI on AI | The AI Homepage",
  description: "Daily AI intelligence across launches, prediction markets, media, research, models, and investments."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
