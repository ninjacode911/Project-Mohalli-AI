import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Space_Grotesk,
  JetBrains_Mono, Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohalla AI — Find Trusted Services in Your Neighbourhood",
  description:
    "Discover plumbers, electricians, pharmacies, mechanics & more near you. Real ratings, reviews, and one-tap calling.",
  keywords: [
    "local services",
    "neighbourhood",
    "plumber near me",
    "electrician near me",
    "hyperlocal",
    "Pune services",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", plusJakartaSans.variable, spaceGrotesk.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
