import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

import resumeData from "@/data/resume.json";
import siteData from "@/data/site.json";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteData.siteUrl),
  title: `${resumeData.personal.name} — Software Engineer`,
  description: resumeData.personal.summary,
  openGraph: {
    title: `${resumeData.personal.name} — Software Engineer`,
    description: resumeData.personal.summary,
    type: "website",
    url: siteData.siteUrl,
    siteName: `${resumeData.personal.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${resumeData.personal.name} — Software Engineer`,
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
      className={`${inter.variable} ${robotoMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col bg-grid-texture bg-fixed">
        <SmoothScroll>
          <CustomCursor />
          <ThemeProvider>
            <Nav />
            <div className="flex-1">{children}</div>
            <Footer />
            <ScrollToTop />
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
