"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimeBySeasons, fetchRecommendedAnime, fetchRecommendedManga } from "@/lib/jikan";
import { useAnimeStore } from "@/store/animeStore";
import { Container, Typography, Grid2, CircularProgress } from "@mui/material";
import AnimeCard from "@/components/AnimeCard";

export default function Home() {
  const { setSeasons, setRecommendedAnime, setRecommendedManga } = useAnimeStore();

  const { data: seasons, isLoading: loadingSeasons } = useQuery({
    queryKey: ["seasons"],
    queryFn: fetchAnimeBySeasons,
    onSuccess: (data) => setSeasons(data),

  });


  const { data: recommendedAnime, isLoading: loadingAnime } = useQuery({
    queryKey: ["recommendedAnime"],
    queryFn: fetchRecommendedAnime,
    onSuccess: (data) => setRecommendedAnime(data.data),
  });

  console.log("Recommended Anime Data:", recommendedAnime);
  const { data: recommendedManga, isLoading: loadingManga } = useQuery({
    queryKey: ["recommendedManga"],
    queryFn: fetchRecommendedManga,
    onSuccess: (data) => setRecommendedManga(data.data),
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎌 Discover Anime & Manga
      </Typography>

      {/* 🔥 Seasonal Anime */}
      <Typography variant="h5" mt={4} gutterBottom>
        🌸 Seasonal Anime
      </Typography>
      {loadingSeasons ? (
        <CircularProgress />
      ) : (
        <Grid2 container spacing={2}>
          {seasons?.map((season) => (
            <Grid2 item xs={12} sm={6} md={4} lg={3} key={season.year}>
              <AnimeCard anime={season} />
            </Grid2>
          ))}
        </Grid2>
      )}

      {/* 🔥 Recommended Anime */}
      <Typography variant="h5" mt={4} gutterBottom>
        ⭐ Recommended Anime
      </Typography>
      {loadingAnime ? (
        <CircularProgress />
      ) : (
        <Grid2 container spacing={2}>
          {Array.isArray(recommendedAnime) && recommendedAnime.length > 0 ? (
            recommendedAnime?.map((anime) => (
              <Grid2 item xs={12} sm={6} md={4} lg={3} key={anime.mal_id}>
                <AnimeCard anime={anime} />
              </Grid2>
            ))
          ) : (
            <Typography variant="h6">No recommendations available</Typography>
          )}
        </Grid2>
      )}

      {/* 🔥 Recommended Manga */}
      <Typography variant="h5" mt={4} gutterBottom>
        📖 Recommended Manga
      </Typography>
      {loadingManga ? (
        <CircularProgress />
      ) : (
        <Grid2 container spacing={2}>
          {Array.isArray(recommendedManga) && recommendedManga.length > 0 ? (
            recommendedManga.map((manga) => (
              <Grid2 item xs={12} sm={6} md={4} lg={3} key={manga.mal_id}>
                <MangaCard manga={manga} />
              </Grid2>
            ))
          ) : (
            <Typography variant="h6">No recommended manga available</Typography>
          )}
        </Grid2>

      )}
    </Container>
  );
}
