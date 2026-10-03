import type { Metadata } from "next";
import { Instrument_Sans, Sora } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AgenticBank for Belo — Prototipo",
  description:
    "From Digital Banking to Agentic Banking. Prototipo independiente simulado. No es producto oficial de Belo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${instrument.variable} ${sora.variable} antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
