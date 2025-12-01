import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MbotixTECH Arisan System",
  description: "Modern Arisan Management System",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-dark-bg text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
