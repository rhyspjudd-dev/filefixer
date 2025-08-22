import type { Metadata } from "next";
import "./globals.scss";
import Providers from "@/components/Providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "File Fixer - Clean File Names Tool",
  description: "Clean up your file names with ease. Remove special characters, convert to kebab-case, camelCase, or PascalCase, and download as a zip.",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ]
  },
  // Chrome performance optimizations
  other: {
    'theme-color': '#1a1a1a',
    'msapplication-TileColor': '#1a1a1a',
    'viewport': 'width=device-width, initial-scale=1, viewport-fit=cover',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="//avatars.githubusercontent.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <GoogleAnalytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
