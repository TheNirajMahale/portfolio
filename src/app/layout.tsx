import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono, Newsreader, Fraunces } from "next/font/google";
import {
  ThemeProvider,
  SmoothScroll,
  LoaderProvider,
} from "@/components/providers";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ScrollProgressBar } from "@/components/ui/scroll-progress-bar";
import "./globals.css";

import resumeData from "@/data/resume.json";
import siteData from "@/data/site.json";

// Uxum Grotesque - Main body font (authentic font from Vaibhav Mali's portfolio)
const uxum = localFont({
  src: [
    {
      path: "../fonts/uxumlight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/uxumregular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/uxumbold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-uxum",
  display: "swap",
});

// Geist Mono - Code/technical content
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Newsreader - Serif for emphasis/headings
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Fraunces - Section titles (WORK EXPERIENCE, TECH STACK, etc.)
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteData.siteUrl),
  title: `${resumeData.personal.name} | Software Engineer`,
  description: resumeData.personal.summary,
  openGraph: {
    title: `${resumeData.personal.name} | Software Engineer`,
    description: resumeData.personal.summary,
    type: "website",
    url: siteData.siteUrl,
    siteName: `${resumeData.personal.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${resumeData.personal.name} | Software Engineer`,
    description: resumeData.personal.summary,
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
      className={`${uxum.variable} ${geistMono.variable} ${newsreader.variable} ${fraunces.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground flex flex-col">
        <SmoothScroll>
          <ThemeProvider>
            <LoaderProvider>
              <ScrollProgressBar />
              <Nav />
              <div className="flex-1 relative bg-background">{children}</div>
              <Footer />
              <ScrollToTop />
            </LoaderProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
