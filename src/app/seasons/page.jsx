"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimeBySeasons } from "@/lib/jikan";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const seasonEmojis = {
  winter: "❄️",
  spring: "🌸",
  summer: "☀️",
  fall: "🍁"
};

export default function SeasonsPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["animeSeasons"],
    queryFn: fetchAnimeBySeasons,
    retry: 2,
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  });

  // Loading state with improved skeleton UI
  if (isLoading) {
    return (
      <div className="container mx-auto pt-14 p-4 md:p-8 md:pt-14">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-7 w-24" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, btnIndex) => (
                  <Skeleton key={btnIndex} className="h-9" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-lg text-red-500">Failed to load anime seasons</p>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-lg mb-2">No anime seasons available</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Refresh
        </Button>
      </div>
    );
  }

  // Render seasons grid
  return (
    <div className="container mx-auto pt-14 p-4 md:p-8 md:pt-14">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Anime Seasons</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((anime) => (
          <Card
            key={anime.year}
            className="hover:bg-accent/5 transition-all duration-200"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📅</span>
                <h2 className="text-xl font-semibold">{anime.year}</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {anime.seasons.map((season) => (
                  <Button
                    key={season}
                    variant="outline"
                    className="w-full hover:bg-primary hover:text-primary-foreground flex items-center gap-2 capitalize"
                    onClick={() => router.push(`/seasons/${anime.year}/${season.toLowerCase()}`)}
                  >
                    <span>{seasonEmojis[season.toLowerCase()]}</span>
                    <span>{season}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}