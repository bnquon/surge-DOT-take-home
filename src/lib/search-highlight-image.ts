import type { ImageSearchResponse, UnsplashImageData } from "@/types/unsplash";

// Reuse requests across cards and React's development effect remounts.
const imageRequestCache = new Map<string, Promise<UnsplashImageData>>();

export function searchHighlightImage(query: string) {
  const normalizedQuery = query.trim().replace(/\s+/g, " ").toLowerCase();
  const cachedRequest = imageRequestCache.get(normalizedQuery);
  if (cachedRequest) return cachedRequest;

  const request = fetch(`/api/images?q=${encodeURIComponent(normalizedQuery)}`, {
    signal: AbortSignal.timeout(25_000),
  })
    .then(async (response) => {
      if (!response.ok) throw new Error("Image search failed.");
      const data: ImageSearchResponse = await response.json();
      if (!data.image?.src) throw new Error("Image search returned no photo.");
      return data.image;
    })
    .catch((error: unknown) => {
      imageRequestCache.delete(normalizedQuery);
      throw error;
    });

  imageRequestCache.set(normalizedQuery, request);
  return request;
}
