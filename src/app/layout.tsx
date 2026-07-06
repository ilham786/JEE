import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  authors: [{ name: "ILHAM FAROOQUE", url: "https://github.com/ilham786" }],
  keywords: ["JEE", "NEET", "study", "exam", "competitive", "focus", "productivity"],
  openGraph: {
    title: "FocusForge",
    description: "The ultimate study operating system for competitive exam preparation",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#090a0f",
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
      </head>
      <body className="min-h-full flex flex-col bg-[#090a0f] text-foreground">
        {children}
      </body>
    </html>
  );
}
