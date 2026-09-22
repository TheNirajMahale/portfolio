import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  CursorProvider,
  SoundProvider,
  MusicProvider,
  ThemeProvider,
  SmoothScroll,
  LoaderProvider,
} from "@/components/providers";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ScrollProgressBar } from "@/components/ui/scroll-progress-bar";
import "./globals.css";

import resumeData from "@/data/resume.json";
import siteData from "@/data/site.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground flex flex-col">
        <SmoothScroll>
          <CursorProvider>
            <SoundProvider>
              <MusicProvider>
                <CustomCursor />
                <ThemeProvider>
                  <LoaderProvider>
                    <ScrollProgressBar />
                    <Nav />
                    <div className="flex-1 relative bg-background">{children}</div>
                    <Footer />
                    <ScrollToTop />
                  </LoaderProvider>
                </ThemeProvider>
              </MusicProvider>
            </SoundProvider>
          </CursorProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
