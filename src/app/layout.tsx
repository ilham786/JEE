import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FocusForge - JEE Study Operating System",
  description: "A professional dark-mode glassmorphic study workspace designed specifically for JEE & competitive exam students to maximize discipline and focus.",
  authors: [{ name: "FocusForge Team" }],
  keywords: ["JEE", "NEET", "study", "exam", "competitive", "focus", "productivity"],
  openGraph: {
    title: "FocusForge",
    description: "The ultimate study operating system for competitive exam preparation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#090a0f" />
      </head>
      <body className="min-h-full flex flex-col bg-[#090a0f] text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
