import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import { NextAuthProvider } from "./providers";
import { Roboto } from 'next/font/google';

// Define fonts
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nature Magazine | Exploring the Wonders of the Natural World",
  description:
    "Discover fascinating articles about wildlife, conservation, ecosystems, and the beauty of our planet on Nature Magazine.",
  keywords:
    "nature, wildlife, conservation, ecosystems, environment, biology, forests, oceans",
  authors: [{ name: "Nature Magazine Team" }],
  openGraph: {
    title: "Nature Magazine | Exploring the Wonders of the Natural World",
    description:
      "Discover fascinating articles about wildlife, conservation, ecosystems, and the beauty of our planet on Nature Magazine.",
    url: "https://nature-magazine.example.com",
    siteName: "Nature Magazine",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nature Magazine | Exploring the Wonders of the Natural World",
    description:
      "Discover fascinating articles about wildlife, conservation, ecosystems, and the beauty of our planet on Nature Magazine.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <NextAuthProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </NextAuthProvider>
      </body>
    </html>
  );
}
