"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAnimeBySeason } from "@/lib/jikan";
import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpring, animated } from "@react-spring/web";

export default function SeasonAnimePage() {
    const router = useRouter();
    const { year, season } = useParams();
    const observerRef = useRef(null);

    const fadeIn = useSpring({
        from: { opacity: 0, transform: "translateY(20px)" },
        to: { opacity: 1, transform: "translateY(0)" },
    });

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["anime", year, season],
        queryFn: ({ pageParam = 1 }) => fetchAnimeBySeason(year, season, pageParam),
        getNextPageParam: (lastPage) => lastPage.nextPage,
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
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [fetchNextPage, hasNextPage]);

    const SkeletonCard = () => (
        <div className="border p-2 sm:p-3 lg:p-4 rounded-lg shadow">
            <Skeleton className="w-full h-36 sm:h-40 lg:h-48 rounded" />
            <Skeleton className="h-5 sm:h-6 lg:h-7 w-3/4 mt-2" />
            <Skeleton className="h-4 sm:h-5 w-16 mt-2" />
            <Skeleton className="h-10 sm:h-12 lg:h-14 w-full mt-2" />
        </div>
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{season.toUpperCase()} {year} Anime</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {console.log(data)}
                
                {!data ? (
                    // Show skeletons while initial loading
                    [...Array(12)].map((_, index) => (
                        <SkeletonCard key={index} />
                    ))
                ) : (
                    (() => {
                        const uniqueAnime = new Set();
                        return data.pages.flatMap((page) =>
                            page.data
                                .filter((anime) => 
                                    !anime.genres.some((genre) => genre.name === "Hentai") &&
                                    !uniqueAnime.has(anime.mal_id) && uniqueAnime.add(anime.mal_id)
                                )
                                .map((anime) => (
                                    <animated.div
                                        key={anime.mal_id}
                                        style={fadeIn}
                                        className="border p-3 rounded-lg shadow hover:shadow-lg transition-shadow"
                                    >
                                        <img 
                                            src={anime.images.jpg.image_url} 
                                            alt={anime.title} 
                                            className="w-full h-48 object-cover rounded" 
                                            onClick={() => router.push(`/anime/${anime.year}/${anime.season}/${anime.mal_id}`)}
                                        />
                                        <h2 className="text-sm font-semibold mt-2 text-ellipsis overflow-hidden whitespace-nowrap">
                                            {anime.title}
                                        </h2>
                                        <p className="text-sm font-semibold mt-2">Rating: {anime.score}</p>
                                        <p className="text-sm font-semibold mt-2">
                                            Genre: {anime.genres.map((genre) => genre.name).join(", ")}
                                        </p>
                                    </animated.div>
                                ))
                        );
                    })()
                )}
            </div>

            <div ref={observerRef} className="h-10" />

            {isFetchingNextPage && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
                    {[...Array(6)].map((_, index) => (
                        <SkeletonCard key={`loading-${index}`} />
                    ))}
                </div>
            )}
        </div>
    );
}
