import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Event Registration",
  description: "Event registration application",
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
