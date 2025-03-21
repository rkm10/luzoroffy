"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchRecommended, fetchTop, fetchRandom } from "@/lib/jikan";
import AnimeBanner from "@/components/custom/AnimeBanner";
import AnimeCard from "@/components/custom/AnimeCard";
import SeasonalAnime from "@/components/custom/SeasonalAnime";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, TrendingUp, Star, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const {
    data: recommendedAnime,
    isLoading: isLoadingAnime,
    error: errorAnime,
  } = useQuery({
    queryKey: ["recommendedAnime"],
    queryFn: () => fetchRecommended("anime"),
  });

  const {
    data: topManga,
    isLoading: isLoadingManga,
    error: errorManga,
  } = useQuery({
    queryKey: ["topManga"],
    queryFn: () => fetchTop("manga"),
  });

  const { data: randomAnime } = useQuery({
    queryKey: ["randomAnime"],
    queryFn: () => fetchRandom("anime"),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Banner Section */}
      <div className="mt-1 sm:mt-2">
        <AnimeBanner />
      </div>

      {/* Featured Sections */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-16 space-y-8 sm:space-y-16">
        {/* Random Anime Spotlight */}
        {randomAnime && (
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-500/20 p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-8 items-center">
              <div className="shrink-0 w-32 sm:w-48">
                <img
                  src={randomAnime.images.jpg.large_image_url}
                  alt={randomAnime.title}
                  className="rounded-lg shadow-xl aspect-[2/3] object-cover"
                />
              </div>
              <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left">
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium">Random Recommendation</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">{randomAnime.title}</h3>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">{randomAnime.synopsis}</p>
                <Link href={`/anime/${randomAnime.mal_id}`}>
                  <Button size="sm" className="sm:text-base">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Seasonal Anime */}
        <SeasonalAnime />

        {/* Recommended Anime */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                Recommended Anime
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Popular picks you might enjoy
              </p>
            </div>
            <Link href="/anime">
              <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 text-sm sm:text-base">
                View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>

          {isLoadingAnime ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2 sm:space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="h-3 sm:h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : errorAnime ? (
            <div className="text-center py-8">
              <p className="text-sm sm:text-base text-muted-foreground">Failed to load recommendations</p>
            </div>
          ) : (
            <div className="relative">
              <Carousel className="mx-auto">
                <CarouselContent className="-ml-2 sm:-ml-4">
                  {recommendedAnime?.data.map((anime) => (
                    <CarouselItem
                      key={anime.mal_id}
                      className="pl-2 sm:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/4 lg:basis-1/6"
                    >
                      <AnimeCard item={anime} type="anime" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 sm:-left-16" />
                <CarouselNext className="hidden md:flex -right-12 sm:-right-16" />
              </Carousel>
            </div>
          )}
        </div>

        {/* Top Manga */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                Top Manga
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Most popular manga series
              </p>
            </div>
            <Link href="/manga">
              <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 text-sm sm:text-base">
                View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>

          {isLoadingManga ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2 sm:space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="h-3 sm:h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : errorManga ? (
            <div className="text-center py-8">
              <p className="text-sm sm:text-base text-muted-foreground">Failed to load manga</p>
            </div>
          ) : (
            <div className="relative">
              <Carousel className="mx-auto">
                <CarouselContent className="-ml-2 sm:-ml-4">
                  {topManga?.data.map((manga) => (
                    <CarouselItem
                      key={manga.mal_id}
                      className="pl-2 sm:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/4 lg:basis-1/6"
                    >
                      <AnimeCard item={manga} type="manga" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 sm:-left-16" />
                <CarouselNext className="hidden md:flex -right-12 sm:-right-16" />
              </Carousel>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}