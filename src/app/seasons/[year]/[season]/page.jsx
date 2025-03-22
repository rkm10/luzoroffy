"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAnimeBySeason } from "@/lib/jikan";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpring, animated } from "@react-spring/web";
import { BookmarkIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life",
  "Sports", "Supernatural", "Thriller"
];

const TYPES = ["TV", "Movie", "OVA", "ONA", "Special"];

const SORT_OPTIONS = {
  score: "Highest Score",
  popularity: "Most Popular"
};

const ITEMS_PER_PAGE = 24;
const MAX_INFINITE_ITEMS = 72; // Switch to pagination after 3 pages

export default function SeasonAnimePage() {
  const router = useRouter();
  const params = useParams();
  const year = parseInt(params.year, 10);
  const season = params.season;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    genre: "all",
    type: "all",
    sort: "score",
    excludeAdult: true
  });

  // Validate year and season
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const validSeasons = ["winter", "spring", "summer", "fall"];
    
    if (
      isNaN(year) || 
      year < 1917 || 
      year > currentYear + 1 || 
      !validSeasons.includes(season.toLowerCase())
    ) {
      router.push("/seasons");
    }
  }, [year, season, router]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ["seasonAnime", year, season, filters],
    queryFn: ({ pageParam = 1 }) => fetchAnimeBySeason(year, season, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });

  // Animation for page elements
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 20 }
  });

  // Process and filter anime data
  const allAnime = useMemo(() => {
    const items = data?.pages.flatMap(page => page.data) ?? [];
    return Array.from(new Map(items.map(item => [item.uniqueKey, item])).values());
  }, [data]);
  
  const filteredAnime = useMemo(() => {
    return allAnime.filter(anime => {
      const matchesGenre = filters.genre === "all" || anime.genres?.some(g => g.name === filters.genre);
      const matchesType = filters.type === "all" || anime.type === filters.type;
      const isAppropriate = !filters.excludeAdult || !anime.rating?.startsWith("R -");
      return matchesGenre && matchesType && isAppropriate;
    }).sort((a, b) => {
      if (filters.sort === "score") return (b.score || 0) - (a.score || 0);
      if (filters.sort === "popularity") return (b.members || 0) - (a.members || 0);
      return 0;
    });
  }, [allAnime, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAnime.length / ITEMS_PER_PAGE);
  const shouldUsePagination = filteredAnime.length > MAX_INFINITE_ITEMS;
  const paginatedAnime = shouldUsePagination
    ? filteredAnime.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : filteredAnime;

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

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 max-w-2xl mx-auto mb-8" />
        <div className="flex justify-center gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full h-[200px] rounded-lg" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Anime</h2>
        <p className="text-gray-600 mb-6">{error?.message || "Something went wrong"}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <animated.div style={fadeIn}>
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {season.charAt(0).toUpperCase() + season.slice(1)} {year} Anime
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Select
            value={filters.genre}
            onValueChange={(value) => setFilters(prev => ({ ...prev, genre: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {GENRES.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.type}
            onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sort}
            onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setFilters(prev => ({ ...prev, excludeAdult: !prev.excludeAdult }))}
            className={filters.excludeAdult ? "bg-blue-50 dark:bg-blue-900/20" : ""}
          >
            {filters.excludeAdult ? "Show Adult Content" : "Hide Adult Content"}
          </Button>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {paginatedAnime.map((anime) => (
            <animated.div
              key={anime.uniqueKey}
              style={fadeIn}
              onClick={() => router.push(`/anime/${anime.mal_id}`)}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                  alt={anime.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h2 className="text-lg font-bold line-clamp-2 mb-2">{anime.title}</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-sm px-2 py-1 bg-blue-500/80 rounded-full">
                      {anime.type || "N/A"}
                    </span>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-yellow-400" />
                      <span className="font-medium">{anime.score || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Badge */}
                {anime.rating?.startsWith("R -") && (
                  <div className="absolute top-2 left-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-md">
                    18+
                  </div>
                )}
              </div>
            </animated.div>
          ))}
        </div>

        {/* Pagination or Load More */}
        {filteredAnime.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No anime found matching your filters</p>
          </div>
        ) : shouldUsePagination ? (
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
              <p className="text-gray-600">No more anime to load</p>
            )}
          </div>
        )}
      </animated.div>
    </div>
  );
}