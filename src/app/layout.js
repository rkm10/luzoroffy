import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Luzoroffy - Anime & Manga Discovery Platform",
  description: "Discover and track your favorite anime and manga with Luzoroffy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
