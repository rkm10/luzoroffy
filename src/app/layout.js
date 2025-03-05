"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";


const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <NavBar />
            <div className="min-h-screen pt-14 p-4 md:p-8 md:pt-14" style={{ maxWidth: "1200px", margin: "0 auto" }}>
              {children}
            </div>
            <Footer />
          </ThemeProvider>
        </QueryClientProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
