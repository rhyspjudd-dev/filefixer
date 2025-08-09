import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "File Fixer - Clean File Names Tool",
  description: "Clean up your file names with ease. Remove special characters, convert to kebab-case, camelCase, or PascalCase, and download as a zip.",
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
