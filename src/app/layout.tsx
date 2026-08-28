import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Niraj Mahale - Software Engineer",
  description: "Portfolio of Niraj Mahale, a Software Engineer specializing in Flutter, Node.js, and Spring Boot.",
  openGraph: {
    title: "Niraj Mahale - Software Engineer",
    description: "Portfolio of Niraj Mahale, a Software Engineer specializing in Flutter, Node.js, and Spring Boot.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        {children}
      </body>
    </html>
  );
}
