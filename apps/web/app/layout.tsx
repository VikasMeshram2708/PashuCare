import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Providers from "./(context)/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "PashuCare - Animals Health AI Assistant",
  description: "AI-powered assistant for animals health and care",
  keywords: [
    "AI-powered assistant",
    "Animals health",
    "AI assistant",
    "AI for animals",
    "AI for veterinarians",
    "AI for pet owners",
    "AI for animal care",
    "AI for animal health",
    "AI for animal welfare",
    "AI for animal care and health",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto.variable} antialiased dark`}>
        <Suspense>
          <ClerkProvider>
            <Providers>{children}</Providers>
          </ClerkProvider>
        </Suspense>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
