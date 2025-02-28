"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimeBySeasons } from "@/lib/jikan";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import ModeToggle from "@/components/ModeToggle";

export default function AnimePage() {
    const router = useRouter();
    const { data, isLoading, error } = useQuery({
        queryKey: ["animeSeasons"],
        queryFn: fetchAnimeBySeasons,
        retry: 2,
        staleTime: 1000 * 60 * 30,
    });

    if (isLoading) return (
        <div className="container mx-auto pt-14 p-4 md:p-8 md:pt-14">
            <div className="flex justify-between items-center mb-6">
                <div className="h-9 w-48 bg-muted rounded animate-pulse" />
                <div className="h-10 w-10 bg-muted rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                            <div className="h-7 w-24 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {[...Array(4)].map((_, btnIndex) => (
                                <div
                                    key={btnIndex}
                                    className="h-9 bg-muted rounded animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto p-4 flex flex-col items-center min-h-[50vh]">
            <p className="text-lg text-red-500 mb-2">Failed to load anime seasons</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
    );

    if (!data || data.length === 0) return (
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
            <p className="text-lg">No anime seasons available</p>
        </div>
    );

    return (
        <div className="container mx-auto pt-14 p-4 md:p-8 md:pt-14">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Anime Seasons</h1>
                <ModeToggle />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {data.map((anime) => (
                    <Card
                        key={anime.year}
                        className="hover:bg-accent/5 transition-all duration-200"
                    >
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">📅</span>
                                <h2 className="text-xl font-semibold">{anime.year}</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {anime.seasons.map((season) => (
                                    <Button
                                        key={season}
                                        variant="outline"
                                        size="sm"
                                        className="w-full hover:bg-primary hover:text-primary-foreground"
                                        onClick={() => router.push(`/anime/${anime.year}/${season}`)}
                                    >
                                        {season}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
