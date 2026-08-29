import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Niraj Mahale — Software Engineer",
  description:
    "Portfolio of Niraj Mahale, a Software Engineer specializing in Flutter, Node.js, and Spring Boot.",
  openGraph: {
    title: "Niraj Mahale — Software Engineer",
    description:
      "Portfolio of Niraj Mahale, a Software Engineer specializing in Flutter, Node.js, and Spring Boot.",
    type: "website",
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
      className={`${inter.variable} ${robotoMono.variable} antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <CustomCursor />
        <ThemeProvider>
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
