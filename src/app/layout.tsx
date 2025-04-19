import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  Mynerve,
  Noto_Sans_Sinhala,
  Noto_Serif_Sinhala,
  Protest_Revolution,
} from "next/font/google";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sinhala_serif = Noto_Serif_Sinhala({
  subsets: ["sinhala"],
  display: "swap",
  weight: ["100", "200", "300", "400", "600", "800", "900"],
  variable: "--font-sinhala-serif",
});

const sinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  display: "swap",
  weight: ["100", "400", "600", "800", "900"],
  variable: "--font-sinhala-sans",
});

const protest = Protest_Revolution({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-protest",
  adjustFontFallback: false,
});

const marks = Mynerve({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-marks",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ExamLabs",
    default: "ExamLabs",
  },
  description: "practise your school exams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sinhala.variable} ${marks.variable} ${protest.variable} ${sinhala_serif.variable} antialiased flex flex-col min-h-screen dark:bg-slate-900 bg-slate-50`}
      >
        <Providers>
          <Navbar />
          <main className="flex grow max-w-7xl p-10 mx-auto w-full">
            {children}
          </main>

          <footer className="max-w-7xl mx-auto p-5 flex">
            <p>ExamLabs ©️ 2024</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
