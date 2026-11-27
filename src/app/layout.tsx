import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PopAuth from "@/components/PopAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "READTalk- Demo",
  description: "ReadTalk - Demo",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "READTalk-Demo",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ background: "#000000" }}>
      <head>
        <style>{`html,body{background:#000000 !important;margin:0;padding:0;}`}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ margin: 0, background: "#000000", color: "#ffffff" }}
      >
        <PopAuth />
        <div
          style={{
            display: "flex",
            height: "100dvh",
            overflow: "hidden",
            background: "#000000",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
