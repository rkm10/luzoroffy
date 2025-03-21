"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export default function AnimeCard({ item, type = "anime" }) {
  const { isFavorited, isLoading, toggleFavorite } = useFavorites(
    type,
    item.mal_id.toString()
  );

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    toggleFavorite(item);
  };

  return (
    <Link href={`/${type}/${item.mal_id}`}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 relative group">
        <CardHeader className="p-0">
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={item.images?.webp?.image_url || item.images?.jpg?.image_url}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-1 right-1 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-background/80 backdrop-blur-sm",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                isFavorited && "text-red-500 opacity-100"
              )}
              onClick={handleFavoriteClick}
              disabled={isLoading}
            >
              <Heart
                className={cn(
                  "h-3 w-3 sm:h-4 sm:w-4",
                  isFavorited && "fill-current"
                )}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-3">
          <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2">
            {item.title}
          </h3>
        </CardContent>
        <CardFooter className="p-2 sm:p-3 pt-0 flex justify-between">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {item.type || "Unknown"}
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
            ⭐ {item.score || "N/A"}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
} 