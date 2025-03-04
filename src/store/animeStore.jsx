import { create } from "zustand";

export const useAnimeStore = create((set) => ({
  seasons: [],
  recommendedAnime: [],
  recommendedManga: [],
  setSeasons: (data) => set({ seasons: data }),
  setRecommendedAnime: (data) => set({ recommendedAnime: data }),
  setRecommendedManga: (data) => set({ recommendedManga: data }),
}));
