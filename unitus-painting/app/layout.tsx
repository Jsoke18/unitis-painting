import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Unitus Painting",
  description: "Professional Painting Services in Vancouver & Calgary",
  metadataBase: new URL('https://www.unituspainting.com'),
  openGraph: {
    title: "Unitus Painting",
    description: "Professional Painting Services in Vancouver & Calgary",
    url: 'https://www.unituspainting.com',
    siteName: 'Unitus Painting',
    images: [
      {
        url: 'public/photos/unituslogo.png',
        width: 600,
        height: 200,
        alt: 'Unitus Painting Logo',
      }
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unitus Painting',
    description: 'Professional Painting Services in Vancouver & Calgary',
    images: ['/photos/9b68ca45052d057c3539f5259eaebc8fc853392e2bc5d444f2225c9e4d6265ec.png'],
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          theme="light"
          className="font-sans"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #E2E8F0',
              padding: '16px',
            },
            className: 'text-sm font-medium',
          }}
        />
      </body>
    </html>
  );
}