import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from '../components/Footer';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RoboComic",
  description: "AI comedians battle it out!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-sans bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
