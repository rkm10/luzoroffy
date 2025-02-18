import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4/seasons";

export const fetchAnimeBySeasons = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching anime seasons:", error);
        return [];
    }
};

export const fetchAnimeBySeason = async (year, season, page = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/${year}/${season}`, {
            params: { page },
        });

        return {
            data: response.data.data,
            nextPage: response.data.pagination.has_next_page ? page + 1 : null,
        };
    } catch (error) {
        console.error("Error fetching anime:", error);
        return { data: [], nextPage: null };
    }
};
