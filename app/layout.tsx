import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

// Configure the Inter font with proper display and preloading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Ensures text remains visible during font loading
  variable: '--font-inter', // Creates a CSS variable for the font
});

export const metadata: Metadata = {
  title: 'Belecure - Advanced Lighting Simulation for Any Floorplan',
  description: 'Transform your space with intelligent light simulation. Upload any floorplan and instantly visualize lighting in your space with our cutting-edge simulation technology.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Preconnect to improve font loading performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}