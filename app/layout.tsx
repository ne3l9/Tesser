import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/app/components/providers/ConvexClientProvider";
import Footer from "@/app/components/Footer";
import RouteLoader from "./components/RouteLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tesser",
  description: "Develop and run code snippets in multiple programming languages, right in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
       <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col`}
        >
        <RouteLoader />
        <ConvexClientProvider>
        <main className="flex-1">
        {children}
        </main>
        </ConvexClientProvider>
      <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}
