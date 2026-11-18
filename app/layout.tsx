import type { Metadata, Viewport } from 'next';
import { Outfit, Fraunces } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  weight: ['400', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FFF9EF',
};

export const metadata: Metadata = {
  title: 'Food Market Hub — Because your cost matters',
  description:
    'Food Market Hub helps F&B businesses to improve profits by over 12% with smart ordering and cost-management data.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`}>
      <body className="bg-[#FFF9EF] font-sans antialiased text-[#2C1E14]">
        {children}
      </body>
    </html>
  );
}
