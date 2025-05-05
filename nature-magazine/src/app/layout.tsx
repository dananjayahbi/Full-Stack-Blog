import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";

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
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
