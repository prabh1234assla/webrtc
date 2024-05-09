import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "webrtc project",
  description: "webrtc based project",
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
