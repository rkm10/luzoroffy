"use client";

import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAnimeBySeason } from "@/lib/jikan";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpring, animated } from "@react-spring/web";
import { BookmarkIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function SeasonAnimePage() {
    const router = useRouter();
    const params = useParams();
    const year = parseInt(params.year, 10) || new Date().getFullYear();
    const season = params.season || "spring";
    const observerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [sortBy, setSortBy] = useState("score");
    const [excludeHentai, setExcludeHentai] = useState(true);

    const fadeIn = useSpring({
        from: { opacity: 0, transform: "translateY(20px)" },
        to: { opacity: 1, transform: "translateY(0)" },
        config: { tension: 280, friction: 20 }
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["anime", year, season],
        queryFn: ({ pageParam = 1 }) => fetchAnimeBySeason(year, season, pageParam),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 60 * 60 * 1000,
        retry: 2,
    });

    let allAnime = data ? data.pages.flatMap(page => page.data) : [];

    // Filtering & Sorting Logic
    allAnime = allAnime
        .filter(anime => excludeHentai ? !anime.genres.some(g => g.name === "Hentai") : true)
        .filter(anime => !selectedGenre || anime.genres.some(g => g.name === selectedGenre))
        .filter(anime => !selectedType || anime.type === selectedType)
        .sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0));

    useEffect(() => {
        if (!observerRef.current || !hasNextPage) return;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) fetchNextPage();
        }, { threshold: 1 });
        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage]);

    // Determine if we should use infinite scroll or pagination
    const shouldUseInfiniteScroll = allAnime.length < 40;

    useEffect(() => {
        // Only use intersection observer for infinite scroll
        if (!shouldUseInfiniteScroll) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1 }
        );

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            observer.disconnect();
        };
    }, [fetchNextPage, hasNextPage, shouldUseInfiniteScroll]);

    const SkeletonCard = () => (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
            <Skeleton className="w-full h-48 sm:h-56 md:h-64" />
            <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );

    // Pagination logic
    const itemsPerPage = 40;
    const paginatedAnime = shouldUseInfiniteScroll
        ? allAnime
        : allAnime.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(allAnime.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-12 w-96 mx-auto mb-8" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {[...Array(12)].map((_, index) => (
                        <SkeletonCard key={`skeleton-${index}`} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-xl mb-4">Error loading anime</p>
                    <p className="text-gray-600">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <animated.h1 style={fadeIn} className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {season.charAt(0).toUpperCase() + season.slice(1)} {year} Anime Collection
            </animated.h1>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger placeholder="Select Genre" />
                    <SelectContent>
                        <SelectItem value="Action">Action</SelectItem>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                        <SelectItem value="Comedy">Comedy</SelectItem>
                        <SelectItem value="Drama">Drama</SelectItem>
                        <SelectItem value="Fantasy">Fantasy</SelectItem>
                        <SelectItem value="Horror">Horror</SelectItem>
                        <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                        <SelectItem value="Slice of Life">Slice of Life</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger placeholder="Select Type" />
                    <SelectContent>
                        <SelectItem value="TV">TV</SelectItem>
                        <SelectItem value="Movie">Movie</SelectItem>
                        <SelectItem value="OVA">OVA</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger placeholder="Sort By" />
                    <SelectContent>
                        <SelectItem value="score">Highest Score</SelectItem>
                        <SelectItem value="popularity">Most Popular</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setExcludeHentai(!excludeHentai)}>
                    {excludeHentai ? "Allow Hentai" : "Exclude Hentai"}
                </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {paginatedAnime.map((anime) => (
                    <animated.div
                        key={anime.mal_id}
                        style={fadeIn}
                        className="group"
                    >
                        <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
                            <div className="relative">
                                <img
                                    src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                                    alt={anime.title}
                                    className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                    onClick={() => router.push(`/anime/${year}/${season}/${anime.mal_id}`)}
                                />
                                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Hover Overlay Buttons */}
                                <div className="absolute top-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors">
                                        <BookmarkIcon className="text-white w-5 h-5" />
                                    </button>
                                </div>

                                {anime.rating?.startsWith("R -") && (
                                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                                        18+
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h2 className="text-lg font-bold line-clamp-2 mb-2">
                                    {anime.title}
                                </h2>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm bg-blue-500 px-2 py-1 rounded-full">
                                        {anime.type || "N/A"}
                                    </span>
                                    <div className="flex items-center">
                                        <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                        <span className="text-sm font-medium">
                                            {anime.score || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </animated.div>
                ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {shouldUseInfiniteScroll && (
                <div ref={observerRef} className="h-10" />
            )}

            {/* Pagination Controls */}
            {!shouldUseInfiniteScroll && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Loading More for Infinite Scroll */}
            {isFetchingNextPage && shouldUseInfiniteScroll && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8">
                    {[...Array(6)].map((_, index) => (
                        <SkeletonCard key={`loading-${index}`} />
                    ))}
                </div>
            )}
        </div>
    );
}