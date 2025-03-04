"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchRecommendedAnime, fetchRecommendedManga } from "@/lib/jikan";
import { toast } from "sonner";

export default function Home() {
  const {
    data: recommendedAnime,
    isLoading: isLoadingRecommendedAnime,
    error: errorRecommendedAnime,
  } = useQuery({
    queryKey: ["recommendedAnime"],
    queryFn: () => fetchRecommendedAnime(),
    onError: (error) => {
      toast.error("Failed to load recommended anime", {
        description: "An error occurred while fetching anime recommendations.",
        duration: 5000,
      });
    }
  });

  const {
    data: recommendedManga,
    isLoading: isLoadingRecommendedManga,
    error: errorRecommendedManga,
  } = useQuery({
    queryKey: ["recommendedManga"],
    queryFn: () => fetchRecommendedManga(),
    onError: (error) => {
      toast.error("Failed to load recommended manga", {
        description: "An error occurred while fetching manga recommendations.",
        duration: 5000,
      });
    }
  });

  if (isLoadingRecommendedAnime || isLoadingRecommendedManga) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (errorRecommendedAnime || errorRecommendedManga) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Failed to load recommended anime and manga
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center text-center">
        <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Recommended Anime and Manga
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <RecommendedAnime recommendedAnime={recommendedAnime?.data || []} />
          <RecommendedManga recommendedManga={recommendedManga?.data || []} />
        </div>

        <div className="mt-8">
          <a
            href="/anime"
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity animate-pulse"
          >
            Explore Anime →
          </a>
        </div>
      </main>
      <footer className="text-sm text-gray-500 dark:text-gray-400">
        &copy; 2024 AnimeVerse. All rights reserved.
      </footer>
    </div>
  );
}

export const RecommendedAnime = ({ recommendedAnime }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Recommended Anime</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendedAnime.map(anime => (
          <li key={anime.mal_id} className="p-4 border rounded-lg">
            <a href={`/anime/${anime.mal_id}`} className="flex items-center gap-4">
              <img 
                src={anime.images?.jpg?.image_url || anime.image_url} 
                alt={anime.title} 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{anime.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{anime.type}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const RecommendedManga = ({ recommendedManga }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Recommended Manga</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendedManga.map(manga => (
          <li key={manga.mal_id} className="p-4 border rounded-lg">
            <a href={`/manga/${manga.mal_id}`} className="flex items-center gap-4">
              <img 
                src={manga.images?.jpg?.image_url || manga.image_url} 
                alt={manga.title} 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{manga.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{manga.type}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};