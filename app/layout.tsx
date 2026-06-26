import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-accent",
});

export const metadata: Metadata = {
  title: "Peppery House — Cozy Indie Café",
  description: "A warm, cozy café experience with great coffee, snacks & desserts. Order online or visit us for dine-in.",
  keywords: ["cafe", "coffee", "dine-in", "delivery", "India"],
  openGraph: {
    title: "Peppery House",
    description: "Great coffee. Warm vibes.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} ${cormorant.variable} font-sans bg-cream text-raisin`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
