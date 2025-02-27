import axios from "axios";
import { toast } from "sonner";

const BASE_URL = "https://api.jikan.moe/v4/seasons";

// 🔥 Fetch Anime by Seasons (Without Redis Cache)
export const fetchAnimeBySeasons = async () => {
    try {
        // Fetch from Jikan API
        const response = await axios.get(BASE_URL);

        const transformedData = response.data.data.map(season => ({
            year: Number(season.year),
            seasons: Array.isArray(season.seasons) ? season.seasons : []
        }));

        return transformedData;
    } catch (error) {
        console.error("Fetch error:", error);
        handleRateLimitError(error);
        return [];
    }
};

// 🔥 Fetch Anime by Specific Season (Without Redis Cache)
export const fetchAnimeBySeason = async (year, season, page = 1) => {
    try {
        // Fetch from Jikan API
        const response = await axios.get(`${BASE_URL}/${year}/${season}`, { params: { page } });

        const uniqueAnime = new Map();
        response.data.data.forEach(anime => uniqueAnime.set(anime.mal_id, anime));

        const result = {
            data: Array.from(uniqueAnime.values()),
            nextPage: response.data.pagination.has_next_page ? page + 1 : null,
        };

        return result;
    } catch (error) {
        handleRateLimitError(error);
        return { data: [], nextPage: null };
    }
};

// 🔥 Handle Rate Limit Errors
const handleRateLimitError = (error) => {
    if (error.response?.status === 429) {
        toast.error("Rate Limit Reached", {
            description: "Jikan API is limiting requests. Try again later.",
            duration: 5000,
        });
    }
    console.error("Error fetching anime:", error);
};
