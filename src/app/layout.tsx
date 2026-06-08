import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { QueryProvider } from "@/components/QueryProvider";
import { AuthModalProvider } from "@/components/AuthModalProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthCookieSync } from "@/components/AuthCookieSync";

import { ErrorBoundaryWrapper } from "@/components/ErrorBoundaryWrapper";
import { AgentationWrapper } from "@/components/AgentationWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrowdRaise - Money Collection Made Beautifully Simple",
  description: "Raise funds, collect gifts, and receive tips — all in one beautiful platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <LayoutWrapper>
            <ErrorBoundaryWrapper>
              {children}
            </ErrorBoundaryWrapper>
          </LayoutWrapper>
          <Toaster position="top-right" richColors />
          <AuthModalProvider />
          <AuthCookieSync />
          <AgentationWrapper />
        </QueryProvider>
      </body>
    </html>
  );
}
