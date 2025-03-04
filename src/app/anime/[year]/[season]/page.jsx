"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAnimeBySeason } from "@/lib/jikan";
import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpring, animated } from "@react-spring/web";

export default function SeasonAnimePage() {
    const router = useRouter();
    const params = useParams();
    const year = parseInt(params.year, 10) || new Date().getFullYear();
    const season = params.season || "spring";
    const observerRef = useRef(null);

    const fadeIn = useSpring({
        from: { opacity: 0, transform: "translateY(20px)" },
        to: { opacity: 1, transform: "translateY(0)" },
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
        staleTime: 60 * 60 * 1000, // Cache for 1 hour
        retry: 2, // Retry twice before failing
    });

    useEffect(() => {
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
            observer.disconnect(); // Prevent memory leaks
        };
    }, [fetchNextPage, hasNextPage]);

    const SkeletonCard = () => (
        <div className="border p-2 sm:p-3 md:p-4 rounded-lg shadow">
            <Skeleton className="w-full h-32 sm:h-36 md:h-40 lg:h-48 rounded" />
            <Skeleton className="h-4 sm:h-5 md:h-6 w-3/4 mt-2" />
            <Skeleton className="h-3 sm:h-4 w-16 mt-1 sm:mt-2" />
            <Skeleton className="h-3 sm:h-4 w-full mt-1 sm:mt-2" />
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen pt-14 p-4 md:p-8 md:pt-14">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">
                    <Skeleton className="h-8 sm:h-10 md:h-12 w-64 mx-auto" />
                </h1>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {[...Array(12)].map((_, index) => (
                        <SkeletonCard key={`initial-loading-${index}`} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 flex items-center justify-center">
                <p className="text-red-500">Error loading anime: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-14 p-4 md:p-8 md:pt-14">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">
                {season.toUpperCase()} {year} Anime 
            </h1>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {data.pages.flatMap((page) => {
                    const uniqueAnime = new Set();
                    return page.data
                        .filter((anime) =>
                            !anime.genres.some((genre) => genre.name === "Hentai") &&
                            !uniqueAnime.has(anime.mal_id) &&
                            uniqueAnime.add(anime.mal_id)
                        )
                        .map((anime) => (
                            <animated.div
                                key={anime.mal_id}
                                style={fadeIn}
                                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative group">
                                    
                                    <img
                                        src={anime.images.jpg.image_url}
                                        alt={anime.title}
                                        className="w-full h-32 sm:h-36 md:h-40 lg:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        onClick={() => router.push(`/anime/${year}/${season}/${anime.mal_id}`)}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                                    {anime.rating?.startsWith("R -") && (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md font-semibold">
                                            18+
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 sm:p-3 md:p-4">
                                    <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100 text-ellipsis overflow-hidden whitespace-nowrap">
                                        {anime.title}
                                    </h2>
                                    <div className="flex items-center justify-between mt-1 sm:mt-2">
                                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                            {anime.type || "N/A"}
                                        </span>
                                        <div className="flex items-center text-yellow-500">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="ml-1 text-xs sm:text-sm font-medium">{anime.score || "N/A"}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 line-clamp-1">
                                        {anime.genres.map((genre) => genre.name).join(", ")}
                                    </p>
                                </div>
                            </animated.div>
                        ));
                })}
            </div>

            <div ref={observerRef} className="h-10" />

            {isFetchingNextPage && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-6">
                    {[...Array(6)].map((_, index) => (
                        <SkeletonCard key={`loading-${index}`} />
                    ))}
                </div>
            )}
        </div>
    );
}
