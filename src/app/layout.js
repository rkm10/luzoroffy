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
            defaultTheme="dark"
            disableTransitionOnChange
            enableSystem
          >
            <NavBar />
              {children}
            <Footer />
          </ThemeProvider>
        </QueryClientProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
