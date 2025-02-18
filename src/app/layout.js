"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider"; 


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
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
