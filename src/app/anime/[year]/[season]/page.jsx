"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAnimeBySeason } from "@/lib/jikan";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

export default function SeasonAnimePage() {
    const { year, season } = useParams();
    const observerRef = useRef(null);

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

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{season.toUpperCase()} {year} Anime</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data?.pages.flatMap((page) =>
                    page.data.map((anime) => (
                        <div key={anime.mal_id} className="border p-3 rounded-lg shadow">
                            <img src={anime.images.jpg.image_url} alt={anime.title} className="w-full h-48 object-cover rounded" />
                            <h2 className="text-lg font-semibold mt-2">{anime.title}</h2>
                        </div>
                    ))
                )}
            </div>

            <div ref={observerRef} className="h-10" />

            {isFetchingNextPage && <p>Loading more anime...</p>}
        </div>
    );
}
