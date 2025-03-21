"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchDetails, fetchCharacters } from "@/lib/jikan";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  Star,
  Users,
  Calendar,
  Clock,
  PlayCircle,
  BookOpen,
  Heart,
} from "lucide-react";

// Function to process and deduplicate characters
const processCharacters = (characters) => {
  if (!characters) return [];
  
  // Create a Map to store unique characters by mal_id and role combination
  const uniqueChars = new Map();
  
  characters.forEach(char => {
    const id = char.character.mal_id;
    const role = char.role;
    const key = `${id}-${role}`; // Create a unique key combining id and role
    
    // Check if we should update the existing entry
    if (!uniqueChars.has(key)) {
      uniqueChars.set(key, {
        ...char,
        uniqueKey: key // Add a uniqueKey property for React key
      });
    }
  });

  // Convert Map back to array and sort by role importance
  return Array.from(uniqueChars.values()).sort((a, b) => {
    // Sort by role importance (Main > Supporting > Other)
    const roleOrder = { "Main": 0, "Supporting": 1 };
    const roleA = roleOrder[a.role] ?? 2;
    const roleB = roleOrder[b.role] ?? 2;
    return roleA - roleB;
  });
};

export default function DetailPage({ params }) {
  // Unwrap params using React.use()
  const resolvedParams = React.use(params);
  const { type, id } = resolvedParams;

  const {
    data: details,
    isLoading: isLoadingDetails,
    error: errorDetails,
  } = useQuery({
    queryKey: ["details", type, id],
    queryFn: () => fetchDetails(id, type),
  });

  const {
    data: charactersData,
    isLoading: isLoadingCharacters,
  } = useQuery({
    queryKey: ["characters", type, id],
    queryFn: () => fetchCharacters(id, type),
    enabled: !!details,
  });

  // Process characters data to ensure uniqueness
  const characters = processCharacters(charactersData);

  if (isLoadingDetails) {
    return <LoadingSkeleton />;
  }

  if (errorDetails || !details) {
    return <ErrorState />;
  }

  const {
    title,
    title_japanese,
    images,
    synopsis,
    score,
    scored_by,
    status,
    aired,
    episodes,
    duration,
    rating,
    genres,
    studios,
    streaming,
  } = details;

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={images?.jpg?.large_image_url || ""}
            alt={title}
            fill
            className="object-cover blur-sm opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-background/0" />
        </div>

        {/* Content */}
        <div className="container relative h-full mx-auto px-4 flex items-end pb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="shrink-0 w-48">
              <Image
                src={images?.jpg?.large_image_url || ""}
                alt={title}
                width={192}
                height={288}
                className="rounded-lg shadow-xl"
                priority
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-bold">{title}</h1>
                {title_japanese && (
                  <p className="text-lg text-muted-foreground">{title_japanese}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {genres?.map((genre) => (
                  <Badge key={genre.mal_id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <div>
                    <span className="font-semibold">{score}</span>
                    <span className="text-muted-foreground"> / 10</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span>{scored_by?.toLocaleString()} ratings</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <span>{aired?.string || "Unknown"}</span>
                </div>

                {episodes && (
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-purple-400" />
                    <span>{episodes} episodes</span>
                  </div>
                )}

                {duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-pink-400" />
                    <span>{duration}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-500">
                  <Heart className="mr-2 h-4 w-4" /> Add to Favorites
                </Button>
                {streaming?.[0]?.url && (
                  <Button variant="outline" asChild>
                    <a href={streaming[0].url} target="_blank" rel="noopener noreferrer">
                      <PlayCircle className="mr-2 h-4 w-4" /> Watch Now
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Synopsis & Details */}
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed">{synopsis}</p>
            </section>

            {/* Characters */}
            {!isLoadingCharacters && characters?.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Characters</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {characters.slice(0, 8).map((char) => (
                    <div 
                      key={char.uniqueKey || `${char.character.mal_id}-${char.role}`} 
                      className="space-y-2"
                    >
                      <div className="aspect-square relative rounded-lg overflow-hidden">
                        <Image
                          src={char.character.images?.jpg?.image_url || ""}
                          alt={char.character.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{char.character.name}</p>
                        <p className="text-muted-foreground">{char.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Information</h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>{status}</dd>
                </div>
                {rating && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Rating</dt>
                    <dd>{rating}</dd>
                  </div>
                )}
                {studios?.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Studios</dt>
                    <dd>{studios.map(s => s.name).join(", ")}</dd>
                  </div>
                )}
              </dl>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-[50vh] relative">
      <div className="container mx-auto px-4 h-full flex items-end pb-8">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <Skeleton className="w-48 h-72 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
      <p className="text-muted-foreground mb-8">
        We couldn't find the content you're looking for.
      </p>
      <Button variant="outline" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  </div>
); 