"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getFavorites } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AnimeCard from "@/components/custom/AnimeCard";

export default function FavoritesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [animeFavorites, setAnimeFavorites] = useState([]);
  const [mangaFavorites, setMangaFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const [animeData, mangaData] = await Promise.all([
          getFavorites(user.uid, "anime"),
          getFavorites(user.uid, "manga"),
        ]);
        setAnimeFavorites(animeData);
        setMangaFavorites(mangaData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user, router]);

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Please log in to view your favorites</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
      <Tabs defaultValue="anime" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="anime">
            Anime ({animeFavorites.length})
          </TabsTrigger>
          <TabsTrigger value="manga">
            Manga ({mangaFavorites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anime">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-[300px] rounded-lg bg-gray-800 animate-pulse"
                />
              ))}
            </div>
          ) : animeFavorites.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {animeFavorites.map((anime) => (
                <AnimeCard 
                  key={anime.mal_id} 
                  item={anime} 
                  type="anime"
                  isFavorited={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No favorite anime yet</h3>
              <p className="text-muted-foreground mb-4">
                Start exploring and add some anime to your favorites!
              </p>
              <Button onClick={() => router.push("/anime")}>
                Explore Anime
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="manga">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-[300px] rounded-lg bg-gray-800 animate-pulse"
                />
              ))}
            </div>
          ) : mangaFavorites.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mangaFavorites.map((manga) => (
                <AnimeCard 
                  key={manga.mal_id} 
                  item={manga} 
                  type="manga"
                  isFavorited={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No favorite manga yet</h3>
              <p className="text-muted-foreground mb-4">
                Start exploring and add some manga to your favorites!
              </p>
              <Button onClick={() => router.push("/manga")}>
                Explore Manga
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 