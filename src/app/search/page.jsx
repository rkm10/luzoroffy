"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAnimeSearch } from "@/lib/jikan";
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
import { Filter, Search as SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// Constants
const ITEMS_PER_PAGE = 24;
const MAX_INFINITE_ITEMS = 72; // Switch to pagination after 3 pages

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [type, setType] = useState("anime");
  const [sort, setSort] = useState("popularity");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["search", { query, type, sort, status }],
    queryFn: ({ pageParam = 1 }) => fetchAnimeSearch({ query, type, sort, status, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.pagination?.has_next_page ? lastPage.pagination.current_page + 1 : undefined,
    enabled: query.length > 0,
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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Search Results</h1>
            <p className="text-muted-foreground">
              {query ? `Showing results for "${query}"` : "Enter a search term to begin"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="manga">Manga</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="score">Rating</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="start_date">Release Date</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="airing">Currently Airing</SelectItem>
                <SelectItem value="complete">Completed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {query.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Start Your Search</h2>
            <p className="text-muted-foreground max-w-md">
              Enter a search term in the bar above to discover your next favorite anime or manga.
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              An error occurred while fetching results.
            </p>
            <Button variant="outline" onClick={() => fetchNextPage()}>
              Try Again
            </Button>
          </div>
        ) : allItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No results found for "{query}". Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {paginatedItems.map((item) => (
                <AnimeCard key={item.mal_id} item={item} type={type} />
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
                  <p className="text-gray-600">No more results to load</p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
} 