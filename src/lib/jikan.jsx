import axios from "axios";
import { toast } from "sonner";

const BASE_URL = "https://api.jikan.moe/v4";
const api = axios.create({ baseURL: BASE_URL });

// Global rate limiting state
let rateLimitAttempts = 0;

// Queue for managing API requests
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const { request, resolve, reject } = this.queue.shift();

    try {
      await rateLimitDelay();
      const response = await request();
      resolve(response);
    } catch (error) {
      reject(error);
    }

    // Process next request after delay
    setTimeout(() => this.processQueue(), 1000);
  }
}

const requestQueue = new RequestQueue();

// Cache implementation
const cache = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const { value, timestamp, expiry } = JSON.parse(item);
      if (Date.now() > timestamp + expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return value;
    } catch (error) {
      console.error('Cache error:', error);
      return null;
    }
  },
  set: (key, value, expiry = 5 * 60 * 1000) => {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        expiry
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Cache error:', error);
    }
  }
};

// Rate limiting helper with exponential backoff
const rateLimitDelay = () => new Promise(resolve => {
  const delay = Math.min(1000 * Math.pow(2, rateLimitAttempts), 10000); // Max 10 second delay
  setTimeout(() => {
    rateLimitAttempts = Math.max(0, rateLimitAttempts - 1); // Gradually reduce attempts
    resolve();
  }, delay);
});

// 🛠️ Utility function to deduplicate arrays by a key
const deduplicateByKey = (array, getKey) => {
  const seen = new Map();
  return array.filter(item => {
    const key = getKey(item);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.set(key, true);
    return true;
  });
};

// 🛠️ Utility function to deduplicate and sort anime/manga data
const processAnimeData = (data, sortKey = "popularity") => {
  if (!data || !Array.isArray(data)) return [];
  
  // Remove duplicates based on mal_id and ensure valid IDs
  const uniqueData = deduplicateByKey(data, item => {
    if (!item?.mal_id) return null;
    return `${item.mal_id}-${item.type || ''}-${item.season || ''}-${item.year || ''}`;
  });
  
  // Sort data based on the specified key
  return uniqueData.sort((a, b) => {
    if (sortKey === "popularity") return (b.members || 0) - (a.members || 0);
    if (sortKey === "score") return (b.score || 0) - (a.score || 0);
    if (sortKey === "title") return (a.title || '').localeCompare(b.title || '');
    return 0;
  }).map(item => ({
    ...item,
    uniqueKey: `${item.mal_id}-${item.type || ''}-${item.season || ''}-${item.year || ''}`
  }));
};

