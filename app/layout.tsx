import type { Metadata } from "next";
import "./globals.css";
import "lenis/dist/lenis.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { IntroSequenceProvider } from "@/components/providers/IntroSequenceProvider";
import { NavbarScrollProvider } from "@/components/providers/NavbarScrollProvider";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { Preloader } from "@/components/features/Preloader";

export const metadata: Metadata = {
  title: "Taraca | Album Experience",
  description: "Interactive conceptual album experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased text-white overflow-x-hidden font-sans">
        <CustomCursor />
        <ScrollProgress />
        <LenisProvider>
          <IntroSequenceProvider>
            <Preloader />
            <NavbarScrollProvider>
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
            </NavbarScrollProvider>
          </IntroSequenceProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
