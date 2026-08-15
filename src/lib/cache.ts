/**
 * Fetches data with localStorage caching.
 * It immediately returns cached data if available (via onUpdate),
 * then fetches fresh data in the background. If the fresh data is different
 * from cached data, it updates the cache and calls onUpdate again.
 */
export async function fetchWithCache<T>(
  url: string,
  onUpdate: (data: T) => void,
  fallbackData: T,
  validator?: (data: any) => boolean
): Promise<void> {
  const cacheKey = `cache_${url}`;
  let cachedData: T | null = null;

  // 1. Try to load and serve from cache immediately
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (!validator || validator(parsed)) {
        cachedData = parsed;
        onUpdate(parsed);
      }
    }
  } catch (e) {
    console.error(`Error reading cache for ${url}:`, e);
  }

  // 2. Fetch fresh data in background
  try {
    const response = await fetch(url);
    if (response.ok) {
      const freshData = await response.json();
      if (freshData && (!validator || validator(freshData))) {
        const freshString = JSON.stringify(freshData);
        const cachedString = cachedData ? JSON.stringify(cachedData) : '';

        if (freshString !== cachedString) {
          localStorage.setItem(cacheKey, freshString);
          onUpdate(freshData);
        }
        return;
      }
    }
  } catch (error) {
    console.error(`Background fetch failed for ${url}:`, error);
  }

  // 3. If no cache and network failed, use fallback
  if (!cachedData) {
    onUpdate(fallbackData);
  }
}
