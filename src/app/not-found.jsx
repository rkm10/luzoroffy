"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function NotFoundPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      {/* Animated Heading */}
      <motion.h1
        className="text-7xl font-bold text-gray-800 dark:text-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>

      {/* Animated Subheading */}
      <motion.p
        className="text-xl text-gray-600 dark:text-gray-300 mt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Oops! The page you are looking for does not exist.
      </motion.p>

      {/* Floating Image Animation */}
      <motion.img
        src={theme === "dark" ? "/robot-404-error-errors.svg" : "/robot-404-error-errors.svg"}
        alt="Not Found"
        className="w-72 md:w-96 mt-6"
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated Button */}
      <Link href="/">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Button className="mt-6">Go Home</Button>
        </motion.div>
      </Link>
    </div>
  );
}
