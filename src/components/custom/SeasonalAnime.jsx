"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentSeason } from "@/lib/jikan";
import AnimeCard from "./AnimeCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function SeasonalAnime() {
  const {
    data: seasonalAnime,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["seasonalAnime"],
    queryFn: () => fetchCurrentSeason(),
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            Currently Airing
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Fresh from this season
          </p>
        </div>
        <Link href="/seasons/current">
          <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 text-sm sm:text-base">
            View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2 sm:space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-3 sm:h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-sm sm:text-base text-muted-foreground">Failed to load seasonal anime</p>
        </div>
      ) : (
        <div className="relative">
          <Carousel className="mx-auto">
            <CarouselContent className="-ml-2 sm:-ml-4">
              {seasonalAnime?.data.map((anime) => (
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
  );
} 