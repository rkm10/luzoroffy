"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSeasonNow, fetchSeasonUpcoming } from "@/lib/jikan";
import AnimeCard from "@/components/custom/AnimeCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock } from "lucide-react";

export default function SeasonalPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);

  const {
    data: currentSeason,
    isLoading: isLoadingCurrent,
    isFetching: isFetchingCurrent,
  } = useQuery({
    queryKey: ["currentSeason", currentPage],
    queryFn: () => fetchSeasonNow(),
    keepPreviousData: true,
  });

  const {
    data: upcomingSeason,
    isLoading: isLoadingUpcoming,
    isFetching: isFetchingUpcoming,
  } = useQuery({
    queryKey: ["upcomingSeason", upcomingPage],
    queryFn: () => fetchSeasonUpcoming(),
    keepPreviousData: true,
  });

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8 mt-14">
        <div className="space-y-6 mb-8">
          <h1 className="text-4xl font-bold">Seasonal Anime</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover what's currently airing and what's coming next season. Stay up to date with the latest anime releases.
          </p>
        </div>

        <Tabs defaultValue="current" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Current Season
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming Season
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-8">
            {isLoadingCurrent ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {[...Array(18)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {currentSeason?.data.map((anime) => (
                    <AnimeCard key={anime.mal_id} item={anime} type="anime" />
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isFetchingCurrent}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={!currentSeason?.pagination?.has_next_page || isFetchingCurrent}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-8">
            {isLoadingUpcoming ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {[...Array(18)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {upcomingSeason?.data.map((anime) => (
                    <AnimeCard key={anime.mal_id} item={anime} type="anime" />
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setUpcomingPage((p) => Math.max(1, p - 1))}
                    disabled={upcomingPage === 1 || isFetchingUpcoming}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setUpcomingPage((p) => p + 1)}
                    disabled={!upcomingSeason?.pagination?.has_next_page || isFetchingUpcoming}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 