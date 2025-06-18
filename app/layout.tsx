import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import GeminiMonitor from "@/components/GeminiMonitor";
import { AuthProvider } from "@/lib/authContext"; // Import AuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PropAnalyzed - Real Estate Lead Enrichment & Property Analysis",
  description: "Unlock property data, find off-market deals, and qualify real estate leads with PropAnalyzed. Your AI-powered property intelligence tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white dark:bg-gray-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-gray-100`}
      >
        <AuthProvider> {/* Wrap with AuthProvider */}
          <Navbar />
          {children}
          <Footer />
          <GeminiMonitor />
        </AuthProvider>
      </body>
    </html>
  );
}
