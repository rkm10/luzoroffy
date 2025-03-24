"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTop } from "@/lib/jikan";
import AnimeCard from "@/components/custom/AnimeCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// Constants
const ITEMS_PER_PAGE = 24;
const MAX_INFINITE_ITEMS = 72; // Switch to pagination after 3 pages

export default function MangaPage() {
  const [filter, setFilter] = useState("bypopularity");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["allManga", { filter }],
    queryFn: ({ pageParam = 1 }) => fetchTop("manga", pageParam, filter),
    getNextPageParam: (lastPage) => lastPage.pagination?.has_next_page ? lastPage.pagination.current_page + 1 : undefined,
    keepPreviousData: true,
  });

  // Process all items
  const allItems = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  // Calculate pagination
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const shouldUsePagination = allItems.length > MAX_INFINITE_ITEMS;
  const paginatedItems = shouldUsePagination
    ? allItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : allItems;

  // Intersection Observer for infinite scroll
  const observerRef = useRef(null);
  useEffect(() => {
    if (shouldUsePagination) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, shouldUsePagination]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change
  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 mt-14">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">All Manga</h1>
            <p className="text-muted-foreground">
              Explore popular manga series and find your next read
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Sort by:</span>
            </div>
            
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bypopularity">Popularity</SelectItem>
                <SelectItem value="favorite">Most Favorited</SelectItem>
                <SelectItem value="score">Top Rated</SelectItem>
                <SelectItem value="publishing">Publishing</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {paginatedItems.map((manga) => (
                <AnimeCard key={manga.mal_id} item={manga} type="manga" />
              ))}
            </div>

            {/* Pagination or Load More */}
            {shouldUsePagination ? (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div ref={observerRef} className="py-8 text-center">
                {isFetchingNextPage ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={`loading-${i}`} className="w-full aspect-[3/4] rounded-lg" />
                    ))}
                  </div>
                ) : hasNextPage ? (
                  <Button variant="outline" onClick={() => fetchNextPage()}>
                    Load More
                  </Button>
                ) : (
                  <p className="text-gray-600">No more manga to load</p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
} 