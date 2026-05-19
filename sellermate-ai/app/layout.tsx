import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SellerMate AI - WhatsApp Micro-Store & AI Sales Assistant",
  description: "Turn your WhatsApp hustle into a real storefront in minutes. Upload products, let AI answer customer questions, and get orders instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(sora.variable, inter.variable)}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
