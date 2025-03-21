"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchTop } from "@/lib/jikan";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Star, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Autoplay from "embla-carousel-autoplay";

export default function AnimeBanner() {
  const { data: topAnime, isLoading } = useQuery({
    queryKey: ["topAnime"],
    queryFn: () => fetchTop("anime", 1, "bypopularity"),
  });

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (isLoading) {
    return <BannerSkeleton />;
  }

  return (
    <div className="w-full bg-background">
      <Carousel
        plugins={[autoplayPlugin.current]}
        className="w-full"
        onMouseEnter={autoplayPlugin.current.stop}
        onMouseLeave={autoplayPlugin.current.reset}
      >
        <CarouselContent>
          {topAnime?.data.slice(0, 5).map((anime) => (
            <CarouselItem key={anime.mal_id}>
              <div className="relative w-full h-[400px] md:h-[400px] lg:h-[700px]">
                {/* Background Image */}
                <Image
                  src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                  alt={anime.title}
                  fill
                  className="object-cover brightness-50"
                  priority
                />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent">
                  <div className="container h-full mx-auto px-4 py-8 flex items-end">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-6xl mx-auto">
                      {/* Poster */}
                      <div className="shrink-0 w-32 md:w-48 lg:w-64 aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
                        <Image
                          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                          alt={anime.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                            {anime.title}
                          </h2>
                          {anime.title_japanese && (
                            <p className="text-sm md:text-base text-white/80">
                              {anime.title_japanese}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {anime.genres?.slice(0, 3).map((genre) => (
                            <Badge key={genre.mal_id} variant="secondary" className="bg-white/10 text-white">
                              {genre.name}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-white/90">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="font-semibold">{anime.score}</span>
                          </div>
                          <span>•</span>
                          <span>{anime.type}</span>
                          {anime.episodes && (
                            <>
                              <span>•</span>
                              <span>{anime.episodes} Episodes</span>
                            </>
                          )}
                        </div>

                        <p className="hidden md:block text-sm md:text-base text-white/80 line-clamp-3">
                          {anime.synopsis}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                          <Link href={`/anime/${anime.mal_id}`}>
                            <Button className="bg-primary hover:bg-primary/90">
                              Learn More
                            </Button>
                          </Link>
                          {anime.trailer?.url && (
                            <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20" asChild>
                              <a href={anime.trailer.url} target="_blank" rel="noopener noreferrer">
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Watch Trailer
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}

function BannerSkeleton() {
  return (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-muted animate-pulse">
      <div className="container h-full mx-auto px-4 py-8 flex items-end">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-6xl mx-auto">
          <div className="shrink-0 w-32 md:w-48 lg:w-64 aspect-[2/3] bg-muted-foreground/10 rounded-lg" />
          <div className="flex-1 space-y-4">
            <div className="h-8 md:h-10 bg-muted-foreground/10 rounded w-2/3" />
            <div className="h-4 bg-muted-foreground/10 rounded w-1/3" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-20 bg-muted-foreground/10 rounded" />
              ))}
            </div>
            <div className="hidden md:block space-y-2">
              <div className="h-4 bg-muted-foreground/10 rounded w-full" />
              <div className="h-4 bg-muted-foreground/10 rounded w-4/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 