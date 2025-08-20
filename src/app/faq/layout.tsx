import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - FileFixer | Batch File Renaming & SEO Optimization Questions',
  description: 'Get answers about FileFixer\'s batch file renaming, SEO image optimization, naming conventions (kebab-case, camelCase), security, and Pro features. Learn how to clean filenames online.',
  keywords: [
    'batch file renaming FAQ',
    'file naming conventions',
    'kebab-case vs camelCase',
    'SEO image optimization',
    'remove spaces from filenames',
    'online file renaming tool',
    'batch rename files',
    'clean filenames',
    'file cleaning service',
    'web-safe filenames'
  ],
  openGraph: {
    title: 'FileFixer FAQ - Batch File Renaming Questions Answered',
    description: 'Complete guide to batch file renaming, SEO optimization, and file cleaning. Learn about naming conventions, security, and Pro features.',
    url: 'https://filefixer.app/faq',
    type: 'website',
    images: [
      {
        url: 'https://filefixer.app/og-faq.jpg',
        width: 1200,
        height: 630,
        alt: 'FileFixer FAQ - File Renaming Questions'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileFixer FAQ - Batch File Renaming Guide',
    description: 'Everything about batch file renaming, SEO optimization, and file cleaning. Get answers to common questions.',
    images: ['https://filefixer.app/og-faq.jpg']
  },
  alternates: {
    canonical: 'https://filefixer.app/faq'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
