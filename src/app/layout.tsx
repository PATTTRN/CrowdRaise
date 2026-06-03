import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthModalProvider } from "@/components/AuthModalProvider";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresenceWrapper } from "@/components/AnimatePresenceWrapper";
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundaryWrapper";

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
        <Header />
        <main className="pt-[var(--header-height)]">
          <ErrorBoundaryWrapper>
            <AnimatePresenceWrapper>{children}</AnimatePresenceWrapper>
          </ErrorBoundaryWrapper>
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
        <AuthModalProvider />
      </body>
    </html>
  );
}
