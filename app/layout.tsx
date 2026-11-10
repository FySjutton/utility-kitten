import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import React from "react";
import { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({variable: "--font-geist-sans", subsets: ["latin"],});
const geistMono = Geist_Mono({variable: "--font-geist-mono", subsets: ["latin"],});

export default function RootLayout({children}: { children: React.ReactNode; }) {
    return (
        <html lang="en" className="dark">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
