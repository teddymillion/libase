import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "../styles/globals.css";

// Load fonts via next/font — zero layout shift, self-hosted, no Google request at runtime
const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
  display:  "swap",
});

const sora = Sora({
  subsets:  ["latin"],
  variable: "--font-sora",
  weight:   ["600", "700"],
  display:  "swap",
});

export const metadata: Metadata = {
  title:       "Libase — Your Smart Wardrobe",
  description: "Style yourself with what you already own.",
  manifest:    "/manifest.json",
  appleWebApp: {
    capable:           true,
    statusBarStyle:    "default",
    title:             "Libase",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width:               "device-width",
  initialScale:        1,
  maximumScale:        1,
  userScalable:        false,
  themeColor:          "#F97316",
  viewportFit:         "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
