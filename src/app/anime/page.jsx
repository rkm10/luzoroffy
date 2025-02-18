"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimeBySeasons } from "@/lib/jikan";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AnimePage() {
    const router = useRouter();
    const { data, isLoading, error } = useQuery({
        queryKey: ["animeSeasons"],
        queryFn: fetchAnimeBySeasons,
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading anime</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Years and Seasons</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.map((anime) => (
                    <Card key={anime.year} className="p-3 shadow flex gap-2">
                        <div className="flex flex-col w-1/3">
                            <p>Year:</p>
                            <p>Seasons:</p>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold">{anime.year}</h2>
                            <div className="flex flex-wrap">
                                {anime.seasons.map((season) => (
                                    <Button
                                        key={season}
                                        className="mr-2 mb-2"
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
