import ModeToggle from "@/components/ModeToggle";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ModeToggle />
      <main className="flex flex-col gap-8 items-center text-center">
        <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Welcome to AnimeVerse
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Discover your next favorite anime series in our carefully curated collection
        </p>

        <div className="mt-8">
          <a
            href="/anime"
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity animate-pulse"
          >
            Explore Anime →
          </a>
        </div>

        {/* <Image
          className="mt-12"
          src="/anime-hero.png"
          alt="Anime Hero Image"
          width={400}
          height={300}
          priority
        /> */}
      </main>
      <footer className="text-sm text-gray-500 dark:text-gray-400">
        © 2024 AnimeVerse. All rights reserved.
      </footer>
    </div>
  );
}
