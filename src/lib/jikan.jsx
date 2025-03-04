import axios from "axios";
import { toast } from "sonner";

const BASE_URL = "https://api.jikan.moe/v4";
const api = axios.create({ baseURL: BASE_URL });

// 🛠️ Unified API Fetcher with Error Handling
const fetchData = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    handleRateLimitError(error);
    return null;
  }
};

// 🔥 Fetch Anime by Seasons
export const fetchAnimeBySeasons = async () => {
  const data = await fetchData("/seasons");
  if (!data) return [];

  return data.data.map(season => ({
    year: Number(season.year),
    seasons: Array.isArray(season.seasons) ? season.seasons : [],
  }));
};

// 🔥 Fetch Anime by Specific Season
export const fetchAnimeBySeason = async (year, season, page = 1) => {
  const data = await fetchData(`/seasons/${year}/${season}`, { page });
  if (!data) return { data: [], nextPage: null };

  const uniqueAnime = Array.from(new Set(data.data.map(anime => JSON.stringify(anime)))).map(JSON.parse);

  return {
    data: uniqueAnime,
    nextPage: data.pagination?.has_next_page ? page + 1 : null,
  };
};

// 🔥 Fetch Recommended Anime
export const fetchRecommendedAnime = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/recommendations/anime`, { params: { page } });

    const uniqueAnime = new Map();
    response.data.data.forEach(anime => uniqueAnime.set(anime.mal_id, anime));

    return Array.from(uniqueAnime.values()); // ✅ Always return an array
  } catch (error) {
    handleRateLimitError(error);
    return []; // ✅ Return an empty array instead of null
  }
};


// 🔥 Fetch Recommended Manga
export const fetchRecommendedManga = async (page = 1) => {
  const data = await fetchData(`/recommendations/manga`, { page });
  if (!data) return { data: [], nextPage: null };

  const recommendedManga = data.data.flatMap(rec => rec.entry);
  const uniqueManga = Array.from(new Set(recommendedManga.map(manga => JSON.stringify(manga)))).map(JSON.parse);

  return {
    data: uniqueManga,
    nextPage: data.pagination?.has_next_page ? page + 1 : null,
  };
};

// 🔥 Handle Rate Limit Errors
const handleRateLimitError = (error) => {
  if (error.response?.status === 429) {
    toast.error("Rate Limit Reached", {
      description: "Jikan API is limiting requests. Try again later.",
      duration: 5000,
    });
  } else {
    toast.error("Failed to fetch data", {
      description: "An error occurred while fetching data.",
      duration: 5000,
    });
  }
  console.error("Error fetching anime:", error);
};