// 🛠️ Unified API Fetcher with Error Handling and Caching
const fetchData = async (endpoint, params = {}, options = {}) => {
  const cacheKey = `${endpoint}-${JSON.stringify(params)}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData && !options.bypass) {
    return cachedData;
  }

  try {
    const response = await requestQueue.add(() => 
      api.get(endpoint, { params })
    );
    
    const data = response.data;
    cache.set(cacheKey, data, options.expiry);
    rateLimitAttempts = 0; // Reset attempts on successful request
    return data;
  } catch (error) {
    handleRateLimitError(error);
    
    // Return cached data if available, even if expired
    if (cachedData) {
      toast.info("Using cached data", {
        description: "Latest data unavailable due to rate limiting",
        duration: 3000,
      });
      return cachedData;
    }
    return null;
  }
};

// Update cache expiry times for different types of data
const CACHE_TIMES = {
  STATIC: 60 * 60 * 1000,    // 1 hour for static data like genres
  DYNAMIC: 5 * 60 * 1000,    // 5 minutes for dynamic data
  SEASONAL: 30 * 60 * 1000,  // 30 minutes for seasonal data
};

// 🔥 Search Anime/Manga with improved caching
export const fetchAnimeSearch = async ({ query, type = "anime", sort = "popularity", status = "all" }) => {
  const params = {
    q: query,
    order_by: sort,
    sort: "desc",
    sfw: true,
    limit: 24,
  };

  if (status !== "all") {
    params.status = status;
  }

  const data = await fetchData(`/${type}`, params, {
    expiry: CACHE_TIMES.DYNAMIC
  });
  
  if (!data) return { data: [], pagination: null };

  return {
    data: processAnimeData(data.data, sort),
    pagination: data.pagination,
  };
};

// 🔥 Fetch Recommended Anime/Manga
export const fetchRecommended = async (type = "anime", page = 1) => {
  const data = await fetchData(`/recommendations/${type}`, { page }, {
    expiry: CACHE_TIMES.DYNAMIC
  });
  if (!data) return { data: [], pagination: null };

  const recommendedItems = data.data.flatMap(rec => rec.entry);
  const processedData = processAnimeData(recommendedItems, "score");

  return {
    data: processedData.slice(0, 24),
    pagination: data.pagination,
  };
};

// 🔥 Fetch Top Anime/Manga
export const fetchTop = async (type = "anime", page = 1, filter = "bypopularity") => {
  const data = await fetchData(`/top/${type}`, { page, filter }, {
    expiry: CACHE_TIMES.DYNAMIC
  });
  if (!data) return { data: [], pagination: null };

  return {
    data: processAnimeData(data.data, filter === "bypopularity" ? "popularity" : "score"),
    pagination: data.pagination,
  };
};

// 🔥 Fetch Current Season Anime
export const fetchSeasonNow = async () => {
  const data = await fetchData("/seasons/now", {}, {
    expiry: CACHE_TIMES.SEASONAL
  });
  if (!data) return { data: [], pagination: null };

  return {
    data: processAnimeData(data.data, "score"),
    pagination: data.pagination,
  };
};

// 🔥 Fetch Upcoming Season Anime
export const fetchSeasonUpcoming = async () => {
  const data = await fetchData("/seasons/upcoming", {}, {
    expiry: CACHE_TIMES.SEASONAL
  });
  if (!data) return { data: [], pagination: null };

  return {
    data: processAnimeData(data.data, "popularity"),
    pagination: data.pagination,
  };
};

// 🔥 Fetch Random Anime/Manga
export const fetchRandom = async (type = "anime") => {
  const data = await fetchData(`/random/${type}`);
  if (!data) return null;

  return data.data;
};

// 🔥 Fetch Anime/Manga Details
export const fetchDetails = async (id, type = "anime") => {
  const data = await fetchData(`/${type}/${id}/full`);
  if (!data) return null;

  return data.data;
};

// 🔥 Fetch Anime/Manga Characters
export const fetchCharacters = async (id, type = "anime") => {
  const data = await fetchData(`/${type}/${id}/characters`);
  if (!data) return [];

  // Create a Map to store unique characters by mal_id and role combination
  const characterMap = new Map();

  // Process each character entry
  data.data.forEach(entry => {
    const charId = entry.character.mal_id;
    const role = entry.role;
    const key = `${charId}-${role}`;
    
    // Check if we should update the existing entry
    if (!characterMap.has(key)) {
      characterMap.set(key, {
        ...entry,
        uniqueKey: key
      });
    }
  });

  // Convert map values to array and sort by role importance
  return Array.from(characterMap.values()).sort((a, b) => {
    const roleOrder = { "Main": 0, "Supporting": 1 };
    return (roleOrder[a.role] ?? 2) - (roleOrder[b.role] ?? 2);
  });
};

// 🔥 Fetch Anime/Manga Statistics
export const fetchStats = async (id, type = "anime") => {
  const data = await fetchData(`/${type}/${id}/statistics`);
  if (!data) return null;

  return data.data;
};

// 🔥 Fetch Genre List
export const fetchGenres = async (type = "anime") => {
  const data = await fetchData(`/genres/${type}`, {}, {
    expiry: CACHE_TIMES.STATIC
  });
  if (!data) return [];

  return deduplicateByKey(data.data, item => item.mal_id);
};

// 🔥 Fetch Anime Seasons
export const fetchAnimeBySeasons = async () => {
  const data = await fetchData('/seasons', {}, {
    expiry: CACHE_TIMES.STATIC // Seasons list rarely changes
  });

  if (!data) return [];

  // Process and structure the seasons data
  const seasonsData = data.data.map(season => ({
    year: season.year,
    seasons: season.seasons
  }));

  // Sort by year in descending order (most recent first)
  return seasonsData.sort((a, b) => b.year - a.year);
};

// 🔥 Fetch Anime for Specific Season
export const fetchAnimeBySeason = async (year, season, page = 1) => {
  const params = {
    page,
    limit: 24,
    sfw: true
  };

  const data = await fetchData(`/seasons/${year}/${season}`, params, {
    expiry: CACHE_TIMES.SEASONAL
  });

  if (!data) return { data: [], pagination: null };

  // Process the data to ensure unique entries with proper keys
  const processedData = processAnimeData(data.data, "score").map(item => ({
    ...item,
    uniqueKey: `${item.mal_id}-${season}-${year}`
  }));

  return {
    data: processedData,
    pagination: data.pagination,
    nextPage: data.pagination?.has_next_page ? page + 1 : undefined
  };
};

// 🔥 Enhanced Rate Limit Error Handler
const handleRateLimitError = (error) => {
  if (error.response?.status === 429) {
    rateLimitAttempts++; // Increment attempts for exponential backoff
    toast.error("Rate Limit Reached", {
      description: "Using cached data while waiting for API availability",
      duration: 5000,
    });
  } else {
    toast.error("Failed to fetch data", {
      description: "An error occurred while fetching data",
      duration: 5000,
    });
  }
  console.error("API Error:", error);
};

