"use client";

import Providers from "@/components/providers/Providers";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";

export default function ClientLayout({ children }) {
  return (
    <Providers>
      <NavBar />
      {children}
      <Footer />
    </Providers>
  );
} 