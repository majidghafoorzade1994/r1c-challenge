import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog Admin Panel",
  description: "Manage blog content",
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
