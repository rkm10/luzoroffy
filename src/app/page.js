"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchRecommendedAnime, fetchRecommendedManga } from "@/lib/jikan";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import RecommendationCard from "@/components/custom/RecommendationCard";
import RecommendationSkeleton from "@/components/custom/RecommendationSkeleton";
import Link from "next/link";

export default function AnimePage() {
  const {
    data: recommendedAnime,
    isLoading: isLoadingAnime,
    error: errorAnime,
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
    isLoading: isLoadingManga,
    error: errorManga,
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

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl mx-auto">
            Discover Your Next Anime and Manga Adventure
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore curated recommendations, dive into new worlds, and find your next obsession.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" size="lg">
              Browse Anime
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/20">
              Browse Manga
            </Button>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="container mx-auto px-4 py-12 space-y-12">
        {/* Recommended Anime */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Recommended Anime</h2>
          {isLoadingAnime ? (
            <RecommendationSkeleton />
          ) : errorAnime ? (
            <ErrorState message="Failed to load recommended anime" />
          ) : (
            <Carousel>
              <CarouselContent className="-ml-4">
                {recommendedAnime?.data.map((anime) => (
                  <CarouselItem
                    className="pl-4 basis-[280px] shrink-0 grow-0"
                  >
                    <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                      <RecommendationCard
                        item={anime}
                        type="anime"
                        imageUrl={anime.images?.jpg?.large_image_url || anime.image_url}
                      />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          )}
        </div>

        {/* Recommended Manga */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Recommended Manga</h2>
          {isLoadingManga ? (
            <RecommendationSkeleton />
          ) : errorManga ? (
            <ErrorState message="Failed to load recommended manga" />
          ) : (
            <Carousel>
              <CarouselContent className="-ml-4">
                {recommendedManga?.data.map((manga) => (
                  <CarouselItem
                    key={manga.mal_id}
                    className="pl-4 basis-[280px] shrink-0 grow-0"
                  >
                    <RecommendationCard
                      item={manga}
                      type="manga"
                      imageUrl={manga.images?.jpg?.large_image_url || manga.image_url}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          )}
        </div>
      </section>
    </div>
  );
}

const ErrorState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {message}
      </p>
      <Button variant="outline">
        Retry
      </Button>
    </div>
  );
};